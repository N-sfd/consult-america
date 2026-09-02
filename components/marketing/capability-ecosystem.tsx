"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

type Capability = {
  id: string;
  label: string;
  short: string;
  detail: string;
  href: string;
  cta: string;
  /** Degrees from top, clockwise */
  angle: number;
};

const CAPABILITIES: Capability[] = [
  {
    id: "oracle",
    label: "Oracle",
    short: "Digital core",
    detail:
      "Modernize finance, procurement, supply chain, projects and workforce operations on Oracle Cloud.",
    href: "/oracle",
    cta: "Explore Oracle",
    angle: 0,
  },
  {
    id: "ai-data",
    label: "AI & Data",
    short: "Governed intelligence",
    detail:
      "Put trusted data and AI into operational workflows with document intelligence and enterprise agents.",
    href: "/ai-data",
    cta: "Explore AI & Data",
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
    angle: 300,
  },
];

/** Convert angle (0 = top) to x/y percent in a square canvas */
function polar(angleDeg: number, radiusPct: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: 50 + radiusPct * Math.cos(rad),
    y: 50 + radiusPct * Math.sin(rad),
  };
}

const NODE_RADIUS = 38;
const DOT_RADIUS = 28;
const revealEase = [0.2, 0.8, 0.2, 1] as const;

