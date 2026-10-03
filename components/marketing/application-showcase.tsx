"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

import { useStableReducedMotion } from "@/lib/marketing/use-stable-reduced-motion";
import { cn } from "@/lib/utils";

const applications = [
  {
    id: "data-agent",
    category: "Document intelligence",
    name: "Data Agent",
    summary: "Turn contracts and complex documents into fields people can verify.",
    signals: ["Extraction", "Source trace", "Review queue"],
    href: "/work/innovation/data-agent",
    image: "/innovation/data-agent-hero.png",
    alt: "Data Agent document intelligence interface",
  },
  {
    id: "mediguide",
    category: "Medical information intelligence",
    name: "MediGuide AI",
    summary: "Explain health documents with evidence kept beside the answer.",
    signals: ["Labels & labs", "Visit prep", "Citations"],
    href: "/work/innovation/mediguide-ai",
    image: "/innovation/mediguide-hero.png",
    alt: "MediGuide AI health information interface",
  },
  {
    id: "joblens",
    category: "Recruiting intelligence",
    name: "JobLens",
    summary: "Resume analysis and job matching with the score explained.",
    signals: ["Resume analysis", "ATS signals", "Matching"],
    href: "/work/innovation/joblens",
    image: "/innovation/joblens-hero.png",
    alt: "JobLens recruiting intelligence interface",
  },
  {
    id: "explorer",
    category: "Enterprise data exploration",
    name: "Data Explorer",
    summary: "Search and compare documents across fields, dates, and obligations.",
    signals: ["Cross-document search", "Comparison", "Traceability"],
    href: "/ai-data",
    image: "/innovation/data-agent-platform.png",
    alt: "Data Explorer repository and document comparison interface",
  },
];

const revealEase = [0.2, 0.8, 0.2, 1] as const;

export default function ApplicationShowcase() {
  const [activeId, setActiveId] = useState(applications[0].id);
  const shouldReduceMotion = useStableReducedMotion();
  const active = applications.find((item) => item.id === activeId) ?? applications[0];

  return (
    <section
      id="applications"
      aria-label="Applications"
      className="border-b border-[var(--ca-line)] bg-white py-12 sm:py-14 lg:py-16"
    >
      <div className="mkt-shell">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <p className="text-[0.75rem] font-bold uppercase tracking-[0.14em] text-[var(--ca-teal)]">
              Applications
            </p>
            <h2 className="mt-3 font-serif text-[clamp(1.875rem,3.2vw,2.75rem)] font-semibold tracking-[-0.03em] text-[var(--ca-ink)]">
              What we have actually built.
            </h2>
          </div>
          <Link
            href="/work/innovation"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--ca-teal)] hover:text-[var(--ca-ink)]"
          >
            All applications
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-6 flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Applications">
          {applications.map((app) => {
            const selected = app.id === active.id;
            return (
              <button
                key={app.id}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => setActiveId(app.id)}
                className={cn(
                  "shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ca-lime)] focus-visible:ring-offset-2",
                  selected
                    ? "border-[var(--ca-ink)] bg-[var(--ca-ink)] text-white"
                    : "border-[var(--ca-line)] bg-[var(--ca-canvas)] text-[var(--ca-ink)] hover:border-[var(--ca-teal)]",
                )}
              >
                {app.name}
              </button>
            );
          })}
        </div>

        <AnimatePresence mode="wait" initial={false}>
          <motion.article
            key={active.id}
            role="tabpanel"
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: shouldReduceMotion ? 0.15 : 0.35, ease: revealEase }}
            className="mt-6 grid items-center gap-8 lg:grid-cols-12 lg:gap-12"
          >
            <div className="overflow-hidden rounded-md bg-[var(--ca-canvas)] shadow-[0_16px_40px_rgba(16,47,53,0.08)] ring-1 ring-[var(--ca-line)] lg:col-span-7">
              <Image
                src={active.image}
                alt={active.alt}
                width={1440}
                height={900}
                className="h-auto max-h-[460px] w-full object-contain object-top"
                sizes="(max-width: 1024px) 100vw, 58vw"
              />
            </div>
            <div className="lg:col-span-5">
              <p className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[var(--ca-teal)]">
                {active.category}
              </p>
              <h3 className="mt-3 font-serif text-3xl font-semibold tracking-[-0.03em] text-[var(--ca-ink)]">
                {active.name}
              </h3>
              <p className="mt-3 max-w-md text-base leading-relaxed text-[var(--ca-text-secondary)]">
                {active.summary}
              </p>
              <ul className="mt-5 flex flex-wrap gap-2">
                {active.signals.map((signal) => (
                  <li
                    key={signal}
                    className="rounded-full bg-[var(--ca-lime-soft)] px-3 py-1 text-xs font-semibold text-[var(--ca-ink)]"
                  >
                    {signal}
                  </li>
                ))}
              </ul>
              <Link
                href={active.href}
                className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--ca-teal)] hover:text-[var(--ca-ink)]"
              >
                View application
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.article>
        </AnimatePresence>
      </div>
    </section>
  );
}
