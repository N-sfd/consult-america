"use client";

import Link from "next/link";
import { ArrowUpRight, Sparkles, FileText, CheckCircle2, Database, Search, Bot, Check, Workflow, ShieldCheck } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

const pipelineStages = [
  { step: "01", name: "SOURCE DOCUMENT", detail: "PDFs, MSAs, Statements of Work, and contracts", icon: FileText },
  { step: "02", name: "EXTRACTION", detail: "Clause segmentation & dynamic entity detection", icon: Search },
  { step: "03", name: "STRUCTURED DATA", detail: "Normalized schema mapped to ERP & CRM", icon: Database },
  { step: "04", name: "VERIFICATION", detail: "Human-in-the-loop citation grounding", icon: ShieldCheck },
  { step: "05", name: "ENTERPRISE WORKFLOW", detail: "Autonomous sync to Oracle Fusion & Workspaces", icon: Workflow },
];

export default function AIDataStory() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="ai-data-story" className="bg-[#211E1B] text-[#F7F3EC] py-24 sm:py-28 lg:py-32 relative overflow-hidden border-b border-[#3A302B]">
      {/* Background Architectural Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(to right, #F7F3EC 1px, transparent 1px), linear-gradient(to bottom, #F7F3EC 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />

      <div className="mkt-shell relative z-10">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#52443D] bg-[#2B2420] px-3.5 py-1 text-[0.68rem] font-bold uppercase tracking-[0.16em] text-[#D8C5AA]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#D8C5AA]" />
          GOVERNED AI &amp; DATA
        </div>

        <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center lg:gap-14">
          {/* Left Column: Streamlined Heading & Pipeline Flow (~38%) */}
          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="lg:col-span-5 space-y-6"
          >
            <h2 className="font-serif text-3xl font-semibold tracking-[-0.03em] text-white sm:text-4xl lg:text-5xl lg:leading-[1.1]">
              AI should move the work —
              <br />
              <span className="text-[#D8C5AA]">not sit beside it.</span>
            </h2>

            <p className="text-base sm:text-lg leading-relaxed text-[#C5BCB3]">
              Move beyond AI experiments with governed agents, intelligent document
              processing, enterprise search, and workflow automation built
              around real operational data.
            </p>

            <div className="pt-2">
              <Link
                href="/ai-data"
                className="group inline-flex items-center gap-2 rounded-lg bg-[#7D2639] px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#681F30] cursor-pointer shadow-lg shadow-black/30"
              >
                <span>Explore AI &amp; Data Practice</span>
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>

            {/* Pipeline Stages Stepper */}
            <div className="mt-8 border-t border-[#3A302B] pt-6 space-y-2">
              <p className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#D8C5AA] mb-3">
                End-to-End Intelligence Pipeline
              </p>
              {pipelineStages.map((st) => (
                <div
                  key={st.step}
                  className="flex items-center gap-3 rounded-lg border border-[#3A302B] bg-[#2B2420]/80 px-3 py-2 text-xs"
                >
                  <span className="font-mono text-[0.65rem] font-bold text-[#D8C5AA]">
                    {st.step}
                  </span>
                  <div className="flex-1">
                    <span className="font-bold text-white text-xs">{st.name}</span>
                    <span className="text-[#A4B1BE] text-[0.65rem] block">{st.detail}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right Column: Enlarged Flagship Data Agent Workspace (~62%) */}
          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 rounded-2xl border border-[#52443D] bg-[#2B2420] p-6 lg:p-8 shadow-2xl relative overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#3A302B] pb-4 text-xs font-mono">
              <div className="flex items-center gap-2 text-white">
                <Sparkles className="h-4 w-4 text-[#D8C5AA]" />
                <span className="font-bold text-sm">Data Agent Intelligence Workspace</span>
              </div>
              <span className="rounded bg-[#3A302B] border border-[#52443D] px-2.5 py-1 text-[0.62rem] font-bold text-[#D8C5AA]">
                Verified Grounding
              </span>
            </div>

            {/* Document Extraction Interface - Enlarged */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-12 gap-4">
              {/* Left Column: Extracted Entities */}
              <div className="sm:col-span-7 space-y-3 text-xs">
                <div className="rounded-xl border border-[#3A302B] bg-[#342B27] p-4">
                  <p className="text-[0.62rem] font-bold uppercase tracking-wider text-[#D8C5AA]">Clause Classification</p>
                  <p className="font-bold text-white text-sm sm:text-base mt-1">Limitation of Liability &amp; Indemnity</p>
                  <p className="text-[0.7rem] text-[#A4B1BE] mt-1 font-mono">Section 14.2 · Cap: 2x Annual Contract Value</p>
                </div>

                <div className="rounded-xl border border-[#3A302B] bg-[#342B27] p-4">
                  <p className="text-[0.62rem] font-bold uppercase tracking-wider text-[#D8C5AA]">DFARS Compliance Verification</p>
                  <p className="font-bold text-white text-sm sm:text-base mt-1">252.204-7012 (NIST SP 800-171)</p>
                  <p className="text-[0.7rem] text-[#657766] font-bold mt-1.5 flex items-center gap-1.5">
                    <Check className="h-3.5 w-3.5" /> Fully Grounded to Document Text
                  </p>
                </div>

                <div className="rounded-xl border border-[#3A302B] bg-[#342B27] p-3.5">
                  <p className="text-[0.62rem] font-bold uppercase tracking-wider text-[#D8C5AA]">Payment Terms &amp; Accounting Line</p>
                  <p className="font-bold text-white text-xs sm:text-sm mt-0.5">Net 30 · Early Payment Discount 2% 10</p>
                </div>
              </div>

              {/* Right Column: Grounded PDF Source Chunk */}
              <div className="sm:col-span-5 rounded-xl border border-[#3A302B] bg-[#1C1815] p-4 flex flex-col justify-between text-xs">
                <div>
                  <div className="flex items-center gap-2 font-bold text-white text-xs">
                    <FileText className="h-4 w-4 text-[#D8C5AA]" />
                    <span>Source PDF Page 18</span>
                  </div>
                  <p className="mt-3 text-[0.72rem] text-[#C5BCB3] leading-relaxed italic border-l-2 border-[#7D2639] pl-2.5">
                    &ldquo;...Neither party shall be liable for indirect, incidental or punitive damages exceeding twice the fees paid under Section 4...&rdquo;
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-[#3A302B] flex items-center justify-between font-mono text-[0.65rem] text-[#A4B1BE]">
                  <span>Chunk #14</span>
                  <span className="font-bold text-[#D8C5AA]">High Confidence</span>
                </div>
              </div>
            </div>

            {/* Bottom Autonomous Action Bar */}
            <div className="mt-5 pt-4 border-t border-[#3A302B] flex items-center justify-between text-xs text-[#A4B1BE]">
              <span className="flex items-center gap-1.5 text-xs text-white font-medium">
                <Bot className="h-4 w-4 text-[#D8C5AA]" /> Autonomous Sync to Oracle Procurement
              </span>
              <span className="font-mono text-[#D8C5AA] font-bold text-xs bg-[#342B27] px-2.5 py-1 rounded">Status: Approved</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
