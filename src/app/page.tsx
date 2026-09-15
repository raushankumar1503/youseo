"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Generator from "@/components/Generator";
import Results from "@/components/Results";
import JsonLd from "@/components/JsonLd";
import type { GenerateResult } from "@/lib/types";
import { SITE } from "@/lib/site";

const FAQS = [
  {
    q: "Is the YouTube SEO Generator free to use?",
    a: "Yes. The generator is free — there is no account, no payment, and nothing to install or configure. Enter a topic and you get a title, a description, and tags right away.",
  },
  {
    q: "Do I need to connect an AI service to use it?",
    a: "No. It works right in your browser — type a topic, press Generate, and the results come back in a few seconds. There is no sign-up and nothing to set up on your side.",
  },
  {
    q: "Does the tool guarantee my video will rank or get views?",
    a: "No. The output is a starting point — a title, a description, and tags. How a video performs depends on many factors outside metadata, including the quality of the video, your audience, and YouTube's own systems.",
  },
  {
    q: "Is the generated content ready to publish as-is?",
    a: "Treat it as a draft. You should review and edit every title, description, and tag so it accurately and honestly reflects the video you actually made before publishing.",
  },
  {
    q: "Will tags alone help my video rank?",
    a: "Only a little. Tags are a small signal. Your title, description, and the quality of the video matter far more. The guides explain how to use tags sensibly.",
  },
  {
    q: "Where can I learn how to use the results well?",
    a: "The Guides section has practical articles on writing titles, descriptions, tags, finding keywords, improving click-through rate, avoiding common mistakes, and refreshing older videos.",
  },
  {
    q: "Is this site affiliated with YouTube or Google?",
    a: "No. YouTube is used descriptively only. This is an independent, editorially written site and is not affiliated with or endorsed by YouTube or Google.",
  },
  {
    q: "What data does the tool store when I enter a topic?",
    a: "The topic you enter is sent in a single request to produce results and is not stored in a database. See the Privacy Policy for the full details.",
  },
];

export default function HomePage() {
  const [result, setResult] = useState<GenerateResult | null>(null);
  const [lastTopic, setLastTopic] = useState("");

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": ["WebApplication", "SoftwareApplication"],
          name: SITE.name,
          url: SITE.url + "/",
          applicationCategory: "DeveloperApplication",
          operatingSystem: "Web",
          description:
            "Generate SEO-friendly YouTube titles, descriptions, and tags from your video topic.",
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          author: { "@type": "Person", name: SITE.author },
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQS.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }}
      />
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <section id="generator" className="scroll-mt-20">
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900">
            YouTube SEO Generator
          </h1>
          <p className="mt-3 max-w-xl text-base text-neutral-600">
            Create better YouTube titles, descriptions, and tags from your video
            topic.
          </p>

          <div className="mt-8 rounded-lg border border-neutral-200 p-5 sm:p-6">
            <Generator
              onResult={(res, topic) => {
                setResult(res);
                setLastTopic(topic);
              }}
              hasResult={result !== null}
            />
          </div>
        </section>

        {result && <Results result={result} topic={lastTopic} />}

        <section className="mt-14 space-y-5">
          <h2 className="text-2xl font-bold tracking-tight text-neutral-900">
            What this tool does
          </h2>
          <p className="text-[15px] leading-relaxed text-neutral-700">
            {SITE.name} turns a single video topic into three practical pieces of
            YouTube metadata: a recommended best title, a set of alternative
            titles, a description, and a batch of relevant tags. It is designed
            for creators who want a strong, honest starting point for their
            upload without hiring an editor or building a workflow by hand.
          </p>
          <p className="text-[15px] leading-relaxed text-neutral-700">
            The output is grounded in the search terms around your topic and in
            practical YouTube SEO — it aims to be specific, useful, and natural
            rather than clickbait. Every result is a suggestion to review, not a
            guarantee of views or rankings.
          </p>
        </section>

        <section className="mt-12 space-y-5">
          <h2 className="text-2xl font-bold tracking-tight text-neutral-900">
            How it works
          </h2>
          <ol className="list-decimal space-y-2 pl-5 text-[15px] leading-relaxed text-neutral-700">
            <li>
              Enter a video topic, or pick one of the suggested topics to start
              from.
            </li>
            <li>Press Generate. The topic is sent once to an AI model.</li>
            <li>
              The tool returns a best title, alternative titles, a description,
              and tags.
            </li>
            <li>Copy each piece into YouTube Studio and edit as needed.</li>
          </ol>
          <p className="text-[15px] leading-relaxed text-neutral-700">
            Generation is handled for you by a hosted AI service, so there is
            nothing to install or configure. The tool produces all its output in
            a single request, so it is fast.
          </p>
        </section>

        <section className="mt-12 space-y-5">
          <h2 className="text-2xl font-bold tracking-tight text-neutral-900">
            How to use the results
          </h2>
          <p className="text-[15px] leading-relaxed text-neutral-700">
            Use the recommended title as your main option, and the alternatives
            to compare angles while you decide. Paste the description as a draft
            and make sure every sentence is true of your actual video. Add the
            tags to the tag field, but treat them as the last box to tick — a
            clear title and description matter more, as the guides explain.
          </p>
        </section>

        <section className="mt-12 space-y-5">
          <h2 className="text-2xl font-bold tracking-tight text-neutral-900">
            Why SEO matters for YouTube
          </h2>
          <p className="text-[15px] leading-relaxed text-neutral-700">
            YouTube is a search and recommendation engine. It decides which
            videos to show based partly on understanding what your video is
            about, and partly on how viewers behave once they click. A clear
            title, a matching description, and honest packaging help YouTube
            match your video to the people who want it. That is why the metadata
            you write matters — not because it can force rankings, but because it
            lets the right viewers find you. The{" "}
            <Link href="/guides" className="text-neutral-700 underline hover:text-neutral-900">
              Guides
            </Link>{" "}
            go deeper into each piece.
          </p>
        </section>

        <section className="mt-12 space-y-5">
          <h2 className="text-2xl font-bold tracking-tight text-neutral-900">
            Frequently asked questions
          </h2>
          <div className="space-y-4">
            {FAQS.map((faq) => (
              <div
                key={faq.q}
                className="rounded-lg border border-neutral-200 p-5"
              >
                <h3 className="text-sm font-semibold text-neutral-900">
                  {faq.q}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-700">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}