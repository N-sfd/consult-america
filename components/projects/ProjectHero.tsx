"use client";

import { motion } from "framer-motion";

import EditorialHeading from "@/components/marketing/EditorialHeading";
import SectionLabel from "@/components/marketing/SectionLabel";

export default function ProjectHero({
  category,
  headline,
  summary,
  capabilities,
  children,
}: {
  category: string;
  headline: string;
  summary: string;
  capabilities: string[];
  children: React.ReactNode;
}) {
  return (
    <section className="mkt-section bg-[var(--mkt-cloud)] text-[var(--mkt-navy)]">
      <div className="mkt-shell">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-6">
            <SectionLabel tone="blue">{category.toUpperCase()}</SectionLabel>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.65 }}
              className="mt-7"
            >
              <EditorialHeading
                as="h1"
                size="hero"
                className="max-w-xl text-[var(--mkt-navy)]"
              >
                {headline}
              </EditorialHeading>

              <p className="mkt-body-lg mt-7 max-w-lg">{summary}</p>

              <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2 border-t border-[var(--mkt-border)] pt-6">
                {capabilities.map((item) => (
                  <span
                    key={item}
                    className="text-sm font-medium text-[var(--mkt-navy)]/70"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.65, delay: 0.1 }}
            className="lg:col-span-6"
          >
            {children}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
