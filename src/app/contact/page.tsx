import type { Metadata } from "next";
import Header from "@/components/Header";
import ContactForm from "@/components/ContactForm";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: `Contact — ${SITE.name}`,
  description:
    "Contact the editor behind the YouTube SEO Generator with questions, bug reports, or feedback on a guide.",
  alternates: { canonical: SITE.url + "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900">
          Contact
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-neutral-700">
          Have a question, a bug report, or feedback on a guide? Send a message
          below using your email app, or write directly to{" "}
          <a
            href={`mailto:${SITE.email}`}
            className="text-neutral-700 underline hover:text-neutral-900"
          >
            {SITE.email}
          </a>
          . Expect a reply within a few days.
        </p>
        <div className="mt-6 rounded-lg border border-neutral-200 p-5 sm:p-6">
          <ContactForm />
        </div>
      </main>
    </>
  );
}