"use client";

import Link from "next/link";

import BrandLogo from "@/components/brand/brand-logo";
import { companyContact } from "@/lib/site-data";

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

/**
 * Light marketing footer — ivory/white surface, charcoal type, burgundy accents.
 * Logo uses full lockup so the mark stays fully visible.
 */
export function SiteFooter() {
  return (
    <footer className="border-t border-[#D8D0C5] bg-[#F7F3EC] text-[#211E1B]">
      <div className="mx-auto max-w-[1440px] overflow-x-clip px-6 py-14 lg:px-8 xl:px-10 lg:py-16">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="max-w-[400px]">
              <BrandLogo variant="full" context="footer" href="/" />
            </div>
            <div className="mt-6 space-y-4 text-sm leading-relaxed text-[#695F57]">
              <div>
                <p className="text-[0.7rem] font-bold uppercase tracking-[0.12em] text-[#211E1B]">
                  {companyContact.headquarters.label}
                </p>
                <p className="mt-1">{companyContact.headquarters.address}</p>
                <p>{companyContact.headquarters.cityStateZip}</p>
              </div>

              <div>
                <p className="text-[0.7rem] font-bold uppercase tracking-[0.12em] text-[#211E1B]">
                  {companyContact.office.label}
                </p>
                <p className="mt-1">{companyContact.office.address}</p>
                <p>{companyContact.office.cityStateZip}</p>
              </div>

              <div className="space-y-1">
                <p>
                  <a
                    href={`mailto:${companyContact.email}`}
                    className="transition-colors hover:text-[#B83A3A]"
                  >
                    {companyContact.email}
                  </a>
                </p>
                <p>
                  <a
                    href={`tel:${companyContact.phoneTel}`}
                    className="transition-colors hover:text-[#B83A3A]"
                  >
                    {companyContact.phone}
                  </a>
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:col-span-8">
            {footerColumns.map((column) => (
              <div key={column.title}>
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#211E1B]">
                  {column.title}
                </p>
                <ul className="mt-4 space-y-2.5">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-[#695F57] transition-colors hover:text-[#B83A3A]"
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

        <div className="mt-12 border-t border-[#D8D0C5] pt-8 text-center text-xs text-[#695F57]">
          <p>© {new Date().getFullYear()} Consult America LLC. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
