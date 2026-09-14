import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";
import { GUIDE_TITLES } from "@/components/GuideLayout";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // URLs end with a trailing slash to match Next.js `trailingSlash: true`
  // (each page is served as a directory/index.html on the static host).
  const staticPages = [
    "",
    "/about",
    "/contact",
    "/privacy-policy",
    "/terms",
    "/disclaimer",
    "/guides",
  ];

  const pages = [
    ...staticPages.map((p) => ({
      url: `${SITE.url}${p}/`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: p === "" ? 1 : 0.7,
    })),
    ...Object.entries(GUIDE_TITLES).map(([slug, g]) => ({
      url: `${SITE.url}/guides/${slug}/`,
      lastModified: new Date(g.updated),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];

  return pages;
}