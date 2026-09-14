import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import JsonLd from "@/components/JsonLd";
import { GUIDE_TITLES, formatDate } from "@/components/GuideLayout";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: `YouTube SEO Guides — ${SITE.name}`,
  description:
    "Practical, honest guides on YouTube search: titles, descriptions, tags, keyword research, click-through rate, common mistakes, and optimizing older videos.",
  alternates: { canonical: SITE.url + "/guides" },
};

export default function GuidesPage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "YouTube SEO Guides",
          url: SITE.url + "/guides",
          description: metadata.description,
        }}
      />
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900">
          YouTube SEO Guides
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-neutral-700">
          Straightforward, practical guides on how YouTube search and
          recommendations actually work — written for creators who want their
          titles, descriptions, tags, and keywords to do a better job. Each
          guide focuses on one real problem and ends with something you can
          apply right away.
        </p>

        <div className="mt-8 space-y-4">
          {Object.entries(GUIDE_TITLES).map(([slug, g]) => (
            <div
              key={slug}
              className="rounded-lg border border-neutral-200 p-5 transition-colors hover:border-neutral-300 hover:bg-neutral-50"
            >
              <h2 className="text-base font-semibold text-neutral-900">
                {g.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                {g.blurb}
              </p>
              <div className="mt-3 flex items-center justify-between gap-4">
                <Link
                  href={`/guides/${slug}`}
                  className="inline-flex items-center gap-1 text-sm font-medium text-accent hover:text-green-700"
                >
                  Read guide
                  <span aria-hidden="true">→</span>
                </Link>
                <span className="shrink-0 text-xs text-neutral-500">
                  {formatDate(g.updated)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}