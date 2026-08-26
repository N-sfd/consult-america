"use client";

import { motion } from "framer-motion";

import { heroStats, testimonials } from "@/lib/site-data";

export default function TrustCredibility() {
  const quote = testimonials[0];

  return (
    <section
      id="trust"
      className="mkt-section-compact border-y border-[var(--mkt-border)] bg-[var(--mkt-white)]"
    >
      <div className="mkt-shell">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-2 divide-y divide-[var(--mkt-border)] lg:grid-cols-4 lg:divide-y-0 lg:divide-x"
        >
          {heroStats.map((stat) => (
            <div key={stat.value + stat.label} className="py-5 pr-6 first:pl-0 lg:py-0 lg:pl-8 lg:first:pl-0">
              <p className="text-xl font-medium tracking-[-0.03em] text-[var(--mkt-navy)] md:text-2xl">
                {stat.value}
                <span className="ml-2 text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-[var(--mkt-muted)]">
                  {stat.label}
                </span>
              </p>
              {"detail" in stat && stat.detail ? (
                <p className="mt-1 text-sm text-[var(--mkt-muted)]">
                  {stat.detail}
                </p>
              ) : null}
            </div>
          ))}
        </motion.div>

        <motion.blockquote
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.08 }}
          className="mt-12 border-t border-[var(--mkt-border)] pt-10 lg:mt-14 lg:pt-12"
        >
          <p className="max-w-3xl text-xl leading-[1.45] tracking-[-0.015em] text-[var(--mkt-text)] md:text-2xl">
            “{quote.quote}”
          </p>
          <footer className="mt-5 text-sm text-[var(--mkt-muted)]">
            <span className="font-medium text-[var(--mkt-navy)]">
              {quote.name}
            </span>
            <span className="mx-2 text-[var(--mkt-border)]">·</span>
            {quote.org}
          </footer>
        </motion.blockquote>
      </div>
    </section>
  );
}
