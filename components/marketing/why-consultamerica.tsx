"use client";

import { motion } from "framer-motion";

import SectionLabel from "@/components/marketing/SectionLabel";

const differentiators = [
  {
    number: "01",
    title: "Enterprise Depth",
    description: "Deep platforms, operational process, enterprise integration, and mission data.",
  },
  {
    number: "02",
    title: "Business + Technology",
    description: "Decisions grounded in how organizations actually operate and generate value.",
  },
  {
    number: "03",
    title: "Execution Focus",
    description: "From strategy and architecture design through production go-live and support.",
  },
  {
    number: "04",
    title: "Senior Expertise",
    description: "Experienced practitioners stay directly attached to the work throughout delivery.",
  },
];

export default function WhyConsultAmerica() {
  return (
    <section
      id="why-consultamerica"
      className="mkt-section bg-[#2B2420] text-[#F7F0E7]"
    >
      <div className="mkt-shell">
        <SectionLabel tone="light">Why ConsultAmerica</SectionLabel>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-5 max-w-3xl text-2xl font-bold leading-[1.18] tracking-[-0.03em] text-[#F7F0E7] sm:text-3xl lg:text-4xl"
        >
          Deep enough for the enterprise.
          <br className="hidden sm:inline" /> Focused enough to stay close.
        </motion.p>

        <div className="mt-12 grid gap-x-12 gap-y-10 sm:grid-cols-2 lg:gap-x-16 lg:gap-y-12">
          {differentiators.map((item, index) => (
            <motion.article
              key={item.title}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: index * 0.05 }}
              className="border-t border-[#6F6259] pt-6"
            >
              <span className="text-3xl font-light tracking-tight text-[#D8C5AA] sm:text-4xl">
                {item.number}
              </span>
              <h3 className="mt-3 text-lg font-bold tracking-[-0.01em] text-[#F7F0E7] sm:text-xl">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[#CFC4BA] sm:text-base">
                {item.description}
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
