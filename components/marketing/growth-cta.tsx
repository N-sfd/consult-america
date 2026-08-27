"use client";

import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

import { useContactPanel } from "@/components/providers/contact-provider";

export default function GrowthCta() {
  const { setOpen } = useContactPanel();

  return (
    <section className="mkt-section-compact bg-[var(--mkt-blue)] text-white">
      <div className="mkt-shell">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
          >
            <h2 className="max-w-xl text-2xl font-medium tracking-[-0.035em] text-white md:text-3xl lg:text-4xl">
              Ready to move from plan to production?
            </h2>
            <p className="mt-4 max-w-md text-base leading-7 text-white/75 md:text-lg">
              Let&apos;s talk about what you&apos;re transforming.
            </p>
          </motion.div>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="group/cta ca-button-light shrink-0"
          >
            Start a conversation
            <ArrowUpRight className="mkt-cta-arrow h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
