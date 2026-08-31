"use client";

import { motion, useReducedMotion } from "framer-motion";
import SectionLabel from "@/components/marketing/SectionLabel";

const manifestoItems = [
  {
    num: "01",
    title: "BUSINESS CONTEXT FIRST",
    description: "Start with how the organization operates, not with a technology product.",
  },
  {
    num: "02",
    title: "TECHNOLOGY DEPTH",
    description: "Connect enterprise platforms, data, AI and engineering.",
  },
  {
    num: "03",
    title: "PRODUCTION DISCIPLINE",
    description: "Design with implementation, testing, adoption and operations in mind.",
  },
  {
    num: "04",
    title: "PRODUCT MINDSET",
    description: "We test ideas by building. Our application portfolio demonstrates how strategy, workflow design, AI and engineering become usable software.",
  },
];

export default function WhyConsultAmericaSection() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="why-consult-america" className="bg-[#FFFFFF] text-[#102033] py-20 sm:py-24 lg:py-28 border-b border-[#DDE4E8]">
      <div className="ca-shell">
        <SectionLabel tone="burgundy">WHY CONSULT AMERICA</SectionLabel>

        <div className="mt-8 flex flex-col justify-between gap-4 md:flex-row md:items-end pb-8">
          <motion.h2
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-[-0.03em] text-[#102033]"
          >
            Built for execution, not just advice.
          </motion.h2>
          <p className="max-w-md text-sm sm:text-base text-[#526170]">
            How our consulting and engineering model delivers predictable enterprise outcomes.
          </p>
        </div>

        {/* Editorial Manifesto: Large Typography + Thin Dividers + Generous Whitespace (No Cards) */}
        <div className="mt-8 divide-y divide-[#DDE4E8] border-y border-[#DDE4E8]">
          {manifestoItems.map((item, idx) => (
            <motion.div
              key={item.num}
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: idx * 0.08 }}
              className="grid grid-cols-1 gap-4 py-8 sm:py-10 sm:grid-cols-12 sm:items-baseline sm:gap-8"
            >
              <div className="sm:col-span-2">
                <span className="font-serif text-3xl sm:text-4xl font-normal text-[#B63A3A]">
                  {item.num}
                </span>
              </div>
              <div className="sm:col-span-4">
                <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-[#102033]">
                  {item.title}
                </h3>
              </div>
              <div className="sm:col-span-6">
                <p className="text-base sm:text-lg leading-relaxed text-[#526170]">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
