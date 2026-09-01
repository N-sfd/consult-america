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
    <footer className="ca-site-footer relative w-full max-w-[100vw] overflow-x-hidden border-t border-[rgba(38,31,27,0.10)] bg-[#F3EEE5] text-[#261F1B]">
      {/* Pre-footer CTA band */}
      <div className="ca-site-footer-cta relative z-10 border-b border-[rgba(38,31,27,0.10)] bg-[#F7F3EC] py-10 sm:py-12">
        <Shell>
          <div className="flex flex-wrap items-center justify-between gap-8 max-[768px]:flex-col max-[768px]:items-start">
            <div className="min-w-0 flex-[1_1_280px] max-[1100px]:basis-full lg:flex-[1_1_480px]">
              <p className="font-mono text-xs font-bold tracking-widest text-[#B63A3A] uppercase">
                Enterprise Production Delivery
              </p>
              <h3 className="mt-2 font-serif text-3xl font-bold tracking-tight text-[#261F1B] sm:text-4xl leading-[1.08]">
                BUILD
                <br />
                WHAT&apos;S NEXT.
              </h3>
            </div>

            <div className="shrink-0 max-[768px]:w-full">
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="group inline-flex w-auto max-w-full items-center justify-center gap-2 whitespace-nowrap rounded-md bg-[#B63A3A] px-[22px] py-4 min-h-[52px] text-sm font-semibold text-white transition-colors hover:bg-[#962F3E] cursor-pointer max-[768px]:w-full"
              >
                <span>Talk to an expert</span>
                <ArrowUpRight className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        </Shell>
      </div>

      <Shell className="relative z-10 py-12 lg:py-16">
        <div className="ca-footer-grid">
          {/* Brand column — dark charcoal wordmark on light ivory */}
          <div className="ca-footer-brand">
            <BrandLogo
              tone="dark"
              showTagline={false}
              markClassName="h-9 sm:h-10 w-auto"
              className="shrink-0"
            />
            <p className="mt-4 max-w-xs text-xs leading-relaxed text-[#695F57] sm:text-sm">
              Enterprise consulting, Oracle Cloud, AI, data, and digital engineering delivered to production.
            </p>
            <div className="mt-6 flex flex-col gap-2.5">
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="inline-flex items-center gap-1.5 text-left text-xs font-bold text-[#B63A3A] transition-colors hover:text-[#962F3E] cursor-pointer"
              >
                Start a Conversation →
              </button>
              <Link
                href="/login"
                className="text-xs font-medium text-[#695F57] transition-colors hover:text-[#261F1B]"
              >
                Employee Portal Login →
              </Link>
            </div>
          </div>

          {footerColumns.map((column) => (
            <div key={column.title} className="ca-footer-col min-w-0">
              <details open className="group border-b border-[rgba(38,31,27,0.10)] pb-4 sm:border-0 sm:pb-0">
                <summary className="flex cursor-pointer list-none items-center justify-between text-xs font-bold uppercase tracking-[0.14em] text-[#261F1B] marker:content-none sm:cursor-default">
                  {column.title}
                  <ChevronDown className="h-3.5 w-3.5 shrink-0 text-[#695F57] transition-transform duration-200 group-open:rotate-180 sm:hidden" />
                </summary>
                <ul className="mt-3.5 space-y-2.5">
                  {column.links.map((link) => (
                    <li key={link.href + link.label}>
                      <Link
                        href={link.href}
                        className="break-words text-xs text-[#695F57] transition-colors hover:text-[#B63A3A]"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </details>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-[rgba(38,31,27,0.10)] pt-8 text-xs text-[#695F57] sm:flex-row">
          <p className="text-center sm:text-left">© {new Date().getFullYear()} Consult America LLC. All rights reserved.</p>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            <Link href="/privacy" className="transition-colors hover:text-[#261F1B]">
              Privacy Policy
            </Link>
            <Link href="/terms" className="transition-colors hover:text-[#261F1B]">
              Terms of Service
            </Link>
            <Link href="/security" className="transition-colors hover:text-[#261F1B]">
              Security &amp; Compliance
            </Link>
          </div>
        </div>
      </Shell>
    </footer>
  );
}
