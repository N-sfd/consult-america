"use client";

import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

import { useContactPanel } from "@/components/providers/contact-provider";

export default function ContactCTA({
  headline = "Ready to move from plan to production?",
}: {
  headline?: string;
}) {
  const { setOpen } = useContactPanel();

  return (
    <section className="mkt-section-compact bg-[var(--mkt-blue)] text-white">
      <div className="mkt-shell flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
        <motion.h2
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="max-w-2xl text-3xl font-medium tracking-[-0.035em] text-white md:text-4xl lg:text-5xl"
        >
          {headline}
        </motion.h2>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="group/cta ca-button-light shrink-0"
        >
          Start a conversation
          <ArrowUpRight className="mkt-cta-arrow h-4 w-4" />
        </button>
      </div>
    </section>
  );
}
