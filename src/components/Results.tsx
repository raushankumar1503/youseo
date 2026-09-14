"use client";

import type { GenerateResult } from "@/lib/types";
import CopyButton from "./CopyButton";

export default function Results({ result }: { result: GenerateResult }) {
  return (
    <div className="mt-10 space-y-10">
      <section aria-label="Best title">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-neutral-900">Best title</h2>
          <CopyButton text={result.bestTitle} label="best title" />
        </div>
        <p className="rounded-md border border-accent/40 bg-accent/5 px-4 py-3 text-sm text-neutral-900">
          {result.bestTitle}
        </p>
        <p className="mt-1.5 text-xs text-neutral-500">
          Recommended — strongest option for search intent, clarity, and click-through.
        </p>
      </section>

      <section aria-label="Alternative titles">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-neutral-900">Alternative titles</h2>
          <CopyButton
            text={result.alternativeTitles.join("\n")}
            label="all alternative titles"
          />
        </div>
        <ol className="divide-y divide-neutral-200 rounded-md border border-neutral-200">
          {result.alternativeTitles.map((title, i) => (
            <li
              key={i}
              className="flex items-start justify-between gap-3 px-3 py-2.5"
            >
              <span className="text-sm text-neutral-900">{title}</span>
              <CopyButton text={title} label={`alternative title ${i + 1}`} />
            </li>
          ))}
        </ol>
      </section>

      <section aria-label="Description">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-neutral-900">Description</h2>
          <CopyButton text={result.description} label="description" />
        </div>
        <div className="whitespace-pre-wrap rounded-md border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm leading-relaxed text-neutral-800">
          {result.description}
        </div>
      </section>

      <section aria-label="Tags">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-neutral-900">Tags</h2>
          <CopyButton text={result.tags.join(", ")} label="all tags" />
        </div>
        <div className="flex flex-wrap gap-2">
          {result.tags.map((tag, i) => (
            <span
              key={i}
              className="rounded border border-neutral-200 bg-white px-2.5 py-1 text-xs text-neutral-700"
            >
              {tag}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
}