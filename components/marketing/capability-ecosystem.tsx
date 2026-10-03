"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type KeyboardEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

import { useStableReducedMotion } from "@/lib/marketing/use-stable-reduced-motion";
import { cn } from "@/lib/utils";

type Capability = {
  id: string;
  index: string;
  label: string;
  outcome: string;
  signals: string[];
  href: string;
  image: string;
  imageAlt: string;
  /** Product UI stays rectangular. Photography may use an editorial frame. */
  kind: "photo" | "product";
};

const CAPABILITIES: Capability[] = [
  {
    id: "enterprise",
    index: "01",
    label: "Enterprise Transformation",
    outcome: "Modernize the operating model and the systems it depends on.",
    signals: ["Strategy to production", "Operating models", "Program leadership", "Change readiness"],
    href: "/capabilities/enterprise-transformation",
    image: "/company/source/quality-review.jpg",
    imageAlt: "Consult America team reviewing delivery work",
    kind: "photo",
  },
  {
    id: "oracle",
    index: "02",
    label: "Oracle",
    outcome: "Connect finance, procurement, supply chain, and projects on Oracle Cloud.",
    signals: ["Fusion Financials", "Procurement", "Projects", "Integration"],
    href: "/oracle",
    image: "/company/source/finance-workplace.jpg",
    imageAlt: "Enterprise finance and operations workplace",
    kind: "photo",
  },
  {
    id: "ai",
    index: "03",
    label: "AI + Data",
    outcome: "Put governed intelligence into documents, data, and daily work.",
    signals: ["Document intelligence", "Verified answers", "Enterprise search", "Data foundations"],
    href: "/ai-data",
    image: "/innovation/data-agent-hero.png",
    imageAlt: "Data Agent document intelligence interface",
    kind: "product",
  },
  {
    id: "apps",
    index: "04",
    label: "Application Engineering",
    outcome: "Build the applications packaged software does not cover.",
    signals: ["Product design", "Workflow software", "APIs", "Production delivery"],
    href: "/capabilities/digital-engineering",
    image: "/innovation/joblens-hero.png",
    imageAlt: "JobLens recruiting intelligence interface",
    kind: "product",
  },
  {
    id: "crm",
    index: "05",
    label: "CRM / ClientFlow",
    outcome: "Keep client work, opportunities, and follow-through on one record.",
    signals: ["Accounts", "Opportunities", "ClientFlow", "Shared context"],
    href: "/platforms/crm",
    image: "/company/source/connected-systems.jpg",
    imageAlt: "Connected enterprise systems and delivery work",
    kind: "photo",
  },
  {
    id: "managed",
    index: "06",
    label: "Managed Services",
    outcome: "Keep programs moving after design — through test, release, and support.",
    signals: ["Delivery leadership", "Testing", "Operational support", "Continuity"],
    href: "/capabilities/managed-delivery",
    image: "/company/office-workstations.png",
    imageAlt: "Consult America office and delivery workstations",
    kind: "photo",
  },
];

const revealEase = [0.2, 0.8, 0.2, 1] as const;

