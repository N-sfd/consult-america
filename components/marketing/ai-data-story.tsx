"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

import SectionLabel from "@/components/marketing/SectionLabel";

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
    <section id="ai-data-story" className="bg-[#103F3E] text-white py-16 sm:py-20 lg:py-24 border-b border-[#0B3332]">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-8 xl:px-10">
        <div className="inline-flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[#9DC8BC]" />
          <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#9DC8BC]">
            AI &amp; DATA PRACTICE
          </span>
        </div>

        {/* Split: Headline & Copy Left, 1 Large Engineering Team Photo Right */}
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
                className="inline-flex h-[46px] items-center justify-center gap-2 rounded-[6px] bg-[#B63A3A] px-6 text-xs sm:text-sm font-semibold text-white shadow-[0_4px_16px_rgba(182,58,58,0.22)] hover:bg-[#992F31] transition-all cursor-pointer"
              >
                <span>Explore AI &amp; Data Practice</span>
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>

          {/* One Large Engineering Team Photograph */}
          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.08 }}
            className="lg:col-span-6"
          >
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[10px] border border-white/20 bg-[#0B3332] shadow-[0_16px_40px_rgba(0,0,0,0.20)]">
              <Image
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=85"
                alt="Data engineering and applied machine learning team collaborating on enterprise data pipelines"
                fill
                className="object-cover mkt-img-graded"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B3332]/40 via-transparent to-transparent pointer-events-none" />
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
                <span className="font-serif text-3xl sm:text-4xl font-normal text-[#9DC8BC]">
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
