"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import FeatureCard from "@/components/marketing/inner-page/feature-card";
import { PageHero } from "@/components/marketing/inner-page";
import PageSection from "@/components/marketing/inner-page/page-section";
import Reveal from "@/components/marketing/inner-page/reveal";
import { useContactPanel } from "@/components/providers/contact-provider";
import { stockImage } from "@/lib/marketing/stock-images";

const outcomes = [
  {
    title: "Finance that closes on time",
    description:
      "General ledger, close, and reporting aligned to how finance teams actually operate.",
  },
  {
    title: "Procurement with control",
    description:
      "Source-to-pay workflows that preserve approvals, audit trails, and policy compliance.",
  },
  {
    title: "Supply chain visibility",
    description:
      "Planning, inventory, and fulfillment connected across entities and regions.",
  },
];

const modules = [
  { label: "Financials", href: "/oracle", detail: "Close, reporting, and multi-entity accounting" },
  { label: "Procurement", href: "/oracle", detail: "Source-to-pay with policy and controls" },
  { label: "Supply Chain", href: "/oracle", detail: "Planning, inventory, and fulfillment" },
  { label: "Projects", href: "/oracle", detail: "Project controls, costing, and billing" },
  { label: "HCM", href: "/oracle", detail: "Workforce, payroll, and talent operations" },
  { label: "Integration & Data", href: "/oracle", detail: "OIC, reporting, and data flows" },
];

const lifecycle = [
  "Discover",
  "Design",
  "Configure",
  "Integrate",
  "Test",
  "Adopt",
  "Operate",
];

export default function OraclePageSections() {
  const { setOpen } = useContactPanel();

  return (
    <>
      <PageHero
        variant="oracle"
        layout="split-left"
        imageShape="oracle-tall"
        photoScale="editorial"
        eyebrow="Oracle Transformation"
        title={
          <>
            Modernize the
            <br />
            digital core.
          </>
        }
        description="Transform finance, procurement, supply chain, projects and workforce operations through connected Oracle Cloud delivery."
        image={stockImage("oracleFinanceOps", { w: 1400, q: 88 })}
        imageAlt="Enterprise finance and operations transformation"
        secondaryImage={{
          src: stockImage("oracleWorkflowDetail", { w: 480, q: 85 }),
          alt: "Finance and procurement workflow",
          shape: "rect",
        }}
        primaryCta={{ label: "Talk to an Oracle expert", href: "/contact" }}
        secondaryCta={{ label: "View case studies", href: "/work/case-studies", variant: "secondary" }}
      />

      <PageSection
        tone="soft"
        eyebrow="Business outcomes"
        title="What modernization should deliver."
      >
        <div className="grid gap-6 md:grid-cols-3">
          {outcomes.map((item, index) => (
            <FeatureCard key={item.title} delay={index * 0.08}>
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#F0F6F4] text-sm font-bold text-[#176A63]">
                {String(index + 1).padStart(2, "0")}
              </div>
              <h3 className="text-lg font-semibold text-[#122D2E]">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-[#5B6D6B]">{item.description}</p>
            </FeatureCard>
          ))}
        </div>
      </PageSection>

      <PageSection
        tone="white"
        eyebrow="Oracle Cloud"
        title="Capabilities across the enterprise."
      >
        <div className="overflow-hidden rounded-2xl border border-[#E1ECE8] bg-white shadow-[0_8px_32px_rgba(7,59,58,0.05)]">
          {modules.map((mod, index) => (
            <Reveal key={mod.label} delay={index * 0.05}>
              <Link
                href={mod.href}
                className="ca-editorial-row group flex items-center justify-between gap-6 border-b border-[#E1ECE8] px-5 py-6 last:border-b-0 md:px-7 md:py-7"
              >
                <div>
                  <h3 className="text-xl font-semibold text-[var(--ca-ink)] group-hover:text-[var(--ca-teal)]">
                    {mod.label}
                  </h3>
                  <p className="mt-1 text-sm text-[var(--ca-text-secondary)]">{mod.detail}</p>
                </div>
                <ArrowUpRight className="h-5 w-5 shrink-0 text-[var(--ca-text-secondary)] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--ca-teal)]" />
              </Link>
            </Reveal>
          ))}
        </div>
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#E1ECE8] bg-[#F8FAF9] px-6 py-5">
          <p className="text-sm text-[#5B6D6B]">
            Not sure which module fits your environment? Talk it through with an Oracle practice lead.
          </p>
          <button
            type="button"
            onClick={() => setOpen(true, { practice: "Oracle", serviceKey: "oracle" })}
            className="inline-flex h-11 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-lg bg-[var(--ca-teal-deep)] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#0B4655]"
          >
            Talk to an Oracle expert
            <ArrowUpRight className="h-4 w-4" />
          </button>
        </div>
      </PageSection>

      <PageSection
        tone="sage"
        eyebrow="Delivery approach"
        title="Structured delivery from discovery through go-live."
        lead="Cutover planning, regression coverage, and release governance are built into the program — not bolted on before launch weekend."
      >
        <div className="flex flex-wrap gap-3">
          {lifecycle.map((step, index) => (
            <Reveal key={step} delay={index * 0.05}>
              <span className="ca-step-pill">
                <span className="text-[#176A63]">{String(index + 1).padStart(2, "0")}</span>
                {step}
              </span>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.12} className="mt-8 grid gap-4 sm:grid-cols-2">
          {[
            "Test strategy aligned to business process risk",
            "Data migration validation and reconciliation",
            "Release readiness checkpoints with executive sponsors",
            "Hypercare and stabilization support post go-live",
          ].map((item) => (
            <p key={item} className="flex items-start gap-3 text-sm text-[#5B6D6B]">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#176A63]" />
              {item}
            </p>
          ))}
        </Reveal>
      </PageSection>
    </>
  );
}
