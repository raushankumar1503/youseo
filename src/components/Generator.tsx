"use client";

import { useState, type FormEvent } from "react";
import type { GenerateInput, GenerateResult } from "@/lib/types";
import { WORKER_URL } from "@/lib/config";

// Curated, genuinely useful starting topics. Selecting one fills the topic
// field; the user can also type their own topic.
const SUGGESTED_TOPICS = [
  "How to grow your YouTube channel from 0 to 1,000 subscribers",
  "How to write YouTube titles that people actually click",
  "How to find video topics your audience is already searching for",
  "How to plan and structure a YouTube video before filming",
  "How to keep viewers watching and improve video retention",
  "How to upload your first YouTube video as a complete beginner",
];

interface GeneratorProps {
  onResult: (result: GenerateResult) => void;
}

export default function Generator({ onResult }: GeneratorProps) {
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (loading) return;

    // Basic client-side sanity before we spend a network round-trip or any
    // free-tier quota on nonsense input. Mirrors the worker's own validation.
    const topicValue = topic.trim();
    if (topicValue.length < 3) {
      setError("Please enter a topic that is at least 3 characters long.");
      return;
    }

    setError(null);
    setLoading(true);

    // If the site owner hasn't wired this build to a Worker yet, don't make a
    // doomed request — tell the visitor what's missing instead.
    if (!WORKER_URL) {
      setError(
        "This build of the generator is not connected to a backend yet. The site owner must set NEXT_PUBLIC_WORKER_URL to the Cloudflare Worker URL and rebuild."
      );
      setLoading(false);
      return;
    }

    const payload: GenerateInput = { topic: topicValue };

    try {
      const res = await fetch(WORKER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setError(
          (data as { error?: string } | null)?.error ??
            "The generation service returned an error. Please try again."
        );
        setLoading(false);
        return;
      }
      onResult(data as GenerateResult);
    } catch {
      setError(
        "Could not reach the generation service. Please check your connection and try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="topic" className="mb-1.5 block text-sm font-medium text-neutral-800">
          Enter your video topic
        </label>
        <textarea
          id="topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="e.g. How to save money as a college student"
          rows={3}
          maxLength={500}
          required
          className="w-full resize-y rounded border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400"
        />
      </div>

      <div>
        <p className="mb-1.5 text-sm font-medium text-neutral-800">
          Or pick a topic to start from
        </p>
        <ul className="flex flex-wrap gap-2">
          {SUGGESTED_TOPICS.map((suggestion) => (
            <li key={suggestion}>
              <button
                type="button"
                onClick={() => setTopic(suggestion)}
                aria-label={`Use topic: ${suggestion}`}
                className="rounded-full border border-neutral-300 bg-white px-3 py-1 text-xs text-neutral-700 hover:border-neutral-400 hover:bg-neutral-50"
              >
                {suggestion}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="inline-flex items-center rounded-md bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Generating…" : "Generate SEO"}
      </button>
    </form>
  );
}