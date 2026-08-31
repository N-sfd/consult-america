"use client";

import { motion } from "framer-motion";
import SectionLabel from "@/components/marketing/SectionLabel";

const differentiators = [
  {
    number: "01",
    title: "BUSINESS CONTEXT FIRST",
    description:
      "Start with outcomes and operating reality—not abstract technology choices. We ground decisions in how teams actually work and generate value.",
  },
  {
    number: "02",
    title: "TECHNOLOGY DEPTH",
    description:
      "Connect enterprise architecture with deep engineering execution. We design systems that scale securely and hold up under production scrutiny.",
  },
  {
    number: "03",
    title: "PRODUCTION DISCIPLINE",
    description:
      "Design testing, cutover controls, data contracts, and change readiness into delivery from day one, not after workshops finish.",
  },
  {
    number: "04",
    title: "PRODUCT MINDSET",
    description:
      "Build reusable digital capabilities and proprietary accelerators through Consult America Labs instead of one-off, disposable code.",
  },
];

export default function WhyConsultAmericaSection() {
  return (
    <section id="why-us" className="mkt-section bg-[#2B2420] text-[#F7F0E7]">
      <div className="mkt-shell">
        <SectionLabel tone="light">Why Consult America</SectionLabel>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-6 max-w-3xl text-2xl font-bold leading-[1.18] tracking-[-0.03em] text-[#F7F0E7] sm:text-3xl lg:text-4xl"
        >
          Strategy that stays connected to delivery.
        </motion.p>

        <div className="mt-14 grid grid-cols-1 gap-x-12 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {differentiators.map((item, index) => (
            <motion.article
              key={item.title}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: index * 0.08 }}
              className="border-t border-[#6F6259] pt-6 flex flex-col justify-between"
            >
              <div>
                <span className="text-2xl font-light tracking-tight text-[#D8C5AA]">
                  {item.number}
                </span>
                <h3 className="mt-3 text-sm font-bold uppercase tracking-[0.1em] text-[#F7F0E7]">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[#CFC4BA]">
                  {item.description}
                </p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
