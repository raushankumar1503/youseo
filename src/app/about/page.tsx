import type { Metadata } from "next";
import Link from "next/link";
import InfoLayout from "@/components/InfoLayout";
import JsonLd from "@/components/JsonLd";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: `About — ${SITE.name}`,
  description:
    "Who runs the YouTube SEO Generator: founder Raushan Kumar, the editorial standards behind the tool and guides, and how this site is not affiliated with YouTube or Google.",
  alternates: { canonical: SITE.url + "/about" },
};

export default function AboutPage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "AboutPage",
          name: "About — " + SITE.name,
          url: SITE.url + "/about",
          about: {
            "@type": "WebApplication",
            name: SITE.name,
            author: { "@type": "Person", name: SITE.author, jobTitle: SITE.authorRole },
          },
        }}
      />
      <InfoLayout
        title="About"
        intro="YouTube SEO Generator is a small, focused utility that turns a video topic into practical search suggestions — a best title, alternatives, a description, and tags — alongside honest guides on YouTube search and growth."
      >
        <h2 className="text-base font-semibold text-neutral-900">
          What this website does
        </h2>
        <p>
          You enter a video topic and the tool returns a recommended title,
          three alternatives, a description, and a set of tags to use as a
          starting point for your upload. The goal is to keep the ideas focused
          on your actual topic and on what real viewers search for — not to pad
          the metadata with clickbait or keyword stuffing.
        </p>

        <h2 className="text-base font-semibold text-neutral-900">
          Who created it
        </h2>
        <p>
          The site is founded and edited by{" "}
          <strong className="font-semibold text-neutral-900">{SITE.author}</strong>,{" "}
          {SITE.authorRole}. It is an independent, single-person project built
          to be genuinely useful to creators. It is not affiliated with or
          endorsed by YouTube or Google; "YouTube" is used descriptively only.
        </p>

        <h2 className="text-base font-semibold text-neutral-900">
          Editorial standards
        </h2>
        <p>
          Everything on this site — the tool and the guides — is written in
          plain language by {SITE.author} and reviewed before publishing. We
          only make claims we can back up. The guides explain how YouTube's
          search and recommendation systems work in practical terms, and they
          flag where outcomes depend on factors outside metadata, such as video
          quality and audience. We do not promise rankings, views, or
          subscribers, and we do not publish made-up testimonials or inflated
          results.
        </p>

        <h2 className="text-base font-semibold text-neutral-900">
          How it generates suggestions
        </h2>
        <p>
          First, your topic is processed to pull out the main keyword and a few
          long-tail variations. That structured context is then passed to a
          generation step (a hosted AI service) that produces a naturally
          worded title, a clear description, and a set of relevant tags. One
          request produces all four outputs.
        </p>

        <h2 className="text-base font-semibold text-neutral-900">
          Review before publishing
        </h2>
        <p>
          The output is a starting point, not a final answer. Always review and
          edit the titles, description, and tags so they accurately reflect the
          video you plan to publish. For deeper guidance, the{" "}
          <Link href="/guides" className="text-neutral-700 underline hover:text-neutral-900">
            Guides
          </Link>{" "}
          cover titles, descriptions, tags, keywords, click-through rate, and
          common mistakes.
        </p>

        <h2 className="text-base font-semibold text-neutral-900">
          Get in touch
        </h2>
        <p>
          Questions, corrections, or suggestions on a guide? Reach out on the{" "}
          <Link href="/contact" className="text-neutral-700 underline hover:text-neutral-900">
            Contact
          </Link>{" "}
          page.
        </p>
      </InfoLayout>
    </>
  );
}