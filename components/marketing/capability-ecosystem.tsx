"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUpRight,
  ChevronDown,
  Cloud,
  Code2,
  Database,
  ShieldCheck,
  Sparkles,
  Users,
  type LucideIcon,
} from "lucide-react";

import { useStableReducedMotion } from "@/lib/marketing/use-stable-reduced-motion";
import { cn } from "@/lib/utils";

type Capability = {
  id: string;
  label: string;
  short: string;
  detail: string;
  href: string;
  cta: string;
  icon: LucideIcon;
  /** Illustrative — no live metrics source; keep directional, not a specific client claim */
  metric: { value: string; label: string };
  /** Degrees from top, clockwise */
  angle: number;
};

type LayoutMode = "desktop" | "tablet" | "mobile";

const CAPABILITIES: Capability[] = [
  {
    id: "oracle",
    label: "Oracle",
    short: "Digital core",
    detail:
      "Modernize finance, procurement, supply chain, projects and workforce operations on Oracle Cloud.",
    href: "/oracle",
    cta: "Explore Oracle",
    icon: Database,
    metric: { value: "12-16 wk", label: "typical go-live" },
    angle: 0,
  },
  {
    id: "ai-data",
    label: "AI & Data",
    short: "Governed intelligence",
    detail:
      "Build trusted data foundations and practical AI inside business workflows.",
    href: "/ai-data",
    cta: "Explore AI & Data",
    icon: Sparkles,
    metric: { value: "30-45%", label: "faster decision cycles" },
    angle: 60,
  },
  {
    id: "apps",
    label: "Application Engineering",
    short: "Digital products",
    detail:
      "Engineer focused applications and platforms where packaged software stops meeting the work.",
    href: "/capabilities/digital-engineering",
    cta: "Explore Engineering",
    icon: Code2,
    metric: { value: "8-10 wk", label: "MVP to production" },
    angle: 120,
  },
  {
    id: "managed",
    label: "Managed Delivery",
    short: "Production discipline",
    detail:
      "Keep transformation programs moving with delivery leadership, testing, and managed support.",
    href: "/capabilities/managed-delivery",
    cta: "Explore Delivery",
    icon: ShieldCheck,
    metric: { value: "24/7", label: "delivery coverage" },
    angle: 180,
  },
  {
    id: "cloud",
    label: "Cloud & Integration",
    short: "Connected systems",
    detail:
      "Integrate ERP, CRM, and custom platforms so information and processes move without friction.",
    href: "/capabilities/digital-engineering",
    cta: "Explore Integration",
    icon: Cloud,
    metric: { value: "99.9%", label: "integration uptime target" },
    angle: 240,
  },
  {
    id: "crm",
    label: "CRM",
    short: "Customer journeys",
    detail:
      "Connect every customer moment to the enterprise systems behind sales, service, and growth.",
    href: "/platforms/crm",
    cta: "Explore CRM",
    icon: Users,
    metric: { value: "20-35%", label: "pipeline velocity gain" },
    angle: 300,
  },
];

function polar(angleDeg: number, radiusPct: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: 50 + radiusPct * Math.cos(rad),
    y: 50 + radiusPct * Math.sin(rad),
  };
}

function getLayoutMode(): LayoutMode {
  if (typeof window === "undefined") return "mobile";
  if (window.matchMedia("(min-width: 1024px)").matches) return "desktop";
  if (window.matchMedia("(min-width: 768px)").matches) return "tablet";
  return "mobile";
}

function useLayoutMode(): LayoutMode {
  const [mode, setMode] = useState<LayoutMode>("mobile");

  useEffect(() => {
    const update = () => setMode(getLayoutMode());
    update();
    const desktop = window.matchMedia("(min-width: 1024px)");
    const tablet = window.matchMedia("(min-width: 768px)");
    desktop.addEventListener("change", update);
    tablet.addEventListener("change", update);
    return () => {
      desktop.removeEventListener("change", update);
      tablet.removeEventListener("change", update);
    };
  }, []);

  return mode;
}

const NODE_RADIUS = 38;
const DOT_RADIUS = 28;
const revealEase = [0.2, 0.8, 0.2, 1] as const;

