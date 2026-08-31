"use client";

import Link from "next/link";
import { ArrowUpRight, Sparkles, FileText, CheckCircle2, ShieldCheck, Database, Search, Cpu, Bot } from "lucide-react";
import { motion } from "framer-motion";

import SectionLabel from "@/components/marketing/SectionLabel";

const capabilities = [
  { name: "AI Agents", desc: "Autonomous task execution and policy adherence" },
  { name: "Document Intelligence", desc: "Complex contract & invoice field parsing" },
  { name: "Enterprise Search", desc: "Grounded semantic retrieval across silos" },
  { name: "Data Platforms", desc: "Scalable modern lakehouse architectures" },
  { name: "Analytics", desc: "Predictive operational dashboards & metrics" },
  { name: "Workflow Automation", desc: "Event-triggered straight-through processing" },
  { name: "Responsible AI", desc: "Audit trails, human review & guardrails" },
];

export default function AIDataStory() {
  return (
    <section id="ai-data-story" className="bg-[#F4EFE6] text-[#261F1B] py-20 sm:py-24 lg:py-28 border-b border-[#D7CCBD]">
      <div className="mkt-shell">
        <SectionLabel tone="sage">AI &amp; DATA</SectionLabel>

        <div className="mt-6 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center lg:gap-14">
          {/* Left Column: Heading, Copy & Capabilities */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="lg:col-span-6 space-y-6"
          >
            <h2 className="font-serif text-3xl font-semibold tracking-[-0.03em] text-[#261F1B] sm:text-4xl lg:text-5xl lg:leading-[1.1]">
              AI that works inside the enterprise.
            </h2>

            <p className="text-base sm:text-lg leading-relaxed text-[#695F57]">
              Move beyond AI experiments with governed agents, intelligent document
              processing, enterprise search, analytics and workflow automation built
              around real operational data.
            </p>

            <div className="pt-2">
              <Link
                href="/ai-data"
                className="group ca-button-primary inline-flex items-center gap-2 !min-h-12 !px-7 text-sm font-semibold rounded-md cursor-pointer"
              >
                <span>Explore AI &amp; Data Capabilities</span>
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>

            {/* Capabilities Matrix */}
            <div className="mt-8 border-t border-[#D7CCBD] pt-6">
              <p className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#695F57]">
                Core Practice Capabilities
              </p>
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {capabilities.map((item) => (
                  <div
                    key={item.name}
                    className="flex items-start gap-2 rounded-lg border border-[#D7CCBD]/80 bg-[#FFFDF8] p-2.5"
                  >
                    <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#7D2639]" />
                    <div>
                      <p className="text-xs font-bold text-[#261F1B]">{item.name}</p>
                      <p className="text-[0.68rem] text-[#695F57]">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right Column: Layered Data Agent + AI Agent Panel Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6 relative"
          >
            {/* Main Application Mockup: Data Agent Document Extraction Workspace */}
            <div className="rounded-2xl border border-[#D7CCBD] bg-[#FFFDF8] p-5 lg:p-6 shadow-[0_16px_50px_rgba(38,31,27,0.08)]">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-[#D7CCBD] pb-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#DFE4DA] text-[#657766]">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#261F1B]">Data Agent Platform</h4>
                    <p className="text-[0.62rem] text-[#695F57]">Master Services Agreement (MSA-2026-04.pdf)</p>
                  </div>
                </div>
                <span className="rounded bg-[#DFE4DA] px-2 py-0.5 font-mono text-[0.62rem] font-bold text-[#657766]">
                  Grounded 99.8%
                </span>
              </div>

              {/* Document Analysis Workspace */}
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-12 gap-3">
                {/* Extracted Fields */}
                <div className="sm:col-span-7 space-y-2">
                  <div className="rounded border border-[#D7CCBD]/80 bg-[#FFFAF2] p-2.5">
                    <p className="text-[0.62rem] font-bold uppercase text-[#695F57]">Clause Classification</p>
                    <p className="text-xs font-bold text-[#261F1B] mt-0.5">Limitation of Liability &amp; Indemnity</p>
                    <p className="text-[0.65rem] text-[#657766] font-mono mt-1">Section 14.2 · Cap: 2x Annual Contract Value</p>
                  </div>

                  <div className="rounded border border-[#D7CCBD]/80 bg-[#FFFAF2] p-2.5">
                    <p className="text-[0.62rem] font-bold uppercase text-[#695F57]">DFARS Compliance</p>
                    <p className="text-xs font-bold text-[#261F1B] mt-0.5">252.204-7012 (NIST SP 800-171)</p>
                    <p className="text-[0.65rem] text-[#657766] font-mono mt-1">Status: Fully Verified with Source Grounding</p>
                  </div>

                  <div className="rounded border border-[#D7CCBD]/80 bg-[#FFFAF2] p-2.5">
                    <p className="text-[0.62rem] font-bold uppercase text-[#695F57]">Payment Terms &amp; Net Days</p>
                    <p className="text-xs font-bold text-[#261F1B] mt-0.5">Net 30 · Early Pay Discount: 2% 10</p>
                  </div>
                </div>

                {/* Source Verification Preview */}
                <div className="sm:col-span-5 rounded border border-[#D7CCBD] bg-[#F4EFE6] p-3 text-[0.65rem] flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1.5 font-bold text-[#261F1B]">
                      <FileText className="h-3.5 w-3.5 text-[#7D2639]" />
                      <span>Source PDF Chunk #14</span>
                    </div>
                    <p className="mt-2 text-[#695F57] leading-relaxed italic border-l-2 border-[#7D2639] pl-2">
                      &ldquo;...Neither party shall be liable for indirect, incidental or punitive damages exceeding twice the fees paid under Section 4...&rdquo;
                    </p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-[#D7CCBD] flex items-center justify-between font-mono text-[0.6rem] text-[#657766]">
                    <span>Page 18, Para 3</span>
                    <span className="font-bold text-[#7D2639]">Match 100%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Layered AI Agent Floating Assistant Panel */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-3 sm:mt-0 sm:absolute sm:-bottom-6 sm:-right-4 rounded-xl border border-[#D7CCBD] bg-[#FFFDF8] p-4 shadow-xl sm:max-w-xs"
            >
              <div className="flex items-center justify-between border-b border-[#D7CCBD]/60 pb-2">
                <div className="flex items-center gap-1.5">
                  <Bot className="h-4 w-4 text-[#7D2639]" />
                  <span className="text-xs font-bold text-[#261F1B]">Autonomous Agent</span>
                </div>
                <span className="h-2 w-2 rounded-full bg-[#657766]" />
              </div>
              <p className="mt-2 text-[0.68rem] text-[#695F57] leading-relaxed">
                Contract values mapped automatically to Oracle ERP Procurement lines with zero human reconciliation required.
              </p>
              <div className="mt-2.5 flex items-center justify-between text-[0.62rem] font-bold">
                <span className="text-[#657766]">Approved for Fusion GL</span>
                <span className="text-[#7D2639]">1-Click Cutover</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
