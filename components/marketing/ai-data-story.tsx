"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

import SectionLabel from "@/components/marketing/SectionLabel";

const aiStages = [
  {
    num: "01",
    title: "FIND THE VALUE",
    desc: "AI strategy, operational readiness, business case validation, and use-case prioritization based on measurable enterprise return.",
  },
  {
    num: "02",
    title: "BUILD THE FOUNDATION",
    desc: "Data quality contracts, pipeline engineering, clean lineage, metadata governance, and enterprise security boundaries.",
  },
  {
    num: "03",
    title: "PUT AI INTO THE WORK",
    desc: "Task-oriented agents, document intelligence, grounded RAG, copilots, and end-to-end workflow automation in day-to-day operations.",
  },
  {
    num: "04",
    title: "OPERATE WITH TRUST",
    desc: "Active telemetry, accuracy evaluation benchmarks, human-in-the-loop validation, and continuous model lifecycle governance.",
  },
];

export default function AIDataStory() {
  return (
    <section id="ai-data-story" className="mkt-section bg-[#FFFAF2] text-[#261F1B]">
      <div className="mkt-shell">
        <SectionLabel tone="burgundy">AI &amp; Data Practice</SectionLabel>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-end lg:gap-12">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="lg:col-span-7"
          >
            <h2 className="text-3xl font-bold tracking-[-0.03em] text-[#261F1B] sm:text-4xl lg:text-5xl">
              AI should move the work — not sit beside it.
            </h2>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.08 }}
            className="lg:col-span-5"
          >
            <p className="text-base leading-relaxed text-[#695F57]">
              We help organizations identify valuable use cases, prepare
              trusted data, design governed AI systems, and integrate
              intelligence into real operational workflows.
            </p>
          </motion.div>
        </div>

        {/* 4-Step Transformation Grid + Contextual Team Photography */}
        <div className="mt-14 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center">
          {/* 4 Steps Column */}
          <div className="lg:col-span-7 space-y-6">
            {aiStages.map((stage, idx) => (
              <motion.div
                key={stage.num}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: idx * 0.06 }}
                className="rounded-xl border border-[#D7CCBD] bg-[#FFFDF8] p-6 transition-all hover:border-[#7D2639]/40"
              >
                <div className="flex items-baseline gap-4">
                  <span className="text-lg font-bold text-[#7D2639]">
                    {stage.num}
                  </span>
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-[0.1em] text-[#261F1B]">
                      {stage.title}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-[#695F57]">
                      {stage.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Contextual Photography */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5"
          >
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-[#D7CCBD] bg-[#FFFDF8] shadow-[0_16px_40px_rgba(38,31,27,0.08)]">
              <Image
                src="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80"
                alt="AI data engineering and analytics team validating workflow intelligence"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#261F1B]/80 via-[#261F1B]/20 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#D8C5AA]">
                  Human + AI Governance
                </span>
                <p className="mt-1 text-sm font-semibold text-[#F7F0E7]">
                  Every model output verified against enterprise source data with human reviewers in the loop.
                </p>
                <div className="mt-4">
                  <Link
                    href="/ai-data"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#DFE4DA] hover:text-white"
                  >
                    <span>Explore AI &amp; Data Capabilities</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
