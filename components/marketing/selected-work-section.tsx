"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

import SectionLabel from "@/components/marketing/SectionLabel";

const caseStudies = [
  {
    industry: "Public-Sector Organization",
    headline: "Oracle Fusion Cloud Modernization & Core Financials Cutover",
    challenge: "Fragmented legacy ERP systems across 12 agencies causing delayed reporting and manual reconciliations.",
    solution: "Designed and deployed a unified Oracle Fusion Cloud financial core with automated period-close workflows.",
    technology: "Oracle ERP Cloud · OIC · Fusion Data Intelligence",
    outcome: "70% acceleration in monthly close with complete audit transparency and zero cutover downtime.",
    linkHref: "/work",
  },
  {
    industry: "Defense & Aerospace Enterprise",
    headline: "Autonomous Contract Intelligence & Regulatory Clause Parsing",
    challenge: "Complex multi-thousand page subcontracts requiring manual compliance verification across federal regulations.",
    solution: "Deployed Data Agent platform to automatically extract, ground, and verify DFARS clauses with 100% source citations.",
    technology: "Data Agent · Document AI · Vector Retrieval · Oracle ERP",
    outcome: "99.8% extraction accuracy and 85% reduction in contract review cycle times.",
    linkHref: "/work/innovation/data-agent",
  },
  {
    industry: "Healthcare Technology Concept",
    headline: "AI-Enabled Clinical Intelligence & Patient Visit Preparation",
    challenge: "High clinician cognitive load synthesizing disparate patient records, lab histories, and medication changes.",
    solution: "Engineered MediGuide AI to summarize clinical timelines and generate grounded, evidence-backed patient guidance.",
    technology: "MediGuide AI · Clinical NLP · FHIR APIs · Voice Synthesis",
    outcome: "88% faster clinical chart review with fully verified source evidence for every recommendation.",
    linkHref: "/work/innovation/mediguide-ai",
  },
  {
    industry: "Financial Services Institution",
    headline: "Enterprise CRM & Revenue Workspace Modernization",
    challenge: "Siloed customer interaction records and disconnected sales pipelines slowing deal execution.",
    solution: "Implemented custom CRM Workspace integrated with transactional accounting and predictive deal telemetry.",
    technology: "CRM Platform · Real-time REST APIs · Predictive Revenue Models",
    outcome: "Unified Customer 360 view across 45,000 corporate accounts and 40% faster deal cycle progression.",
    linkHref: "/platforms/crm",
  },
];

export default function SelectedWorkSection() {
  return (
    <section id="selected-work" className="bg-[#FFFDF8] text-[#261F1B] py-20 sm:py-24 lg:py-28 border-b border-[#D7CCBD]">
      <div className="mkt-shell">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end pb-10 border-b border-[#D7CCBD]">
          <div>
            <SectionLabel tone="burgundy">CASE STUDIES</SectionLabel>
            <h2 className="mt-3 font-serif text-3xl font-semibold tracking-tight text-[#261F1B] sm:text-4xl lg:text-5xl">
              Selected work
            </h2>
          </div>

          <Link
            href="/work"
            className="group inline-flex items-center gap-1.5 text-sm font-semibold text-[#7D2639] hover:text-[#681F30]"
          >
            <span>Explore all case studies</span>
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        {/* 16:9 Editorial Case Study Cards */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
          {caseStudies.map((cs, idx) => (
            <motion.article
              key={cs.headline}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              className="group flex flex-col justify-between rounded-2xl border border-[#D7CCBD] bg-[#FFFAF2] p-7 transition-all duration-200 hover:border-[#7D2639]/40 hover:bg-[#FFFDF8] hover:shadow-[0_12px_36px_rgba(38,31,27,0.06)]"
            >
              <div>
                <span className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#7D2639]">
                  {cs.industry}
                </span>

                <h3 className="mt-2.5 font-serif text-xl sm:text-2xl font-bold text-[#261F1B] group-hover:text-[#7D2639] transition-colors leading-snug">
                  {cs.headline}
                </h3>

                <div className="mt-5 space-y-3 text-xs leading-relaxed">
                  <div>
                    <strong className="text-[#261F1B]">Challenge:</strong>{" "}
                    <span className="text-[#695F57]">{cs.challenge}</span>
                  </div>
                  <div>
                    <strong className="text-[#261F1B]">Solution:</strong>{" "}
                    <span className="text-[#695F57]">{cs.solution}</span>
                  </div>
                  <div>
                    <strong className="text-[#261F1B]">Technology:</strong>{" "}
                    <span className="font-mono text-[#657766]">{cs.technology}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[#D7CCBD]/80 flex items-center justify-between">
                <div>
                  <span className="block text-[0.62rem] uppercase tracking-wider text-[#695F57]">Outcome</span>
                  <span className="text-xs font-bold text-[#261F1B]">{cs.outcome}</span>
                </div>
                <Link
                  href={cs.linkHref}
                  className="rounded-full bg-[#FFFDF8] p-2 border border-[#D7CCBD] group-hover:border-[#7D2639] group-hover:bg-[#7D2639] group-hover:text-white transition-all text-[#261F1B]"
                  aria-label="View case study details"
                >
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
