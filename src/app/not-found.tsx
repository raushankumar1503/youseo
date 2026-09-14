import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: `Page not found — ${SITE.name}`,
  robots: { index: false },
};

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-24 text-center sm:px-6">
        <p className="text-5xl font-bold text-accent">404</p>
        <h1 className="mt-4 text-2xl font-bold tracking-tight text-neutral-900">
          Page not found
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-neutral-600">
          The page you are looking for may have moved or no longer exists. You
          can return to the generator or browse the guides.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center rounded-md bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
          >
            Back to the generator
          </Link>
          <Link
            href="/guides"
            className="inline-flex items-center rounded-md border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
          >
            Browse guides
          </Link>
        </div>
      </main>
    </>
  );
}