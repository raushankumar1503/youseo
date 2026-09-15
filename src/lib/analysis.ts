// Client-side "SEO content score" heuristic.
//
// IMPORTANT disambiguation: this score is NOT real YouTube search data. It
// does not measure ranking, search volume, competition, CTR, impressions, or
// views — those are impossible to compute locally. Instead it scores how well
// the generated metadata *internally* uses the topic's own keywords and
// follows basic metadata structure. It exists to give creators a fast,
// honest self-check, and it is always labelled as a heuristic in the UI.
//
// It is a pure function of (topic, result) so it can be unit-tested without
// any network or backend involvement.

import type { GenerateResult } from "./types";

const STOP_WORDS = new Set([
  "the", "a", "an", "and", "or", "but", "for", "to", "of", "in", "on",
  "at", "by", "with", "from", "up", "about", "into", "over", "after",
  "before", "how", "why", "what", "when", "is", "are", "be", "do", "does",
  "i", "you", "your", "we", "my", "their", "me", "as", "it", "can", "this",
  "that", "these", "those", "get", "make", "use",
]);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s'-]/g, " ")
    .split(/\s+/)
    .map((w) => w.trim())
    .filter((w) => w.length > 1 && !STOP_WORDS.has(w));
}

function uniqueTokens(text: string): string[] {
  return [...new Set(tokenize(text))];
}

function countUniqueMatches(terms: string[], haystack: string): number {
  const body = new Set(tokenize(haystack));
  return terms.filter((t) => body.has(t)).length;
}

// Sub-scores out of each category's own max, with a plain-language note.
export interface ScoreFactor {
  label: string;
  score: number;
  max: number;
  note: string;
}

export interface SeoAnalysis {
  total: number; // 0-100
  factors: ScoreFactor[];
  /** Short "what to look at next" pointer, or an empty string when solid. */
  tip: string;
}

const clamp = (n: number) => Math.max(0, Math.min(n, 1));

export function analyzeResult(topic: string, result: GenerateResult): SeoAnalysis {
  const topicTokens = uniqueTokens(topic);
  const title = result.bestTitle;
  const description = result.description;
  const tagsText = result.tags.join(" ");
  const bodyText = `${title} ${description}`;

  const factors: ScoreFactor[] = [];

  // 1) Title quality & relevance (max 30)
  const titleLen = title.trim().length;
  let titleScore = clamp((titleLen - 15) / 35); // penalise very short / very long
  if (topicTokens.length > 0 && countUniqueMatches(topicTokens, title) > 0) {
    titleScore = Math.min(1, titleScore + 0.25);
  }
  factors.push({
    label: "Title & relevance",
    score: Math.round(titleScore * 30),
    max: 30,
    note:
      titleLen >= 25 && titleLen <= 70
        ? "Title is a strong length and reads naturally."
        : titleLen < 25
          ? "Title is a bit short — try adding a specific angle or qualifier."
          : "Title is long — YouTube may truncate it. Consider trimming.",
  });

  // 2) Keyword coverage across title + description (max 25)
  const coverageRatio =
    topicTokens.length === 0
      ? 0
      : countUniqueMatches(topicTokens, bodyText) / topicTokens.length;
  const kwScore = clamp(0.25 + coverageRatio * 0.75); // floor so it's not savage on short topics
  factors.push({
    label: "Keyword coverage",
    score: Math.round(kwScore * 25),
    max: 25,
    note:
      coverageRatio >= 0.8
        ? `Most topic keywords appear in the title or description (${Math.round(
            coverageRatio * 100
          )}%).`
        : `Some topic keywords are missing from the title/description (${Math.round(
            coverageRatio * 100
          )}%). Fold them in naturally where they fit.`,
  });

  // 3) Description quality (max 25)
  const descWords = description.trim().split(/\s+/).length;
  const descLenOk = descWords >= 100 && descWords <= 350;
  const descHasKeyword = topicTokens.length === 0 || countUniqueMatches(topicTokens, description) > 0;
  let descScore = 0.2;
  if (descLenOk) descScore += 0.5;
  else if (descWords > 40) descScore += 0.25;
  if (descHasKeyword) descScore += 0.3;
  descScore = clamp(descScore);
  factors.push({
    label: "Description quality",
    score: Math.round(descScore * 25),
    max: 25,
    note: descLenOk
      ? `Description is ${
          descWords < 150 ? "a good length" : "well developed"
        } and uses the topic keywords.`
      : descWords < 100
        ? "Description is on the shorter side — expand it to ~150+ words."
        : "Description is very long — tighten it for readability.",
  });

  // 4) Tags: count + relevance (max 20)
  const tagCount = result.tags.length;
  const tagRelevance =
    topicTokens.length === 0
      ? 0
      : countUniqueMatches(topicTokens, tagsText) / topicTokens.length;
  let tagScore = 0.15;
  if (tagCount >= 10) tagScore += 0.5;
  else if (tagCount >= 5) tagScore += 0.3;
  else if (tagCount >= 1) tagScore += 0.15;
  if (tagRelevance >= 0.5) tagScore += 0.35;
  else if (tagRelevance > 0) tagScore += 0.2;
  tagScore = clamp(tagScore);
  factors.push({
    label: "Tags & coverage",
    score: Math.round(tagScore * 20),
    max: 20,
    note:
      tagCount >= 10
        ? "A healthy set of tags covering the topic and its variations."
        : `${tagCount} tag${tagCount === 1 ? "" : "s"} — aim for ~10–20 relevant tags.`,
  });

  // 5) Search-intent alignment proxy (max 0 — informational only). Not scored
  // as numerical weight because intent can't be measured client-side; we only
  // reflect whether at least one title reads like a clear, specific claim.
  const titles = [title, ...result.alternativeTitles];
  const specific = titles.filter((t) => {
    const toks = tokenize(t);
    const hasNumber = /\d/.test(t);
    const hasQualifier = /\b(how|why|tips|guide|for|best|vs|with|without|complete|beginner)\b/i.test(t);
    return toks.length >= 4 && (hasNumber || hasQualifier);
  });
  factors.push({
    label: "Search-intent alignment",
    score: specific.length >= 2 ? 0 : 0,
    max: 0,
    note:
      specific.length >= 2
        ? "Titles read as specific, intent-driven angles (guide/how-to/beginner/list)."
        : "Titles lean generic. Aim for an angle viewers will recognise as 'for me'.",
  });

  const maxTotal = 30 + 25 + 25 + 20; // 100
  const earned = factors.reduce((sum, f) => sum + f.score, 0);
  const total = Math.round(clamp(earned / maxTotal) * 100);

  const tip =
    total >= 85
      ? ""
      : factors
          .filter((f) => f.max > 0 && f.score / f.max < 0.6)
          .map((f) => f.label)
          .join(", ") || "Review each line and refine the weakest areas.";

  return { total, factors, tip };
}