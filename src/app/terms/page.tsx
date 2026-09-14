import type { Metadata } from "next";
import InfoLayout from "@/components/InfoLayout";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: `Terms of Use — ${SITE.name}`,
  description:
    "The terms of using the YouTube SEO Generator: output is suggestions only, no guaranteed results, and no warranties.",
  alternates: { canonical: SITE.url + "/terms" },
};

export default function TermsPage() {
  return (
    <InfoLayout
      title="Terms of Use"
      intro="By using YouTube SEO Generator, you agree to these terms. Last updated: September 2026."
    >
      <h2 className="text-base font-semibold text-neutral-900">
        The output is suggestions only
      </h2>
      <p>
        The titles, descriptions, and tags generated here are starting points
        for your own content. They are suggestions, not professional advice, and
        they do not guarantee views, impressions, rankings, clicks, subscribers,
        or revenue on YouTube. Many factors outside metadata — the quality of
        your video, your audience, and YouTube&apos;s own systems — determine
        how well a video performs.
      </p>

      <h2 className="text-base font-semibold text-neutral-900">
        Your responsibility
      </h2>
      <p>
        Before publishing, review and edit any generated title, description, and
        tags so they accurately and honestly represent your video. You are
        responsible for making sure your final content follows YouTube&apos;s
        policies and all applicable laws. This includes not republishing
        copyrighted material through the tool and not using generated metadata
        to mislead viewers.
      </p>

      <h2 className="text-base font-semibold text-neutral-900">
        Acceptable use
      </h2>
      <p>
        Use the tool for its intended purpose. Do not attempt to overload,
        disrupt, or gain unauthorised access to this site or its services, and
        do not use it to generate spam, deceptive, or abusive content.
      </p>

      <h2 className="text-base font-semibold text-neutral-900">
        Intellectual property
      </h2>
      <p>
        The design, text, and guides on this site are original and are the
        property of {SITE.name} unless otherwise noted. You may quote them with
        attribution. "YouTube" is a trademark of Google LLC and is used here
        only descriptively; this site is not affiliated with or endorsed by
        Google.
      </p>

      <h2 className="text-base font-semibold text-neutral-900">
        No warranty
      </h2>
      <p>
        This tool is provided "as is", without warranties of any kind, express
        or implied. To the fullest extent permitted by law, we are not liable
        for any loss or damage arising from your use of or reliance on the tool
        and its output. If local AI (Ollama) is configured, the tool depends on
        your local setup and we cannot guarantee its availability.
      </p>

      <h2 className="text-base font-semibold text-neutral-900">
        Changes
      </h2>
      <p>
        We may update these terms from time to time. Continued use of the site
        after changes means you accept the updated terms.
      </p>
    </InfoLayout>
  );
}