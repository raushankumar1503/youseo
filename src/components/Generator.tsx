"use client";

import { useState, type FormEvent } from "react";
import type { GenerateInput, GenerateResult } from "@/lib/types";

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

    setError(null);
    setLoading(true);

    const payload: GenerateInput = { topic: topic.trim() };

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error ?? "Something went wrong. Please try again.");
        setLoading(false);
        return;
      }
      onResult(data as GenerateResult);
    } catch {
      setError(
        "Live generation requires a running AI backend (Ollama or an API key). This static deployment cannot host the backend — clone the repo and run it locally to generate results."
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