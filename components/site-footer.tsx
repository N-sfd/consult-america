"use client";

import Link from "next/link";
import { ChevronDown, ArrowUpRight } from "lucide-react";

import BrandLogo from "@/components/brand/brand-logo";
import { Shell } from "@/components/layout/grid";
import { useContactPanel } from "@/components/providers/contact-provider";

const footerColumns = [
  {
    title: "Consulting",
    links: [
      { href: "/capabilities/enterprise-transformation", label: "Enterprise Transformation" },
      { href: "/capabilities/enterprise-transformation", label: "Operating Model & Process" },
      { href: "/oracle", label: "Oracle Advisory" },
      { href: "/capabilities/managed-delivery", label: "Program Delivery & PMO" },
      { href: "/capabilities/managed-delivery", label: "Managed Services" },
    ],
  },
  {
    title: "Technology",
    links: [
      { href: "/oracle", label: "Oracle Fusion Cloud" },
      { href: "/ai-data", label: "AI & Data Engineering" },
      { href: "/capabilities/digital-engineering", label: "Cloud Modernization" },
      { href: "/capabilities/digital-engineering", label: "API & Integration Hub" },
      { href: "/capabilities/digital-engineering", label: "Application Engineering" },
    ],
  },
  {
    title: "Applications",
    links: [
      { href: "/work/innovation/data-agent", label: "Data Agent" },
      { href: "/ai-data", label: "Data Explorer" },
      { href: "/work/innovation/joblens", label: "JobLens" },
      { href: "/work/innovation/mediguide-ai", label: "MediGuide AI" },
      { href: "/capabilities/digital-engineering", label: "Convera" },
      { href: "/platforms/ats", label: "HR & Talent Suite" },
    ],
  },
  {
    title: "Industries",
    links: [
      { href: "/industries/public-sector", label: "Government & Public Sector" },
      { href: "/industries/financial-services", label: "Financial Services" },
      { href: "/industries/healthcare", label: "Healthcare & Life Sciences" },
      { href: "/industries/technology", label: "Technology & Software" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About Us" },
      { href: "/work", label: "Our Work" },
      { href: "/insights", label: "Insights & Publications" },
      { href: "/careers", label: "Careers" },
      { href: "/contact", label: "Contact Practice Leads" },
    ],
  },
];

export function SiteFooter() {
  const { setOpen } = useContactPanel();

  return (
    <footer className="relative border-t border-[#1E3752] bg-[#0C2233] text-[#97A8B7] overflow-hidden">
      {/* Prominent Pre-Footer Statement */}
      <div className="relative z-10 border-b border-[#1E3752] bg-[#102033] py-10 sm:py-12">
        <Shell>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <p className="text-[0.68rem] font-bold tracking-widest text-[#B63A3A] uppercase">
                ENTERPRISE PRODUCTION DELIVERY
              </p>
              <h3 className="mt-2 font-serif text-3xl sm:text-4xl font-bold text-white tracking-tight">
                BUILD WHAT&apos;S NEXT.
              </h3>
            </div>
            <div>
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="ca-button-primary inline-flex items-center gap-2 !min-h-[48px] !px-7 text-sm font-semibold rounded-lg cursor-pointer"
              >
                <span>Talk to an Expert</span>
                <ArrowUpRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </Shell>
      </div>

      <Shell className="relative z-10 py-12 lg:py-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-12">
          {/* Brand Col */}
          <div className="sm:col-span-2 lg:col-span-3">
            <BrandLogo tone="light" />
            <p className="mt-4 max-w-xs text-xs sm:text-sm leading-relaxed text-[#97A8B7]">
              Enterprise transformation, Oracle Cloud, AI &amp; data, and digital application engineering delivered from strategy through production.
            </p>
            <div className="mt-6 flex flex-col gap-2.5">
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-white hover:text-[#B63A3A] transition-colors cursor-pointer"
              >
                Start a Conversation →
              </button>
              <Link
                href="/login"
                className="text-xs font-medium text-[#97A8B7] hover:text-white transition-colors"
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
                className="group border-b border-[#1E3752] pb-4 sm:border-0 sm:pb-0"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between text-xs font-bold uppercase tracking-[0.14em] text-white marker:content-none sm:cursor-default">
                  {column.title}
                  <ChevronDown className="h-3.5 w-3.5 text-[#97A8B7]/50 transition-transform duration-200 group-open:rotate-180 sm:hidden" />
                </summary>
                <ul className="mt-3.5 space-y-2.5">
                  {column.links.map((link) => (
                    <li key={link.href + link.label}>
                      <Link
                        href={link.href}
                        className="text-xs text-[#97A8B7] transition-colors hover:text-white"
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

        {/* Bottom copyright & legal */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-[#1E3752] pt-8 text-xs text-[#97A8B7]/70 sm:flex-row">
          <p>© {new Date().getFullYear()} Consult America LLC. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
            <Link href="/security" className="hover:text-white transition-colors">
              Security &amp; Compliance
            </Link>
          </div>
        </div>
      </Shell>
    </footer>
  );
}
