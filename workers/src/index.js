/**
 * YouSEO Generation Backend — a Cloudflare Worker.
 *
 * The static GitHub Pages site cannot host an API, so this Worker is the
 * `POST {topic}` -> Gemini API bridge. It is free-tier friendly:
 *   - the Gemini API key is read ONLY from the secret binding GEMINI_API_KEY
 *     (set via `wrangler secret put`), so it never reaches the browser;
 *   - only sender's origin is allowed (CORS), so other websites can't abuse it;
 *   - request size / topic length are validated, responses are capped, and the
 *     request times out so there are no unbounded retries or runaway costs.
 *
 * No authentication, no database, no analytics, no payments.
 *
 * Deploy (from workers/):
 *   npx wrangler login
 *   npx wrangler secret put GEMINI_API_KEY
 *   npx wrangler deploy
 */

// Origins allowed to call this worker. A browser request carrying an Origin
// outside this list is rejected (403). Requests with no Origin header
// (non-browser clients like curl) are allowed but get no CORS headers.
// Add your GitHub Pages origin here; keep localhost for development.
const ALLOWED_ORIGINS = new Set([
  "https://raushankumar1503.github.io", // GitHub Pages project site
  "http://localhost:3000", // local dev
]);

const MAX_BODY_BYTES = 4096; // tiny topics only — reject anything larger
const MAX_TOPIC_LENGTH = 500; // matches the frontend textarea maxLength
const MAX_OUTPUT_CHARS = 12000; // extra safety cap on the model's response
const TIMEOUT_MS = 30000;

// Concise system framing so output stays focused and free-tier-friendly.
const SYSTEM_PROMPT =
  "You are a practical YouTube SEO assistant. Given a video topic, return ONLY " +
  'valid JSON matching exactly: {"bestTitle": string, "alternativeTitles": ' +
  'string[], "description": string, "tags": string[]}. No markdown, no code ' +
  "fences, no commentary, no extra fields.";

function buildPrompt(topic) {
  return (
    "Create YouTube metadata for a video about this topic.\n\n" +
    `TOPIC: ${topic}\n\n` +
    "OUTPUT REQUIREMENTS:\n" +
    "- bestTitle: ONE strongest title (best balance of search intent, clarity, curiosity and click-through). Natural and specific, no clickbait, no ALL CAPS.\n" +
    "- alternativeTitles: EXACTLY 3 genuinely different titles, each a real alternate angle. Not near-duplicates of bestTitle or each other.\n" +
    "- description: 150 to 250 words. Open with the video's value, say what the viewer will learn, use the topic's keywords naturally, include a short bullet list of a few things the video covers, and end with a natural call to action. No filler, no keyword stuffing.\n" +
    "- tags: 10 to 20 relevant tags covering the topic, its variations and related search phrases.\n\n" +
    "Return ONLY the JSON object described by the schema."
  );
}

// Extract the first complete JSON object from model text and validate it into
// the shared GenerateResult shape. Mirrors src/lib/provider.ts semantics.
function parseResult(text) {
  let parsed;
  try {
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");
    if (start === -1 || end === -1) return null;
    parsed = JSON.parse(text.slice(start, end + 1));
  } catch {
    return null;
  }
  if (typeof parsed !== "object" || parsed === null) return null;

  const str = (v) => (typeof v === "string" ? v.trim() : "");
  const uniqueStrings = (v) => {
    if (!Array.isArray(v)) return [];
    const seen = new Set();
    const out = [];
    for (const item of v) {
      const s = str(item);
      if (!s) continue;
      const key = s.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      out.push(s);
    }
    return out;
  };

  const bestTitle = str(parsed.bestTitle);
  const description = str(parsed.description);
  const alternativeTitles = uniqueStrings(parsed.alternativeTitles).slice(0, 3);
  const tags = uniqueStrings(parsed.tags).slice(0, 20);

  if (!bestTitle || !description || alternativeTitles.length < 2 || tags.length < 1) {
    return null;
  }
  return { bestTitle, alternativeTitles, description, tags };
}

// Candidate models tried in order. The configured GEMINI_MODEL (from
// wrangler.toml [vars], if set) is tried first, then these fallbacks. If the
// account's free tier doesn't expose the primary model name, the chain steps
// to the next candidate (400/404 "model not found" style errors only);
// auth/quota/5xx errors stop immediately and surface directly.
const FALLBACK_MODELS = [
  // Fallbacks confirmed present in this API key's `/models` response. Each is
  // tried at most once, and only when the primary is temporarily unavailable
  // (503 / transient 5xx).
  "gemini-3.5-flash",
  "gemini-3.5-flash-lite",
];

