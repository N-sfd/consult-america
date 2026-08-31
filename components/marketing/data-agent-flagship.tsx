"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

import SectionLabel from "@/components/marketing/SectionLabel";

const workflowSteps = [
  { name: "INGEST", color: "text-[#657766] border-[#657766]/50" },
  { name: "EXTRACT", color: "text-[#D8C5AA] border-[#D8C5AA]/50" },
  { name: "VERIFY", color: "text-[#C77A8A] border-[#C77A8A]/50" },
  { name: "REVIEW", color: "text-[#657766] border-[#657766]/50" },
  { name: "ANALYZE", color: "text-[#D8C5AA] border-[#D8C5AA]/50" },
  { name: "INTEGRATE", color: "text-[#C77A8A] border-[#C77A8A]/50" },
];

const features = [
  "Dynamic Field Extraction",
  "Complex Tables & Schedules",
  "FAR / DFARS Clauses",
  "Source Verification on Every Field",
  "Centralized Contract Repository",
  "Field Explorer & Bulk Compare",
];

export default function DataAgentFlagship() {
  return (
    <section id="data-agent" className="mkt-section bg-[#2B2420] text-[#F7F0E7]">
      <div className="mkt-shell">
        <div className="flex items-center justify-between">
          <SectionLabel tone="light">Innovation Flagship</SectionLabel>
          <span className="rounded-md border border-[#D8C5AA]/40 bg-[#342B27] px-2.5 py-1 text-[0.68rem] font-bold tracking-wider text-[#D8C5AA] uppercase">
            Consult America Labs
          </span>
        </div>

        {/* 2-Column Presentation: Copy (Left) + Real Product Screenshot (Right) */}
        <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center lg:gap-14">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="lg:col-span-5 space-y-6"
          >
            <h2 className="text-3xl font-bold tracking-[-0.03em] text-[#F7F0E7] sm:text-4xl lg:text-5xl">
              Turn complex documents into usable enterprise intelligence.
            </h2>
            <p className="text-base leading-relaxed text-[#CFC4BA]">
              Data Agent transforms contracts and complex enterprise documents into
              structured, traceable information while keeping humans connected to
              the source document.
            </p>

            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 pt-2">
              {features.map((feat) => (
                <div key={feat} className="flex items-center gap-2 text-xs font-semibold text-[#F7F0E7]">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#D8C5AA] shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <Link
                href="/work/innovation/data-agent"
                className="inline-flex min-h-12 items-center gap-2 rounded-lg bg-[#FFFDF8] px-6 text-sm font-bold text-[#261F1B] transition-all hover:bg-[#FFFAF2] hover:text-[#7D2639]"
              >
                <span>Explore Data Agent</span>
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>

          {/* Real Product Screenshot */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65 }}
            className="lg:col-span-7"
          >
            <div className="overflow-hidden rounded-2xl border border-[#6F6259] bg-[#342B27] p-2.5 shadow-[0_24px_60px_rgba(0,0,0,0.5)]">
              <div className="flex items-center justify-between border-b border-[#6F6259] px-3 pb-2.5">
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#B93838]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#C77A16]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#657766]" />
                </div>
                <span className="text-[0.68rem] font-bold uppercase tracking-[0.12em] text-[#D8C5AA]">
                  Data Agent · Production Workspace
                </span>
              </div>
              <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-[#2B2420]">
                <Image
                  src="/innovation/data-agent-hero.png"
                  alt="Data Agent document intelligence product interface"
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 1024px) 100vw, 55vw"
                />
              </div>
            </div>
          </motion.div>
        </div>

        {/* 6-Stage Workflow Stepper Below */}
        <div className="mt-14 border-t border-[#6F6259] pt-8">
          <p className="text-[0.72rem] font-bold uppercase tracking-[0.14em] text-[#D8C5AA]">
            Data Agent Workflow
          </p>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {workflowSteps.map((step, idx) => (
              <div
                key={step.name}
                className={`rounded-lg border bg-[#342B27] p-3 text-center ${step.color}`}
              >
                <span className="text-[0.65rem] font-mono text-[#CFC4BA]">0{idx + 1}</span>
                <p className="mt-0.5 text-xs font-bold tracking-wider">{step.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
