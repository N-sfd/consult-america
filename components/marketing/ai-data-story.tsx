"use client";

import Link from "next/link";
import { ArrowUpRight, FileText, Database, Search, Bot, Check, Workflow, ShieldCheck } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

import { ProductFrame } from "@/components/marketing/image-system";

const pipelineStages = [
  { step: "SOURCE", name: "Source Documents", detail: "PDFs, MSAs, Statements of Work, and contracts", icon: FileText },
  { step: "EXTRACTION", name: "Dynamic Extraction", detail: "Clause segmentation & entity detection", icon: Search },
  { step: "STRUCTURED DATA", name: "Structured Schemas", detail: "Normalized schema mapped to ERP & CRM", icon: Database },
  { step: "VERIFICATION", name: "Source Verification", detail: "Human-in-the-loop citation grounding", icon: ShieldCheck },
  { step: "ENTERPRISE WORKFLOW", name: "Production Action", detail: "Autonomous sync to Oracle Fusion & Workspaces", icon: Workflow },
];

export default function AIDataStory() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="ai-data-story" className="bg-[#211E1B] text-[#FFFDF8] py-24 sm:py-28 lg:py-32 relative overflow-hidden border-b border-[#3A302B]">
      {/* 1. Subtle Background Document & Architectural Wire Texture with Slow Drift (Requirement 14) */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={
            shouldReduceMotion
              ? {}
              : {
                  x: [-8, 8, -8],
                }
          }
          transition={{
            duration: 26,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="relative h-full w-full opacity-[0.045]"
        >
          {/* Subtle geometric wire architecture */}
          <div
            className="w-full h-full"
            style={{
              backgroundImage: "radial-gradient(circle at 50% 50%, rgba(255,253,248,0.25) 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />
        </motion.div>

        {/* Enormous barely-visible burgundy C arc behind interface */}
        <motion.div
          animate={
            shouldReduceMotion
              ? {}
              : {
                  x: [-8, 8, -8],
                  y: [4, -4, 4],
                }
          }
          transition={{
            duration: 24,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[680px] h-[680px] rounded-full border border-[#B63A3A]/16 opacity-[0.06] pointer-events-none"
          aria-hidden="true"
        />

        {/* Technical Grid Matrix Overlay */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: "linear-gradient(to right, #FFFDF8 1px, transparent 1px), linear-gradient(to bottom, #FFFDF8 1px, transparent 1px)",
            backgroundSize: "44px 44px",
          }}
        />
      </div>

      <div className="mkt-shell relative z-10">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#3A302B] bg-[#2B2420] px-3.5 py-1 text-[0.68rem] font-bold uppercase tracking-[0.16em] text-[#D8C5AA]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#B63A3A]" />
          GOVERNED AI &amp; DATA
        </div>

        <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center lg:gap-14">
          {/* Left Column: Streamlined Heading & Pipeline Flow (~35%) */}
          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="lg:col-span-4 space-y-6"
          >
            <h2 className="font-serif text-3xl font-semibold tracking-[-0.03em] text-[#FFFDF8] sm:text-4xl lg:text-5xl lg:leading-[1.1]">
              AI should move the work —
              <br />
              <span className="text-[#D8C5AA]">not sit beside it.</span>
            </h2>

            <p className="text-base leading-relaxed text-[rgba(255,253,248,0.72)]">
              Move beyond AI experiments with governed agents, document
              intelligence, and workflow automation built
              around real operational data.
            </p>

            <div className="pt-2">
              <Link
                href="/ai-data"
                className="group inline-flex items-center gap-2 rounded-lg bg-[#B63A3A] px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#942E31] cursor-pointer shadow-lg shadow-black/30"
              >
                <span>Explore AI &amp; Data Practice</span>
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>

            {/* Pipeline Stepper: SOURCE → EXTRACT → STRUCTURE → VERIFY → ACT */}
            <div className="mt-8 border-t border-[#3A302B] pt-6 space-y-2">
              <p className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#D8C5AA] mb-3">
                Traceable Intelligence Pipeline
              </p>
              {pipelineStages.map((st) => (
                <div
                  key={st.step}
                  className="flex items-center gap-3 rounded-lg border border-[#3A302B] bg-[#2B2420]/80 px-3 py-2 text-xs"
                >
                  <span className="font-mono text-[0.6rem] font-bold text-[#D8C5AA] w-18 shrink-0">
                    {st.step}
                  </span>
                  <div className="flex-1">
                    <span className="font-bold text-[#FFFDF8] text-xs">{st.name}</span>
                    <span className="text-[rgba(255,253,248,0.65)] text-[0.65rem] block">{st.detail}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right Column: 65% Data Agent Interactive Production Interface */}
          <div className="lg:col-span-8">
            <ProductFrame
              title="Consult America Data Agent · Document Intelligence Engine"
              badge="DEMONSTRATION ENVIRONMENT"
              tone="dark"
            >
              <div className="p-4 sm:p-6 space-y-5">
                {/* Agent Control Header with Source Extraction Metadata */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#2B2420] pb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#357C78]/20 text-[#357C78] border border-[#357C78]/40">
                      <Bot className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#FFFDF8]">
                          Autonomous Extraction &amp; Reconciliation Agent
                        </span>
                        <span className="inline-flex items-center rounded-full bg-[#357C78]/20 px-2 py-0.5 text-[0.62rem] font-semibold text-[#357C78] border border-[#357C78]/30">
                          Active Job #4819
                        </span>
                      </div>
                      <p className="text-[0.68rem] text-[rgba(255,253,248,0.6)]">
                        Target System: Oracle Fusion Procurement &amp; AP Invoices · Model: CA-Titan Extraction v4
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-mono">
                    <span className="rounded bg-[#2B2420] border border-[#3A302B] px-2.5 py-1 text-[#D8C5AA]">
                      Accuracy Grounding: 99.4%
                    </span>
                  </div>
                </div>

                {/* Staggered Entrance UI Sub-Panels (Requirement 15) */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                  {/* Left: Source Document Panel */}
                  <motion.div
                    initial={shouldReduceMotion ? {} : { opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.08 }}
                    className="sm:col-span-7 space-y-3 text-xs"
                  >
                    <div className="rounded-xl border border-[#3A302B] bg-[#1F1A17] p-4 space-y-3">
                      <div className="flex items-center justify-between text-[0.68rem] text-[#D8C5AA] font-mono border-b border-[#2E2722] pb-2">
                        <span>SOURCE ARTIFACT: MSA_AMENDMENT_2025.PDF</span>
                        <span className="text-[#357C78]">PAGE 14 OF 38</span>
                      </div>
                      <div className="rounded bg-[#161311] p-3 text-[0.72rem] text-[rgba(255,253,248,0.78)] font-mono leading-relaxed border border-[#2B2420]">
                        &ldquo;...payment terms shall adhere to Net 45 schedule with a recurring license surcharge capped at $48,200 annually, subject to annual CPI-U adjustments not to exceed 3.5%...&rdquo;
                      </div>
                      <div className="flex items-center gap-2 text-[0.68rem] text-[#357C78]">
                        <Check className="h-3.5 w-3.5" />
                        <span>Entity extracted: Billing Terms, Payment Schedule, Inflation Cap</span>
                      </div>
                    </div>

                    <div className="rounded-xl border border-[#3A302B] bg-[#1F1A17] p-4">
                      <p className="text-[0.68rem] font-bold text-[#D8C5AA] uppercase tracking-wider mb-2 font-mono">
                        Extracted Schema Mappings
                      </p>
                      <div className="grid grid-cols-2 gap-2 text-[0.7rem] font-mono">
                        <div className="rounded bg-[#161311] p-2 border border-[#2B2420]">
                          <span className="text-[rgba(255,253,248,0.5)] block text-[0.6rem]">PAYMENT_TERMS</span>
                          <span className="text-[#FFFDF8] font-bold">NET_45_DAYS</span>
                        </div>
                        <div className="rounded bg-[#161311] p-2 border border-[#2B2420]">
                          <span className="text-[rgba(255,253,248,0.5)] block text-[0.6rem]">ANNUAL_CAP</span>
                          <span className="text-[#FFFDF8] font-bold">$48,200.00 USD</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Right: Verification & System Action Panel */}
                  <motion.div
                    initial={shouldReduceMotion ? {} : { opacity: 0, x: 12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.16 }}
                    className="sm:col-span-5 rounded-xl border border-[#3A302B] bg-[#1C1815] p-4 flex flex-col justify-between text-xs"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-[0.68rem] font-bold uppercase tracking-wider text-[#357C78] font-mono">
                        <ShieldCheck className="h-4 w-4" />
                        <span>Source Grounded</span>
                      </div>
                      <p className="text-[0.72rem] text-[rgba(255,253,248,0.7)] leading-relaxed">
                        Every field references page, clause, and semantic lineage. No hallucinated figures.
                      </p>
                      <div className="rounded bg-[#161311] p-2.5 border border-[#2B2420] text-[0.68rem] font-mono space-y-1.5">
                        <div className="flex justify-between text-[rgba(255,253,248,0.6)]">
                          <span>Confidence Score</span>
                          <span className="text-[#357C78] font-bold">99.8%</span>
                        </div>
                        <div className="flex justify-between text-[rgba(255,253,248,0.6)]">
                          <span>Oracle ERP Sync</span>
                          <span className="text-[#D8C5AA] font-bold">STAGED</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#2B2420]">
                      <button
                        type="button"
                        className="w-full rounded-lg bg-[#357C78] py-2 text-center text-xs font-bold text-white transition-colors hover:bg-[#2C6B67] cursor-pointer"
                      >
                        Approve &amp; Dispatch to ERP
                      </button>
                    </div>
                  </motion.div>
                </div>
              </div>
            </ProductFrame>
          </div>
        </div>
      </div>
    </section>
  );
}
