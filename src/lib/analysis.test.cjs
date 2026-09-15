// Dependency-free tests for the client-side SEO heuristic (src/lib/analysis.ts).
// Compiled to .test-dist/ by the package.json test script alongside provider.ts
// and seo.ts, then run by node --test here.

const { test } = require("node:test");
const assert = require("node:assert/strict");

const { analyzeResult } = require("../../.test-dist/analysis.js");

function solidResult() {
  return {
    bestTitle: "How to Grow a YouTube Channel From Zero (Beginner's Guide)",
    alternativeTitles: [
      "How to Grow a YouTube Channel From Zero",
      "My Beginner's Process for Growing a YouTube Channel",
      "10 Things I Wish I Knew Before Starting YouTube",
    ],
    description:
      "In this guide you will learn how to grow a YouTube channel from zero. We walk through finding your niche, planning videos, and writing titles and descriptions that actually get clicks. You will leave with a repeatable process for your first hundred subscribers. We also cover how to write better titles, how to find keywords people are searching for, and how to improve your click-through rate over time.",
    tags: [
      "how to grow youtube channel",
      "youtube growth tips",
      "beginner youtube",
      "youtube subscriber tips",
      "grow youtube from zero",
      "youtube for beginners",
      "how to get more subscribers",
      "youtube channel growth strategies",
      "first youtube video",
      "picture perfect youtube meta",
    ],
  };
}

const TOPIC = "How to grow a YouTube channel from zero";

test("analyzeResult scores a strong result highly", () => {
  const a = analyzeResult(TOPIC, solidResult());
  assert.equal(typeof a.total, "number");
  // Strong, on-topic result should score well but never exceed 100.
  assert.ok(a.total >= 75, `expected a strong score, got ${a.total}`);
  assert.ok(a.total <= 100);
  assert.equal(a.factors.length, 5);
});

test("analyzeResult sum of factor points stays within the 0-100 scale", () => {
  const a = analyzeResult(TOPIC, solidResult());
  const maxTotal = a.factors.reduce((s, f) => s + f.max, 0);
  assert.equal(maxTotal, 100, "factor maxima should sum to 100");
  const earned = a.factors.reduce((s, f) => s + f.score, 0);
  assert.ok(earned <= 100, `earned ${earned} must not exceed 100`);
});

test("analyzeResult penalises an empty, off-topic result", () => {
  const weak = {
    bestTitle: "Video",
    alternativeTitles: ["Clip", "Movie", "Post"],
    description: "hi",
    tags: ["fun"],
  };
  const a = analyzeResult("How to cook pasta carbonara", weak);
  assert.ok(a.total <= 45, `expected a low heuristic score, got ${a.total}`);
});

test("analyzeResult never crashes on a blank or short topic", () => {
  const a = analyzeResult("  ", solidResult());
  assert.equal(typeof a.total, "number");
  assert.ok(a.total >= 0 && a.total <= 100);
});