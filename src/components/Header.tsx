import Link from "next/link";

const links = [
  { href: "/", label: "Home" },
  { href: "/#generator", label: "Generator" },
  { href: "/guides", label: "Guides" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  return (
    <header className="border-b border-neutral-200">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="text-sm font-semibold text-neutral-900">
          YouTube SEO Generator
        </Link>
        <nav aria-label="Main">
          <ul className="flex items-center gap-4 sm:gap-5">
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
      </div>
    </header>
  );
}