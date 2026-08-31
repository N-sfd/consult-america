"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

import SectionLabel from "@/components/marketing/SectionLabel";

const caseStudies = [
  {
    industry: "PUBLIC SECTOR & GOVERNMENT",
    headline: "Multi-Entity Fusion Cloud Modernization & Core Financials Cutover",
    challenge: "Fragmented legacy ERP systems across multiple agencies causing delayed financial reporting and manual consolidations.",
    solution: "Designed and deployed a unified Oracle Fusion Cloud financial core with automated subledger reconciliation.",
    technology: "Oracle ERP Cloud · OIC Integration · Fusion Data Intelligence",
    outcome: "Streamlined monthly close operations with zero cutover downtime and complete audit compliance.",
    image: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1000&q=80",
    href: "/work",
  },
  {
    industry: "DEFENSE & AEROSPACE CONTRACTING",
    headline: "Autonomous Contract Intelligence & Regulatory Clause Verification",
    challenge: "Complex multi-thousand page subcontracts requiring manual compliance verification across federal regulations.",
    solution: "Deployed Data Agent platform to automatically extract, ground, and verify DFARS clauses with direct citations.",
    technology: "Data Agent · Document AI · Vector Retrieval · Oracle ERP",
    outcome: "Accelerated regulatory contract review with verified, auditable source-grounded evidence.",
    image: "https://images.unsplash.com/photo-1517976487502-8693c0429f55?auto=format&fit=crop&w=1000&q=80",
    href: "/work/innovation/data-agent",
  },
  {
    industry: "HEALTHCARE & LIFE SCIENCES",
    headline: "Clinical Documentation Intelligence & Longitudinal Patient Summaries",
    challenge: "High clinician cognitive load synthesizing disparate patient records, lab histories, and medication changes.",
    solution: "Engineered MediGuide AI to summarize clinical timelines and generate grounded, evidence-backed patient visit preparation.",
    technology: "MediGuide AI · Clinical NLP · FHIR APIs · Voice Synthesis",
    outcome: "Synthesized clinical record timelines with verified physician point-of-care citations.",
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1000&q=80",
    href: "/work/innovation/mediguide-ai",
  },
  {
    industry: "FINANCIAL SERVICES & BANKING",
    headline: "Enterprise CRM & Unified Revenue Operations Workspace",
    challenge: "Siloed customer interaction records and disconnected sales pipelines slowing strategic account execution.",
    solution: "Implemented custom Customer 360 Workspace integrated with transactional accounting and predictive account health telemetry.",
    technology: "CRM Platform · Real-time REST APIs · Predictive Revenue Models",
    outcome: "Unified Customer 360 engagement with automated transactional ERP reconciliation.",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1000&q=80",
    href: "/platforms/crm",
  },
];

export default function SelectedWorkSection() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="selected-work" className="bg-[#FFFDF8] text-[#261F1B] py-24 sm:py-28 lg:py-32 border-b border-[#D7CCBD]">
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

        {/* 2-Column Editorial Cards (45% Image / 55% Content) */}
        <div className="mt-14 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
          {caseStudies.map((cs, idx) => (
            <motion.article
              key={cs.headline}
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              className="group overflow-hidden rounded-2xl border border-[#D7CCBD] bg-[#FFFAF2] shadow-[0_12px_36px_rgba(38,31,27,0.06)] hover:border-[#7D2639]/40 transition-all flex flex-col justify-between"
            >
              {/* Image (~45% aspect) */}
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#211E1B]">
                <Image
                  src={cs.image}
                  alt={cs.headline}
                  fill
                  className="object-cover mkt-img-graded transition-transform duration-700 group-hover:scale-103"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#211E1B]/80 via-transparent to-transparent" />
                <span className="absolute bottom-3 left-4 rounded-full bg-white/10 backdrop-blur-md px-3 py-1 text-[0.62rem] font-bold uppercase tracking-wider text-[#D8C5AA] border border-white/15">
                  {cs.industry}
                </span>
              </div>

              {/* Content (~55%) */}
              <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-5">
                <div>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#261F1B] group-hover:text-[#7D2639] transition-colors leading-snug">
                    {cs.headline}
                  </h3>

                  <div className="mt-4 space-y-2.5 text-xs sm:text-sm leading-relaxed text-[#695F57]">
                    <p>
                      <strong className="text-[#261F1B]">Challenge:</strong> {cs.challenge}
                    </p>
                    <p>
                      <strong className="text-[#261F1B]">Solution:</strong> {cs.solution}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#D7CCBD]/80 flex items-center justify-between">
                  <div>
                    <span className="block text-[0.62rem] uppercase tracking-wider text-[#695F57]">Production Outcome</span>
                    <span className="text-xs sm:text-sm font-bold text-[#261F1B]">{cs.outcome}</span>
                  </div>
                  <Link
                    href={cs.href}
                    className="rounded-full bg-white p-2.5 border border-[#D7CCBD] group-hover:border-[#7D2639] group-hover:bg-[#7D2639] group-hover:text-white transition-all text-[#261F1B]"
                    aria-label="View case study"
                  >
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
