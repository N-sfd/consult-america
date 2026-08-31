"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Sparkles, FileText, Database, Search, Bot, Check, Workflow, ShieldCheck } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

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
      {/* 1. Subtle Background Document & Architectural Wire Texture with Slow Drift (Requirement 20) */}
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
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="relative h-full w-full opacity-[0.07]"
        >
          <Image
            src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=2000&q=80"
            alt=""
            fill
            className="object-cover object-center grayscale contrast-150"
            sizes="100vw"
          />
        </motion.div>

        {/* 2. Geometric Brand Arc Motif Echoing CA Logo Curve (Requirement 15) */}
        <div
          className="ca-brand-arc-motif -bottom-28 -left-28 w-[360px] h-[360px] sm:w-[440px] sm:h-[440px] opacity-25"
          aria-hidden="true"
        />

        {/* Technical Grid Matrix Overlay */}
        <div
          className="absolute inset-0 opacity-[0.035] pointer-events-none"
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

          {/* Right Column: Precision Rectangular Data Agent Workspace (Requirement 5 & 21) */}
          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65 }}
            className="lg:col-span-8 rounded-2xl border border-[#3A302B] bg-[#2B2420] p-6 lg:p-8 shadow-2xl relative overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#3A302B] pb-4 text-xs font-mono">
              <div className="flex items-center gap-2 text-white">
                <Sparkles className="h-4 w-4 text-[#D8C5AA]" />
                <span className="font-bold text-sm">Data Agent Intelligence Workspace</span>
              </div>
              <span className="rounded bg-[#342B27] border border-[#3A302B] px-2.5 py-1 text-[0.62rem] font-bold text-[#D8C5AA]">
                Demonstration environment
              </span>
            </div>

            {/* Document Extraction Interface - Layered Sub-panel Entrance */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-12 gap-4">
              {/* Left Column: Extracted Entities (Staggered Entrance) */}
              <motion.div
                initial={shouldReduceMotion ? {} : { opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="sm:col-span-7 space-y-3 text-xs"
              >
                <div className="rounded-xl border border-[#3A302B] bg-[#342B27] p-4">
                  <p className="text-[0.62rem] font-bold uppercase tracking-wider text-[#D8C5AA]">Clause Classification</p>
                  <p className="font-bold text-white text-sm sm:text-base mt-1">Limitation of Liability &amp; Indemnity</p>
                  <p className="text-[0.7rem] text-[rgba(255,253,248,0.65)] mt-1 font-mono">Section 14.2 · Commercial Risk Profile</p>
                </div>

                <div className="rounded-xl border border-[#3A302B] bg-[#342B27] p-4">
                  <p className="text-[0.62rem] font-bold uppercase tracking-wider text-[#D8C5AA]">Regulatory Review Status</p>
                  <p className="font-bold text-white text-sm sm:text-base mt-1">DFARS 252.204-7012 (Covered Defense Information)</p>
                  <p className="text-[0.7rem] text-[#357C78] font-bold mt-1.5 flex items-center gap-1.5">
                    <Check className="h-3.5 w-3.5" /> Source Grounded &amp; Compliant
                  </p>
                </div>

                <div className="rounded-xl border border-[#3A302B] bg-[#342B27] p-3.5">
                  <p className="text-[0.62rem] font-bold uppercase tracking-wider text-[#D8C5AA]">Payment Terms &amp; Accounting Line</p>
                  <p className="font-bold text-white text-xs sm:text-sm mt-0.5">Net 30 · Early Settlement Structure</p>
                </div>
              </motion.div>

              {/* Right Column: Grounded PDF Source Chunk (Staggered Entrance) */}
              <motion.div
                initial={shouldReduceMotion ? {} : { opacity: 0, x: 10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.16 }}
                className="sm:col-span-5 rounded-xl border border-[#3A302B] bg-[#1C1815] p-4 flex flex-col justify-between text-xs"
              >
                <div>
                  <div className="flex items-center gap-2 font-bold text-white text-xs">
                    <FileText className="h-4 w-4 text-[#D8C5AA]" />
                    <span>Source PDF · Page 18</span>
                  </div>
                  <p className="mt-3 text-[0.72rem] text-[#C5BCB3] leading-relaxed italic border-l-2 border-[#B63A3A] pl-2.5">
                    &ldquo;...Neither party shall be liable for indirect, incidental or punitive damages exceeding twice the fees paid under Section 4...&rdquo;
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-[#3A302B] flex items-center justify-between font-mono text-[0.65rem] text-[rgba(255,253,248,0.65)]">
                  <span>Chunk #14</span>
                  <span className="font-bold text-[#357C78]">Source Traceable</span>
                </div>
              </motion.div>
            </div>

            {/* Bottom Autonomous Action Bar */}
            <div className="mt-5 pt-4 border-t border-[#3A302B] flex items-center justify-between text-xs text-[rgba(255,253,248,0.65)]">
              <span className="flex items-center gap-1.5 text-xs text-white font-medium">
                <Bot className="h-4 w-4 text-[#D8C5AA]" /> Verified Sync to Oracle Procurement
              </span>
              <span className="font-mono text-[#D8C5AA] font-bold text-xs bg-[#342B27] px-2.5 py-1 rounded">Status: Verified</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
