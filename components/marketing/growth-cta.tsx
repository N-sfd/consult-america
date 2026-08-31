"use client";

import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

import { useContactPanel } from "@/components/providers/contact-provider";

export default function GrowthCta() {
  const { setOpen } = useContactPanel();

  return (
    <section className="mkt-section bg-[#7D2639] text-white">
      <div className="mkt-shell">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
          >
            <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#D8C5AA]">
              Start Transforming
            </span>
            <h2 className="mt-3 max-w-xl text-3xl font-bold tracking-[-0.03em] text-white md:text-4xl lg:text-5xl">
              Ready to move from plan to production?
            </h2>
            <p className="mt-3 max-w-md text-base leading-relaxed text-[#F1DCE1] md:text-lg">
              Let&apos;s talk about your Oracle, AI, CRM, and enterprise platform roadmap.
            </p>
          </motion.div>

          <button
            type="button"
            onClick={() => setOpen(true)}
            className="group/cta inline-flex items-center justify-center gap-2 rounded-lg bg-[#FFFDF8] px-6 py-3.5 text-base font-bold text-[#7D2639] transition-all hover:bg-[#FFFAF2] hover:text-[#681F30] hover:shadow-lg shrink-0"
          >
            Start a conversation
            <ArrowUpRight className="mkt-cta-arrow h-4.5 w-4.5" />
          </button>
        </div>
      </div>
    </section>
  );
}
