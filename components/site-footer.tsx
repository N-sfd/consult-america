"use client";

import Link from "next/link";
import { ChevronDown, ArrowUpRight } from "lucide-react";

import BrandLogo from "@/components/brand/brand-logo";
import { Shell } from "@/components/layout/grid";
import { useContactPanel } from "@/components/providers/contact-provider";

const SITE_DOMAIN = "consultamerica.net";

const footerColumns = [
  {
    title: "Consulting",
    links: [
      { href: "/capabilities/enterprise-transformation", label: "Enterprise Transformation" },
      { href: "/oracle", label: "Oracle Advisory" },
      { href: "/capabilities/managed-delivery", label: "Program Delivery" },
      { href: "/capabilities/managed-delivery", label: "Managed Services" },
    ],
  },
  {
    title: "Technology",
    links: [
      { href: "/oracle", label: "Oracle Fusion Cloud" },
      { href: "/ai-data", label: "AI & Data Platforms" },
      { href: "/capabilities/digital-engineering", label: "Cloud Platforms" },
      { href: "/capabilities/digital-engineering", label: "API & Integration Hub" },
      { href: "/capabilities/digital-engineering", label: "Digital Engineering" },
    ],
  },
  {
    title: "Platforms",
    links: [
      { href: "/platforms/crm", label: "CRM Workspace" },
      { href: "/platforms/ats", label: "ATS & Talent Platform" },
      { href: "/platforms/hr", label: "Core HR Portal" },
      { href: "/platforms/employee", label: "Employee Self-Service" },
      { href: "/platforms/payroll", label: "Enterprise Payroll" },
      { href: "/work/innovation/data-agent", label: "Data Agent" },
    ],
  },
  {
    title: "Industries",
    links: [
      { href: "/industries/government-public-sector", label: "Government" },
      { href: "/industries/financial-services", label: "Financial Services" },
      { href: "/industries/healthcare", label: "Healthcare" },
      { href: "/industries/technology", label: "Technology" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/work", label: "Selected Work" },
      { href: "/insights", label: "Insights" },
      { href: "/careers", label: "Careers" },
    ],
  },
];

export function SiteFooter() {
  const { setOpen } = useContactPanel();

  return (
    <footer className="border-t border-[#433A35] bg-[#211B18] text-[#CFC4BA]">
      <Shell className="py-12 lg:py-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-12">
          {/* Brand Col */}
          <div className="sm:col-span-2 lg:col-span-3">
            <BrandLogo />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-[#CFC4BA]">
              Consulting, technology, and enterprise software platforms delivered to production.
            </p>
            <div className="mt-6 flex flex-col gap-2.5">
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="ca-button-primary inline-flex w-fit text-xs font-semibold"
              >
                Start a Conversation
                <ArrowUpRight className="h-3.5 w-3.5" />
              </button>
              <Link
                href="/login"
                className="text-xs font-medium text-[#CFC4BA]/70 hover:text-[#E2B6C0] transition-colors"
              >
                Employee Portal Login →
              </Link>
            </div>
          </div>

          {/* 5 Content Columns */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-9 lg:grid-cols-5">
            {footerColumns.map((column) => (
              <details
                key={column.title}
                open
                className="group border-b border-[#433A35] pb-4 sm:border-0 sm:pb-0"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between text-xs font-bold uppercase tracking-[0.14em] text-[#FFFFFF] marker:content-none sm:cursor-default">
                  {column.title}
                  <ChevronDown className="h-3.5 w-3.5 text-[#CFC4BA]/50 transition-transform duration-200 group-open:rotate-180 sm:hidden" />
                </summary>
                <ul className="mt-3.5 space-y-2.5">
                  {column.links.map((link) => (
                    <li key={link.href + link.label}>
                      <Link
                        href={link.href}
                        className="text-xs text-[#CFC4BA] transition-colors hover:text-[#E2B6C0]"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </details>
            ))}
          </div>
        </div>

        {/* Footer Bottom Strip */}
        <div className="mt-12 flex flex-col gap-3 border-t border-[#433A35] pt-6 text-xs text-[#CFC4BA]/70 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} ConsultAmerica Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/about" className="hover:text-[#E2B6C0] transition-colors">
              Privacy Policy
            </Link>
            <Link href="/about" className="hover:text-[#E2B6C0] transition-colors">
              Terms of Service
            </Link>
            <a
              href={`https://${SITE_DOMAIN}`}
              className="text-[#CFC4BA]/50 hover:text-[#E2B6C0] transition-colors"
            >
              {SITE_DOMAIN}
            </a>
          </div>
        </div>
      </Shell>
    </footer>
  );
}
