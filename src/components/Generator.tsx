"use client";

import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
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

// UX-stage status messages shown while the generation request is in flight.
// The Worker returns the complete result in a single request and gives us no
// per-step progress, so these communicate the current *stage* to the viewer
// rather than claiming the backend is doing extra work — kept honest on purpose.
const STATUS_MESSAGES = [
  "Analyzing your topic…",
  "Building SEO-friendly titles…",
  "Preparing description and tags…",
  "Finalizing SEO recommendations…",
];

const MESSAGE_INTERVAL_MS = 2200;

// Light client-side shape check so a malformed response never renders as a
// broken result. This mirrors the Worker's own parseResult validation rather
// than trusting the network blindly.
function isValidResult(value: unknown): value is GenerateResult {
  if (!value || typeof value !== "object") return false;
  const d = value as Partial<GenerateResult>;
  if (typeof d.bestTitle !== "string" || !d.bestTitle.trim()) return false;
  if (typeof d.description !== "string" || !d.description.trim()) return false;
  if (!Array.isArray(d.alternativeTitles) || d.alternativeTitles.length < 1) return false;
  if (!Array.isArray(d.tags) || d.tags.length < 1) return false;
  return true;
}

interface GeneratorProps {
  onResult: (result: GenerateResult, topic: string) => void;
  /** True once a result already exists, so the primary button can say "Regenerate". */
  hasResult?: boolean;
}

export default function Generator({ onResult, hasResult = false }: GeneratorProps) {
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState(STATUS_MESSAGES[0]);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const messageIndexRef = useRef(0);

  const stopCycle = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const startCycle = useCallback(() => {
    messageIndexRef.current = 0;
    setStatusMessage(STATUS_MESSAGES[0]);
    stopCycle();
    intervalRef.current = setInterval(() => {
      messageIndexRef.current = (messageIndexRef.current + 1) % STATUS_MESSAGES.length;
      // Force the crossfade to replay on each step by keying on the index.
      setStatusMessage(STATUS_MESSAGES[messageIndexRef.current]);
    }, MESSAGE_INTERVAL_MS);
  }, [stopCycle]);

  // Always clean up the timer, even if the component unmounts mid-request.
  useEffect(() => stopCycle, [stopCycle]);

  // The actual request. Shared by the form submit, the retry button, and
  // re-submission so there is exactly one code path to keep loading correct.
  const runGeneration = useCallback(
    async (topicValue: string) => {
      setError(null);
      setLoading(true);
      startCycle();
      setStatusMessage(STATUS_MESSAGES[0]);

      try {
        // Defensive: the request should resolve in both cases below. If next
        // code regresses and forgets to stop cycling, the timeout is a backstop
        // so the UI never stays stuck on "Generating…".
        const safety = setTimeout(() => {
          stopCycle();
          setLoading(false);
        }, 90000);
        try {
          const res = await fetch(WORKER_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ topic: topicValue } satisfies GenerateInput),
          });
          const text = await res.text();
          let data: unknown = null;
          try {
            data = text ? JSON.parse(text) : null;
          } catch {
            data = null; // malformed JSON body
          }

          if (!res.ok) {
            const apiError = (data as { error?: string } | null)?.error;
            const message =
              apiError ||
              (res.status >= 500
                ? "The generation service hit a temporary problem. Please try again."
                : "The generation service returned an error. Please try again.");
            setError(message);
            return;
          }

          if (!isValidResult(data)) {
            setError(
              "The generation service returned an unreadable response. Please try again."
            );
            return;
          }

          onResult(data, topicValue);
        } finally {
          clearTimeout(safety);
        }
      } catch {
        setError(
          "Could not reach the generation service. Please check your connection and try again."
        );
      } finally {
        stopCycle();
        setLoading(false);
      }
    },
    [onResult, startCycle, stopCycle]
  );

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (loading) return; // prevent duplicate requests while generating

    const topicValue = topic.trim();
    if (topicValue.length < 3) {
      setError("Please enter a topic that is at least 3 characters long.");
      return;
    }

    if (!WORKER_URL) {
      setError(
        "This build of the generator is not connected to a backend yet. The site owner must set NEXT_PUBLIC_WORKER_URL to the Cloudflare Worker URL and rebuild."
      );
      return;
    }

    runGeneration(topicValue);
  }

  function handleRetry() {
    const topicValue = topic.trim();
    if (topicValue.length < 3) {
      setError("Please enter a topic that is at least 3 characters long.");
      return;
    }
    runGeneration(topicValue);
  }

  const buttonLabel = loading ? "Generating…" : hasResult ? "Regenerate SEO" : "Generate SEO";

  return (
    <form onSubmit={handleSubmit} aria-busy={loading} className="space-y-5">
      <div>
        <label htmlFor="topic" className="mb-1.5 block text-sm font-medium text-neutral-800">
          Enter your video topic
        </label>
        <textarea
          id="topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          onKeyDown={(e) => {
            // Allow Ctrl/Cmd+Enter to submit from the keyboard.
            if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
              e.preventDefault();
              if (!loading) runGeneration(topic.trim());
            }
          }}
          placeholder="e.g. How to save money as a college student"
          rows={3}
          maxLength={500}
          required
          disabled={loading}
          aria-describedby="topic-help"
          className="w-full resize-y rounded border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 disabled:opacity-60"
        />
        <div id="topic-help" className="mt-1 text-right text-xs text-neutral-400">
          {topic.length}/500
        </div>
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
                disabled={loading}
                aria-label={`Use topic: ${suggestion}`}
                className="rounded-full border border-neutral-300 bg-white px-3 py-1 text-xs text-neutral-700 hover:border-neutral-400 hover:bg-neutral-50 disabled:opacity-60"
              >
                {suggestion}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {loading && (
        <div
          role="status"
          aria-live="polite"
          className="flex items-start gap-3 rounded-md border border-accent/40 bg-accent/5 px-4 py-3"
        >
          <span className="spinner mt-0.5" aria-hidden="true" />
          <div className="min-w-0">
            <p className="font-medium text-neutral-900" aria-atomic="true">
              {statusMessage}
            </p>
            <p className="mt-0.5 text-xs text-neutral-600">
              Turning your topic into a title, a description, and tags. This
              usually takes a few seconds.
            </p>
          </div>
        </div>
      )}

      {error && (
        <div
          role="alert"
          className="flex flex-col gap-3 rounded-md border border-red-200 bg-red-50 px-4 py-3"
        >
          <p className="text-sm text-red-700">{error}</p>
          {!loading && (
            <button
              type="button"
              onClick={handleRetry}
              className="self-start rounded border border-red-300 px-3 py-1 text-xs font-medium text-red-700 hover:bg-red-100"
            >
              Try again
            </button>
          )}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        aria-busy={loading}
        className="inline-flex items-center rounded-md bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading && <span className="spinner spinner-inverse mr-2" aria-hidden="true" />}
        {buttonLabel}
      </button>
    </form>
  );
}