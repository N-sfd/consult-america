"use client";

import { motion, useReducedMotion } from "framer-motion";

import SectionBackdrop from "@/components/marketing/section-backdrop";

const pillars = [
  {
    title: "Transform",
    detail: "Modernize enterprise platforms and operating models.",
  },
  {
    title: "Connect",
    detail: "Unify data, workflows, and customer experiences.",
  },
  {
    title: "Activate",
    detail: "Put AI into daily operations with governance.",
  },
  {
    title: "Build",
    detail: "Engineer applications where packaged software stops.",
  },
];

const revealEase = [0.2, 0.8, 0.2, 1] as const;

export default function PositioningSection() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-white py-24 sm:py-28 lg:py-32 xl:py-36">
      <SectionBackdrop variant="positioning" />

      <div className="relative z-10 mx-auto max-w-[1440px] px-6 lg:px-8 xl:px-10">
        <div className="max-w-3xl">
          <motion.h2
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, ease: revealEase }}
            className="font-serif text-3xl font-semibold tracking-[-0.03em] text-[#073B3A] sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]"
          >
            One partner for transformation and what comes next.
          </motion.h2>
          <motion.p
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: 0.05, ease: revealEase }}
            className="mt-5 max-w-2xl text-[1.0625rem] leading-relaxed text-[#5B6D6B]"
          >
            Modernize enterprise platforms. Connect data and workflows. Put AI into daily
            operations. Build applications where packaged software stops.
          </motion.p>
        </div>

        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10">
          {pillars.map((pillar, index) => (
            <motion.div
              key={pillar.title}
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.48, delay: index * 0.05, ease: revealEase }}
              className="ca-pillar pt-5"
            >
              <h3 className="ca-pillar-title text-xs font-bold uppercase tracking-[0.16em] text-[#073B3A]">
                {pillar.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[#5B6D6B]">{pillar.detail}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
