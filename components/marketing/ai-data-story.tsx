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

        {/* Top: Headline & Strong Editorial Photo */}
        <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center lg:gap-14">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="lg:col-span-6 space-y-6"
          >
            <h2 className="font-serif text-3xl font-semibold tracking-[-0.03em] text-[#261F1B] sm:text-4xl lg:text-5xl lg:leading-[1.12]">
              AI should move the work — not sit beside it.
            </h2>
            <p className="text-base leading-relaxed text-[#695F57]">
              We help organizations identify valuable use cases, prepare
              trusted data, design governed AI systems, and integrate
              intelligence into real operational workflows.
            </p>
            <div className="pt-2">
              <Link
                href="/ai-data"
                className="group inline-flex items-center gap-2 text-sm font-semibold text-[#7D2639] transition-colors hover:text-[#681F30]"
              >
                <span>Explore AI &amp; Data Practice</span>
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </motion.div>

          {/* Large Editorial Photo: Collaborative Data & AI Engineers */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6"
          >
            <div className="relative aspect-[16/10] lg:h-[360px] w-full overflow-hidden rounded-lg border border-[#D7CCBD] bg-[#FFFDF8] shadow-[0_12px_36px_rgba(38,31,27,0.06)]">
              <Image
                src="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80"
                alt="AI data engineering and analytics team collaborating on enterprise models"
                fill
                className="object-cover mkt-img-graded"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#261F1B]/60 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#D8C5AA]">
                  HUMAN + AI GOVERNANCE
                </span>
                <p className="mt-1 text-xs text-[#F7F0E7]">
                  Every model output verified against enterprise source data with human reviewers in the loop.
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Below: 4-Step Model with Large Numbers & Thin Dividers */}
        <div className="mt-20 border-t border-[#D7CCBD] pt-14">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#7D2639]">
            AI Transformation Framework
          </p>

          <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {aiStages.map((stage, idx) => (
              <motion.div
                key={stage.num}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: idx * 0.08 }}
                className="border-t border-[#D7CCBD] pt-6 flex flex-col justify-between"
              >
                <div>
                  <span className="font-serif text-3xl font-normal text-[#7D2639]">
                    {stage.num}
                  </span>
                  <h3 className="mt-3 text-xs font-bold uppercase tracking-[0.12em] text-[#261F1B]">
                    {stage.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#695F57]">
                    {stage.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
