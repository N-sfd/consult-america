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
    <section id="ai-data-story" className="mkt-section bg-[#E7ECE8] text-[#101828]">
      <div className="mkt-shell">
        <SectionLabel tone="sage">AI &amp; Data Practice</SectionLabel>

        {/* Top: Headline & Strong Editorial Photo */}
        <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center lg:gap-14">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="lg:col-span-6 space-y-6"
          >
            <h2 className="font-serif text-3xl font-semibold tracking-[-0.03em] text-[#101828] sm:text-4xl lg:text-5xl lg:leading-[1.12]">
              Put intelligence into the work.
            </h2>
            <p className="text-base leading-relaxed text-[#475467]">
              AI creates value when trusted data, useful models, business
              context and real workflows come together — not as a feature
              bolted onto the side of the work people already do.
            </p>
            <div className="pt-2">
              <Link
                href="/ai-data"
                className="group inline-flex items-center gap-2 text-sm font-semibold text-[#B63838] transition-colors hover:text-[#8F292D]"
              >
                <span>Explore AI &amp; Data Practice</span>
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </motion.div>

          {/* Large Editorial Photo: Data Team & Engineers Collaborating */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6"
          >
            <div className="relative aspect-[16/10] lg:h-[360px] w-full overflow-hidden rounded-lg border border-[#E2E7EC] bg-[#FFFFFF] shadow-[0_12px_36px_rgba(20,30,45,0.06)]">
              <Image
                src="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80"
                alt="AI data engineering and analytics team collaborating on enterprise models"
                fill
                className="object-cover mkt-img-graded"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#101828]/50 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#EEF2F5]">
                  HUMAN + AI GOVERNANCE
                </span>
                <p className="mt-1 text-xs text-[#F5F7FA]">
                  Every model output verified against enterprise source data with human reviewers in the loop.
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Below: 4-Step Model with Large Numbers & Thin Dividers */}
        <div className="mt-20 border-t border-[#E2E7EC] pt-14">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#5F7D75]">
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
                className="border-t border-[#E2E7EC] pt-6 flex flex-col justify-between"
              >
                <div>
                  <span className="font-serif text-3xl font-normal text-[#5F7D75]">
                    {stage.num}
                  </span>
                  <h3 className="mt-3 text-xs font-bold uppercase tracking-[0.12em] text-[#101828]">
                    {stage.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#475467]">
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
