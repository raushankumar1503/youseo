// Shared layout for informational pages (About, Privacy, Terms, Disclaimer, etc.).
// Provides a consistent header, a titled main column, and prose spacing.
import type { ReactNode } from "react";
import Header from "./Header";

export default function InfoLayout({
  title,
  intro,
  children,
}: {
  title: string;
  intro?: string;
  children: ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900">
          {title}
        </h1>
        {intro && (
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-neutral-600">
            {intro}
          </p>
        )}
        <div className="mt-6 space-y-5 text-sm leading-relaxed text-neutral-700">
          {children}
        </div>
      </main>
    </>
  );
}