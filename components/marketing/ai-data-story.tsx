"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

import { stockImage } from "@/lib/marketing/stock-images";

const methodologySteps = [
  {
    number: "01",
    title: "FIND THE VALUE",
    description: "Identify high-friction operational bottlenecks where structured data and AI automation create measurable return.",
  },
  {
    number: "02",
    title: "BUILD THE FOUNDATION",
    description: "Cleanse, govern, and pipeline operational data from enterprise platforms into unified knowledge architectures.",
  },
  {
    number: "03",
    title: "PUT AI INTO THE WORK",
    description: "Deploy task-oriented agents, extraction pipelines, and assistive intelligence directly inside employee workflows.",
  },
  {
    number: "04",
    title: "OPERATE WITH TRUST",
    description: "Establish source grounding, access controls, human review, and continuous operational performance monitoring.",
  },
];

export default function AIDataStory() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="ai-data-story" className="ca-grad-emerald text-white py-16 sm:py-20 lg:py-24 border-b border-[#073B3A] relative overflow-hidden">
      {/* Subtle Data-Line Grid Ambient Background Pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-15"
        style={{
          backgroundImage: "linear-gradient(to right, rgba(155, 196, 184, 0.12) 1px, transparent 1px), linear-gradient(to bottom, rgba(155, 196, 184, 0.12) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="mx-auto max-w-[1440px] px-6 lg:px-8 xl:px-10 relative z-10">
        <div className="inline-flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[#9BC4B8]" />
          <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#9BC4B8]">
            AI &amp; DATA PRACTICE
          </span>
        </div>

        {/* Split: Headline & Copy Left, Architectural Shaped Photo Right */}
        <div className="mt-8 grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center lg:gap-14">
          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="lg:col-span-6 space-y-6"
          >
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-[-0.03em] text-white leading-[1.08]">
              Put intelligence into the work.
            </h2>

            <p className="text-base sm:text-lg leading-relaxed text-white/80">
              AI creates value when trusted data, useful models, business context and real workflows come together.
            </p>

            <div className="pt-2">
              <Link
                href="/ai-data"
                className="inline-flex h-[48px] items-center justify-center gap-2 rounded-[8px] bg-[#B83A3A] px-6 text-xs sm:text-sm font-semibold text-white shadow-[0_4px_16px_rgba(184,58,58,0.22)] hover:bg-[#992F31] transition-all cursor-pointer"
              >
                <span>Explore AI &amp; Data Practice</span>
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>

          {/* Architectural Cut Engineering Team Photo (Section 18 Specification) */}
          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.08 }}
            className="lg:col-span-6 relative flex flex-col items-center"
          >
            <div className="relative w-full max-w-[560px]">
              {/* Data-lines outline frame behind cut image */}
              <div className="absolute -inset-2 rounded-[14px] border border-[#9BC4B8]/20 -z-0 hidden sm:block" />

              {/* Shaped container with Architectural Cut (polygon 12% 0, 100% 0, 100% 88%, 88% 100%, 0 100%, 0 12%) */}
              <div
                className="relative w-full h-[320px] sm:h-[390px] overflow-hidden bg-[#073B3A] border border-[#9BC4B8]/30 shadow-[0_20px_50px_rgba(0,0,0,0.30)] ca-shape-cut-ai"
              >
                <Image
                  src={stockImage("aiDataStory", { w: 1200, q: 85 })}
                  alt="Data engineering and applied machine learning team collaborating on enterprise data pipelines"
                  fill
                  className="object-cover mkt-img-graded"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="mkt-overlay" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* 4 Editorial Stages: Large Numbers + Whitespace + Thin Dividers */}
        <div className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8 border-t border-white/20 pt-10">
          {methodologySteps.map((step, idx) => (
            <motion.div
              key={step.number}
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: idx * 0.08 }}
              className="flex flex-col justify-between"
            >
              <div>
                <span className="font-serif text-3xl sm:text-4xl font-normal text-[#9BC4B8]">
                  {step.number}
                </span>
                <h3 className="mt-3 text-xs font-bold uppercase tracking-[0.14em] text-white">
                  {step.title}
                </h3>
                <p className="mt-2.5 text-xs sm:text-sm leading-relaxed text-white/78">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
