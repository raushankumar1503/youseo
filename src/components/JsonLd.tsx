// Renders a JSON-LD structured-data block. The object is serialized once so
// verify its shape in the rendered HTML. Used for WebSite, WebApplication,
// Article, BreadcrumbList and FAQPage across the site (AdSense + rich results).
import type { JSX } from "react";

export default function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function BreadcrumbJsonLd({
  items,
}: {
  items: { name: string; path: string }[];
}): JSX.Element {
  const list = items.map((item, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: item.name,
    item: item.path,
  }));
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: list,
      }}
    />
  );
}