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
          className="grid grid-cols-1 gap-y-5 divide-y divide-[var(--mkt-border)] sm:grid-cols-2 sm:gap-x-8 sm:gap-y-8 sm:divide-y-0 xl:grid-cols-4 xl:gap-x-0 xl:divide-x"
        >
          {heroStats.map((stat) => (
            <div
              key={stat.value + stat.label}
              className="pt-5 first:pt-0 sm:pt-0 xl:border-[var(--mkt-border)] xl:pl-8 xl:first:border-l-0 xl:first:pl-0"
            >
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
          <p
            className="max-w-[850px] leading-[1.45] tracking-[-0.015em] text-[var(--mkt-text)]"
            style={{ fontSize: "clamp(1.2rem, 1.6vw, 1.625rem)" }}
          >
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
