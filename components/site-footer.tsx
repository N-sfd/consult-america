"use client";

import Link from "next/link";

import ConsultAmericaLogo from "@/components/brand/consult-america-logo";

const footerColumns = [
  {
    title: "Solutions",
    links: [
      { href: "/oracle", label: "Oracle" },
      { href: "/platforms/crm", label: "CRM" },
      { href: "/ai-data", label: "AI & Data" },
      { href: "/capabilities/digital-engineering", label: "Application Engineering" },
    ],
  },
  {
    title: "Applications",
    links: [
      { href: "/work/innovation/data-agent", label: "Data Agent" },
      { href: "/work/innovation/mediguide-ai", label: "MediGuide AI" },
      { href: "/work/innovation/joblens", label: "JobLens" },
      { href: "/ai-data", label: "Data Explorer" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/work", label: "Work" },
      { href: "/insights", label: "Insights" },
      { href: "/careers", label: "Careers" },
    ],
  },
  {
    title: "Connect",
    links: [
      { href: "/contact", label: "Contact" },
      { href: "/jobs", label: "Candidate Portal" },
      { href: "/login", label: "Employee Portal" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-[#E1ECE8] bg-[#F7FAF9] text-[#0B4A47]">
      <div className="mx-auto max-w-[1440px] px-6 py-14 lg:px-8 xl:px-10 lg:py-16">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <ConsultAmericaLogo lockup="footer" maxHeight="68px" maxWidth="340px" href="/" />
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-[#5B6D6B]">
              Enterprise transformation, Oracle, AI &amp; data, and application engineering —
              from strategy through production.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:col-span-8">
            {footerColumns.map((column) => (
              <div key={column.title}>
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#073B3A]">
                  {column.title}
                </p>
                <ul className="mt-4 space-y-2.5">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-[#5B6D6B] transition-colors hover:text-[#073B3A]"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 border-t border-[#DCE4E1] pt-8 text-center text-xs text-[#5B6D6B]">
          <p>© {new Date().getFullYear()} Consult America LLC. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
