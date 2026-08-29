"use client";

import { motion } from "framer-motion";

import { heroStats } from "@/lib/site-data";

export default function TrustCredibility() {
  return (
    <section
      id="trust"
      className="border-y border-[var(--mkt-border)] bg-[var(--mkt-white)] py-4 sm:py-5"
    >
      <div className="mkt-shell">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="flex flex-col items-start justify-between gap-4 divide-y divide-[var(--mkt-border)] sm:flex-row sm:items-center sm:divide-y-0 sm:divide-x"
        >
          {heroStats.map((stat, index) => (
            <div
              key={stat.value + stat.detail}
              className={`flex w-full items-baseline justify-between gap-3 pt-3 sm:w-auto sm:flex-1 sm:justify-center sm:pt-0 ${
                index > 0 ? "sm:pl-6 lg:pl-8" : ""
              }`}
            >
              <div className="flex items-baseline gap-2">
                <span className="text-base font-semibold tracking-[-0.02em] text-[var(--mkt-navy)] sm:text-lg">
                  {stat.value}
                </span>
                {stat.label ? (
                  <span className="text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-[var(--mkt-dim)]">
                    {stat.label}
                  </span>
                ) : null}
              </div>
              <span className="text-xs text-[var(--mkt-muted)] sm:text-sm">
                {stat.detail}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
