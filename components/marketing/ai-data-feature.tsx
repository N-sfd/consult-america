"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import Container from "@/components/layout/container";
import Section from "@/components/layout/section";

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
      "Extract structured data, clauses, tables, specifications, and business context from complex enterprise documents.",
  },
  {
    number: "04",
    title: "Enterprise Search",
    description:
      "Create secure search experiences across contracts, policies, technical documents, knowledge bases, and business data.",
  },
];

export default function AiDataFeature() {
  return (
    <Section
      id="ai-data"
      className="relative overflow-hidden bg-[var(--ca-off-white)] text-[#05070d]"
    >
      <Container className="relative z-10">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <span className="ca-eyebrow text-black/45">AI & DATA</span>

            <motion.div
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.7 }}
              className="mt-8"
            >
              <h2 className="ca-h2 max-w-xl text-[#05070d]">
                Move from AI experiments
                <br />
                to enterprise intelligence.
              </h2>

              <p className="mt-8 max-w-md text-lg leading-8 text-black/65">
                Connect enterprise data, AI models, automation, and business
                workflows into intelligent systems that operate securely in
                production.
              </p>

              <Link href="/ai-data" className="ca-button-primary mt-10">
                Explore AI & Data
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </motion.div>

            <div className="mt-14 grid gap-6 sm:grid-cols-2">
              {aiAreas.map((area, index) => (
                <motion.article
                  key={area.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.5, delay: index * 0.04 }}
                  className="border-t border-black/10 pt-5"
                >
                  <p className="ca-eyebrow text-black/35">{area.number}</p>
                  <h3 className="mt-3 text-lg font-medium tracking-[-0.02em] text-[#05070d]">
                    {area.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-black/50">
                    {area.description}
                  </p>
                </motion.article>
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

        <AiCapabilityExplorer />
      </Container>
    </Section>
  );
}

const capabilityDetails = [
  {
    title: "Enterprise AI",
    description:
      "Apply AI to enterprise workflows, operations, knowledge, and decision-making with production readiness in mind.",
    metrics: [
      { label: "Workflows automated", value: "12" },
      { label: "Systems connected", value: "6" },
    ],
  },
  {
    title: "Generative AI",
    description:
      "Use language and multimodal models to generate, summarize, classify, and extract enterprise information.",
    metrics: [
      { label: "Documents summarized / mo", value: "1,204" },
      { label: "Accuracy", value: "96%" },
    ],
  },
  {
    title: "AI Agents",
    description:
      "Task-oriented agents that reason across systems, retrieve context, and automate actions for business teams.",
    metrics: [
      { label: "Active agents", value: "5" },
      { label: "Tasks per day", value: "340" },
    ],
  },
  {
    title: "Document Intelligence",
    description:
      "Extract structured data, clauses, tables, and business context from complex enterprise documents.",
    pipeline: true,
  },
  {
    title: "Enterprise Search",
    description:
      "Secure search across contracts, policies, technical documents, knowledge bases, and business data.",
    metrics: [
      { label: "Indexed documents", value: "18,400" },
      { label: "Avg query time", value: "220ms" },
    ],
  },
  {
    title: "Data Engineering",
    description:
      "Reliable pipelines, integrations, and data models that make enterprise information usable and trustworthy.",
    metrics: [
      { label: "Pipelines in production", value: "24" },
      { label: "Uptime", value: "99.95%" },
    ],
  },
  {
    title: "Analytics",
    description:
      "Turn operational and enterprise data into dashboards, insights, trends, and decision support.",
    metrics: [
      { label: "Dashboards", value: "31" },
      { label: "Data sources", value: "14" },
    ],
  },
  {
    title: "Automation",
    description:
      "Combine APIs, workflows, AI, and business rules to automate repetitive processes with people in control.",
    metrics: [
      { label: "Processes automated", value: "42" },
      { label: "Hours saved / mo", value: "1,860" },
    ],
  },
];

const extractionFields = [
  { field: "Solicitation No.", status: "check" },
  { field: "Contract No.", status: "check" },
  { field: "Project No.", status: "check" },
  { field: "Clauses", status: "38" },
  { field: "Tables", status: "12" },
];

function AiCapabilityExplorer() {
  const [active, setActive] = useState(3);
  const current = capabilityDetails[active];

  return (
    <div className="mt-20 border-t border-black/10 pt-14">
      <p className="ca-eyebrow text-black/40">ENTERPRISE AI</p>
      <h3 className="ca-h3 mt-4 max-w-xl text-[#05070d]">
        One practice, eight production capabilities.
      </h3>

      <div className="mt-10 grid gap-8 lg:grid-cols-12 lg:gap-14">
        <div className="flex flex-wrap content-start gap-2.5 lg:col-span-5">
          {capabilityDetails.map((capability, index) => (
            <button
              key={capability.title}
              type="button"
              onClick={() => setActive(index)}
              onMouseEnter={() => setActive(index)}
              className={`rounded-full border px-4 py-2 text-sm font-medium tracking-[-0.01em] transition-colors duration-200 ${
                active === index
                  ? "border-[var(--ca-blue)] bg-[var(--ca-blue)] text-white"
                  : "border-black/12 text-black/60 hover:border-black/25 hover:text-[#05070d]"
              }`}
            >
              {capability.title}
            </button>
          ))}
        </div>

        <div className="lg:col-span-7">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden rounded-lg border border-black/10 bg-white p-6 shadow-[0_24px_70px_rgba(5,7,13,0.08)] lg:p-7"
            >
              <p className="ca-eyebrow text-black/35">{current.title}</p>
              <p className="mt-3 max-w-md text-sm leading-6 text-black/55">
                {current.description}
              </p>

              {current.pipeline ? (
                <>
                  <div className="mt-6 flex flex-wrap items-center gap-2">
                    {["PDF", "Extraction", "Validation", "Enterprise Data"].map(
                      (step, i, arr) => (
                        <div key={step} className="flex items-center gap-2">
                          <span className="rounded border border-black/10 bg-[var(--ca-off-white)] px-2.5 py-1.5 text-xs font-medium text-black/70">
                            {step}
                          </span>
                          {i < arr.length - 1 && (
                            <span className="text-black/25">→</span>
                          )}
                        </div>
                      ),
                    )}
                  </div>

                  <div className="mt-5 overflow-hidden rounded border border-black/8">
                    {extractionFields.map((row) => (
                      <div
                        key={row.field}
                        className="flex items-center justify-between border-b border-black/6 px-3.5 py-2.5 text-sm last:border-0"
                      >
                        <span className="text-black/50">{row.field}</span>
                        <span
                          className={`font-medium ${
                            row.status === "check"
                              ? "text-emerald-600"
                              : "text-[#05070d]"
                          }`}
                        >
                          {row.status === "check" ? "✓" : row.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="mt-6 grid grid-cols-2 gap-4">
                  {current.metrics?.map((metric) => (
                    <div
                      key={metric.label}
                      className="border-t border-black/10 pt-3"
                    >
                      <p className="text-2xl font-semibold tracking-[-0.02em] text-[#05070d]">
                        {metric.value}
                      </p>
                      <p className="mt-1 text-xs text-black/45">
                        {metric.label}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function DataAgentScreen() {
  return (
    <div className="relative overflow-hidden border border-black/10 bg-white shadow-[0_32px_100px_rgba(5,7,13,0.1)]">
      <div className="flex items-center justify-between border-b border-black/8 bg-[#071A2F] px-5 py-3.5 text-white">
        <div className="flex items-center gap-3">
          <span className="flex h-6 w-6 items-center justify-center bg-[var(--ca-blue)] text-[0.6rem] font-bold">
            CA
          </span>
          <div>
            <p className="text-xs font-medium tracking-[0.06em]">DATA AGENT</p>
            <p className="text-[0.65rem] text-white/45">
              Contract & document intelligence
            </p>
          </div>
        </div>
        <div className="hidden items-center gap-4 text-[0.7rem] text-white/50 sm:flex">
          <span>Workspace</span>
          <span>History</span>
          <span className="rounded bg-white/10 px-2 py-1 text-white">Live</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
        <div className="border-b border-black/8 p-5 lg:border-b-0 lg:border-r">
          <p className="text-[0.65rem] uppercase tracking-[0.14em] text-black/40">
            Ask the agent
          </p>
          <div className="mt-4 space-y-3">
            <div className="border border-black/8 bg-[var(--ca-off-white)] px-4 py-3 text-sm text-black/70">
              Summarize renewal and liability terms across open MSAs for the
              State Health Agency portfolio.
            </div>
            <div className="border border-[var(--ca-blue)]/30 bg-[var(--ca-blue)]/[0.04] px-4 py-3 text-sm text-[#05070d]">
              Found 14 contracts. 3 renew within 90 days. Liability caps range
              from $2M–$10M. Highest risk: MSA-2024-8841 §12.4.
            </div>
          </div>

          <div className="mt-6">
            <p className="text-[0.65rem] uppercase tracking-[0.14em] text-black/40">
              Sources
            </p>
            <ul className="mt-3 space-y-2">
              {[
                "MSA-2024-8841.pdf",
                "Amendment-03.docx",
                "SOW-Health-Ops.pdf",
              ].map((file) => (
                <li
                  key={file}
                  className="flex items-center justify-between border-b border-black/6 py-2 text-sm"
                >
                  <span className="text-black/70">{file}</span>
                  <span className="text-[0.7rem] text-[var(--ca-blue)]">
                    Indexed
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="p-5">
          <p className="text-[0.65rem] uppercase tracking-[0.14em] text-black/40">
            Structured extraction
          </p>

          <div className="mt-4 overflow-hidden border border-black/8">
            <div className="grid grid-cols-3 border-b border-black/8 bg-[var(--ca-off-white)] text-[0.65rem] uppercase tracking-[0.1em] text-black/40">
              <span className="px-3 py-2">Field</span>
              <span className="px-3 py-2">Value</span>
              <span className="px-3 py-2">Confidence</span>
            </div>
            {[
              ["Counterparty", "State Health Agency", "98%"],
              ["Effective date", "2024-03-01", "97%"],
              ["Term", "36 months", "95%"],
              ["Auto-renewal", "Yes · 90-day notice", "93%"],
              ["Liability cap", "$5,000,000", "91%"],
              ["Governing law", "Maryland", "99%"],
            ].map(([field, value, conf]) => (
              <div
                key={field}
                className="grid grid-cols-3 border-b border-black/6 text-sm last:border-0"
              >
                <span className="px-3 py-2.5 text-black/45">{field}</span>
                <span className="px-3 py-2.5 font-medium text-[#05070d]">
                  {value}
                </span>
                <span className="px-3 py-2.5 text-[var(--ca-blue)]">{conf}</span>
              </div>
            ))}
          </div>

          <div className="mt-5 flex items-center gap-3">
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-black/8">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: "94%" }}
                viewport={{ once: true }}
                transition={{ duration: 1.1, ease: "easeOut" }}
                className="h-full bg-[var(--ca-blue)]"
              />
            </div>
            <span className="text-[0.7rem] text-black/45">
              Portfolio scan 94%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
