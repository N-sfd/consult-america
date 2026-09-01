"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

import { ShapedPhoto } from "@/components/marketing/shaped-photo";
import SectionBackdrop from "@/components/marketing/section-backdrop";
import { stockImage } from "@/lib/marketing/stock-images";

const methodologySteps = [
  {
    number: "01",
    title: "FIND THE VALUE",
    description: "Identify where trusted data and AI automation create measurable return.",
  },
  {
    number: "02",
    title: "BUILD THE FOUNDATION",
    description: "Govern and pipeline operational data into architectures teams can query.",
  },
  {
    number: "03",
    title: "PUT AI INTO THE WORK",
    description: "Deploy agents and assistance directly inside day-to-day workflows.",
  },
  {
    number: "04",
    title: "OPERATE WITH TRUST",
    description: "Ground outputs in source citations, access controls, and human review.",
  },
];

export default function AIDataStory() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      id="ai-data-story"
      className="relative overflow-hidden border-b border-[#073B3A] py-16 text-white sm:py-20 lg:py-24"
      style={{
        background:
          "linear-gradient(135deg, #073B3A 0%, #0B4A47 52%, #176A63 100%)",
      }}
    >
      <SectionBackdrop variant="ai" />

      <div className="mx-auto max-w-[1440px] px-6 lg:px-8 xl:px-10 relative z-10">
        <div className="inline-flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[#9BC4B8]" />
          <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#9BC4B8]">
            AI &amp; DATA PRACTICE
          </span>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center lg:gap-14">
          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-6 space-y-6"
          >
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-[-0.03em] text-white leading-[1.08]">
              Put intelligence into the work.
            </h2>

            <p className="text-base sm:text-lg leading-relaxed text-white/80 max-w-xl">
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

          <div className="lg:col-span-6 relative flex flex-col items-center">
            <div className="relative w-full max-w-[560px]">
              <div className="absolute -inset-3 rounded-[14px] border border-[#9BC4B8]/25 -z-0 hidden sm:block ca-bg-drift" />
              <ShapedPhoto
                src={stockImage("aiDataStory", { w: 1200, q: 85 })}
                alt="Data engineering and applied machine learning team collaborating on enterprise data pipelines"
                shape="cut"
                className="h-[320px] sm:h-[390px] border-[#9BC4B8]/30 shadow-[0_20px_50px_rgba(0,0,0,0.30)]"
                sizes="(max-width: 1024px) 100vw, 50vw"
                overlay="caption"
                revealDirection="right"
              />
            </div>
          </div>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8 border-t border-[#9BC4B8]/25 pt-10">
          {methodologySteps.map((step, idx) => (
            <motion.div
              key={step.number}
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: idx * 0.08 }}
            >
              <span className="font-serif text-3xl sm:text-4xl font-normal text-[#9BC4B8]">
                {step.number}
              </span>
              <h3 className="mt-3 text-xs font-bold uppercase tracking-[0.14em] text-white">
                {step.title}
              </h3>
              <p className="mt-2 text-xs sm:text-sm leading-relaxed text-white/75">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
