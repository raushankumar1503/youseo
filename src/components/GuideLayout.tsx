// Shared article layout for the guides. Renders the site header, a structured
// article with a breadcrumb trail, byline (author + date), a prose column, and
// related-reading + generator footer. Breadcrumb + Article JSON-LD are included
// so every guide is eligible for rich results. guideMetadata() produces the
// unique per-article title/description/canonical/Open Graph/Twitter metadata.
import type { ReactNode } from "react";
import type { Metadata } from "next";
import Header from "./Header";
import JsonLd, { BreadcrumbJsonLd } from "./JsonLd";
import Link from "next/link";
import { SITE } from "@/lib/site";

export default function GuideLayout({
  slug,
  title,
  intro,
  children,
  updated,
  relatedSlugs = [],
}: {
  slug: string;
  title: string;
  intro?: string;
  children: ReactNode;
  /** ISO date, e.g. "2026-09-13" */
  updated: string;
  /** Slugs of guides to link as "related reading" */
  relatedSlugs?: string[];
}) {
  const path = `/guides/${slug}`;

  return (
    <>
      <Header />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: SITE.url + "/" },
          { name: "Guides", path: SITE.url + "/guides" },
          { name: title, path: SITE.url + path },
        ]}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: title,
          description: intro,
          datePublished: updated,
          dateModified: updated,
          image: `${SITE.url}/icon.svg`,
          author: {
            "@type": "Person",
            name: SITE.author,
            jobTitle: SITE.authorRole,
          },
          publisher: {
            "@type": "Organization",
            name: SITE.name,
            logo: { "@type": "ImageObject", url: `${SITE.url}/icon.svg` },
          },
          mainEntityOfPage: SITE.url + path,
        }}
      />
      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <nav aria-label="Breadcrumb" className="text-xs text-neutral-500">
          <ol className="flex flex-wrap items-center gap-1.5">
            <li>
              <Link href="/" className="hover:text-neutral-900">Home</Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href="/guides" className="hover:text-neutral-900">Guides</Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-neutral-700">{title}</li>
          </ol>
        </nav>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-neutral-900">
          {title}
        </h1>
        {intro && (
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-neutral-700">
            {intro}
          </p>
        )}
        <div className="mt-3 flex flex-wrap items-center gap-x-2 text-xs text-neutral-500">
          <span className="font-medium text-neutral-700">{SITE.author}</span>
          <span aria-hidden="true">·</span>
          <span>{SITE.authorRole}</span>
          <span aria-hidden="true">·</span>
          <time dateTime={updated}>{formatDate(updated)}</time>
        </div>

        <div className="mt-8 space-y-5 text-[15px] leading-relaxed text-neutral-800">
          {children}
        </div>

        {relatedSlugs.length > 0 && (
          <div className="mt-10 rounded-lg border border-neutral-200 bg-neutral-50 p-5">
            <h2 className="text-sm font-semibold text-neutral-900">
              Related reading
            </h2>
            <ul className="mt-3 space-y-2 text-sm">
              {relatedSlugs.map((slug2) => {
                const rel = GUIDE_TITLES[slug2];
                return (
                  <li key={slug2}>
                    <Link
                      href={`/guides/${slug2}`}
                      className="text-neutral-700 underline hover:text-neutral-900"
                    >
                      {rel?.title ?? slug2}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        <div className="mt-10 rounded-lg border border-accent/30 bg-accent/5 p-5">
          <p className="text-sm font-semibold text-neutral-900">
            Try the {SITE.name}
          </p>
          <p className="mt-1 text-sm text-neutral-700">
            Turn this guide into practice: enter a video topic and get a
            recommended title, alternatives, a description, and tags.
          </p>
          <Link
            href="/#generator"
            className="mt-3 inline-flex items-center rounded-md bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
          >
            Open the generator
          </Link>
        </div>
      </main>
    </>
  );
}

// Sub-heading helper so guides share consistent heading hierarchy.
export function GuideH2({ children }: { children: ReactNode }) {
  return (
    <h2 className="mt-8 text-xl font-semibold tracking-tight text-neutral-900">
      {children}
    </h2>
  );
}
export function GuideH3({ children }: { children: ReactNode }) {
  return (
    <h3 className="mt-6 text-base font-semibold text-neutral-900">{children}</h3>
  );
}

// Unique per-article metadata. Each article page exports the result of
// guideMetadata(slug) — this guarantees unique title, description, canonical,
// Open Graph, and Twitter metadata without repeating boilerplate in every file.
export function guideMetadata(slug: string): Metadata {
  const g = GUIDE_TITLES[slug];
  const url = `/guides/${slug}`;
  if (!g) {
    return {
      title: `Guide — ${SITE.name}`,
      alternates: { canonical: SITE.url + url },
      robots: { index: false },
    };
  }
  const fullTitle = `${g.title} — ${SITE.name}`;
  return {
    title: fullTitle,
    description: g.blurb,
    alternates: { canonical: SITE.url + url },
    openGraph: {
      type: "article",
      url: SITE.url + url,
      title: fullTitle,
      description: g.blurb,
      locale: "en_US",
      siteName: SITE.name,
      images: [{ url: SITE.url + "/icon.svg", width: 512, height: 512, alt: SITE.name }],
    },
    twitter: {
      card: "summary",
      title: fullTitle,
      description: g.blurb,
      images: [SITE.url + "/icon.svg"],
    },
  };
}

// Titles used for the index and related-reading links.
export const GUIDE_TITLES: Record<string, { title: string; blurb: string; updated: string }> = {
  "how-to-write-better-youtube-titles": {
    title: "How to Write Better YouTube Titles",
    blurb: "Turn vague video titles into ones viewers actually click, without resorting to clickbait.",
    updated: "2026-09-13",
  },
  "how-to-write-a-youtube-description": {
    title: "How to Write a YouTube Description",
    blurb: "A practical walkthrough of a description that helps viewers and search know what your video is about.",
    updated: "2026-09-13",
  },
  "how-youtube-tags-work": {
    title: "How YouTube Tags Work (and How to Use Them)",
    blurb: "What tags actually do on YouTube in 2026, and a realistic process for choosing them.",
    updated: "2026-09-13",
  },
  "youtube-seo-for-beginners": {
    title: "YouTube SEO for Beginners",
    blurb: "A plain-language introduction to how YouTube finds, ranks, and recommends your videos.",
    updated: "2026-09-13",
  },
  "how-to-find-youtube-keywords": {
    title: "How to Find YouTube Keywords",
    blurb: "Pick the search terms people actually type, so your titles and descriptions match real demand.",
    updated: "2026-09-13",
  },
  "how-to-improve-youtube-click-through-rate": {
    title: "How to Improve Your YouTube Click-Through Rate",
    blurb: "Get more of the people who see your video to click it — and keep them honest when they do.",
    updated: "2026-09-13",
  },
  "common-youtube-seo-mistakes": {
    title: "Common YouTube SEO Mistakes (and How to Avoid Them)",
    blurb: "The everyday metadata errors that quietly hurt your videos, and the fixes for each one.",
    updated: "2026-09-13",
  },
  "how-to-optimize-an-old-youtube-video": {
    title: "How to Optimize an Old YouTube Video",
    blurb: "A step-by-step refresh for older videos that deserve more views and may already be ranking.",
    updated: "2026-09-13",
  },
};

export function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}