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
        <h2 className="mkt-section-heading mt-5 max-w-2xl !text-white">
          Enterprise transformation without the unnecessary layers.
        </h2>

        <div className="mt-10 grid gap-x-10 gap-y-8 md:grid-cols-2">
          {differentiators.map((item, index) => (
            <motion.article
              key={item.title}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: index * 0.04 }}
              className="border-t border-white/12 pt-6"
            >
              <span className="mkt-eyebrow text-white/35">{item.number}</span>
              <h3 className="mt-5 text-lg font-medium uppercase tracking-[0.06em] text-white md:text-xl">
                {item.title}
              </h3>
              <p className="mt-4 max-w-sm text-sm leading-7 text-white/55 md:text-base">
                {item.description}
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
