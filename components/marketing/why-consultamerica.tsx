"use client";

import { motion } from "framer-motion";

import SectionLabel from "@/components/marketing/SectionLabel";

const differentiators = [
  {
    number: "01",
    title: "Enterprise Depth",
    description: "Platforms, process, integration and data.",
  },
  {
    number: "02",
    title: "Business + Technology",
    description: "Decisions grounded in how organizations operate.",
  },
  {
    number: "03",
    title: "Execution Focus",
    description: "From design through production.",
  },
  {
    number: "04",
    title: "Senior Expertise",
    description: "Experienced practitioners close to delivery.",
  },
];

export default function WhyConsultAmerica() {
  return (
    <section
      id="why-consultamerica"
      className="mkt-section-compact bg-[var(--mkt-navy)] text-white"
    >
      <div className="mkt-shell">
        <SectionLabel tone="light">Why ConsultAmerica</SectionLabel>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-5 max-w-3xl text-2xl font-medium leading-[1.18] tracking-[-0.03em] text-white sm:text-3xl lg:text-4xl"
        >
          Deep enough for the enterprise.
          <br className="hidden sm:inline" /> Focused enough to stay close.
        </motion.p>

        <div className="mt-10 grid gap-x-12 gap-y-8 sm:grid-cols-2 lg:gap-x-16 lg:gap-y-10">
          {differentiators.map((item, index) => (
            <motion.article
              key={item.title}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: index * 0.04 }}
              className="border-t border-white/15 pt-6"
            >
              <span className="text-2xl font-light text-white/35 sm:text-3xl">
                {item.number}
              </span>
              <h3 className="mt-3 text-base font-medium tracking-[-0.01em] text-white sm:text-lg">
                {item.title}
              </h3>
              <p className="mt-2 text-xs leading-6 text-white/60 sm:text-sm sm:leading-7">
                {item.description}
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
