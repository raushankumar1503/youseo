import type { GenerateInput, GenerateResult } from "./types";
import { buildKeywordContext } from "./seo";

// Isolated AI provider implementation. Supports two backends:
//   - OpenAI-compatible chat completions (cloud, uses AI_API_KEY)
//   - Ollama (local, no key required)
// Provider selection is a pure function of the environment so it can be
// unit-tested without any network access. Both backends use ONE request to
// produce the complete {bestTitle, alternativeTitles, description, tags}.

const DEFAULT_OPENAI_MODEL = "gpt-4o-mini";
const DEFAULT_OPENAI_BASE_URL = "https://api.openai.com/v1";
const DEFAULT_OLLAMA_BASE_URL = "http://localhost:11434";
const DEFAULT_OLLAMA_MODEL = "llama3.2";

// Upper bound on generated tokens so Ollama does not run away and the response
// stays fast. Roughly enough for a ~250-word description + titles + tags.
const MAX_OUTPUT_TOKENS = 1100;

export class ProviderError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ProviderError";
  }
}

export type ProviderKind = "openai" | "ollama" | "none";

export interface ProviderConfig {
  kind: ProviderKind;
  apiKey?: string;
  openaiModel?: string;
  openaiBaseUrl?: string;
  ollamaBaseUrl?: string;
  ollamaModel?: string;
}

// Pure selection logic. Cloud (AI_API_KEY) wins when present; otherwise Ollama
// is used whenever local Ollama config is provided; otherwise nothing is set.
export function resolveProvider(env: {
  AI_API_KEY?: string;
  AI_MODEL?: string;
  AI_BASE_URL?: string;
  OLLAMA_BASE_URL?: string;
  OLLAMA_MODEL?: string;
}): ProviderConfig {
  const apiKey = (env.AI_API_KEY ?? "").trim();
  if (apiKey) {
    return {
      kind: "openai",
      apiKey,
      openaiModel: env.AI_MODEL || DEFAULT_OPENAI_MODEL,
      openaiBaseUrl: env.AI_BASE_URL || DEFAULT_OPENAI_BASE_URL,
    };
  }

  const ollamaBaseUrl = (env.OLLAMA_BASE_URL ?? "").trim() || DEFAULT_OLLAMA_BASE_URL;
  const ollamaModel = (env.OLLAMA_MODEL ?? "").trim() || DEFAULT_OLLAMA_MODEL;
  // Only switch to Ollama when the user has explicitly opted in via config.
  if (env.OLLAMA_BASE_URL || env.OLLAMA_MODEL) {
    return { kind: "ollama", ollamaBaseUrl, ollamaModel };
  }

  return { kind: "none" };
}

// Concise, high-quality framing. Kept short to avoid bloating the prompt and
// slowing the model down. Both backends share this.
const SYSTEM_PROMPT = `You are a practical YouTube SEO assistant. You write metadata a real, established creator would publish: specific, useful, and natural. Return ONLY valid JSON matching the schema exactly. No markdown, no code fences, no commentary, no extra fields.

Schema:
{"bestTitle": string, "alternativeTitles": string[], "description": string, "tags": string[]}`;

function buildPrompt(input: GenerateInput): string {
  const context = buildKeywordContext(input.topic);

  return `Create YouTube metadata for a video about this topic.

TOPIC: ${input.topic}

KEYWORD CONTEXT:
- Primary keyword: "${context.primary}"
- Important words: ${context.words.join(", ")}
- Long-tail phrases: ${context.longTail.join(", ")}

OUTPUT REQUIREMENTS:
- bestTitle: ONE strongest title (best balance of search intent, clarity, curiosity, and click-through). Natural and specific, not clickbait. No ALL CAPS, no keyword stuffing.
- alternativeTitles: EXACTLY 3 genuinely different titles. Each must be a real alternate angle (how-to, problem-solution, beginner, list, benefit, etc.). Must not repeat bestTitle or each other with just small wording changes. No ALL CAPS, no clickbait.
- description: 150 to 250 words. Open with 1-2 sentences on the video's value. Explain what the viewer will learn. Use the primary keyword naturally, add relevant secondary keywords where useful. Include a short bullet list of a few things the video covers. End with a natural call to action. No filler, no keyword stuffing, no repeated sentences, no claims about content the video does not actually cover.
- tags: 10 to 20 relevant tags covering the primary keyword, its variations, long-tail phrases, and related search phrases. No irrelevant tags.

Return ONLY the JSON object described by the schema.`;
}