export default function CapabilityEcosystem() {
  const [activeId, setActiveId] = useState(CAPABILITIES[0].id);
  const shouldReduceMotion = useStableReducedMotion();
  const active = CAPABILITIES.find((item) => item.id === activeId) ?? CAPABILITIES[0];

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const current = CAPABILITIES.findIndex((item) => item.id === activeId);
    if (event.key === "ArrowDown" || event.key === "ArrowRight") {
      event.preventDefault();
      setActiveId(CAPABILITIES[(current + 1) % CAPABILITIES.length].id);
    }
    if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
      event.preventDefault();
      setActiveId(CAPABILITIES[(current - 1 + CAPABILITIES.length) % CAPABILITIES.length].id);
    }
  }

  return (
    <section
      id="capabilities-ecosystem"
      className="border-b border-[var(--ca-line)] bg-[var(--ca-canvas)] py-12 sm:py-14 lg:py-16"
    >
      <div className="mkt-shell">
        <div className="max-w-2xl">
          <p className="text-[0.75rem] font-bold uppercase tracking-[0.14em] text-[var(--ca-teal)]">
            Capabilities
          </p>
          <h2 className="mt-3 font-serif text-[clamp(1.875rem,3.2vw,2.75rem)] font-semibold tracking-[-0.03em] text-[var(--ca-ink)]">
            What we transform.
          </h2>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-[var(--ca-text-secondary)]">
            Six practices. One delivery motion — from the enterprise core to the applications around it.
          </p>
        </div>

        <div className="mt-8 grid items-start gap-8 lg:mt-10 lg:grid-cols-12 lg:gap-12">
          <div
            className="lg:col-span-5"
            role="tablist"
            aria-label="Capabilities"
            aria-orientation="vertical"
            onKeyDown={onKeyDown}
          >
            {CAPABILITIES.map((item) => {
              const selected = item.id === active.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  id={`capability-tab-${item.id}`}
                  aria-selected={selected}
                  aria-controls="capability-panel"
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setActiveId(item.id)}
                  className={cn(
                    "flex w-full items-baseline gap-4 border-t border-[var(--ca-line)] py-3.5 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ca-lime)] focus-visible:ring-offset-2",
                    selected ? "text-[var(--ca-ink)]" : "text-[var(--ca-text-secondary)] hover:text-[var(--ca-ink)]",
                  )}
                >
                  <span
                    className={cn(
                      "w-8 shrink-0 text-[0.7rem] font-bold tracking-[0.14em]",
                      selected ? "text-[var(--ca-teal)]" : "text-[var(--ca-text-secondary)]",
                    )}
                  >
                    {item.index}
                  </span>
                  <span className={cn("text-base font-semibold", selected && "font-serif text-lg")}>
                    {item.label}
                  </span>
                  <span
                    aria-hidden="true"
                    className={cn(
                      "ml-auto h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--ca-lime)] transition-opacity",
                      selected ? "opacity-100" : "opacity-0",
                    )}
                  />
                </button>
              );
            })}
          </div>

          <div
            id="capability-panel"
            role="tabpanel"
            aria-labelledby={`capability-tab-${active.id}`}
            className="lg:col-span-7"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={active.id}
                initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
                transition={{ duration: shouldReduceMotion ? 0.15 : 0.35, ease: revealEase }}
                className="grid gap-6 sm:grid-cols-2 sm:items-center"
              >
                <div>
                  <p className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[var(--ca-teal)]">
                    {active.index} / {active.label}
                  </p>
                  <h3 className="mt-3 font-serif text-2xl font-semibold tracking-[-0.03em] text-[var(--ca-ink)]">
                    {active.outcome}
                  </h3>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {active.signals.map((signal) => (
                      <li
                        key={signal}
                        className="rounded-full border border-[var(--ca-line)] bg-white px-3 py-1 text-xs font-semibold text-[var(--ca-ink)]"
                      >
                        {signal}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={active.href}
                    className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--ca-teal)] hover:text-[var(--ca-ink)]"
                  >
                    Explore
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>
                <div
                  className={cn(
                    "relative overflow-hidden bg-white shadow-[0_16px_40px_rgba(16,47,53,0.08)] ring-1 ring-[var(--ca-line)]",
                    active.kind === "photo" ? "ca-home-frame-offset" : "rounded-md",
                  )}
                >
                  <div className={cn("relative w-full", active.kind === "product" ? "aspect-[16/10]" : "aspect-[4/3]")}>
                      <Image
                      src={active.image}
                      alt={active.imageAlt}
                      fill
                      unoptimized={active.image.endsWith(".jpg")}
                      className={cn(
                        "transition-transform duration-500",
                        active.kind === "photo" ? "ca-home-photo object-cover hover:scale-[1.02]" : "object-contain object-top bg-white",
                      )}
                      sizes="(max-width: 1024px) 100vw, 28vw"
                    />
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
