"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

import CaseStudyCard from "@/components/marketing/CaseStudyCard";
import EditorialHeading from "@/components/marketing/EditorialHeading";
import SectionLabel from "@/components/marketing/SectionLabel";

const caseStudies = [
  {
    number: "01",
    category: "Public Sector",
    title:
      "Modernizing finance and procurement for complex government operations.",
    description:
      "End-to-end Oracle Cloud Financials and Procurement—approvals, reporting, and integration across agencies.",
    capabilities: ["Oracle Cloud", "Finance", "Procurement", "Integration"],
    href: "/projects/public-sector-finance-procurement",
    image:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Modern civic and government architecture",
    tone: "dark" as const,
    visual: "civic" as const,
  },
  {
    number: "02",
    category: "AI + Data",
    title: "Turning complex contracts into structured intelligence.",
    description:
      "Document intelligence, enterprise search, and AI extraction that make contracts searchable and actionable.",
    capabilities: [
      "Document Intelligence",
      "Enterprise Search",
      "AI Extraction",
    ],
    href: "/projects/ai-document-intelligence",
    image: null,
    imageAlt: "Data Agent interface",
    tone: "light" as const,
    visual: "data-agent" as const,
  },
  {
    number: "03",
    category: "Integration",
    title: "Connecting enterprise systems without slowing the business.",
    description:
      "API-led integration across Oracle, legacy platforms, and cloud services—reliable data flows at production scale.",
    capabilities: ["OIC", "APIs", "Event Flows", "Monitoring"],
    href: "/projects/integration-modernization",
    image:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Enterprise data center and network infrastructure",
    tone: "dark" as const,
    visual: "integration" as const,
  },
];

