"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
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
      className="mkt-section bg-[var(--mkt-navy)] text-white"
    >
      <div className="mkt-shell">
        <SectionLabel tone="light">Why ConsultAmerica</SectionLabel>
        <h2 className="mkt-section-heading mt-5 max-w-3xl !text-white">
          Enterprise transformation without the unnecessary layers.
        </h2>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {differentiators.map((item, index) => (
            <motion.article
              key={item.title}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: index * 0.04 }}
              className="border-t border-white/15 pt-6"
            >
              <span className="mkt-eyebrow text-white/40">{item.number}</span>
              <h3 className="mt-4 text-xl font-medium tracking-[-0.03em]">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-white/60">
                {item.description}
              </p>
            </motion.article>
          ))}
        </div>

        <p className="mt-14 max-w-2xl text-xl font-medium tracking-[-0.02em] text-white/85 md:text-2xl">
          Deep enough for the enterprise. Focused enough to stay close.
        </p>

        <div className="mt-10 flex justify-end">
          <Link href="/about" className="ca-link">
            About ConsultAmerica
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
