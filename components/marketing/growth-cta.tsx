"use client";

import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

import { useContactPanel } from "@/components/providers/contact-provider";

export default function GrowthCta() {
  const { setOpen } = useContactPanel();

  return (
    <section className="mkt-section bg-gradient-to-r from-[#2457f5] via-[#1b45c9] to-[#081a2f] text-white">
      <div className="mkt-shell">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
          >
            <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#2ea7ff]">
              Start Transforming
            </span>
            <h2 className="mt-3 max-w-xl text-2xl font-semibold tracking-[-0.035em] text-white md:text-3xl lg:text-4xl">
              Ready to move from plan to production?
            </h2>
            <p className="mt-3 max-w-md text-base leading-relaxed text-white/80 md:text-lg">
              Let&apos;s talk about your Oracle, AI, CRM, and enterprise platform roadmap.
            </p>
          </motion.div>

          <button
            type="button"
            onClick={() => setOpen(true)}
            className="group/cta ca-button-light shrink-0 text-base font-semibold"
          >
            Start a conversation
            <ArrowUpRight className="mkt-cta-arrow h-4.5 w-4.5" />
          </button>
        </div>
      </div>
    </section>
  );
}
