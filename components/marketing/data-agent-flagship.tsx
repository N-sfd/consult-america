"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

import SectionLabel from "@/components/marketing/SectionLabel";

const workflowSteps = [
  { step: "01", name: "INGEST", color: "border-[#176A63] text-[#9BC4B8] bg-[#0B4A47]" },
  { step: "02", name: "EXTRACT", color: "border-[#176A63] text-[#9BC4B8] bg-[#0B4A47]" },
  { step: "03", name: "VERIFY", color: "border-[#B83A3A] text-white bg-[#0B4A47]" },
  { step: "04", name: "REVIEW", color: "border-[#176A63] text-[#9BC4B8] bg-[#0B4A47]" },
  { step: "05", name: "ANALYZE", color: "border-[#176A63] text-[#9BC4B8] bg-[#0B4A47]" },
  { step: "06", name: "INTEGRATE", color: "border-[#B83A3A] text-white bg-[#0B4A47]" },
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
    <section id="data-agent" className="mkt-section bg-[#073B3A] text-white">
      <div className="mkt-shell">
        <div className="flex items-center justify-between">
          <SectionLabel tone="emerald">Innovation Flagship</SectionLabel>
          <span className="rounded bg-[#0B4A47] border border-[#176A63] px-2.5 py-1 text-[0.68rem] font-bold tracking-wider text-[#9BC4B8] uppercase">
            Consult America Labs
          </span>
        </div>

        {/* 2-Column Presentation: Copy (Left ~45%) + Large Real Application Screenshot (Right ~55%) */}
        <div className="mt-8 grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center lg:gap-14">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="lg:col-span-5 space-y-6"
          >
            <h2 className="font-serif text-3xl font-semibold tracking-[-0.03em] text-white sm:text-4xl lg:text-5xl lg:leading-[1.12]">
              Turn complex documents into usable enterprise intelligence.
            </h2>
            <p className="text-base leading-relaxed text-white/80">
              Data Agent transforms contracts and complex enterprise documents into
              structured, traceable information while keeping humans connected to
              the source document.
            </p>

            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 pt-2">
              {features.map((feat) => (
                <div key={feat} className="flex items-center gap-2 text-xs font-semibold text-white">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#9BC4B8] shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <Link
                href="/work/innovation/data-agent"
                className="group inline-flex min-h-12 items-center gap-2 rounded-md bg-[#B83A3A] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#992F31] cursor-pointer"
              >
                <span>Explore Data Agent</span>
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </motion.div>

          {/* Real Product Screenshot in Clean Neutral Browser Frame */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65 }}
            className="lg:col-span-7"
          >
            <div className="overflow-hidden rounded-xl border border-[#176A63] bg-[#FFFFFF] p-2.5 shadow-[0_24px_60px_rgba(0,0,0,0.45)]">
              {/* Browser bar */}
              <div className="flex items-center justify-between border-b border-[#E1ECE8] bg-[#F0F6F4] px-3 py-2 -mx-2.5 -mt-2.5 mb-2.5">
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#C9DDD7]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#C9DDD7]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#C9DDD7]" />
                </div>
                <span className="text-[0.68rem] font-mono tracking-wider text-[#5B6D6B]">
                  data-agent.consultamerica.net
                </span>
                <div className="w-8" />
              </div>
              <div className="relative aspect-[16/10] overflow-hidden rounded-md bg-[#FFFFFF]">
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

        {/* 6-Stage Workflow with Emerald and Red Accents */}
        <div className="mt-16 border-t border-[#176A63] pt-10">
          <p className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#9BC4B8]">
            Data Agent Workflow Line
          </p>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {workflowSteps.map((step) => (
              <div
                key={step.name}
                className={`relative flex items-center justify-center gap-2 rounded-md border p-3 text-center shadow-2xs ${step.color}`}
              >
                <span className="font-mono text-xs opacity-70">
                  {step.step}
                </span>
                <span className="text-xs font-bold tracking-wider">
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
