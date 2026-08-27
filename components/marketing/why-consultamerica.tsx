"use client";

import { motion } from "framer-motion";

import SectionLabel from "@/components/marketing/SectionLabel";

const differentiators = [
  {
    number: "01",
    title: "Enterprise Depth",
    description:
      "Platforms, processes, integrations, data, and transformation programs.",
  },
  {
    number: "02",
    title: "Business + Technology",
    description:
      "Decisions that improve how the organization actually operates.",
  },
  {
    number: "03",
    title: "Execution Focus",
    description:
      "Implementation, adoption, and measurable outcomes—live in production.",
  },
  {
    number: "04",
    title: "Senior Expertise",
    description:
      "Experienced practitioners stay close to the work throughout delivery.",
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
          className="mt-6 max-w-3xl text-2xl font-medium leading-[1.15] tracking-[-0.03em] text-white md:mt-8 md:text-3xl lg:text-4xl"
        >
          Deep enough for the enterprise. Focused enough to stay close.
        </motion.p>

        <div className="mt-10 grid gap-x-8 gap-y-6 md:grid-cols-2">
          {differentiators.map((item, index) => (
            <motion.article
              key={item.title}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: index * 0.04 }}
              className="border-t border-white/12 pt-5"
            >
              <span className="mkt-eyebrow text-white/35">{item.number}</span>
              <h3 className="mt-4 text-base font-medium uppercase tracking-[0.06em] text-white md:text-lg">
                {item.title}
              </h3>
              <p className="mt-3 max-w-sm text-sm leading-7 text-white/55">
                {item.description}
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