async function generateWithOpenAI(
  input: GenerateInput,
  config: Required<Pick<ProviderConfig, "apiKey" | "openaiModel" | "openaiBaseUrl">>
): Promise<GenerateResult> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 25000);

  try {
    const res = await fetch(`${config.openaiBaseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify({
        model: config.openaiModel,
        temperature: 0.7,
        max_tokens: MAX_OUTPUT_TOKENS,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: buildPrompt(input) },
        ],
      }),
      signal: controller.signal,
    });

    if (!res.ok) {
      throw new ProviderError(
        `The AI provider returned an error (${res.status}). Check that the API key is valid or that AI_BASE_URL is correct for your provider.`
      );
    }

    const data = await res.json();
    const content = data?.choices?.[0]?.message?.content;
    if (!content) {
      throw new ProviderError("The generation service returned an empty response.");
    }
    return parseGenerationResult(content);
  } finally {
    clearTimeout(timeout);
  }
}

async function generateWithOllama(
  input: GenerateInput,
  config: Pick<ProviderConfig, "ollamaBaseUrl" | "ollamaModel">
): Promise<GenerateResult> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 60_000);

  let res: Response;
  try {
    res = await fetch(`${config.ollamaBaseUrl}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: config.ollamaModel,
        stream: false,
        // Ask Ollama for strict JSON; bounds output tokens to keep it fast.
        format: "json",
        options: {
          num_predict: MAX_OUTPUT_TOKENS,
          temperature: 0.7,
        },
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: buildPrompt(input) },
        ],
      }),
      signal: controller.signal,
    });
  } catch (err: unknown) {
    clearTimeout(timeout);
    if (err instanceof Error && err.name === "AbortError") {
      throw new ProviderError(
        `The Ollama request timed out after 60 seconds. The model "${config.ollamaModel}" may be too slow for this hardware, or the prompt is too long. Try a smaller model or a shorter topic.`
      );
    }
    // Distinguish connection-refused from other network errors.
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.includes("ECONNREFUSED")) {
      throw new ProviderError(
        `Cannot connect to Ollama at ${config.ollamaBaseUrl} — the service is not running. Start it with "ollama serve".`
      );
    }
    throw new ProviderError(
      `Cannot reach Ollama at ${config.ollamaBaseUrl}. Check that Ollama is running and accessible (${msg}).`
    );
  }
  // Fetch succeeded — clear the timeout before processing the response.
  clearTimeout(timeout);

  if (!res.ok) {
    if (res.status === 404) {
      throw new ProviderError(
        `The Ollama model "${config.ollamaModel}" is not installed. Run "ollama pull ${config.ollamaModel}" and try again.`
      );
    }
    throw new ProviderError(`The local AI service returned an error (${res.status}).`);
  }

  // With stream:false, Ollama returns a completion in data.message.content.
  let data: Record<string, unknown>;
  try {
    data = await res.json();
  } catch {
    throw new ProviderError("Ollama returned an invalid (non-JSON) response.");
  }
  const ollamaMsg = data?.message;
  const content = typeof ollamaMsg === "object" && ollamaMsg !== null ? (ollamaMsg as Record<string, unknown>).content : undefined;
  if (typeof content !== "string" || !content) {
    throw new ProviderError("Ollama returned an empty response. The model may have refused the request or produced no output.");
  }
  return parseGenerationResult(content);
}

export async function generateSEO(input: GenerateInput): Promise<GenerateResult> {
  // Read environment at request time (correct server-side behaviour for
  // Next.js route handlers) and pick the provider from pure config.
  const config = resolveProvider({
    AI_API_KEY: process.env.AI_API_KEY,
    AI_MODEL: process.env.AI_MODEL,
    AI_BASE_URL: process.env.AI_BASE_URL,
    OLLAMA_BASE_URL: process.env.OLLAMA_BASE_URL,
    OLLAMA_MODEL: process.env.OLLAMA_MODEL,
  });

  if (config.kind === "openai") {
    return generateWithOpenAI(input, {
      apiKey: config.apiKey!,
      openaiModel: config.openaiModel!,
      openaiBaseUrl: config.openaiBaseUrl!,
    });
  }

  if (config.kind === "ollama") {
    return generateWithOllama(input, {
      ollamaBaseUrl: config.ollamaBaseUrl!,
      ollamaModel: config.ollamaModel!,
    });
  }

  throw new ProviderError(
    "No AI provider is configured. Either set AI_API_KEY for the cloud provider, or run Ollama locally and set OLLAMA_MODEL in your .env.local to use it without a key."
  );
}

// Extracted for unit-testing JSON parsing + schema validation without a network.
export function parseGenerationResult(raw: string): GenerateResult {
  const cleaned = raw.replace(/```json|```/g, "").trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start === -1 || end === -1) {
    throw new ProviderError("The generation service returned an invalid response.");
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(cleaned.slice(start, end + 1));
  } catch {
    throw new ProviderError("The generation service returned malformed data.");
  }
  return validateGenerateResult(parsed);
}

export function validateGenerateResult(parsed: unknown): GenerateResult {
  const obj = parsed as Partial<GenerateResult>;

  const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");

  const bestTitle = str(obj.bestTitle);
  const description = str(obj.description);

  const uniqueStrings = (v: unknown): string[] => {
    if (!Array.isArray(v)) return [];
    const seen = new Set<string>();
    const out: string[] = [];
    for (const item of v) {
      const s = str(item);
      if (!s) continue;
      const key = s.toLowerCase();
      if (seen.has(key)) continue; // drop duplicate / near-duplicate by exact text
      seen.add(key);
      out.push(s);
    }
    return out;
  };

  const alternativeTitles = uniqueStrings(obj.alternativeTitles).slice(0, 3);
  const tags = uniqueStrings(obj.tags).slice(0, 20);

  if (!bestTitle || !description || alternativeTitles.length < 2 || tags.length < 1) {
    throw new ProviderError(
      "The generation service returned an incomplete response. Please try again."
    );
  }

  return { bestTitle, alternativeTitles, description, tags };
}