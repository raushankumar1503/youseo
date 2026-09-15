// Single place to configure the site identity. Everything that needs the
// site name, URL, author, or contact details imports from here so there is
// exactly one value to change when you go live.
//
// >>> REPLACE SITE_URL below with your real domain once it is decided. <<<
// Every page (canonical, Open Graph, sitemap, robots, JSON-LD) reads from it.

export const SITE = {
  name: "YouTube SEO Generator",
  shortName: "YouTube SEO",
  url: "https://raushankumar1503.github.io/youseo",
  description:
    "Generate SEO-friendly YouTube titles, descriptions, and tags from your video topic — plus practical guides on YouTube search and growth.",
  author: "Raushan Kumar",
  authorRole: "Founder & Editor",
  // CONFIGURATION: set your real public contact email here (a plain string,
  // e.g. "you@yourdomain.com"). Keep it as "" to hide the public contact
  // form and the mailto link on the Contact page (both gracefully fall back
  // to a "getting in touch" notice). Never ship a placeholder like
  // "x@example.com" in production.
  email: "raushansharma152003@gmail.com",
  language: "en",
} as const;

export type Site = typeof SITE;