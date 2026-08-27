"use client";

import { motion } from "framer-motion";

import { heroStats } from "@/lib/site-data";

export default function TrustCredibility() {
  return (
    <section
      id="trust"
      className="border-y border-[var(--mkt-border)] bg-[var(--mkt-white)] py-8 md:py-10"
    >
      <div className="mkt-shell">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 gap-y-5 divide-y divide-[var(--mkt-border)] md:grid-cols-2 md:gap-x-8 md:gap-y-6 md:divide-y-0 lg:grid-cols-3 lg:divide-x"
        >
          {heroStats.map((stat, index) => (
            <div
              key={stat.value + stat.detail}
              className={`pt-5 first:pt-0 md:pt-0 lg:px-8 lg:first:pl-0 ${
                index === 2 ? "md:col-span-2 lg:col-span-1" : ""
              }`}
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
      </div>
    </section>
  );
}
