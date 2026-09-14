import Link from "next/link";
import { SITE } from "@/lib/site";

const links = [
  { href: "/", label: "Home" },
  { href: "/guides", label: "Guides" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Use" },
  { href: "/disclaimer", label: "Disclaimer" },
];

export default function Footer() {
  return (
    <footer className="border-t border-neutral-200">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <p className="max-w-2xl text-sm text-neutral-600">
          {SITE.name} turns a video topic into SEO suggestions — a best title,
          alternatives, a description, and tags. Practical guides on YouTube
          search and growth live under{" "}
          <Link href="/guides" className="text-neutral-700 underline hover:text-neutral-900">
            Guides
          </Link>
          .
        </p>
        <nav aria-label="Footer">
          <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-neutral-600 hover:text-neutral-900"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <p className="mt-6 text-xs text-neutral-500">
          © {new Date().getFullYear()} {SITE.name}. Suggestions only — not a
          guarantee of ranking or views.
        </p>
      </div>
    </footer>
  );
}