import Link from "next/link";

import { primaryLinks } from "@/lib/navigation";

export function SiteFooter() {
  return (
    <footer className="mt-auto bg-ca-navy text-ca-white">
      <div className="mx-auto flex max-w-ca flex-col gap-8 px-6 py-12 md:flex-row md:justify-between">
        <div className="max-w-sm">
          <p className="font-heading text-lg font-semibold text-ca-white">
            Consult America
          </p>
          <p className="mt-2 text-sm text-ca-white/70">
            Oracle, AI, and enterprise delivery for organizations that need
            outcomes, not slideware.
          </p>
        </div>
        <nav className="grid grid-cols-2 gap-x-10 gap-y-2 text-sm">
          {primaryLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-ca-white/80 hover:text-ca-white"
            >
              {link.label}
            </Link>
          ))}
          <Link href="/contact" className="text-ca-white/80 hover:text-ca-white">
            Contact
          </Link>
        </nav>
      </div>
    </footer>
  );
}
