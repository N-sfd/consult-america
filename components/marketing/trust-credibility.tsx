"use client";

import { motion } from "framer-motion";

import { deliveryPhases, heroStats } from "@/lib/site-data";

export default function TrustCredibility() {
  return (
    <section
      id="trust"
      className="border-y border-[var(--mkt-border)] bg-[var(--mkt-white)] py-10 md:py-12"
    >
      <div className="mkt-shell">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 gap-y-6 divide-y divide-[var(--mkt-border)] sm:grid-cols-3 sm:gap-x-8 sm:gap-y-0 sm:divide-y-0 sm:divide-x"
        >
          {heroStats.map((stat) => (
            <div
              key={stat.value + stat.detail}
              className="pt-6 first:pt-0 sm:px-8 sm:pt-0 sm:first:pl-0"
            >
              <p className="text-lg font-medium tracking-[-0.03em] text-[var(--mkt-navy)] md:text-xl">
                {stat.value}
                {stat.label ? (
                  <span className="ml-2 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-[var(--mkt-muted)]">
                    {stat.label}
                  </span>
                ) : null}
              </p>
              <p className="mt-1.5 text-sm text-[var(--mkt-muted)]">
                {stat.detail}
              </p>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: 0.06 }}
          className="mt-8 flex flex-wrap items-center gap-x-2 gap-y-2 border-t border-[var(--mkt-border)] pt-6"
        >
          <span className="mkt-eyebrow mr-2 text-[var(--mkt-muted)]">
            Enterprise Delivery
          </span>
          {deliveryPhases.map((phase, index) => (
            <span key={phase} className="flex items-center gap-2 text-sm">
              <span className="font-medium text-[var(--mkt-navy)]">{phase}</span>
              {index < deliveryPhases.length - 1 && (
                <span className="text-[var(--mkt-border)]">→</span>
              )}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
