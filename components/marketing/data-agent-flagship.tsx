"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

import SectionLabel from "@/components/marketing/SectionLabel";

const workflowSteps = [
  { step: "01", name: "INGEST" },
  { step: "02", name: "EXTRACT" },
  { step: "03", name: "VERIFY" },
  { step: "04", name: "REVIEW" },
  { step: "05", name: "ANALYZE" },
  { step: "06", name: "INTEGRATE" },
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
          <span className="rounded bg-[#342B27] px-2.5 py-1 text-[0.68rem] font-bold tracking-wider text-[#D8C5AA] uppercase">
            Consult America Labs
          </span>
        </div>

        {/* 2-Column Presentation: Copy (Left ~45%) + Large Product Screenshot (Right ~55%) */}
        <div className="mt-8 grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center lg:gap-14">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="lg:col-span-5 space-y-6"
          >
            <h2 className="font-serif text-3xl font-semibold tracking-[-0.03em] text-[#F7F0E7] sm:text-4xl lg:text-5xl lg:leading-[1.12]">
              Turn complex documents into usable enterprise intelligence.
            </h2>
            <p className="text-base leading-relaxed text-[#CFC4BA]">
              Data Agent transforms contracts and complex enterprise documents into
              structured, traceable information while keeping humans connected to
              the source document.
            </p>

            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 pt-2">
              {features.map((feat) => (
                <div key={feat} className="flex items-center gap-2 text-xs font-medium text-[#F7F0E7]">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#D8C5AA] shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <Link
                href="/work/innovation/data-agent"
                className="group inline-flex min-h-12 items-center gap-2 rounded-md bg-[#FFFDF8] px-6 text-sm font-semibold text-[#261F1B] transition-colors hover:bg-[#FFFAF2] hover:text-[#7D2639]"
              >
                <span>Explore Data Agent</span>
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </motion.div>

          {/* Real Product Screenshot in Soft Warm Browser Frame */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65 }}
            className="lg:col-span-7"
          >
            <div className="overflow-hidden rounded-lg border border-[#6F6259] bg-[#342B27] p-2.5 shadow-[0_24px_60px_rgba(0,0,0,0.5)]">
              {/* Browser bar */}
              <div className="flex items-center justify-between border-b border-[#6F6259]/80 px-3 pb-2.5">
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#B93838]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#C77A16]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#657766]" />
                </div>
                <span className="text-[0.68rem] font-mono tracking-wider text-[#D8C5AA]">
                  data-agent.consultamerica.internal
                </span>
              </div>
              <div className="relative aspect-[16/10] overflow-hidden rounded-sm bg-[#2B2420]">
                <Image
                  src="/innovation/data-agent-hero.png"
                  alt="Data Agent document intelligence product interface"
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 1024px) 100vw, 58vw"
                />
              </div>
            </div>
          </motion.div>
        </div>

        {/* 6-Stage Workflow on One Continuous Visual Line */}
        <div className="mt-16 border-t border-[#6F6259] pt-10">
          <p className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#D8C5AA]">
            Data Agent Workflow Line
          </p>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {workflowSteps.map((step, idx) => (
              <div
                key={step.name}
                className="relative flex items-center gap-3 rounded-md border border-[#6F6259] bg-[#342B27] p-3 text-center"
              >
                <span className="font-mono text-xs text-[#D8C5AA]">
                  {step.step}
                </span>
                <span className="text-xs font-bold tracking-wider text-[#F7F0E7]">
                  {step.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
