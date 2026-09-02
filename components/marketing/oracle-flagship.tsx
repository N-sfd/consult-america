"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import { stockImage } from "@/lib/marketing/stock-images";
import { cn } from "@/lib/utils";

const capabilities = [
  {
    name: "Finance",
    detail: "Close, reporting, multi-entity accounting, and controlled financial operations.",
    imageKey: "oracleFlagship" as const,
  },
  {
    name: "Procurement",
    detail: "Source-to-pay with policy, supplier collaboration, and spend visibility.",
    imageKey: "capabilitiesModernize" as const,
  },
  {
    name: "Supply Chain",
    detail: "Planning, inventory, and fulfillment connected to the digital core.",
    imageKey: "capabilitiesOperate" as const,
  },
  {
    name: "Projects",
    detail: "Costing, billing, and project controls for complex delivery organizations.",
    imageKey: "capabilitiesTransform" as const,
  },
  {
    name: "Integration & Data",
    detail: "OIC connectivity, data quality, and reporting across the enterprise.",
    imageKey: "capabilitiesIntelligence" as const,
  },
  {
    name: "Testing & Readiness",
    detail: "Cutover planning, regression testing, and readiness for production go-live.",
    imageKey: "capabilitiesBuild" as const,
  },
];

const revealEase = [0.2, 0.8, 0.2, 1] as const;

export default function OracleFlagship() {
  const [active, setActive] = useState(0);
  const shouldReduceMotion = useReducedMotion();
  const current = capabilities[active];

  return (
    <section
      id="oracle-practice"
      className="relative overflow-hidden border-b border-[#E1ECE8] bg-[#F8FAF9] py-12 sm:py-14 lg:py-16"
    >
      <div className="mx-auto max-w-[1440px] px-6 lg:px-8 xl:px-10">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center lg:gap-14">
          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 18, scale: 0.985 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.78, ease: revealEase }}
            className="lg:col-span-5"
          >
            <div className="ca-home-compose relative mx-auto max-w-[480px] lg:mx-0">
              <div
                aria-hidden="true"
                className="ca-home-sage-panel absolute -right-6 top-8 hidden h-[420px] w-[200px] opacity-80 lg:block"
              />
              <div
                aria-hidden="true"
                className="ca-home-ring ca-home-orbit left-[-12%] top-[10%] hidden h-[min(380px,36vw)] w-[min(380px,36vw)] opacity-[0.08] lg:block"
                style={{ animationDuration: "52s" }}
              />
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.name}
                  initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="ca-home-frame-tall ca-home-photo-overlay relative z-10 shadow-[0_24px_56px_rgba(7,59,58,0.10)] ring-1 ring-[#DDE6E3]"
                >
                  <div className="ca-home-img-oracle relative aspect-[4/5] w-full max-h-[560px]">
                    <Image
                      src={stockImage(current.imageKey, { w: 1200, q: 85 })}
                      alt={`${current.name} — Oracle Cloud transformation`}
                      fill
                      className="ca-home-photo object-cover object-center"
                      sizes="(max-width: 1024px) 100vw, 38vw"
                    />
                  </div>
                </motion.div>
              </AnimatePresence>
              <div className="ca-home-detail-photo ca-home-photo-overlay -bottom-2 -right-3 hidden h-[210px] lg:block">
                <div className="relative h-full w-full">
                  <Image
                    src={stockImage("heroDetail", { w: 400, q: 85 })}
                    alt="Enterprise operations detail"
                    fill
                    className="ca-home-photo object-cover"
                    sizes="170px"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          <div className="lg:col-span-7">
            <p className="text-[0.75rem] font-bold uppercase tracking-[0.14em] text-[#176A63]">
              Oracle Flagship Practice
            </p>
            <h2 className="mt-3 font-serif text-[clamp(1.75rem,3vw,2.5rem)] font-semibold tracking-[-0.03em] text-[#073B3A]">
              Modernize the digital core.
            </h2>
            <p className="mt-4 max-w-md text-[1.0625rem] leading-relaxed text-[#5B6D6B]">
              Modernize finance, procurement, supply chain, projects, and workforce operations
              with connected Oracle Cloud transformation.
            </p>

            <div
              className="mt-7 flex flex-wrap gap-2 border-t border-[#DDE6E3] pt-6"
              role="tablist"
              aria-label="Oracle capabilities"
            >
              {capabilities.map((cap, i) => (
                <button
                  key={cap.name}
                  type="button"
                  role="tab"
                  aria-selected={i === active}
                  onClick={() => setActive(i)}
                  className={cn(
                    "rounded-lg px-3 py-2 text-xs font-bold tracking-[0.08em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#176A63]",
                    i === active
                      ? "bg-[#073B3A] text-white"
                      : "border border-[#DDE6E3] bg-white text-[#073B3A] hover:border-[#176A63]",
                  )}
                >
                  {cap.name}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.p
                key={current.name}
                initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-5 max-w-md text-sm leading-relaxed text-[#5B6D6B]"
                role="tabpanel"
              >
                {current.detail}
              </motion.p>
            </AnimatePresence>

            <Link
              href="/oracle"
              className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-[#176A63] hover:text-[#073B3A]"
            >
              Explore Oracle
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
