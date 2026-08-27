"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

import EditorialHeading from "@/components/marketing/EditorialHeading";
import SectionLabel from "@/components/marketing/SectionLabel";

const aiAreas = [
  {
    number: "01",
    title: "Enterprise AI",
    description:
      "Apply AI to enterprise workflows, operations, knowledge, and decision-making with production readiness in mind.",
  },
  {
    number: "02",
    title: "AI Agents",
    description:
      "Build task-oriented agents that can reason across systems, retrieve context, automate actions, and support business teams.",
  },
  {
    number: "03",
    title: "Document Intelligence",
    description:
      "Extract structured data, clauses, tables, and business context from complex enterprise documents.",
  },
  {
    number: "04",
    title: "Enterprise Search",
    description:
      "Create secure search experiences across contracts, policies, technical documents, and knowledge bases.",
  },
];

export default function AiDataFeature({
  headingLevel = "h2",
  linkToDetail = true,
}: {
  headingLevel?: "h1" | "h2";
  linkToDetail?: boolean;
}) {
  return (
    <section
      id="ai-data"
      className="mkt-section relative overflow-hidden bg-[var(--mkt-ice-soft)]"
    >
      <div className="mkt-shell relative z-10">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <SectionLabel tone="blue">AI & Data</SectionLabel>

            <motion.div
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.7 }}
              className="mt-8"
            >
              <EditorialHeading
                as={headingLevel}
                size={headingLevel === "h1" ? "hero" : "section"}
                className="max-w-xl text-[var(--mkt-navy)]"
              >
                Move from AI experiments
                <br />
                to enterprise intelligence.
              </EditorialHeading>

              <p className="mkt-body-lg mt-8 max-w-md">
                Connect enterprise data, AI models, automation, and business
                workflows into intelligent systems that operate securely in
                production.
              </p>

              {linkToDetail && (
                <Link href="/ai-data" className="ca-button-primary mt-10">
                  Explore AI & Data
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              )}
            </motion.div>

            <div className="mt-14 grid gap-6 sm:grid-cols-2">
              {aiAreas.map((area) => (
                <article
                  key={area.title}
                  className="border-t border-[var(--mkt-border)] pt-5"
                >
                  <p className="mkt-eyebrow text-[var(--mkt-muted)]">
                    {area.number}
                  </p>
                  <h3 className="mt-3 text-lg font-medium tracking-[-0.02em] text-[var(--mkt-navy)]">
                    {area.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-[var(--mkt-muted)]">
                    {area.description}
                  </p>
                </article>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="lg:col-span-7"
          >
            <DataAgentScreen />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function DataAgentScreen() {
  return (
    <div className="overflow-hidden border border-[var(--mkt-border)] bg-white shadow-[0_28px_80px_rgba(16,42,67,0.08)]">
      <div className="flex items-center justify-between border-b border-[var(--mkt-border)] px-5 py-3.5">
        <div className="flex items-center gap-3">
          <span className="flex h-2.5 w-2.5 rounded-full bg-[var(--mkt-blue)]" />
          <div>
            <p className="text-xs font-medium tracking-[0.06em] text-[var(--mkt-navy)]">
              ConsultAmerica AI
            </p>
            <p className="text-[0.65rem] text-[var(--mkt-muted)]">
              Contract intelligence
            </p>
          </div>
        </div>
        <span className="rounded bg-[var(--mkt-cloud)] px-2 py-1 text-[0.65rem] font-medium text-[var(--mkt-blue)]">
          Live
        </span>
      </div>

      <div className="grid gap-px bg-[var(--mkt-border)] sm:grid-cols-2 lg:grid-cols-4">
        {[
          ["Documents", "248"],
          ["Clauses", "38"],
          ["Risks", "12"],
          ["Confidence", "96%"],
        ].map(([label, value]) => (
          <div key={label} className="bg-white p-5">
            <p className="text-[0.65rem] uppercase tracking-[0.12em] text-[var(--mkt-muted)]">
              {label}
            </p>
            <p className="mt-2 text-3xl font-medium tracking-[-0.03em] text-[var(--mkt-navy)]">
              {value}
            </p>
          </div>
        ))}
      </div>

      <div className="p-5">
        <p className="text-[0.65rem] uppercase tracking-[0.12em] text-[var(--mkt-muted)]">
          Ask the agent
        </p>
        <div className="mt-4 space-y-3">
          <div className="border border-[var(--mkt-border)] bg-[var(--mkt-ice)] px-4 py-3 text-sm text-[var(--mkt-muted)]">
            Summarize renewal and liability terms across open MSAs.
          </div>
          <div className="border border-[var(--mkt-blue)]/25 bg-[var(--mkt-cloud)] px-4 py-3 text-sm text-[var(--mkt-navy)]">
            Found 14 contracts. 3 renew within 90 days. Highest risk:
            MSA-2024-8841 §12.4.
          </div>
        </div>
      </div>
    </div>
  );
}
