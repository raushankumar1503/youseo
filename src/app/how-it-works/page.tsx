import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "How It Works — YouTube SEO Generator",
  description:
    "How the YouTube SEO Generator processes your topic to create a title, description, and tags.",
  alternates: { canonical: SITE.url + "/how-it-works" },
};

export default function HowItWorksPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900">
          How It Works
        </h1>

        <div className="mt-6 space-y-5 text-sm leading-relaxed text-neutral-700">
          <section>
            <h2 className="text-base font-semibold text-neutral-900">
              1. Your topic is processed
            </h2>
            <p className="mt-1">
              When you enter a video topic, the site first reads it for the main
              keyword and a few natural long-tail phrases. This structured context
              keeps the output focused on what your video is actually about.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-neutral-900">
              2. A title is generated
            </h2>
            <p className="mt-1">
              Using that keyword context, a single strong title is written. It aims
              to be useful, natural, and accurate to your topic rather than a
              clickbait phrase.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-neutral-900">
              3. A description is structured
            </h2>
            <p className="mt-1">
              The description opens with a clear line that reflects the topic, then
              outlines what a viewer can expect, and closes with a simple call to
              action.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-neutral-900">
              4. Tags are selected
            </h2>
            <p className="mt-1">
              Tags are limited to terms genuinely related to your topic and search
              intent. They are meant to support how people actually search, not to
              pad the list with unrelated words.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-neutral-900">
              They are suggestions
            </h2>
            <p className="mt-1">
              The output is a starting point, not a guarantee. It reflects good
              practice and your topic, but it cannot promise rankings, views, or
              performance on YouTube. Review and edit before publishing.
            </p>
          </section>
        </div>

        <p className="mt-8 text-sm text-neutral-500">
          <Link href="/" className="text-neutral-700 hover:text-neutral-900">
            Back to the generator
          </Link>
        </p>
      </main>
    </>
  );
}