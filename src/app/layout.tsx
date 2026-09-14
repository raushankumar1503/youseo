import type { Metadata } from "next";
import type { ReactNode } from "react";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import { SITE } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — Titles, Descriptions & Tags`,
    template: `%s — ${SITE.name}`,
  },
  description: SITE.description,
  alternates: {
    canonical: SITE.url + "/",
  },
  openGraph: {
    type: "website",
    url: SITE.url + "/",
    siteName: SITE.name,
    title: `${SITE.name} — Titles, Descriptions & Tags`,
    description: SITE.description,
    locale: "en_US",
    images: [{ url: SITE.url + "/icon.svg", width: 512, height: 512, alt: SITE.name }],
  },
  twitter: {
    card: "summary",
    title: `${SITE.name} — Titles, Descriptions & Tags`,
    description: SITE.description,
    images: [SITE.url + "/icon.svg"],
  },
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col bg-white text-neutral-900 antialiased">
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: SITE.name,
            url: SITE.url + "/",
            description: SITE.description,
            inLanguage: "en",
            publisher: {
              "@type": "Organization",
              name: SITE.name,
              url: SITE.url + "/",
            },
          }}
        />
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}