export default function CapabilityEcosystem() {
  const [activeId, setActiveId] = useState(CAPABILITIES[0].id);
  const [openMobile, setOpenMobile] = useState(CAPABILITIES[0].id);
  const shouldReduceMotion = useReducedMotion();
  const active = CAPABILITIES.find((c) => c.id === activeId) ?? CAPABILITIES[0];
  const activeIndex = CAPABILITIES.findIndex((c) => c.id === activeId);

  return (
    <section
      id="capabilities-ecosystem"
      className="relative overflow-hidden border-b border-[#E1ECE8] bg-[#F0F6F4] py-14 sm:py-16 lg:py-20"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-[12%] top-[18%] hidden h-[420px] w-[420px] rounded-full border border-[#073B3A]/[0.04] lg:block"
      />

      <div className="relative z-10 mx-auto max-w-[1440px] px-6 lg:px-8 xl:px-10">
        <div className="max-w-2xl">
          <p className="text-[0.75rem] font-bold uppercase tracking-[0.14em] text-[#176A63]">
            Capability Ecosystem
          </p>
          <h2 className="mt-3 font-serif text-[clamp(1.75rem,3vw,2.5rem)] font-semibold tracking-[-0.03em] text-[#073B3A]">
            Capabilities built around transformation.
          </h2>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-[#5B6D6B]">
            Strategy, platforms, data and engineering connected around how enterprises actually operate.
          </p>
        </div>

        {/* Desktop / large tablet orbit */}
        <div className="mt-12 hidden items-center gap-8 lg:grid lg:grid-cols-12 lg:gap-10 xl:gap-14">
          <div className="relative lg:col-span-7">
            <div
              className="ca-ecosystem relative mx-auto aspect-square w-full max-w-[580px]"
              role="tablist"
              aria-label="Capability areas"
            >
              {/* Outer drafting rings */}
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

              {/* Connector spokes — SVG in same coordinate space */}
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
                      stroke={isActive ? "#B83A3A" : "#073B3A"}
                      strokeWidth={isActive ? "0.45" : "0.28"}
                      strokeOpacity={isActive ? 0.45 : 0.12}
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
                      fill={isActive ? "#B83A3A" : "#176A63"}
                      fillOpacity={isActive ? 0.9 : 0.35}
                    />
                  );
                })}
              </svg>

              {/* Center hub */}
              <div className="absolute left-1/2 top-1/2 z-10 flex h-[150px] w-[150px] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full bg-[#073B3A] text-center shadow-[0_20px_48px_rgba(7,59,58,0.28)] ring-4 ring-[#073B3A]/10 xl:h-[162px] xl:w-[162px]">
                <p className="text-[0.58rem] font-bold uppercase tracking-[0.18em] text-[#9BC4B8]">
                  Consult America
                </p>
                <p className="mt-1.5 px-4 font-serif text-[0.95rem] font-semibold leading-[1.15] text-white xl:text-[1.05rem]">
                  Enterprise
                  <br />
                  Transformation
                </p>
              </div>

              {/* Capability nodes */}
              {CAPABILITIES.map((cap) => {
                const isActive = cap.id === activeId;
                const pos = polar(cap.angle, NODE_RADIUS);
                return (
                  <button
                    key={cap.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    aria-controls="capability-detail-panel"
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
                        ? "scale-[1.04] border-[#B83A3A]/35 shadow-[0_16px_36px_rgba(7,59,58,0.14)]"
                        : "border-[#DDE6E3] shadow-[0_4px_14px_rgba(7,59,58,0.04)] hover:border-[#176A63]/35 hover:shadow-[0_10px_24px_rgba(7,59,58,0.08)]",
                    )}
                  >
                    <span
                      className={cn(
                        "block text-[0.62rem] font-bold uppercase tracking-[0.11em]",
                        isActive ? "text-[#B83A3A]" : "text-[#176A63]",
                      )}
                    >
                      {cap.label}
                    </span>
                    <span className="mt-0.5 block text-[0.78rem] leading-snug text-[#5B6D6B]">
                      {cap.short}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Detail panel */}
          <div className="lg:col-span-5">
            <div
              id="capability-detail-panel"
              role="tabpanel"
              aria-live="polite"
              className="relative overflow-hidden rounded-2xl border border-[#DDE6E3] bg-white shadow-[0_16px_44px_rgba(7,59,58,0.07)]"
            >
              <div
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-[3px] bg-[#B83A3A] transition-opacity"
              />
              <div className="p-7 sm:p-8">
                <p className="text-[0.7rem] font-bold uppercase tracking-[0.16em] text-[#8A9A97]">
                  {String(activeIndex + 1).padStart(2, "0")} / {String(CAPABILITIES.length).padStart(2, "0")}
                </p>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={active.id}
                    initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
                    transition={{ duration: 0.32, ease: revealEase }}
                  >
                    <p className="mt-4 text-[0.72rem] font-bold uppercase tracking-[0.14em] text-[#B83A3A]">
                      {active.label}
                    </p>
                    <h3 className="mt-2 font-serif text-[1.75rem] font-semibold leading-tight tracking-[-0.02em] text-[#073B3A]">
                      {active.short}
                    </h3>
                    <p className="mt-4 text-[1.02rem] leading-relaxed text-[#5B6D6B]">
                      {active.detail}
                    </p>
                    <Link
                      href={active.href}
                      className="mt-7 inline-flex h-11 items-center gap-2 rounded-lg bg-[#B83A3A] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#992F31]"
                    >
                      {active.cta}
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  </motion.div>
                </AnimatePresence>

                <div className="mt-8 flex gap-1.5 border-t border-[#E1ECE8] pt-5">
                  {CAPABILITIES.map((cap) => (
                    <button
                      key={cap.id}
                      type="button"
                      aria-label={cap.label}
                      onClick={() => setActiveId(cap.id)}
                      className={cn(
                        "h-1 flex-1 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#176A63]",
                        cap.id === activeId ? "bg-[#176A63]" : "bg-[#DDE6E3] hover:bg-[#C9DDD7]",
                      )}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tablet: two-column list (no orbit squeeze) */}
        <div className="mt-10 hidden grid-cols-2 gap-3 md:grid lg:hidden">
          {CAPABILITIES.map((cap) => {
            const isActive = activeId === cap.id;
            return (
              <button
                key={cap.id}
                type="button"
                onClick={() => setActiveId(cap.id)}
                className={cn(
                  "rounded-xl border p-4 text-left transition-all",
                  isActive
                    ? "border-[#B83A3A]/30 bg-white shadow-[0_12px_28px_rgba(7,59,58,0.08)]"
                    : "border-[#DDE6E3] bg-white/80 hover:border-[#176A63]/30",
                )}
              >
                <span
                  className={cn(
                    "text-[0.68rem] font-bold uppercase tracking-[0.12em]",
                    isActive ? "text-[#B83A3A]" : "text-[#176A63]",
                  )}
                >
                  {cap.label}
                </span>
                <p className="mt-1 text-sm font-medium text-[#073B3A]">{cap.short}</p>
                {isActive ? (
                  <>
                    <p className="mt-2 text-sm leading-relaxed text-[#5B6D6B]">{cap.detail}</p>
                    <Link
                      href={cap.href}
                      className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-[#176A63]"
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

        {/* Mobile accordion */}
        <div className="mt-8 space-y-2 md:hidden">
          {CAPABILITIES.map((cap) => {
            const open = openMobile === cap.id;
            return (
              <div key={cap.id} className="overflow-hidden rounded-xl border border-[#DDE6E3] bg-white">
                <button
                  type="button"
                  onClick={() => setOpenMobile(open ? "" : cap.id)}
                  className="flex w-full items-center justify-between px-4 py-4 text-left"
                  aria-expanded={open}
                >
                  <span>
                    <span className="block text-sm font-bold uppercase tracking-[0.12em] text-[#073B3A]">
                      {cap.label}
                    </span>
                    <span className="mt-0.5 block text-xs text-[#5B6D6B]">{cap.short}</span>
                  </span>
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 shrink-0 text-[#176A63] transition-transform",
                      open && "rotate-180",
                    )}
                  />
                </button>
                {open ? (
                  <div className="border-t border-[#E1ECE8] px-4 pb-4 pt-3">
                    <p className="text-sm leading-relaxed text-[#5B6D6B]">{cap.detail}</p>
                    <Link
                      href={cap.href}
                      className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-[#176A63]"
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
      </div>
    </section>
  );
}
