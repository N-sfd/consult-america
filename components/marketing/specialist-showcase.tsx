"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

import DataAgentScreenshot from "@/components/marketing/DataAgentScreenshot";
import OracleArchitectureDiagram from "@/components/marketing/OracleArchitectureDiagram";
import SectionLabel from "@/components/marketing/SectionLabel";

export default function SpecialistShowcase() {
  return (
    <section id="specialists" className="mkt-section bg-[var(--mkt-ice)]">
      <div className="mkt-shell">
        <SectionLabel tone="dark">Specialist capabilities</SectionLabel>
        <h2 className="mkt-section-heading mt-5 text-[var(--mkt-navy)]">
          Depth where it matters most.
        </h2>

        <div className="mt-10 flex flex-col gap-8 lg:gap-10">
          <motion.article
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="border border-[var(--mkt-border)] bg-[var(--mkt-cloud)] p-6 md:p-8"
          >
            <div className="flex flex-col gap-8 lg:grid lg:grid-cols-2 lg:items-start lg:gap-10">
              <div>
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
                <Link href="/oracle" className="ca-link mt-6 w-fit">
                  Explore Oracle
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
              <OracleArchitectureDiagram compact />
            </div>
          </motion.article>

          <motion.article
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.08 }}
            className="border border-[var(--mkt-border)] bg-[var(--mkt-ice-soft)] p-6 md:p-8"
          >
            <div className="flex flex-col gap-8 lg:grid lg:grid-cols-2 lg:items-start lg:gap-10">
              <div>
                <p className="mkt-eyebrow text-[var(--mkt-blue)]">AI + Data</p>
                <h3 className="mt-4 mkt-h3 text-[var(--mkt-navy)]">
                  Move from experiments to enterprise intelligence.
                </h3>
                <p className="mkt-body mt-4">
                  Document intelligence, agents, search, and data engineering
                  built for production governance.
                </p>
                <ul className="mt-5 space-y-2 text-sm text-[var(--mkt-muted)]">
                  {[
                    "Document Intelligence",
                    "AI Agents",
                    "Enterprise Search",
                    "Data Engineering",
                  ].map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <Link href="/ai-data" className="ca-link mt-6 w-fit">
                  Explore AI & Data
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
              <DataAgentScreenshot />
            </div>
          </motion.article>
        </div>
      </div>
    </section>
  );
}