const GEMINI_API_BASE = "https://generativelanguage.googleapis.com/v1beta/models";

// Pull Gemini's own safe error message out of its error body. These fields
// (error.status / error.message) never contain the API key, so they are safe
// to surface to the caller for diagnosis.
function geminiErrorText(data) {
  const err = data && typeof data === "object" ? data.error : null;
  if (!err) return null;
  const pieces = [err.status, err.message].filter(Boolean);
  return pieces.length ? pieces.join(": ") : null;
}

// Try each candidate model until one accepts the request. Returns
// { ok: true, res, model } on a 200, otherwise an error payload with a status
// and a safe, human-readable message. The API key travels only in the request
// query string and is never included in any returned/logged text.
async function callGemini(env, topic) {
  const primary = (env.GEMINI_MODEL || "gemini-3.6-flash").trim();
  const candidates = [primary, ...FALLBACK_MODELS];
  const tried = new Set();
  let sawUnavailable = false; // any model returned a transient 503/5xx

  // Normalize a model name so models.list's "models/gemini-3.6-flash" and the
  // configured "gemini-3.6-flash" are treated as the same model when
  // deduplicating candidates.
  const normalize = (m) => String(m || "").trim().replace(/^models\//, "");

  for (const raw of candidates) {
    const model = normalize(raw);
    if (!model || tried.has(model)) continue;
    tried.add(model);

    // Correct REST shape: <base>/models/{model}:generateContent?key=...
    const apiUrl =
      GEMINI_API_BASE +
      "/" +
      encodeURIComponent(model) +
      ":generateContent?key=" +
      encodeURIComponent(env.GEMINI_API_KEY);

    let res;
    try {
      res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Deliberately NO generationConfig: a bare contents -> parts -> text
        // request is the most broadly compatible form of generateContent and
        // avoids any field this model/version might reject.
        body: JSON.stringify({
          contents: [{ parts: [{ text: SYSTEM_PROMPT + "\n\n" + buildPrompt(topic) }] }],
        }),
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });
    } catch {
      // Network failure or timeout talking to Gemini. No point falling back.
      return {
        ok: false,
        status: 504,
        message:
          "The generation service timed out. Please try again or use a shorter topic.",
      };
    }

    if (res.ok) return { ok: true, res, model };

    // Read Gemini's own (key-free) error fields for diagnosis.
    let status = res.status;
    let detailText = "";
    try {
      const body = await res.text();
      const data = JSON.parse(body);
      const g = data && data.error;
      if (g) {
        status = typeof g.code === "number" ? g.code : status;
        detailText = [g.status, g.message].filter(Boolean).join(": ");
      }
    } catch {
      // Body wasn't JSON; keep the generic message.
    }

    // Retry a DIFFERENT model only for temporary availability errors:
    // HTTP 503 (high demand) and other transient server-side 5xx. Each model
    // is tried at most once (guaranteed by the `tried` set).
    if (status === 503 || (status >= 500 && status <= 504)) {
      sawUnavailable = true;
      continue;
    }

    // Move to a fallback only when the message plainly means the model
    // resource itself is missing/inaccessible. A generic 400 (e.g. a rejected
    // request field) must be surfaced as-is, NOT masked as a model problem.
    const looksLikeMissingModel =
      /is not found|does not exist|model not found|is not accessible/i.test(detailText);
    if (detailText && looksLikeMissingModel) continue;
    if (status === 404 && !detailText) continue;

    // Auth (401/403), quota/rate-limit (429), arbitrary 400, and any other 4xx
    // are surfaced immediately with NO fallback — none of them is a
    // model-availability problem.
    if (status === 429) {
      return {
        ok: false,
        status: 429,
        message:
          "The free tier rate limit was reached. Please wait a moment and try again.",
      };
    }
    const message = detailText
      ? `The AI service returned an error (${status}) — ${detailText}`
      : `The AI service returned an error (${status}). Please try again.`;
    return { ok: false, status, message };
  }

  const last = [...tried].join(", ");
  if (sawUnavailable) {
    return {
      ok: false,
      status: 503,
      message:
        "All configured Gemini models are momentarily unavailable due to high demand. " +
        "Please try again in a moment.",
    };
  }
  return {
    ok: false,
    status: 400,
    message:
      `None of the configured Gemini models are accessible for this account (tried: ${last}). ` +
      "Confirm the free-tier model name in workers/wrangler.toml (GEMINI_MODEL) " +
      "and that it matches one of your key's accessible models, then redeploy.",
  };
}

