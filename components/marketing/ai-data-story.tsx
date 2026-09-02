"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import { cn } from "@/lib/utils";

import PracticeAiPaths from "@/components/marketing/practice-ai-paths";

const stages = [
  {
    id: "extract",
    label: "Extract",
    detail: "Turn documents into structured enterprise information.",
    image: "/innovation/data-agent-hero.png",
    alt: "Data Agent extracting structured fields from enterprise documents",
  },
  {
    id: "verify",
    label: "Verify",
    detail: "Trace extracted values back to their source.",
    image: "/innovation/data-agent-platform.png",
    alt: "Data Agent source verification and grounded document review",
  },
  {
    id: "explore",
    label: "Explore",
    detail: "Compare information across documents and contracts.",
    image: "/innovation/data-agent-platform.png",
    alt: "Data Agent repository exploration across contracts",
  },
];

const aiTimeline = [
  { num: "01", label: "Find the value" },
  { num: "02", label: "Build the foundation" },
  { num: "03", label: "Put AI into the work" },
  { num: "04", label: "Operate with trust" },
];

const revealEase = [0.2, 0.8, 0.2, 1] as const;

export default function AIDataStory() {
  const [active, setActive] = useState(0);
  const shouldReduceMotion = useReducedMotion();
  const current = stages[active];

  return (
    <section
      id="ai-data-story"
      className="relative overflow-hidden border-b border-[#073B3A] py-12 text-white sm:py-14 lg:py-16"
      style={{
        background: "linear-gradient(135deg, #073B3A 0%, #0B4A47 50%, #176A63 100%)",
      }}
    >
      <PracticeAiPaths
        className={cn(
          "ca-practice-ai-paths hidden lg:block",
          !shouldReduceMotion && "ca-decor-drift--slow",
        )}
      />
      <div
        aria-hidden="true"
        className={cn(
          "ca-home-ring right-[-8%] top-[15%] hidden h-[min(380px,36vw)] w-[min(380px,36vw)] border-white/10 lg:block",
          !shouldReduceMotion && "ca-decor-orbit",
        )}
      />

      <div className="relative z-10 mx-auto max-w-[1440px] px-6 lg:px-8 xl:px-10">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center lg:gap-12">
          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: revealEase }}
            className="lg:col-span-5"
          >
            <p className="text-[0.75rem] font-bold uppercase tracking-[0.14em] text-[#9BC4B8]">
              AI &amp; Data
            </p>
            <h2 className="mt-3 font-serif text-[clamp(1.75rem,3vw,2.5rem)] font-semibold tracking-[-0.03em] text-white">
              Put intelligence into the work.
            </h2>
            <p className="mt-4 max-w-md text-base leading-relaxed text-white/80">
              Move beyond AI experiments with document intelligence, enterprise agents, and
              governed workflows connected to real operational data.
            </p>

            <div className="mt-6 flex flex-wrap gap-3 border-t border-white/15 pt-5">
              {aiTimeline.map((step, i) => (
                <div key={step.num} className="flex items-center gap-2">
                  <span className="text-[0.65rem] font-bold tracking-[0.12em] text-[#9BC4B8]">
                    {step.num}
                  </span>
                  <span className="text-[0.72rem] font-semibold uppercase tracking-[0.08em] text-white/85">
                    {step.label}
                  </span>
                  {i < aiTimeline.length - 1 ? (
                    <span className="hidden text-white/30 sm:inline" aria-hidden="true">
                      →
                    </span>
                  ) : null}
                </div>
              ))}
            </div>

            <div
              className="mt-7 flex flex-wrap gap-2"
              role="tablist"
              aria-label="Data Agent product story"
            >
              {stages.map((stage, i) => (
                <button
                  key={stage.id}
                  type="button"
                  role="tab"
                  aria-selected={i === active}
                  onClick={() => setActive(i)}
                  className={cn(
                    "rounded-lg px-4 py-2 text-[0.7rem] font-bold uppercase tracking-[0.12em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50",
                    i === active
                      ? "bg-white text-[#073B3A]"
                      : "border border-white/25 bg-transparent text-[#9BC4B8] hover:border-white/50 hover:text-white",
                  )}
                >
                  {stage.label}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.p
                key={current.id}
                initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-4 max-w-md text-sm leading-relaxed text-white/75"
                role="tabpanel"
              >
                {current.detail}
              </motion.p>
            </AnimatePresence>

            <Link
              href="/work/innovation/data-agent"
              className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-[#9BC4B8] hover:text-white"
            >
              Explore Data Agent
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </motion.div>

          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1, ease: revealEase }}
            className="lg:col-span-7"
          >
            <div className="ca-home-compose ca-practice-stable relative mx-auto w-full max-w-[700px] lg:ml-auto lg:mr-0">
              <div aria-hidden="true" className="ca-practice-ai-panel hidden lg:block" />
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.image + current.id}
                  initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 14, scale: 0.985 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.78, ease: revealEase }}
                  className="ca-home-product-ui ca-practice-img-ai-ui relative z-10 mx-auto w-full max-w-[680px]"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={current.image}
                    alt={current.alt}
                    width={1440}
                    height={900}
                    loading={active === 0 ? "eager" : "lazy"}
                    decoding="async"
                    className="max-h-[420px] w-full object-cover object-top"
                  />
                </motion.div>
              </AnimatePresence>
              {active !== 0 ? (
                <div className="ca-practice-ai-ui-secondary ca-home-product-ui -bottom-2 -left-1 hidden sm:block">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/innovation/data-agent-hero.png"
                    alt="Document extraction preview"
                    width={800}
                    height={500}
                    loading="lazy"
                    className="max-h-[140px] w-full object-cover object-top"
                  />
                </div>
              ) : null}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
