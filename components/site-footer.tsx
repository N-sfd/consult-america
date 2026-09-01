"use client";

import Link from "next/link";
import { ChevronDown, ArrowUpRight } from "lucide-react";

import ConsultAmericaLogo from "@/components/brand/consult-america-logo";
import { useContactPanel } from "@/components/providers/contact-provider";
import { industryLinks } from "@/lib/site-data";

const footerColumns = [
  {
    title: "What We Do",
    links: [
      { href: "/capabilities/enterprise-transformation", label: "Enterprise Transformation" },
      { href: "/oracle", label: "Oracle Transformation" },
      { href: "/ai-data", label: "AI & Data Engineering" },
      { href: "/capabilities/digital-engineering", label: "Application Engineering" },
      { href: "/capabilities/managed-delivery", label: "Managed Delivery" },
    ],
  },
  {
    title: "Oracle",
    links: [
      { href: "/oracle", label: "Financials & Ledger" },
      { href: "/oracle", label: "Supply Chain & ERP" },
      { href: "/oracle", label: "Procurement & S2P" },
      { href: "/oracle", label: "Integration & OIC" },
    ],
  },
  {
    title: "CRM",
    links: [
      { href: "/platforms/crm", label: "Customer 360 Workspace" },
      { href: "/platforms/crm", label: "Sales & Pipeline Governance" },
      { href: "/platforms/crm", label: "Service & Case Automation" },
      { href: "/platforms/crm", label: "Customer Data Platform (CDP)" },
    ],
  },
  {
    title: "AI & Data",
    links: [
      { href: "/ai-data", label: "Data Strategy & Governance" },
      { href: "/ai-data", label: "Enterprise Agents" },
      { href: "/ai-data", label: "Document Intelligence" },
      { href: "/ai-data", label: "Data Pipelines & Analytics" },
    ],
  },
  {
    title: "Applications",
    links: [
      { href: "/work/innovation/data-agent", label: "Data Agent" },
      { href: "/ai-data", label: "Data Explorer" },
      { href: "/work/innovation/joblens", label: "JobLens" },
      { href: "/work/innovation/mediguide-ai", label: "MediGuide AI" },
      { href: "/platforms/ats", label: "HR & Talent Portal" },
    ],
  },
  {
    title: "Industries",
    links: industryLinks.map((item) => ({ href: item.href, label: item.label })),
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About Us" },
      { href: "/work", label: "Our Work" },
      { href: "/insights", label: "Insights & Perspectives" },
      { href: "/careers", label: "Careers" },
      { href: "/contact", label: "Contact Practice Leads" },
    ],
  },
];

export function SiteFooter() {
  const { setOpen } = useContactPanel();

  return (
    <footer className="relative border-t border-[#C9DDD7] bg-[#F0F6F4] text-[#0B4A47] overflow-hidden">
      {/* Pre-footer: darker green bridge from contact */}
      <div className="relative z-10 border-b border-[#176A63]/20 bg-[#0B4A47] py-10 sm:py-12">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-8 xl:px-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <p className="text-[0.68rem] font-bold tracking-widest text-[#9BC4B8] uppercase">
                Enterprise Production Delivery
              </p>
              <h3 className="mt-2 font-serif text-3xl sm:text-4xl font-bold text-white tracking-tight">
                BUILD WHAT&apos;S NEXT.
              </h3>
            </div>
            <div>
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="inline-flex h-[50px] items-center justify-center gap-2 rounded-[8px] bg-[#B83A3A] px-7 text-sm font-semibold text-white shadow-[0_4px_18px_rgba(184,58,58,0.25)] hover:bg-[#992F31] transition-all cursor-pointer"
              >
                <span>Talk to an Expert</span>
                <ArrowUpRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1440px] px-6 lg:px-8 xl:px-10 relative z-10 py-12 lg:py-16">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4 max-w-[400px]">
            <ConsultAmericaLogo variant="light" size="footer" href="/" />
            <p className="mt-6 max-w-[380px] text-xs sm:text-sm leading-relaxed text-[#5B6D6B]">
              Enterprise transformation, Oracle Cloud, AI &amp; data, and digital application engineering delivered from strategy through production.
            </p>
            <div className="mt-6 flex flex-col gap-2.5">
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0B4A47] hover:text-[#B83A3A] transition-colors cursor-pointer"
              >
                Start a Conversation →
              </button>
              <Link
                href="/login"
                className="text-xs font-medium text-[#5B6D6B] hover:text-[#0B4A47] transition-colors"
              >
                Employee Portal Login →
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:col-span-8 lg:grid-cols-7">
            {footerColumns.map((column) => (
              <details
                key={column.title}
                open
                className="group border-b border-[#C9DDD7] pb-4 sm:border-0 sm:pb-0"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between text-[11px] font-bold uppercase tracking-[0.14em] text-[#0B4A47] marker:content-none sm:cursor-default">
                  {column.title}
                  <ChevronDown className="h-3.5 w-3.5 text-[#9BC4B8] transition-transform duration-200 group-open:rotate-180 sm:hidden" />
                </summary>
                <ul className="mt-3.5 space-y-2.5">
                  {column.links.map((link) => (
                    <li key={link.href + link.label}>
                      <Link
                        href={link.href}
                        className="text-xs text-[#5B6D6B] transition-colors hover:text-[#0B4A47]"
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

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-[#C9DDD7] pt-8 text-xs text-[#5B6D6B] sm:flex-row">
          <p>© {new Date().getFullYear()} Consult America LLC. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-[#0B4A47] transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-[#0B4A47] transition-colors">
              Terms of Service
            </Link>
            <Link href="/security" className="hover:text-[#0B4A47] transition-colors">
              Security &amp; Compliance
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
