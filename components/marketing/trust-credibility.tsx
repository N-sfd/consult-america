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
        <div className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-12">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-2 gap-6 sm:grid-cols-4 lg:col-span-7 lg:gap-4"
          >
            {heroStats.map((stat) => (
              <div key={stat.value + stat.label}>
                <p className="text-2xl font-medium tracking-[-0.03em] text-[var(--mkt-navy)] md:text-3xl">
                  {stat.value}
                </p>
                <p className="mt-1 text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-[var(--mkt-muted)]">
                  {stat.label}
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
            className="border-l-2 border-[var(--mkt-blue)] pl-5 lg:col-span-5"
          >
            <p className="text-base leading-7 text-[var(--mkt-text)] md:text-lg">
              “{quote.quote}”
            </p>
            <footer className="mt-4 text-sm text-[var(--mkt-muted)]">
              <span className="font-medium text-[var(--mkt-navy)]">
                {quote.name}
              </span>
              <span className="mx-2 text-[var(--mkt-border)]">·</span>
              {quote.org}
            </footer>
          </motion.blockquote>
        </div>
      </div>
    </section>
  );
}
