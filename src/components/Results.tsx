"use client";

import type { GenerateResult } from "@/lib/types";
import { analyzeResult } from "@/lib/analysis";
import CopyButton from "./CopyButton";

function copyAllText(result: GenerateResult): string {
  const altList = result.alternativeTitles.map((t) => `- ${t}`).join("\n");
  return [
    `Best title: ${result.bestTitle}`,
    "",
    "Alternative titles:",
    altList,
    "",
    `Description: ${result.description}`,
    "",
    `Tags: ${result.tags.join(", ")}`,
  ].join("\n");
}

function scoreTone(total: number): string {
  if (total >= 80) return "text-green-700";
  if (total >= 60) return "text-amber-700";
  return "text-red-700";
}

export default function Results({ result, topic }: { result: GenerateResult; topic: string }) {
  const analysis = analyzeResult(topic, result);

  return (
    <div className="animate-result mt-10 space-y-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-bold tracking-tight text-neutral-900">
          Your SEO metadata
        </h2>
        <CopyButton text={copyAllText(result)} label="all results" />
      </div>

      {/* SEO content score — an honest heuristic, clearly not live ranking data */}
      <section aria-label="SEO content score" className="border-t border-neutral-200 pt-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-lg font-semibold text-neutral-900">SEO content score</h3>
          <p className="text-3xl font-bold tracking-tight">
            <span className={scoreTone(analysis.total)}>{analysis.total}</span>
            <span className="text-base font-medium text-neutral-400">/100</span>
          </p>
        </div>
        <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-neutral-200">
          <div
            className="h-full rounded-full bg-accent transition-all"
            style={{ width: `${analysis.total}%` }}
            role="img"
            aria-label={`SEO content score ${analysis.total} out of 100`}
          />
        </div>
        <p className="mt-2 text-xs text-neutral-500">
          A quick internal check of how well the metadata uses your topic&apos;s
          keywords and structure. It is a heuristic — not a prediction of ranking,
          views, or clicks.
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {analysis.factors
            .filter((f) => f.max > 0)
            .map((f) => (
              <div key={f.label} className="min-w-0">
                <div className="flex items-baseline justify-between gap-2 text-sm">
                  <span className="font-medium text-neutral-800">{f.label}</span>
                  <span className="text-xs text-neutral-500">
                    {f.score}/{f.max}
                  </span>
                </div>
                <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-neutral-200">
                  <div
                    className="h-full rounded-full bg-accent/70"
                    style={{ width: `${(f.score / f.max) * 100}%` }}
                  />
                </div>
                <p className="mt-1.5 text-xs leading-relaxed text-neutral-500">{f.note}</p>
              </div>
            ))}
        </div>
        {analysis.tip && (
          <p className="mt-4 rounded-md border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs text-neutral-600">
            <span className="font-medium text-neutral-800">Worth a look:</span>{" "}
            {analysis.tip}.
          </p>
        )}
      </section>

      <section aria-label="Best title">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-neutral-900">Best title</h3>
          <CopyButton text={result.bestTitle} label="best title" />
        </div>
        <p className="break-words rounded-md border border-accent/40 bg-accent/5 px-4 py-3 text-sm text-neutral-900">
          {result.bestTitle}
        </p>
        <p className="mt-1.5 text-xs text-neutral-500">
          Recommended — strongest option for search intent, clarity, and click-through.
        </p>
      </section>

      <section aria-label="Alternative titles">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-neutral-900">Alternative titles</h3>
          <CopyButton
            text={result.alternativeTitles.join("\n")}
            label="all alternative titles"
          />
        </div>
        <ol className="divide-y divide-neutral-200 rounded-md border border-neutral-200">
          {result.alternativeTitles.map((title, i) => (
            <li key={i} className="flex items-start justify-between gap-3 px-3 py-2.5">
              <span className="min-w-0 flex-1 break-words text-sm text-neutral-900">
                {title}
              </span>
              <CopyButton text={title} label={`alternative title ${i + 1}`} />
            </li>
          ))}
        </ol>
      </section>

      <section aria-label="Description">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-neutral-900">Description</h3>
          <CopyButton text={result.description} label="description" />
        </div>
        <div className="break-words whitespace-pre-wrap rounded-md border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm leading-relaxed text-neutral-800">
          {result.description}
        </div>
      </section>

      <section aria-label="Tags">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-neutral-900">Tags</h3>
          <CopyButton text={result.tags.join(", ")} label="all tags" />
        </div>
        <div className="flex flex-wrap gap-2">
          {result.tags.map((tag, i) => (
            <span
              key={i}
              className="break-words rounded border border-neutral-200 bg-white px-2.5 py-1 text-xs text-neutral-700"
            >
              {tag}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
}