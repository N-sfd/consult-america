"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

import SectionLabel from "@/components/marketing/SectionLabel";

const workflowSteps = [
  { step: "01", name: "INGEST", color: "border-[#3A5A6E]/60 text-[#7FA89C] bg-[#1C2C40]" },
  { step: "02", name: "EXTRACT", color: "border-[#3A5A78]/60 text-[#8FADD1] bg-[#1C2C40]" },
  { step: "03", name: "VERIFY", color: "border-[#7A3A3A]/60 text-[#E38B8B] bg-[#1C2C40]" },
  { step: "04", name: "REVIEW", color: "border-[#3A5A6E]/60 text-[#7FA89C] bg-[#1C2C40]" },
  { step: "05", name: "ANALYZE", color: "border-[#3A5A78]/60 text-[#8FADD1] bg-[#1C2C40]" },
  { step: "06", name: "INTEGRATE", color: "border-[#7A3A3A]/60 text-[#E38B8B] bg-[#1C2C40]" },
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
    <section id="data-agent" className="mkt-section bg-[#111C2D] text-[#F5F7FA]">
      <div className="mkt-shell">
        <div className="flex items-center justify-between">
          <SectionLabel tone="burgundy">Innovation Flagship</SectionLabel>
          <span className="rounded bg-[#1C2C40] border border-[#2A3A4E] px-2.5 py-1 text-[0.68rem] font-bold tracking-wider text-[#E38B8B] uppercase">
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
            <h2 className="font-serif text-3xl font-semibold tracking-[-0.03em] text-[#F5F7FA] sm:text-4xl lg:text-5xl lg:leading-[1.12]">
              Turn complex documents into usable enterprise intelligence.
            </h2>
            <p className="text-base leading-relaxed text-[#A4B1BE]">
              Data Agent transforms contracts and complex enterprise documents into
              structured, traceable information while keeping humans connected to
              the source document.
            </p>

            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 pt-2">
              {features.map((feat) => (
                <div key={feat} className="flex items-center gap-2 text-xs font-semibold text-[#F5F7FA]">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#7FA89C] shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <Link
                href="/work/innovation/data-agent"
                className="group inline-flex min-h-12 items-center gap-2 rounded-md bg-[#B63838] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#8F292D] cursor-pointer"
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
            <div className="overflow-hidden rounded-xl border border-[#2A3A4E] bg-[#FFFFFF] p-2.5 shadow-[0_24px_60px_rgba(0,0,0,0.45)]">
              {/* Browser bar */}
              <div className="flex items-center justify-between border-b border-[#E2E7EC]/80 bg-[#F4F6F8] px-3 py-2 -mx-2.5 -mt-2.5 mb-2.5">
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#E2E7EC]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#E2E7EC]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#E2E7EC]" />
                </div>
                <span className="text-[0.68rem] font-mono tracking-wider text-[#475467]">
                  data-agent.consultamerica.internal
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

        {/* 6-Stage Workflow with Muted Blue, Sage, and Red Accents */}
        <div className="mt-16 border-t border-[#23324A] pt-10">
          <p className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#A4B1BE]">
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