export default function CapabilityEcosystem() {
  const [activeId, setActiveId] = useState(CAPABILITIES[0].id);
  const [openMobile, setOpenMobile] = useState(CAPABILITIES[0].id);
  const [mounted, setMounted] = useState(false);
  const shouldReduceMotion = useStableReducedMotion();
  const layout = useLayoutMode();
  const active = CAPABILITIES.find((c) => c.id === activeId) ?? CAPABILITIES[0];
  const activeIndex = CAPABILITIES.findIndex((c) => c.id === activeId);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section
      id="capabilities-ecosystem"
      className="relative overflow-x-clip border-b border-[var(--ca-line)] bg-[var(--ca-canvas)] py-12 sm:py-14 lg:py-16"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-[12%] top-[22%] hidden h-[380px] w-[380px] rounded-full border border-[var(--ca-teal-deep)]/[0.05] lg:block"
      />

      <div className="relative z-10 mx-auto max-w-[1440px] px-6 lg:px-8 xl:px-10">
        <div className="max-w-2xl">
          <p className="text-[0.75rem] font-bold uppercase tracking-[0.14em] text-[var(--ca-teal)]">
            What We Do
          </p>
          <h2 className="mt-4 font-serif text-[clamp(1.875rem,3.2vw,2.625rem)] font-semibold tracking-[-0.03em] text-[var(--ca-ink)]">
            Connected capabilities.
            <br className="hidden sm:block" />
            Built around the enterprise.
          </h2>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-[var(--ca-text-secondary)]">
            Transformation works best when strategy, platforms, data and engineering move together.
          </p>
        </div>

        {/*
          Mount exactly one interactive representation.
          Inactive layouts are not in the DOM — so crawlers/a11y trees
          cannot see Oracle / Digital Core (etc.) repeated three times.
        */}
        {!mounted || layout === "mobile" ? (
          <div className="mt-8 space-y-2">
            {CAPABILITIES.map((cap) => {
              const open = openMobile === cap.id;
              const Icon = cap.icon;
              return (
                <div
                  key={cap.id}
                  className="overflow-hidden rounded-xl border border-[var(--ca-line)] bg-white"
                >
                  <button
                    type="button"
                    onClick={() => setOpenMobile(open ? "" : cap.id)}
                    className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left"
                    aria-expanded={open}
                  >
                    <span className="flex items-center gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--ca-teal)]/10 text-[var(--ca-teal-chrome)]">
                        <Icon className="h-4.5 w-4.5" />
                      </span>
                      <span>
                        <span className="block text-sm font-bold uppercase tracking-[0.12em] text-[var(--ca-ink)]">
                          {cap.label}
                        </span>
                        <span className="mt-0.5 block text-xs text-[var(--ca-text-secondary)]">{cap.short}</span>
                      </span>
                    </span>
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 shrink-0 text-[var(--ca-teal)] transition-transform",
                        open && "rotate-180",
                      )}
                    />
                  </button>
                  {open ? (
                    <div className="border-t border-[var(--ca-line)] px-4 pb-4 pt-3">
                      <p className="text-sm leading-relaxed text-[var(--ca-text-secondary)]">{cap.detail}</p>
                      <div className="mt-3 inline-flex items-baseline gap-1.5 rounded-md bg-[var(--ca-lime)]/15 px-2.5 py-1">
                        <span className="text-sm font-bold text-[var(--ca-teal-chrome)]">{cap.metric.value}</span>
                        <span className="text-xs text-[var(--ca-text-secondary)]">{cap.metric.label}</span>
                      </div>
                      <Link
                        href={cap.href}
                        className="mt-3 flex items-center gap-1.5 text-sm font-semibold text-[var(--ca-teal)]"
                      >
                        {cap.cta}
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        ) : null}

        {mounted && layout === "tablet" ? (
          <div className="mt-10 grid grid-cols-2 gap-3">
            {CAPABILITIES.map((cap) => {
              const isActive = activeId === cap.id;
              const Icon = cap.icon;
              return (
                <button
                  key={cap.id}
                  type="button"
                  onClick={() => setActiveId(cap.id)}
                  aria-pressed={isActive}
                  className={cn(
                    "rounded-xl border p-4 text-left transition-all",
                    isActive
                      ? "border-[var(--ca-teal)]/35 bg-white shadow-[0_12px_28px_rgba(16,47,53,0.06)]"
                      : "border-[var(--ca-line)] bg-white/80 hover:border-[var(--ca-teal)]/30",
                  )}
                >
                  <span
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-lg",
                      isActive ? "bg-[var(--ca-lime)]/25 text-[var(--ca-teal-chrome)]" : "bg-[var(--ca-teal)]/10 text-[var(--ca-teal)]",
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                  <span
                    className={cn(
                      "mt-2.5 block text-[0.68rem] font-bold uppercase tracking-[0.12em]",
                      isActive ? "text-[var(--ca-teal-chrome)]" : "text-[var(--ca-teal)]",
                    )}
                  >
                    {cap.label}
                  </span>
                  <p className="mt-1 text-sm font-medium text-[var(--ca-ink)]">{cap.short}</p>
                  {isActive ? (
                    <>
                      <p className="mt-2 text-sm leading-relaxed text-[var(--ca-text-secondary)]">{cap.detail}</p>
                      <div className="mt-3 inline-flex items-baseline gap-1.5 rounded-md bg-[var(--ca-lime)]/15 px-2.5 py-1">
                        <span className="text-sm font-bold text-[var(--ca-teal-chrome)]">{cap.metric.value}</span>
                        <span className="text-xs text-[var(--ca-text-secondary)]">{cap.metric.label}</span>
                      </div>
                      <Link
                        href={cap.href}
                        className="mt-3 flex items-center gap-1.5 text-sm font-semibold text-[var(--ca-teal)]"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {cap.cta}
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </Link>
                    </>
                  ) : null}
                </button>
              );
            })}
          </div>
        ) : null}

        {mounted && layout === "desktop" ? (
          <div className="mt-12 grid grid-cols-12 items-center gap-10 xl:gap-14">
            <div className="relative col-span-7">
              <div
                className="ca-ecosystem relative mx-auto aspect-square w-full max-w-[580px]"
                role="tablist"
                aria-label="Capability areas"
              >
                <div
                  aria-hidden="true"
                  className={cn(
                    "absolute inset-[2%] rounded-full border border-[#073B3A]/[0.06]",
                    !shouldReduceMotion && "ca-ecosystem-spin",
                  )}
                />
                <div
                  aria-hidden="true"
                  className={cn(
                    "absolute inset-[9%] rounded-full border border-dashed border-[#073B3A]/[0.07]",
                    !shouldReduceMotion && "ca-ecosystem-spin-reverse",
                  )}
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-[18%] rounded-full border border-[#073B3A]/[0.05]"
                />

                <svg
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 h-full w-full"
                  viewBox="0 0 100 100"
                  preserveAspectRatio="xMidYMid meet"
                >
                  {CAPABILITIES.map((cap) => {
                    const isActive = cap.id === activeId;
                    const end = polar(cap.angle, DOT_RADIUS);
                    return (
                      <line
                        key={cap.id}
                        x1="50"
                        y1="50"
                        x2={end.x}
                        y2={end.y}
                        stroke={isActive ? "#C9F45A" : "#073B4C"}
                        strokeWidth={isActive ? "0.45" : "0.28"}
                        strokeOpacity={isActive ? 0.55 : 0.12}
                        strokeLinecap="round"
                      />
                    );
                  })}
                  {CAPABILITIES.map((cap) => {
                    const isActive = cap.id === activeId;
                    const pt = polar(cap.angle, DOT_RADIUS);
                    return (
                      <circle
                        key={`${cap.id}-dot`}
                        cx={pt.x}
                        cy={pt.y}
                        r={isActive ? 1.1 : 0.7}
                        fill={isActive ? "#C9F45A" : "#356D76"}
                        fillOpacity={isActive ? 0.95 : 0.35}
                      />
                    );
                  })}
                </svg>

                <div
                  aria-hidden="true"
                  className="absolute left-1/2 top-1/2 z-10 flex h-[150px] w-[150px] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full bg-[var(--ca-teal-deep)] text-center shadow-[0_20px_48px_rgba(7,59,76,0.22)] ring-4 ring-[var(--ca-teal-deep)]/10 xl:h-[162px] xl:w-[162px]"
                >
                  <p className="text-[0.58rem] font-bold uppercase tracking-[0.18em] text-[var(--ca-teal-soft)]">
                    Consult America
                  </p>
                  <p className="mt-1.5 px-4 font-serif text-[0.95rem] font-semibold leading-[1.15] text-white xl:text-[1.05rem]">
                    Enterprise
                    <br />
                    Transformation
                  </p>
                </div>

                {CAPABILITIES.map((cap) => {
                  const isActive = cap.id === activeId;
                  const pos = polar(cap.angle, NODE_RADIUS);
                  const Icon = cap.icon;
                  return (
                    <button
                      key={cap.id}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      aria-controls="capability-detail-panel"
                      id={`capability-tab-${cap.id}`}
                      onMouseEnter={() => setActiveId(cap.id)}
                      onFocus={() => setActiveId(cap.id)}
                      onClick={() => setActiveId(cap.id)}
                      style={{
                        left: `${pos.x}%`,
                        top: `${pos.y}%`,
                        transform: "translate(-50%, -50%)",
                      }}
                      className={cn(
                        "absolute z-20 w-[132px] rounded-[12px] border bg-white px-3 py-2.5 text-left transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#176A63] focus-visible:ring-offset-2 xl:w-[148px]",
                        isActive
                          ? "scale-[1.03] border-[var(--ca-teal)]/40 shadow-[0_14px_32px_rgba(16,47,53,0.10)]"
                          : "border-[var(--ca-line)] shadow-[0_4px_14px_rgba(16,47,53,0.04)] hover:border-[var(--ca-teal)]/35 hover:shadow-[0_10px_24px_rgba(16,47,53,0.06)]",
                      )}
                    >
                      <span
                        className={cn(
                          "flex h-7 w-7 items-center justify-center rounded-md",
                          isActive ? "bg-[var(--ca-lime)]/25 text-[var(--ca-teal-chrome)]" : "bg-[var(--ca-teal)]/10 text-[var(--ca-teal)]",
                        )}
                      >
                        <Icon className="h-3.5 w-3.5" />
                      </span>
                      <span
                        className={cn(
                          "mt-2 block text-[0.62rem] font-bold uppercase tracking-[0.11em]",
                          isActive ? "text-[var(--ca-teal-chrome)]" : "text-[var(--ca-teal)]",
                        )}
                      >
                        {cap.label}
                      </span>
                      <span className="mt-0.5 block text-[0.78rem] leading-snug text-[var(--ca-text-secondary)]">
                        {cap.short}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="col-span-5">
              <div
                id="capability-detail-panel"
                role="tabpanel"
                aria-labelledby={`capability-tab-${active.id}`}
                aria-live="polite"
                className="relative overflow-hidden rounded-2xl border border-[var(--ca-line)] bg-white shadow-[0_16px_44px_rgba(16,47,53,0.06)]"
              >
                <div
                  aria-hidden="true"
                  className="absolute inset-y-0 left-0 w-[3px] bg-[var(--ca-lime)]"
                />
                <div className="p-7 sm:p-8">
                  <div className="flex items-center justify-between">
                    <p className="text-[0.7rem] font-bold uppercase tracking-[0.16em] text-[var(--ca-text-secondary)]">
                      {String(activeIndex + 1).padStart(2, "0")} /{" "}
                      {String(CAPABILITIES.length).padStart(2, "0")}
                    </p>
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--ca-teal)]/10 text-[var(--ca-teal-chrome)]">
                      <active.icon className="h-5 w-5" />
                    </span>
                  </div>

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={active.id}
                      initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
                      transition={{ duration: 0.32, ease: revealEase }}
                    >
                      {/* Avoid repeating the tab name; panel focuses on the short title */}
                      <h3 className="mt-4 font-serif text-[1.75rem] font-semibold leading-tight tracking-[-0.02em] text-[var(--ca-ink)]">
                        {active.short}
                      </h3>
                      <p className="mt-4 text-[1.02rem] leading-relaxed text-[var(--ca-text-secondary)]">
                        {active.detail}
                      </p>
                      <div className="mt-5 inline-flex items-baseline gap-2 rounded-lg bg-[var(--ca-lime)]/15 px-3.5 py-2">
                        <span className="font-serif text-xl font-semibold text-[var(--ca-teal-chrome)]">
                          {active.metric.value}
                        </span>
                        <span className="text-sm text-[var(--ca-text-secondary)]">{active.metric.label}</span>
                      </div>
                      <Link
                        href={active.href}
                        className="mt-7 inline-flex h-11 items-center gap-2 rounded-lg bg-[var(--ca-lime)] px-5 text-sm font-semibold text-[var(--ca-ink)] transition-colors hover:bg-[var(--ca-accent-hover)]"
                      >
                        {active.cta}
                        <ArrowUpRight className="h-4 w-4" />
                      </Link>
                    </motion.div>
                  </AnimatePresence>

                  <div className="mt-8 flex gap-1.5 border-t border-[var(--ca-line)] pt-5" aria-hidden="true">
                    {CAPABILITIES.map((cap) => (
                      <button
                        key={cap.id}
                        type="button"
                        tabIndex={-1}
                        onClick={() => setActiveId(cap.id)}
                        className={cn(
                          "h-1 flex-1 rounded-full transition-colors",
                          cap.id === activeId ? "bg-[var(--ca-lime)]" : "bg-[var(--ca-mist)] hover:bg-[var(--ca-teal-soft)]",
                        )}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
