import type { Metadata } from "next";
import InfoLayout from "@/components/InfoLayout";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: `Privacy Policy — ${SITE.name}`,
  description:
    "How the YouTube SEO Generator handles the topic you enter, what data is (and is not) collected, and the limited role of cookies and ads.",
  alternates: { canonical: SITE.url + "/privacy-policy" },
};

export default function PrivacyPage() {
  return (
    <InfoLayout
      title="Privacy Policy"
      intro="This page explains what information this site collects and how it is used. Last updated: September 2026."
    >
      <h2 className="text-base font-semibold text-neutral-900">
        What happens to the topic you enter
      </h2>
      <p>
        When you use the generator, the topic you type is sent to the server in
        a single request to produce titles, descriptions, and tags. It is used
        only for that request and is not stored in a database or associated with
        your identity.
      </p>

      <h2 className="text-base font-semibold text-neutral-900">
        What this site does not collect
      </h2>
      <p>
        This site does not sell your data. It does not use advertising
        trackers, cross-site trackers, or analytics scripts that identify
        individual visitors. We do not ask for an account, and we do not store
        your search topics, email, or messages on a server. The contact form
        opens your own email app and sends directly from it; nothing is saved
        here.
      </p>

      <h2 className="text-base font-semibold text-neutral-900">
        Cookies and third-party ads
      </h2>
      <p>
        The site itself sets no tracking cookies. If we later show ads through a
        service such as Google AdSense, that provider may set cookies to serve
        and measure ads and may use them to personalise ads within its own
        advertising programme. When that happens, this policy will be updated,
        and you can control or reset ad cookies through your browser settings
        and through Google&apos;s Ad Settings.
      </p>

      <h2 className="text-base font-semibold text-neutral-900">
        Anonymous request logs
      </h2>
      <p>
        The hosting provider may keep short-lived, anonymous request logs (such
        as IP address, user agent, and which page was requested) to keep the
        service reliable and to detect abuse. These logs are not used to build
        profiles and are retained for the shortest period needed.
      </p>

      <h2 className="text-base font-semibold text-neutral-900">
        Third-party links
      </h2>
      <p>
        Guides may link to external websites. This policy covers only this site;
        we are not responsible for the privacy practices of third parties.
      </p>

      <h2 className="text-base font-semibold text-neutral-900">
        Contact
      </h2>
      <p>
        Questions about this policy can be sent to {SITE.email}.
      </p>
    </InfoLayout>
  );
}