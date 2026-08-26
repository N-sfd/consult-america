"use client";

import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

import { useContactPanel } from "@/components/providers/contact-provider";

export default function GrowthCta() {
  const { setOpen } = useContactPanel();

  return (
    <section className="mkt-section relative overflow-hidden border-t border-white/10 bg-[var(--mkt-blue)] text-white">
      <div
        aria-hidden="true"
        className="mkt-grid-drift pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.75) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.75) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[38rem] w-[38rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/10 blur-[140px]"
      />

      <div className="mkt-shell relative z-10 flex flex-col items-center py-4 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mkt-hero-heading max-w-4xl !text-white"
        >
          Ready to move from
          <br />
          strategy to execution?
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="mkt-body-lg mt-8 max-w-lg !text-white/80"
        >
          Let&apos;s build what&apos;s next.
        </motion.p>

        <motion.button
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, delay: 0.28 }}
          type="button"
          onClick={() => setOpen(true)}
          className="group/cta ca-button-light mt-14 !min-h-[3.5rem] !px-9 text-base"
        >
          Start a conversation
          <ArrowUpRight className="mkt-cta-arrow h-5 w-5" />
        </motion.button>
      </div>

      <div
        className="absolute inset-x-0 bottom-0 h-[2px] w-full bg-white/25"
        aria-hidden="true"
      />
    </section>
  );
}
