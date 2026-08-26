"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

import EditorialHeading from "@/components/marketing/EditorialHeading";
import SectionLabel from "@/components/marketing/SectionLabel";

const oracleAreas = [
  "Oracle Fusion Cloud",
  "Financials",
  "Procurement & SCM",
  "HCM",
  "EPM",
  "Projects & PPM",
  "OIC & Integration",
  "Analytics",
];

const lifecycle = [
  "Discover",
  "Design",
  "Implement",
  "Integrate",
  "Test",
  "Adopt",
  "Operate",
];

export default function OracleFeature() {
  return (
    <section id="oracle" className="mkt-section bg-[var(--mkt-cloud)]">
      <div className="mkt-shell">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-5">
            <SectionLabel tone="blue">Oracle</SectionLabel>

            <motion.div
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.7 }}
              className="mt-8"
            >
              <EditorialHeading className="max-w-xl text-[var(--mkt-navy)]">
                Transform the enterprise.
                <br />
                Not just the software.
              </EditorialHeading>

              <p className="mkt-body-lg mt-8 max-w-md">
                Modernize finance, procurement, supply chain, HR, projects,
                planning, integration, and analytics through connected Oracle
                enterprise platforms.
              </p>

              <Link href="/oracle" className="ca-button-primary mt-10">
                Explore Oracle
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="lg:col-span-7"
          >
            <OracleProductVisual />
          </motion.div>
        </div>

        <div className="mt-16 border-t border-[var(--mkt-border)]">
          <div className="grid md:grid-cols-2 lg:grid-cols-4">
            {oracleAreas.map((area, index) => (
              <motion.div
                key={area}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.04 }}
                className="group border-b border-[var(--mkt-border)] py-7 md:border-r md:px-6 md:[&:nth-child(2n)]:border-r-0 lg:[&:nth-child(2n)]:border-r lg:[&:nth-child(4n)]:border-r-0"
              >
                <p className="text-sm text-[var(--mkt-muted)]">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <p className="mt-3 text-lg font-medium text-[var(--mkt-navy)] transition-colors duration-200 group-hover:text-[var(--mkt-blue)]">
                  {area}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="mt-14 border-t border-[var(--mkt-border)] pt-10">
          <p className="mkt-eyebrow text-[var(--mkt-muted)]">End-to-end delivery</p>
          <div className="mt-8 flex flex-wrap gap-x-8 gap-y-4">
            {lifecycle.map((item, index) => (
              <div key={item} className="flex items-center gap-8">
                <span className="text-sm font-medium text-[var(--mkt-text)]">
                  {item}
                </span>
                {index < lifecycle.length - 1 && (
                  <span aria-hidden="true" className="text-[var(--mkt-border)]">
                    →
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function OracleProductVisual() {
  return (
    <div className="overflow-hidden border border-[var(--mkt-border)] bg-white shadow-[0_24px_80px_rgba(16,42,67,0.08)]">
      <div className="flex items-center justify-between border-b border-[var(--mkt-border)] px-5 py-3">
        <div className="flex items-center gap-3">
          <span className="text-[0.65rem] font-semibold tracking-[0.14em] text-[var(--mkt-navy)]">
            ENTERPRISE OPERATIONS
          </span>
          <span className="rounded bg-[var(--mkt-cloud)] px-2 py-0.5 text-[0.6rem] text-[var(--mkt-blue)]">
            Oracle Fusion
          </span>
        </div>
        <span className="text-[0.65rem] text-[var(--mkt-muted)]">
          Finance · Period close
        </span>
      </div>

      <div className="grid gap-px bg-[var(--mkt-border)] md:grid-cols-3">
        {[
          { label: "Financials", value: "Healthy", tone: "ok" },
          { label: "Procurement", value: "94%", tone: "metric" },
          { label: "Projects", value: "27", tone: "metric" },
        ].map((card) => (
          <div key={card.label} className="bg-white p-5">
            <p className="text-[0.65rem] uppercase tracking-[0.12em] text-[var(--mkt-muted)]">
              {card.label}
            </p>
            <p className="mt-3 flex items-center gap-2 text-2xl font-medium tracking-[-0.03em] text-[var(--mkt-navy)]">
              {card.tone === "ok" ? (
                <span className="h-2 w-2 rounded-full bg-[var(--mkt-success)]" />
              ) : null}
              {card.value}
            </p>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-[1.2fr_0.8fr]">
        <div className="border-b border-[var(--mkt-border)] p-5 md:border-b-0 md:border-r">
          <p className="text-[0.65rem] uppercase tracking-[0.12em] text-[var(--mkt-muted)]">
            Integration
          </p>
          <p className="mt-3 text-sm font-medium text-[var(--mkt-success)]">
            Active
          </p>
          <div className="mt-6 space-y-3">
            {[
              { name: "Auto-approved POs", pct: 74 },
              { name: "Period close tasks", pct: 86 },
            ].map((row) => (
              <div key={row.name}>
                <div className="mb-1 flex justify-between text-xs text-[var(--mkt-muted)]">
                  <span>{row.name}</span>
                  <span>{row.pct}%</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-[var(--mkt-cloud)]">
                  <div
                    className="h-full bg-[var(--mkt-blue)]"
                    style={{ width: `${row.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="p-5">
          <p className="text-[0.65rem] uppercase tracking-[0.12em] text-[var(--mkt-muted)]">
            Revenue
          </p>
          <p className="mt-3 text-3xl font-medium tracking-[-0.03em] text-[var(--mkt-navy)]">
            $24.8M
          </p>
          <p className="mt-2 text-sm text-[var(--mkt-muted)]">
            Period-to-date · OTBI
          </p>
        </div>
      </div>
    </div>
  );
}
