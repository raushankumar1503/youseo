// Dependency-free tests using node:test and Node's built-in assert.
// The package.json "test" script first transpiles the lib sources with the
// existing TypeScript compiler (npm has typescript installed) into a throwaway
// .test-dist/ folder, then runs this CJS suite against the compiled output.
//
// These cover provider selection (pure function) and the error paths for a
// missing Ollama service and for no provider configured. No external network
// is used: the "Ollama down" case stubs global.fetch to reject.

const { test } = require("node:test");
const assert = require("node:assert/strict");

const {
  resolveProvider,
  ProviderError,
  generateSEO,
  parseGenerationResult,
  validateGenerateResult,
} = require("../../.test-dist/provider.js");

const ALL_KEYS = [
  "AI_API_KEY",
  "AI_MODEL",
  "AI_BASE_URL",
  "OLLAMA_BASE_URL",
  "OLLAMA_MODEL",
];

function clearEnv() {
  return ALL_KEYS.reduce((prev, k) => {
    prev[k] = process.env[k];
    delete process.env[k];
    return prev;
  }, {});
}

function restoreEnv(saved) {
  for (const k of ALL_KEYS) {
    if (saved[k] === undefined) delete process.env[k];
    else process.env[k] = saved[k];
  }
}

test("resolveProvider picks OpenAI when AI_API_KEY is set, even if Ollama config exists", () => {
  const cfg = resolveProvider({
    AI_API_KEY: "sk-test",
    AI_MODEL: "gpt-4o-mini",
    OLLAMA_BASE_URL: "http://localhost:11434",
    OLLAMA_MODEL: "llama3.2",
  });
  assert.equal(cfg.kind, "openai");
  assert.equal(cfg.apiKey, "sk-test");
});

test("resolveProvider picks Ollama when Ollama config is set and no AI_API_KEY", () => {
  const cfg = resolveProvider({ OLLAMA_BASE_URL: "http://localhost:11434", OLLAMA_MODEL: "llama3.2" });
  assert.equal(cfg.kind, "ollama");
  assert.equal(cfg.ollamaModel, "llama3.2");
  assert.equal(cfg.ollamaBaseUrl, "http://localhost:11434");
});

test("resolveProvider applies default base URL when only OLLAMA_MODEL is set", () => {
  const cfg = resolveProvider({ OLLAMA_MODEL: "llama3.2" });
  assert.equal(cfg.kind, "ollama");
  assert.equal(cfg.ollamaBaseUrl, "http://localhost:11434");
});

test("resolveProvider returns none when nothing is configured", () => {
  const cfg = resolveProvider({});
  assert.equal(cfg.kind, "none");
});

test("generateSEO reports a clear, actionable error when Ollama is configured but not running", async () => {
  const saved = clearEnv();
  process.env.OLLAMA_BASE_URL = "http://127.0.0.1:1";
  process.env.OLLAMA_MODEL = "test-model";
  const realFetch = global.fetch;
  // Simulate the local service being down (connection refused).
  global.fetch = () => Promise.reject(new Error("connect ECONNREFUSED"));

  try {
    await assert.rejects(
      () => generateSEO({ topic: "How to grow a YouTube channel" }),
      (err) => {
        assert.ok(err instanceof ProviderError, "expected a ProviderError");
        assert.ok(
          err.message.includes("ollama serve"),
          `expected a run-Ollama instruction, got: ${err.message}`
        );
        return true;
      }
    );
  } finally {
    global.fetch = realFetch;
    restoreEnv(saved);
  }
});

test("generateSEO reports a clear error when no provider is configured", async () => {
  const saved = clearEnv();
  try {
    await assert.rejects(
      () => generateSEO({ topic: "How to grow a YouTube channel" }),
      (err) => {
        assert.ok(err instanceof ProviderError, "expected a ProviderError");
        assert.ok(
          err.message.includes("No AI provider"),
          `expected a no-provider message, got: ${err.message}`
        );
        return true;
      }
    );
  } finally {
    restoreEnv(saved);
  }
});

// --- Output schema (new: bestTitle + alternativeTitles + description + tags) ---

function fullResult() {
  return {
    bestTitle: "How to Grow a YouTube Channel from Zero (Beginner's Guide)",
    alternativeTitles: [
      "How to Grow a YouTube Channel from Zero",
      "My Beginner's Process for Growing a YouTube Channel",
      "10 Things I Wish I Knew Before Starting YouTube",
    ],
    description:
      "In this guide you will learn how to grow a YouTube channel from zero. We walk through finding your niche, planning videos, and writing titles and descriptions that actually get clicks. You will leave with a repeatable process for your first hundred subscribers.",
    tags: [
      "how to grow youtube channel",
      "youtube growth tips",
      "beginner youtube",
      "youtube subscriber tips",
      "grow youtube from zero",
    ],
  };
}

test("parseGenerationResult returns the new structured schema for valid JSON", () => {
  const raw = JSON.stringify(fullResult());
  const result = parseGenerationResult(raw);
  assert.equal(result.bestTitle, fullResult().bestTitle);
  assert.equal(result.alternativeTitles.length, 3);
  assert.equal(typeof result.description, "string");
  assert.ok(result.tags.length >= 5);
});

test("validateGenerateResult trims fenced JSON", () => {
  const raw = "```json\n" + JSON.stringify(fullResult()) + "\n```";
  const result = parseGenerationResult(raw);
  assert.ok(result.bestTitle.length > 0);
  assert.equal(result.alternativeTitles.length, 3);
});

test("validateGenerateResult drops duplicates and caps alternatives at 3", () => {
  const parsed = {
    bestTitle: "A",
    alternativeTitles: [
      "Same Option",
      "same option", // duplicate, case-insensitive
      "Second Option",
      "Third Option",
      "Fourth Option", // 5th -> exceeds cap, should be dropped
    ],
    description: "Some useful description text.",
    tags: ["tag1", "tag2"],
  };
  const result = validateGenerateResult(parsed);
  // 4 unique options after removing the duplicate -> capped to 3.
  assert.equal(result.alternativeTitles.length, 3);
  const count = result.alternativeTitles.filter(
    (t) => t.toLowerCase() === "same option"
  ).length;
  assert.equal(count, 1, "duplicate alternative title must be removed");
});

test("validateGenerateResult rejects incomplete output (missing alternatives)", () => {
  assert.throws(
    () =>
      validateGenerateResult({
        bestTitle: "Only title",
        alternativeTitles: [],
        description: "A description.",
        tags: ["tag"],
      }),
    ProviderError
  );
});

test("parseGenerationResult throws ProviderError on malformed JSON", () => {
  assert.throws(() => parseGenerationResult("not json {"), ProviderError);
});