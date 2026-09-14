import type { Metadata } from "next";
import InfoLayout from "@/components/InfoLayout";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: `Disclaimer — ${SITE.name}`,
  description:
    "An honest disclaimer about what the YouTube SEO Generator can and cannot do, and the limits of SEO advice.",
  alternates: { canonical: SITE.url + "/disclaimer" },
};

export default function DisclaimerPage() {
  return (
    <InfoLayout
      title="Disclaimer"
      intro="We aim to keep this site honest and useful. This page makes the limits of what we can promise clear."
    >
      <h2 className="text-base font-semibold text-neutral-900">
        SEO suggestions, not guarantees
      </h2>
      <p>
        YouTube SEO Generator provides search suggestions — a recommended title,
        alternatives, a description, and tags — based on the topic you enter.
        These are starting points for your own content, not a promise of
        outcomes. The tool does not and cannot guarantee YouTube rankings,
        impressions, clicks, subscribers, or revenue.
      </p>

      <h2 className="text-base font-semibold text-neutral-900">
        Why results vary
      </h2>
      <p>
        Search and recommendation outcomes depend on many factors outside
        metadata, including the quality and relevance of your video, your
        audience, keyword competition, and YouTube&apos;s own systems, which
        change over time. A good title, description, and tag set help, but they
        are only one part of performance.
      </p>

      <h2 className="text-base font-semibold text-neutral-900">
        No professional or financial advice
      </h2>
      <p>
        Everything here is general information for creators. Guides reflect
        widely understood search and recommendation behaviour at the time of
        writing; they are not professional, legal, or financial advice. We are
        not Google, YouTube, or a search consultant, and we do not charge for
        advice.
      </p>

      <h2 className="text-base font-semibold text-neutral-900">
        Review before publishing
      </h2>
      <p>
        You are responsible for reviewing and editing any generated titles,
        descriptions, and tags before publishing and for making sure your
        content follows YouTube&apos;s policies.
      </p>

      <h2 className="text-base font-semibold text-neutral-900">
        Corrections
      </h2>
      <p>
        We do our best to keep information current, but search behaviour and
        policies evolve. If you spot something out of date or incorrect, let us
        know via {SITE.email}.
      </p>
    </InfoLayout>
  );
}