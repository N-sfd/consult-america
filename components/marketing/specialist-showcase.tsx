"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, CheckCircle2, Server, Shield, Cpu } from "lucide-react";
import { motion } from "framer-motion";

import DataAgentScreenshot from "@/components/marketing/DataAgentScreenshot";
import OracleArchitectureDiagram from "@/components/marketing/OracleArchitectureDiagram";
import SectionLabel from "@/components/marketing/SectionLabel";

const AI_PILLARS = [
  "Document Intelligence",
  "Source Verification",
  "Human Review",
  "Repository Intelligence",
  "Oracle / REST / n8n Integration",
];

const DATA_AGENT_STAGES = [
  { name: "INGEST", detail: "PDF · DOCX · Scans · Images" },
  { name: "EXTRACT", detail: "Deterministic + Gemini + Local Ollama fallback" },
  { name: "VERIFY", detail: "Source-grounded evidence & citation mapping" },
  { name: "REVIEW", detail: "Human-in-the-loop audit & governance" },
  { name: "ANALYZE", detail: "Repository · Fields · FAR/DFARS compliance" },
  { name: "INTEGRATE", detail: "Oracle Fusion · REST API · n8n workflows" },
];

const TECH_ACCELERATORS = [
  {
    icon: Cpu,
    title: "AI & Automation",
    detail: "Multi-modal agents, RAG, and document intelligence workflows.",
  },
  {
    icon: Server,
    title: "Cloud & Data Infrastructure",
    detail: "High-throughput governed data lakes, pipelines, and hybrid cloud estates.",
  },
  {
    icon: Shield,
    title: "Zero Trust & Cyber",
    detail: "Defense-in-depth architecture, role-based governance, and continuous audit.",
  },
];

export default function SpecialistShowcase() {
  const [activeStageIndex, setActiveStageIndex] = useState(0);
  const activeStage = DATA_AGENT_STAGES[activeStageIndex];

  return (
    <section id="specialists" className="mkt-section bg-[#081a2f] text-white">
      <div className="mkt-shell">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <SectionLabel tone="light">Technology Platforms</SectionLabel>
            <h2 className="mkt-section-heading mt-4 text-white">
              Engineering the modern enterprise.
            </h2>
          </div>
          <p className="max-w-md text-sm text-white/65">
            Mission-critical platforms, Oracle Cloud estates, and autonomous AI
            systems built for production scale.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-8">
          {/* Oracle Cloud Technical Centerpiece */}
          <motion.article
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="ca-app-window-dark flex h-full flex-col justify-between p-6 md:p-8"
          >
            <div>
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#d94b4b]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#d99a1b]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#16a36a]" />
                  <span className="ml-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#2ea7ff]">
                    Oracle Practice
                  </span>
                </div>
                <span className="text-[0.68rem] text-white/45">Fusion · ERP · EPM</span>
              </div>

              <h3 className="mt-5 text-xl font-semibold tracking-[-0.02em] text-white sm:text-2xl">
                Transform the enterprise. Not just the software.
              </h3>
              <p className="mt-2.5 text-sm leading-relaxed text-white/65">
                Finance, procurement, HCM, projects, integration, and analytics
                through connected Oracle Cloud architecture.
              </p>

              <div className="mt-6">
                <OracleArchitectureDiagram compact />
              </div>
            </div>

            <div className="mt-8 border-t border-white/10 pt-4">
              <Link href="/oracle" className="ca-link text-sm font-semibold text-[#2ea7ff] hover:text-white">
                Explore Oracle Cloud Practice
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.article>

          {/* AI + Data Platform Centerpiece */}
          <motion.article
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.08 }}
            className="ca-app-window-dark flex h-full flex-col justify-between p-6 md:p-8"
          >
            <div>
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#d94b4b]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#d99a1b]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#16a36a]" />
                  <span className="ml-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#2ea7ff]">
                    AI + Data Platform
                  </span>
                </div>
                <span className="rounded-full bg-[#2457f5]/40 px-2.5 py-0.5 text-[0.68rem] font-semibold text-[#2ea7ff]">
                  Data Agent Engine
                </span>
              </div>

              <h3 className="mt-5 text-xl font-semibold tracking-[-0.02em] text-white sm:text-2xl">
                Move from experiments to enterprise intelligence.
              </h3>
              <p className="mt-2.5 text-sm leading-relaxed text-white/65">
                Document intelligence, multi-modal agents, source grounding, and
                human-in-the-loop review.
              </p>

              <div className="mt-6">
                <DataAgentScreenshot />
              </div>

              {/* 5 Enterprise AI Pillars */}
              <div className="mt-5 flex flex-wrap gap-2">
                {AI_PILLARS.map((pillar) => (
                  <span
                    key={pillar}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.06] px-2.5 py-1 text-xs font-medium text-white/90"
                  >
                    <CheckCircle2 className="h-3 w-3 text-[#2ea7ff]" />
                    {pillar}
                  </span>
                ))}
              </div>

              {/* Condensed 6-Stage Interactive Data Agent Architecture */}
              <div className="mt-6 rounded-xl border border-white/12 bg-[#061424] p-4">
                <div className="flex items-center justify-between">
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-[#2ea7ff]">
                    Data Agent Architecture
                  </p>
                  <span className="text-xs font-semibold text-white">
                    {activeStage.name}
                  </span>
                </div>

                <div className="mt-3 grid grid-cols-3 gap-1.5 sm:grid-cols-6">
                  {DATA_AGENT_STAGES.map((stage, idx) => {
                    const isSelected = idx === activeStageIndex;
                    return (
                      <button
                        key={stage.name}
                        type="button"
                        onClick={() => setActiveStageIndex(idx)}
                        onMouseEnter={() => setActiveStageIndex(idx)}
                        className={`rounded-md px-1.5 py-1.5 text-center text-[0.68rem] font-semibold transition-all duration-150 cursor-pointer ${
                          isSelected
                            ? "bg-[#2457f5] text-white shadow-[0_0_12px_rgba(36,87,245,0.6)]"
                            : "bg-white/[0.06] text-white/70 hover:bg-white/[0.12] hover:text-white"
                        }`}
                      >
                        {stage.name}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-3 rounded-lg bg-white/[0.05] px-3 py-2 text-xs">
                  <span className="font-semibold text-[#2ea7ff]">
                    {activeStage.name}:
                  </span>{" "}
                  <span className="text-white/75">{activeStage.detail}</span>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-4">
              <Link
                href="/work/innovation/data-agent"
                className="ca-link text-sm font-semibold text-[#2ea7ff] hover:text-white"
              >
                Explore Data Agent Platform
                <ArrowUpRight className="h-4 w-4" />
              </Link>
              <Link href="/ai-data" className="ca-link text-sm text-white/60 hover:text-white">
                AI &amp; Data Overview
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.article>
        </div>

        {/* 3 Secondary Technology Accelerators */}
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {TECH_ACCELERATORS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: 0.1 + idx * 0.05 }}
                className="rounded-xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-sm"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#2457f5]/20 text-[#2ea7ff]">
                  <Icon className="h-5 w-5" />
                </div>
                <h4 className="mt-3 text-sm font-semibold text-white">
                  {item.title}
                </h4>
                <p className="mt-1 text-xs leading-5 text-white/60">
                  {item.detail}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
