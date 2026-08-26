"use client";

import Link from "next/link";

import BrandLogo from "@/components/brand/brand-logo";
import { Shell } from "@/components/layout/grid";
import { useContactPanel } from "@/components/providers/contact-provider";

const SITE_DOMAIN = "consultamerica.net";

const footerColumns = [
  {
    title: "What We Do",
    links: [
      { href: "/capabilities/enterprise-transformation", label: "Enterprise Transformation" },
      { href: "/oracle", label: "Oracle" },
      { href: "/ai-data", label: "AI & Data" },
      { href: "/capabilities/digital-engineering", label: "Digital Engineering" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/projects", label: "Work" },
      { href: "/insights", label: "Insights" },
      { href: "/careers", label: "Careers" },
    ],
  },
  {
    title: "Connect",
    links: [
      { href: "/contact", label: "Contact" },
      { href: "/login", label: "Employee Login" },
      { href: "/jobs", label: "Open Roles" },
    ],
  },
];

export function SiteFooter() {
  const { setOpen } = useContactPanel();

  return (
    <footer className="border-t border-white/10 bg-[var(--ca-navy)] text-white">
      <Shell className="py-12 lg:py-14">
        <div className="grid gap-10 lg:grid-cols-10">
          <div className="lg:col-span-4">
            <BrandLogo />
            <p className="mt-6 max-w-xs text-sm leading-6 text-white/60">
              Enterprise technology. Delivered to production.
            </p>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="ca-button-primary mt-6"
            >
              Contact
            </button>
          </div>

          {footerColumns.map((column) => (
            <div key={column.title} className="lg:col-span-2">
              <p className="text-sm font-semibold">{column.title}</p>
              <ul className="mt-4 space-y-2">
                {column.links.map((link) => (
                  <li key={link.href + link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/55 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-sm text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} ConsultAmerica</p>
          <a
            href={`https://${SITE_DOMAIN}`}
            className="text-white/35 transition-colors hover:text-white/60"
          >
            {SITE_DOMAIN}
          </a>
        </div>
      </Shell>
    </footer>
  );
}
