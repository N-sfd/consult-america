"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

import SectionLabel from "@/components/marketing/SectionLabel";

export default function SpecialistShowcase() {
  return (
    <section id="specialists" className="mkt-section bg-[var(--mkt-ice)]">
      <div className="mkt-shell">
        <SectionLabel tone="dark">Specialist capabilities</SectionLabel>
        <h2 className="mkt-section-heading mt-5 text-[var(--mkt-navy)]">
          Depth where it matters most.
        </h2>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <motion.article
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="border border-[var(--mkt-border)] bg-[var(--mkt-cloud)] p-6 md:p-8"
          >
            <p className="mkt-eyebrow text-[var(--mkt-blue)]">Oracle</p>
            <h3 className="mt-4 mkt-h3 text-[var(--mkt-navy)]">
              Transform the enterprise.
              <br />
              Not just the software.
            </h3>
            <p className="mkt-body mt-4">
              Finance, procurement, HCM, projects, integration, and analytics
              through connected Oracle Cloud platforms.
            </p>

            <div className="mt-8 overflow-hidden border border-[var(--mkt-border)] bg-white">
              <div className="flex items-center justify-between border-b border-[var(--mkt-border)] px-4 py-3">
                <span className="text-[0.65rem] font-semibold tracking-[0.12em] text-[var(--mkt-navy)]">
                  ENTERPRISE OPERATIONS
                </span>
                <span className="text-[0.6rem] uppercase tracking-[0.1em] text-[var(--mkt-muted)]">
                  Illustrative
                </span>
              </div>
              <div className="grid grid-cols-3 gap-px bg-[var(--mkt-border)]">
                {[
                  ["Financials", "Healthy"],
                  ["Procurement", "On track"],
                  ["Projects", "Active"],
                ].map(([label, value]) => (
                  <div key={label} className="bg-white p-3">
                    <p className="text-[0.65rem] uppercase tracking-[0.1em] text-[var(--mkt-muted)]">
                      {label}
                    </p>
                    <p className="mt-1 text-sm font-medium text-[var(--mkt-navy)]">
                      {value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <p className="mt-3 text-xs text-[var(--mkt-muted)]">
              Illustrative example — not client production data.
            </p>

            <Link href="/oracle" className="ca-link mt-6 w-fit">
              Explore Oracle
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </motion.article>

          <motion.article
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.08 }}
            className="border border-[var(--mkt-border)] bg-[var(--mkt-ice-soft)] p-6 md:p-8"
          >
            <p className="mkt-eyebrow text-[var(--mkt-blue)]">AI + Data</p>
            <h3 className="mt-4 mkt-h3 text-[var(--mkt-navy)]">
              Move from experiments to enterprise intelligence.
            </h3>
            <p className="mkt-body mt-4">
              Document intelligence, agents, search, and data engineering built
              for production governance.
            </p>

            <div className="mt-8 overflow-hidden border border-[var(--mkt-border)] bg-white shadow-[0_12px_40px_rgba(16,42,67,0.06)]">
              <div className="flex items-center justify-between border-b border-[var(--mkt-border)] px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[var(--mkt-blue)]" />
                  <span className="text-xs font-medium text-[var(--mkt-navy)]">
                    Data Agent
                  </span>
                </div>
                <span className="text-[0.6rem] uppercase tracking-[0.1em] text-[var(--mkt-muted)]">
                  Illustrative
                </span>
              </div>
              <div className="grid grid-cols-2 gap-px bg-[var(--mkt-border)]">
                {[
                  ["Document extraction", "Complete"],
                  ["Clause detection", "Active"],
                  ["Risk review", "Ready"],
                  ["Source validation", "Enabled"],
                ].map(([label, value]) => (
                  <div key={label} className="bg-white p-3">
                    <p className="text-[0.65rem] uppercase tracking-[0.1em] text-[var(--mkt-muted)]">
                      {label}
                    </p>
                    <p className="mt-1 text-sm font-medium text-[var(--mkt-navy)]">
                      {value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <p className="mt-3 text-xs text-[var(--mkt-muted)]">
              Illustrative example — not client production data.
            </p>

            <Link href="/ai-data" className="ca-link mt-6 w-fit">
              Explore AI & Data
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </motion.article>
        </div>
      </div>
    </section>
  );
}
