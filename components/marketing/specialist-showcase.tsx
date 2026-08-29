"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";
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
  { name: "EXTRACT", detail: "Deterministic + Gemini + Local fallback" },
  { name: "VERIFY", detail: "Source-grounded evidence citations" },
  { name: "REVIEW", detail: "Human-in-the-loop governance" },
  { name: "ANALYZE", detail: "Repository · Fields · FAR/DFARS" },
  { name: "INTEGRATE", detail: "Oracle · REST API · n8n workflows" },
];

export default function SpecialistShowcase() {
  const [activeStageIndex, setActiveStageIndex] = useState(0);
  const activeStage = DATA_AGENT_STAGES[activeStageIndex];

  return (
    <section id="specialists" className="mkt-section bg-[var(--mkt-ice)]">
      <div className="mkt-shell">
        <SectionLabel tone="dark">Specialist capabilities</SectionLabel>
        <h2 className="mkt-section-heading mt-4 text-[var(--mkt-navy)]">
          Depth where it matters most.
        </h2>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
          {/* Oracle Technical Centerpiece */}
          <motion.article
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="flex h-full flex-col justify-between rounded-2xl border border-[var(--mkt-border)] bg-[var(--mkt-cloud)] p-6 md:p-8"
          >
            <div>
              <p className="mkt-eyebrow text-[var(--mkt-blue)]">Oracle</p>
              <h3 className="mt-3 mkt-h3 text-[var(--mkt-navy)] sm:text-2xl">
                Transform the enterprise.
                <br />
                Not just the software.
              </h3>
              <p className="mkt-body mt-3">
                Finance, procurement, HCM, projects, integration, and analytics
                through connected Oracle Cloud platforms.
              </p>

              <div className="mt-6">
                <OracleArchitectureDiagram compact />
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[var(--mkt-border)]">
              <Link href="/oracle" className="ca-link text-sm">
                Explore Oracle Practice
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.article>

          {/* AI + Data Technical Centerpiece */}
          <motion.article
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.08 }}
            className="flex h-full flex-col justify-between rounded-2xl border border-[var(--mkt-border)] bg-[var(--mkt-ice-soft)] p-6 md:p-8"
          >
            <div>
              <div className="flex items-center justify-between gap-3">
                <p className="mkt-eyebrow text-[var(--mkt-blue)]">AI + Data</p>
                <span className="rounded-full bg-[var(--mkt-cloud)] px-2.5 py-0.5 text-[0.68rem] font-medium text-[var(--mkt-blue)]">
                  Data Agent Platform
                </span>
              </div>
              <h3 className="mt-3 mkt-h3 text-[var(--mkt-navy)] sm:text-2xl">
                Move from experiments to enterprise intelligence.
              </h3>
              <p className="mkt-body mt-3">
                Document intelligence, agents, search, and data engineering
                built for production governance.
              </p>

              <div className="mt-6">
                <DataAgentScreenshot />
              </div>

              {/* 5 Core Pillars */}
              <div className="mt-5 flex flex-wrap gap-2">
                {AI_PILLARS.map((pillar) => (
                  <span
                    key={pillar}
                    className="inline-flex items-center gap-1.5 rounded-full border border-[var(--mkt-border)] bg-white px-3 py-1 text-xs font-medium text-[var(--mkt-navy)] shadow-2xs"
                  >
                    <CheckCircle2 className="h-3 w-3 text-[var(--mkt-blue)]" />
                    {pillar}
                  </span>
                ))}
              </div>

              {/* Compact Interactive Data Agent Flow */}
              <div className="mt-6 rounded-xl border border-[var(--mkt-border)] bg-white p-4">
                <div className="flex items-center justify-between">
                  <p className="text-[0.68rem] font-semibold tracking-[0.12em] text-[var(--mkt-muted)] uppercase">
                    Data Agent Flow
                  </p>
                  <span className="text-[0.68rem] font-semibold text-[var(--mkt-blue)]">
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
                        className={`rounded-md px-1.5 py-1.5 text-center text-[0.68rem] font-semibold transition-all duration-200 cursor-pointer ${
                          isSelected
                            ? "bg-[var(--mkt-blue)] text-white shadow-xs"
                            : "bg-[var(--mkt-ice)] text-[var(--mkt-navy)] hover:bg-[var(--mkt-cloud)]"
                        }`}
                      >
                        {stage.name}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-3 rounded-lg bg-[var(--mkt-ice)] px-3 py-2 text-xs text-[var(--mkt-navy)]">
                  <span className="font-semibold text-[var(--mkt-blue)]">
                    {activeStage.name}:
                  </span>{" "}
                  <span className="text-[var(--mkt-muted)]">
                    {activeStage.detail}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-[var(--mkt-border)] pt-4">
              <Link
                href="/work/innovation/data-agent"
                className="ca-link text-sm font-semibold"
              >
                Explore Data Agent
                <ArrowUpRight className="h-4 w-4" />
              </Link>
              <Link href="/ai-data" className="ca-link text-sm text-[var(--mkt-muted)]">
                AI &amp; Data Overview
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.article>
        </div>
      </div>
    </section>
  );
}