// List the models this API key / project can actually access (models.list).
// The key is sent as the same `key=` query param and is never logged or
// returned. Model names are public and safe to surface.
async function callModelsList(env) {
  if (!env.GEMINI_API_KEY) {
    return { ok: false, status: 500, error: "No GEMINI_API_KEY secret is configured on the Worker." };
  }
  const url =
    "https://generativelanguage.googleapis.com/v1beta/models?key=" +
    encodeURIComponent(env.GEMINI_API_KEY);
  try {
    const res = await fetch(url, {
      method: "GET",
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    const body = await res.json().catch(() => null);
    if (!res.ok || !body) {
      return {
        ok: false,
        status: res.status,
        error: "models.list failed",
        detail: geminiErrorText(body),
      };
    }
    const names = Array.isArray(body.models)
      ? body.models
          .map((m) => (m && typeof m.name === "string" ? m.name : ""))
          .filter(Boolean)
      : [];
    return { ok: true, names };
  } catch {
    return { ok: false, status: 504, error: "models.list timed out or failed to fetch." };
  }
}

function corsHeaders(origin) {
  const headers = {
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
  };
  // Only echo back a specific allowed origin; never a wildcard when credentials
  // are involved, and never reflect arbitrary untrusted origins.
  if (origin) headers["Access-Control-Allow-Origin"] = origin;
  return headers;
}

function json(body, status = 200, cors = corsHeaders(null)) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", ...cors },
  });
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    // Reject browser requests from disallowed origins.
    if (origin && !ALLOWED_ORIGINS.has(origin)) {
      return json({ error: "Forbidden" }, 403, corsHeaders(null));
    }
    const cors = corsHeaders(origin || null);

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: cors });
    }

    if (request.method === "GET") {
      // Diagnostic route — must be checked BEFORE the generic health response.
      // Lists exactly which models this API key can access, via Gemini
      // models.list. Model names are public; the API key is never exposed.
      const url = new URL(request.url);
      if (url.pathname === "/models" || url.pathname.endsWith("/models")) {
        const list = await callModelsList(env);
        if (!list.ok) {
          return json(
            { ok: false, error: list.error, detail: list.detail || undefined },
            list.status || 500,
            cors
          );
        }
        return json({ ok: true, count: list.names.length, models: list.names }, 200, cors);
      }
      return json(
        {
          ok: true,
          notice:
            'Send a POST with a JSON body of the form {"topic": "..."}. ' +
            "To list the models this key can access, GET /models.",
        },
        200,
        cors
      );
    }

    if (request.method !== "POST") {
      return json({ error: "Method not allowed." }, 405, cors);
    }

    // Parse + validate the request body (bounded size prevents abuse).
    let topic = "";
    try {
      const raw = await request.text();
      if (raw.length > MAX_BODY_BYTES) {
        return json({ error: "Request is too large." }, 413, cors);
      }
      const data = JSON.parse(raw);
      topic = typeof data.topic === "string" ? data.topic.trim() : "";
    } catch {
      return json({ error: "Invalid request body." }, 400, cors);
    }

    if (!topic) return json({ error: "A topic is required." }, 400, cors);
    if (topic.length > MAX_TOPIC_LENGTH) {
      return json({ error: "Topic is too long (maximum 500 characters)." }, 400, cors);
    }

    // The API key must be provisioned as a secret binding on the Worker.
    if (!env.GEMINI_API_KEY) {
      return json(
        { error: "The generation service is not configured. The site owner must set the Gemini API key on the Worker." },
        500,
        cors
      );
    }

    // Call Gemini (handles model fallback + surfaces Gemini's own diagnosis).
    const gem = await callGemini(env, topic);
    if (!gem.ok) {
      return json({ error: gem.message }, gem.status, cors);
    }

    let data;
    try {
      data = await gem.res.json();
    } catch {
      return json({ error: "The AI service returned an invalid response." }, 502, cors);
    }

    const parts = data?.candidates?.[0]?.content?.parts;
    const text = Array.isArray(parts)
      ? parts.map((p) => (typeof p?.text === "string" ? p.text : "")).join("")
      : "";

    if (!text) {
      return json({ error: "The AI service returned an empty response." }, 502, cors);
    }
    if (text.length > MAX_OUTPUT_CHARS) {
      return json({ error: "The AI service returned an unexpectedly large response." }, 502, cors);
    }

    const result = parseResult(text);
    if (!result) {
      return json({ error: "The AI service returned an unreadable response. Please try again." }, 502, cors);
    }

    return json(result, 200, cors);
  },
};