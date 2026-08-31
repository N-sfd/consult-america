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
      { href: "/capabilities/enterprise-transformation", label: "Operating Model & Org Design" },
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
      { href: "/capabilities/digital-engineering", label: "Cloud Platforms & Infra" },
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
      { href: "/work/innovation/data-agent", label: "Data Agent" },
      { href: "/work/innovation/mediguide-ai", label: "MediGuide AI" },
    ],
  },
  {
    title: "Industries",
    links: [
      { href: "/industries/public-sector", label: "Government & Public Sector" },
      { href: "/industries/financial-services", label: "Financial Services" },
      { href: "/industries/healthcare", label: "Healthcare & Life Sciences" },
      { href: "/industries/technology", label: "Technology & Software" },
      { href: "/platforms/crm", label: "Retail & Commerce" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About Us" },
      { href: "/work", label: "Selected Work" },
      { href: "/insights", label: "Insights & Perspectives" },
      { href: "/careers", label: "Careers & Open Roles" },
      { href: "/contact", label: "Contact Practice Leads" },
    ],
  },
];

export function SiteFooter() {
  const { setOpen } = useContactPanel();

  return (
    <footer className="relative border-t border-[#D8D0C5] bg-[#F7F3EC] text-[#261F1B] overflow-hidden">
      {/* Subtle Abstract Architectural Texture (3% Opacity) */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(to right, #261F1B 1px, transparent 1px), linear-gradient(to bottom, #261F1B 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Prominent Pre-Footer Statement in Light Warm Shade */}
      <div className="relative z-10 border-b border-[#D8D0C5] bg-[#FFFDF8] py-10 sm:py-12">
        <Shell>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <p className="font-mono text-xs font-bold tracking-widest text-[#B63A3A] uppercase">
                Enterprise Production Delivery
              </p>
              <h3 className="mt-2 font-serif text-3xl sm:text-4xl font-bold text-[#261F1B] tracking-tight">
                BUILD WHAT&apos;S NEXT.
              </h3>
            </div>
            <div>
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="group ca-button-primary inline-flex items-center gap-2 !min-h-[50px] !px-7 text-sm font-semibold rounded-lg cursor-pointer !bg-[#B63A3A] hover:!bg-[#942E31] text-white shadow-sm"
              >
                <span>Talk to an expert</span>
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>
            </div>
          </div>
        </Shell>
      </div>

      <Shell className="relative z-10 py-12 lg:py-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-12">
          {/* Brand Col */}
          <div className="sm:col-span-2 lg:col-span-3">
            <BrandLogo tone="dark" markClassName="h-9 sm:h-10 lg:h-11 w-auto" />
            <p className="mt-4 max-w-xs text-xs sm:text-sm leading-relaxed text-[#695F57]">
              Enterprise consulting, Oracle Cloud, AI, data, and digital engineering delivered to production.
            </p>
            <div className="mt-6 flex flex-col gap-2.5">
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#B63A3A] hover:text-[#942E31] transition-colors cursor-pointer"
              >
                Start a Conversation →
              </button>
              <Link
                href="/login"
                className="text-xs font-medium text-[#695F57] hover:text-[#261F1B] transition-colors"
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
                className="group border-b border-[#D8D0C5] pb-4 sm:border-0 sm:pb-0"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between text-xs font-bold uppercase tracking-[0.14em] text-[#261F1B] marker:content-none sm:cursor-default">
                  {column.title}
                  <ChevronDown className="h-3.5 w-3.5 text-[#695F57] transition-transform duration-200 group-open:rotate-180 sm:hidden" />
                </summary>
                <ul className="mt-3.5 space-y-2.5">
                  {column.links.map((link) => (
                    <li key={link.href + link.label}>
                      <Link
                        href={link.href}
                        className="text-xs text-[#695F57] transition-colors hover:text-[#B63A3A]"
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

        {/* Bottom copyright */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-[#D8D0C5] pt-8 text-xs text-[#695F57] sm:flex-row">
          <p>© {new Date().getFullYear()} Consult America LLC. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-[#261F1B] transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-[#261F1B] transition-colors">
              Terms of Service
            </Link>
            <Link href="/security" className="hover:text-[#261F1B] transition-colors">
              Security &amp; Compliance
            </Link>
          </div>
        </div>
      </Shell>
    </footer>
  );
}
