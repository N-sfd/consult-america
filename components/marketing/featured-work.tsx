"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

import Container from "@/components/layout/container";
import EditorialHeading from "@/components/marketing/EditorialHeading";
import SectionLabel from "@/components/marketing/SectionLabel";
import { cn } from "@/lib/utils";

const caseStudies = [
  {
    number: "01",
    category: "Public Sector",
    title: "Modernizing finance and procurement for complex government operations.",
    description:
      "End-to-end Oracle Cloud Financials and Procurement—approvals, reporting, and integration across agencies.",
    capabilities: ["Oracle Cloud", "Finance", "Procurement", "Integration"],
    href: "/projects/public-sector-finance-procurement",
    image:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Modern civic and government architecture",
    tone: "white" as const,
    visual: "photo" as const,
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
    tone: "cloud" as const,
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
    tone: "navy" as const,
    visual: "photo" as const,
  },
];

export default function FeaturedWork() {
  return (
    <section id="work" className="bg-[var(--mkt-white)]">
      <div className="mkt-section pb-0">
        <div className="mkt-shell">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-16">
            <div className="lg:col-span-4">
              <SectionLabel tone="dark">Selected Work</SectionLabel>
            </div>
            <div className="lg:col-span-8">
              <EditorialHeading className="max-w-4xl text-[var(--mkt-navy)]">
                Outcomes you can see—
                <br />
                not just slides.
              </EditorialHeading>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-10 space-y-0">
        {caseStudies.map((study, index) => (
          <CaseStudyPanel key={study.number} study={study} index={index} />
        ))}
      </div>

      <Container>
        <div className="flex justify-end border-t border-[var(--mkt-border)] py-10">
          <Link href="/projects" className="ca-link">
            View all projects
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </Container>
    </section>
  );
}

type Study = (typeof caseStudies)[number];

function CaseStudyPanel({ study, index }: { study: Study; index: number }) {
  const isNavy = study.tone === "navy";
  const isCloud = study.tone === "cloud";

  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.65, delay: index * 0.04 }}
      className={cn(
        "border-t",
        isNavy
          ? "border-white/10 bg-[var(--mkt-navy)] text-white"
          : isCloud
            ? "border-[var(--mkt-border)] bg-[var(--mkt-cloud)] text-[var(--mkt-navy)]"
            : "border-[var(--mkt-border)] bg-[var(--mkt-white)] text-[var(--mkt-navy)]",
      )}
    >
      <div className="mkt-shell">
        <div className="grid gap-10 py-14 lg:grid-cols-12 lg:gap-12 lg:py-20">
          <div className="flex flex-col justify-between lg:col-span-5">
            <div>
              <p
                className={cn(
                  "mkt-eyebrow",
                  isNavy ? "text-white/45" : "text-[var(--mkt-blue)]",
                )}
              >
                {study.number} / {study.category.toUpperCase()}
              </p>
              <h3 className="mt-8 max-w-xl text-3xl font-medium leading-[1.08] tracking-[-0.04em] md:text-4xl">
                {study.title}
              </h3>
              <p
                className={cn(
                  "mkt-body mt-6 max-w-md",
                  isNavy ? "!text-white/65" : "",
                )}
              >
                {study.description}
              </p>
              <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2">
                {study.capabilities.map((capability) => (
                  <span
                    key={capability}
                    className={cn(
                      "text-sm",
                      isNavy ? "text-white/45" : "text-[var(--mkt-muted)]",
                    )}
                  >
                    {capability}
                  </span>
                ))}
              </div>
            </div>
            <Link href={study.href} className="ca-link mt-12 w-fit">
              Explore the work
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="relative min-h-[320px] overflow-hidden lg:col-span-7 lg:min-h-[440px]">
            {study.visual === "data-agent" ? (
              <DataAgentVisual />
            ) : (
              <Image
                src={study.image!}
                alt={study.imageAlt}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 58vw"
              />
            )}
          </div>
        </div>
      </div>
    </motion.article>
  );
}

function DataAgentVisual() {
  return (
    <div className="flex h-full min-h-[320px] items-center justify-center bg-white/60 p-4 md:p-8 lg:min-h-[440px]">
      <div className="w-full max-w-xl overflow-hidden border border-[var(--mkt-border)] bg-white shadow-[0_20px_60px_rgba(16,42,67,0.08)]">
        <div className="flex items-center justify-between border-b border-[var(--mkt-border)] bg-[var(--mkt-navy)] px-4 py-3 text-white">
          <div className="flex items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-[var(--mkt-bright)]" />
            <span className="text-xs font-medium tracking-[0.08em]">
              DATA AGENT
            </span>
          </div>
          <span className="text-[0.65rem] text-white/45">
            CONTRACT INTELLIGENCE
          </span>
        </div>
        <div className="grid md:grid-cols-2">
          <div className="border-b border-[var(--mkt-border)] p-4 md:border-b-0 md:border-r">
            <p className="text-[0.65rem] uppercase tracking-[0.14em] text-[var(--mkt-muted)]">
              Source
            </p>
            <p className="mt-2 text-sm font-medium text-[var(--mkt-navy)]">
              MSA-2024-8841.pdf
            </p>
            <div className="mt-4 space-y-2">
              {[72, 88, 54, 96].map((width, i) => (
                <div
                  key={i}
                  className="h-2 rounded-sm bg-[var(--mkt-cloud)]"
                  style={{ width: `${width}%` }}
                />
              ))}
            </div>
          </div>
          <div className="p-4">
            <p className="text-[0.65rem] uppercase tracking-[0.14em] text-[var(--mkt-muted)]">
              Extracted
            </p>
            <ul className="mt-3 space-y-3 text-sm">
              {[
                ["Term", "36 months"],
                ["Renewal", "Auto · 90-day"],
                ["Risk", "§12.4"],
              ].map(([label, value]) => (
                <li
                  key={label}
                  className="flex justify-between border-b border-[var(--mkt-border)] pb-2"
                >
                  <span className="text-[var(--mkt-muted)]">{label}</span>
                  <span className="font-medium text-[var(--mkt-navy)]">
                    {value}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
