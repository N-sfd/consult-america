"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";
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
  { name: "INGEST", detail: "PDF · Scans · Contracts", style: "bg-[#657766]/25 text-[#DFE4DA] border border-[#657766]/50" },
  { name: "EXTRACT", detail: "Deterministic + Gemini AI", style: "bg-[#D8C5AA]/20 text-[#D8C5AA] border border-[#D8C5AA]/45" },
  { name: "VERIFY", detail: "Source-grounded citations", style: "bg-[#7D2639]/35 text-[#F7F0E7] border border-[#7D2639]/60" },
  { name: "REVIEW", detail: "Human audit workflow", style: "bg-[#657766]/25 text-[#DFE4DA] border border-[#657766]/50" },
  { name: "ANALYZE", detail: "FAR/DFARS compliance", style: "bg-[#D8C5AA]/20 text-[#D8C5AA] border border-[#D8C5AA]/45" },
  { name: "INTEGRATE", detail: "Oracle ERP / REST API", style: "bg-[#7D2639]/35 text-[#F7F0E7] border border-[#7D2639]/60" },
];

export default function InnovationPreview() {
  const products = listInnovationProducts();
  const dataAgent = products.find((p) => p.slug === "data-agent") ?? products[0];

  if (!dataAgent) return null;

  return (
    <section id="innovation" className="mkt-section bg-[#2B2420] text-[#F7F0E7]">
      <div className="mkt-shell">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <SectionLabel tone="light">Enterprise AI Flagship</SectionLabel>
            <h2 className="mkt-section-heading mt-4 text-[#F7F0E7]">
              ConsultAmerica Data Agent
            </h2>
          </div>
          <Link
            href="/work/innovation/data-agent"
            className="ca-link text-sm font-semibold text-[#D8C5AA] hover:text-[#F7F0E7]"
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
          className="ca-app-window-dark mt-10 grid overflow-hidden border border-[#6F6259] bg-[#342B27] lg:grid-cols-12"
        >
          {/* Left specification */}
          <div className="flex flex-col justify-between p-6 sm:p-8 lg:col-span-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-[#7D2639] px-2.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-[0.1em] text-white">
                  Flagship Software
                </span>
                <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[#D8C5AA]">
                  Contract &amp; Document Intelligence
                </span>
              </div>

              <h3 className="mt-4 text-2xl font-bold tracking-[-0.02em] text-[#F7F0E7] sm:text-3xl">
                Automated document extraction with verified citations.
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[#CFC4BA]">
                Autonomous multi-modal AI engine that ingests enterprise documents,
                extracts structured data with pixel-precise citation grounding, and
                integrates directly with Oracle ERP and business workflows.
              </p>

              {/* 6-Stage Pipeline with Exact Workflow Accents */}
              <div className="mt-6 rounded-xl border border-[#6F6259] bg-[#2B2420] p-4">
                <p className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#CFC4BA]">
                  Architecture Lifecycle
                </p>
                <div className="mt-3 grid grid-cols-3 gap-1.5 sm:grid-cols-6 text-center">
                  {FLOW_STEPS.map((step) => (
                    <div
                      key={step.name}
                      className={`rounded-lg p-2 text-xs font-bold ${step.style}`}
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
                    className="flex items-center gap-2 text-xs font-medium text-[#F7F0E7]"
                  >
                    <CheckCircle2 className="h-4 w-4 text-[#657766] shrink-0" />
                    <span>{pillar}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 border-t border-[#6F6259]/60 pt-5 flex flex-wrap items-center justify-between gap-4">
              <Link
                href="/work/innovation/data-agent"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#FFFAF2] px-4 py-2.5 text-xs font-bold text-[#7D2639] transition-all hover:bg-white hover:text-[#681F30]"
              >
                Explore Data Agent Platform
                <ArrowUpRight className="h-4 w-4" />
              </Link>
              <Link
                href="/work/innovation"
                className="text-xs font-semibold text-[#CFC4BA] hover:text-[#F7F0E7]"
              >
                All Innovation R&amp;D →
              </Link>
            </div>
          </div>

          {/* Right Product Screenshot Framed in Warm Neutral */}
          <div className="relative min-h-[320px] border-t border-[#6F6259] sm:min-h-[400px] lg:col-span-6 lg:border-t-0 lg:border-l bg-[#2B2420]">
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
