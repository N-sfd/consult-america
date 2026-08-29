"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, CheckCircle2, ShieldCheck, Database, FileSearch, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

import SectionLabel from "@/components/marketing/SectionLabel";
import { listInnovationProducts } from "@/data/innovation-products";

const DATA_AGENT_PILLARS = [
  "Source-Grounded Evidence",
  "Human-in-the-Loop Review",
  "Oracle Cloud ERP Integration",
  "REST APIs & n8n Workflows",
];

const FLOW_STEPS = [
  { name: "INGEST", detail: "PDF · Scans · Contracts" },
  { name: "EXTRACT", detail: "Deterministic + Gemini AI" },
  { name: "VERIFY", detail: "Source-grounded citations" },
  { name: "REVIEW", detail: "Human audit workflow" },
  { name: "ANALYZE", detail: "FAR/DFARS compliance" },
  { name: "INTEGRATE", detail: "Oracle ERP / REST API" },
];

export default function InnovationPreview() {
  const products = listInnovationProducts();
  const dataAgent = products.find((p) => p.slug === "data-agent") ?? products[0];

  if (!dataAgent) return null;

  return (
    <section id="innovation" className="mkt-section bg-[var(--mkt-white)]">
      <div className="mkt-shell">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <SectionLabel tone="blue">Enterprise AI Flagship</SectionLabel>
            <h2 className="mkt-section-heading mt-4 text-[var(--mkt-navy)]">
              ConsultAmerica Data Agent
            </h2>
          </div>
          <Link
            href="/work/innovation/data-agent"
            className="ca-link text-sm font-semibold"
          >
            Explore Data Agent Documentation
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Large Flagship Software Feature Card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="ca-app-window mt-10 grid overflow-hidden border border-[var(--mkt-border)] bg-[var(--mkt-cloud)] lg:grid-cols-12"
        >
          {/* Left specification */}
          <div className="flex flex-col justify-between p-6 sm:p-8 lg:col-span-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-[var(--mkt-blue)] px-2.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-[0.1em] text-white">
                  Flagship Software
                </span>
                <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--mkt-dim)]">
                  Contract &amp; Document Intelligence
                </span>
              </div>

              <h3 className="mt-4 text-2xl font-bold tracking-[-0.02em] text-[var(--mkt-navy)] sm:text-3xl">
                Automated document extraction with verified citations.
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--mkt-slate)]">
                Autonomous multi-modal AI engine that ingests enterprise documents,
                extracts structured data with pixel-precise citation grounding, and
                integrates directly with Oracle ERP and business workflows.
              </p>

              {/* 6-Stage Pipeline */}
              <div className="mt-6 rounded-xl border border-[var(--mkt-border)] bg-white p-4">
                <p className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[var(--mkt-dim)]">
                  Architecture Lifecycle
                </p>
                <div className="mt-3 grid grid-cols-3 gap-1.5 sm:grid-cols-6 text-center">
                  {FLOW_STEPS.map((step, idx) => (
                    <div
                      key={step.name}
                      className={`rounded-lg p-2 text-xs font-bold ${
                        idx === 5
                          ? "bg-[var(--mkt-blue)] text-white"
                          : "bg-[var(--mkt-cloud)] text-[var(--mkt-navy)]"
                      }`}
                    >
                      <p className="text-[0.68rem]">{step.name}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Key Capabilities */}
              <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {DATA_AGENT_PILLARS.map((pillar) => (
                  <div
                    key={pillar}
                    className="flex items-center gap-2 text-xs font-medium text-[var(--mkt-navy)]"
                  >
                    <CheckCircle2 className="h-4 w-4 text-[var(--mkt-blue)] shrink-0" />
                    <span>{pillar}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 border-t border-[var(--mkt-border)] pt-5 flex items-center justify-between">
              <Link
                href="/work/innovation/data-agent"
                className="ca-button-primary inline-flex text-xs font-semibold"
              >
                Explore Data Agent Platform
                <ArrowUpRight className="h-4 w-4" />
              </Link>
              <Link
                href="/work/innovation"
                className="text-xs font-semibold text-[var(--mkt-slate)] hover:text-[var(--mkt-blue)]"
              >
                All Innovation R&amp;D →
              </Link>
            </div>
          </div>

          {/* Right Product Screenshot */}
          <div className="relative min-h-[320px] border-t border-[var(--mkt-border)] sm:min-h-[400px] lg:col-span-6 lg:border-t-0 lg:border-l bg-white">
            <Image
              src={dataAgent.heroImage}
              alt={dataAgent.heroImageAlt}
              fill
              className="object-cover object-top"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