export default function FeaturedWork() {
  return (
    <section
      id="work"
      className="mkt-section border-t border-white/10 bg-[var(--mkt-ink)] text-white"
    >
      <div className="mkt-shell">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-16">
          <div className="lg:col-span-4">
            <SectionLabel tone="light">Selected Work</SectionLabel>
          </div>
          <div className="lg:col-span-8">
            <EditorialHeading className="max-w-4xl text-white">
              Outcomes you can see—not just slides.
            </EditorialHeading>
          </div>
        </div>
      </div>

      <div className="mt-16 space-y-0">
        {caseStudies.map((study, index) => (
          <motion.div
            key={study.number}
            initial={{ opacity: 0, y: 36 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, delay: index * 0.05 }}
          >
            <CaseStudyCard
              number={study.number}
              category={`${study.category} · ${study.number} of ${String(caseStudies.length).padStart(2, "0")}`}
              title={study.title}
              description={study.description}
              capabilities={study.capabilities}
              href={study.href}
              tone={study.tone}
            >
              {study.visual === "data-agent" ? (
                <DataAgentVisual />
              ) : study.visual === "integration" ? (
                <IntegrationVisual image={study.image!} alt={study.imageAlt} />
              ) : (
                <CivicVisual image={study.image!} alt={study.imageAlt} />
              )}
            </CaseStudyCard>
          </motion.div>
        ))}
      </div>

      <div className="mkt-shell">
        <div className="mt-12 flex justify-end border-t border-white/10 pt-10">
          <Link href="/projects" className="ca-link">
            View all projects
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function CivicVisual({ image, alt }: { image: string; alt: string }) {
  return (
    <div className="relative h-full min-h-[320px] w-full lg:min-h-[480px]">
      <Image
        src={image}
        alt={alt}
        fill
        className="object-cover"
        sizes="(max-width: 1024px) 100vw, 58vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[var(--mkt-ink)]/70 via-transparent to-transparent" />
      <div className="absolute bottom-6 left-6 right-6 grid grid-cols-3 gap-3 md:bottom-8 md:left-8">
        {["Finance live", "Procurement live", "Reporting live"].map((label) => (
          <div
            key={label}
            className="border border-white/20 bg-black/40 px-3 py-3 backdrop-blur-sm"
          >
            <p className="text-[0.65rem] uppercase tracking-[0.14em] text-white/50">
              Outcome
            </p>
            <p className="mt-1 text-sm font-medium text-white">{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function IntegrationVisual({ image, alt }: { image: string; alt: string }) {
  return (
    <div className="relative h-full min-h-[320px] w-full lg:min-h-[480px]">
      <Image
        src={image}
        alt={alt}
        fill
        className="object-cover"
        sizes="(max-width: 1024px) 100vw, 58vw"
      />
      <div className="absolute inset-0 bg-[var(--mkt-navy)]/55" />
      <div className="absolute inset-0 flex items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-lg border border-white/15 bg-[var(--mkt-ink)]/80 p-6 backdrop-blur-md md:p-8">
          <p className="mkt-eyebrow text-white/40">Integration Fabric</p>
          <div className="mt-6 space-y-3">
            {[
              { from: "Oracle Fusion", to: "Legacy ERP", status: "Synced" },
              { from: "HCM Events", to: "Workforce Hub", status: "Live" },
              { from: "Procurement", to: "Supplier Portal", status: "Live" },
            ].map((row) => (
              <div
                key={row.from}
                className="flex items-center justify-between gap-3 border-b border-white/10 pb-3 text-sm last:border-0"
              >
                <span className="text-white/70">{row.from}</span>
                <span className="text-white/30">→</span>
                <span className="text-white/70">{row.to}</span>
                <span className="text-[var(--mkt-blue-soft)]">{row.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function DataAgentVisual() {
  return (
    <div className="relative flex h-full min-h-[320px] items-center justify-center bg-[var(--mkt-off)] p-4 md:p-8 lg:min-h-[480px]">
      <div className="w-full max-w-xl overflow-hidden border border-black/10 bg-white shadow-[0_24px_80px_rgba(5,7,13,0.12)]">
        <div className="flex items-center justify-between border-b border-black/8 bg-[var(--mkt-navy)] px-4 py-3 text-white">
          <div className="flex items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-[var(--mkt-blue)]" />
            <span className="text-xs font-medium tracking-[0.08em]">
              DATA AGENT
            </span>
          </div>
          <span className="text-[0.65rem] text-white/45">
            CONTRACT INTELLIGENCE
          </span>
        </div>

        <div className="grid md:grid-cols-[1fr_1.1fr]">
          <div className="border-b border-black/8 p-4 md:border-b-0 md:border-r">
            <p className="text-[0.65rem] uppercase tracking-[0.14em] text-black/40">
              Source document
            </p>
            <p className="mt-2 text-sm font-medium text-[var(--mkt-ink)]">
              MSA-2024-8841.pdf
            </p>
            <div className="mt-4 space-y-2">
              {[72, 88, 54, 96, 40, 68].map((width, i) => (
                <div
                  key={i}
                  className="h-2 rounded-sm bg-black/[0.06]"
                  style={{ width: `${width}%` }}
                />
              ))}
            </div>
          </div>

          <div className="p-4">
            <p className="text-[0.65rem] uppercase tracking-[0.14em] text-black/40">
              Extracted fields
            </p>
            <ul className="mt-3 space-y-3">
              {[
                { label: "Counterparty", value: "State Health Agency" },
                { label: "Term", value: "36 months" },
                { label: "Renewal", value: "Auto · 90-day notice" },
                { label: "Risk clause", value: "Liability cap §12.4" },
              ].map((row) => (
                <li
                  key={row.label}
                  className="flex items-baseline justify-between gap-3 border-b border-black/6 pb-2 text-sm"
                >
                  <span className="text-black/45">{row.label}</span>
                  <span className="text-right font-medium text-[var(--mkt-ink)]">
                    {row.value}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex items-center gap-2">
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-black/8">
                <div className="h-full w-[92%] bg-[var(--mkt-blue)]" />
              </div>
              <span className="text-[0.7rem] text-black/45">92% confidence</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
