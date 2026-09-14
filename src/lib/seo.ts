// Deterministic preprocessing layer.
// Extracts structured keyword context from a raw topic before it reaches
// the generation step. This keeps the LLM on-track and reduces repetition.

const STOP_WORDS = new Set([
  "the", "a", "an", "and", "or", "but", "for", "to", "of", "in", "on",
  "at", "by", "with", "from", "up", "about", "into", "over", "after",
  "before", "how", "why", "what", "when", "is", "are", "be", "do", "does",
  "i", "you", "your", "we", "my", "their", "me", "as", "it", "can", "this",
  "that", "these", "those",
]);

interface TokenizeResult {
  phrases: string[];
  importantWords: string[];
  full: string;
}

function tokenize(topic: string): TokenizeResult {
  const normalized = topic
    .toLowerCase()
    .replace(/[^a-z0-9\s'-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const full = normalized;

  const words = normalized.split(" ");
  const importantWords = words.filter((w) => w && !STOP_WORDS.has(w));

  const phrases = new Set<string>();
  const distinct = [...new Set(importantWords)];
  for (let n = 2; n <= 3; n++) {
    for (let i = 0; i + n <= distinct.length; i++) {
      const phrase = distinct.slice(i, i + n).join(" ");
      if (phrase.split(" ").length >= 2) phrases.add(phrase);
    }
  }

  return { phrases: [...phrases].slice(0, 12), importantWords, full };
}

export interface KeywordContext {
  primary: string;
  words: string[];
  longTail: string[];
}

export function extractKeywords(topic: string): KeywordContext {
  const { phrases, importantWords, full } = tokenize(topic);
  return {
    primary: full,
    words: importantWords,
    longTail: phrases,
  };
}

// Builds the structured context block injected into the generation prompt.

export function buildKeywordContext(topic: string): KeywordContext {
  return extractKeywords(topic);
}