"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

import SectionLabel from "@/components/marketing/SectionLabel";
import { ClippedImage } from "@/components/marketing/image-system";

const showcases = [
  {
    type: "CLIENT ENGAGEMENT",
    industry: "PUBLIC SECTOR & GOVERNMENT",
    headline: "Multi-Entity Fusion Cloud Modernization & Core Financials Cutover",
    challenge: "Fragmented legacy ERP systems across multiple agencies causing delayed financial reporting and manual consolidations.",
    approach: "Designed and deployed a unified Oracle Fusion Cloud financial core with automated subledger reconciliation and cutover governance.",
    technology: "Oracle ERP Cloud · OIC Integration · Fusion Data Intelligence",
    outcome: "Streamlined monthly close operations with controlled enterprise cutover and complete audit compliance.",
    image: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1600&q=85",
    href: "/work",
    variant: "top-right" as const,
  },
  {
    type: "SOLUTION SHOWCASE",
    industry: "DEFENSE & AEROSPACE CONTRACTING",
    headline: "Autonomous Contract Intelligence & Regulatory Clause Verification",
    challenge: "Complex multi-thousand page subcontracts requiring manual compliance verification across federal regulations.",
    approach: "Deployed Data Agent platform to automatically extract, ground, and verify DFARS clauses with direct document citations.",
    technology: "Data Agent · Document AI · Vector Retrieval · Oracle ERP",
    outcome: "Accelerated regulatory contract review with verified, auditable source-grounded evidence.",
    image: "https://images.unsplash.com/photo-1517976487502-8693c0429f55?auto=format&fit=crop&w=1600&q=85",
    href: "/work/innovation/data-agent",
    variant: "top-left" as const,
  },
  {
    type: "SOLUTION SHOWCASE",
    industry: "HEALTHCARE & LIFE SCIENCES",
    headline: "Clinical Documentation Intelligence & Longitudinal Patient Summaries",
    challenge: "High clinician cognitive load synthesizing disparate patient records, lab histories, and medication changes.",
    approach: "Engineered MediGuide AI to summarize clinical timelines and generate grounded, evidence-backed patient visit preparation.",
    technology: "MediGuide AI · Clinical NLP · FHIR APIs · Voice Synthesis",
    outcome: "Synthesized clinical record timelines with verified physician point-of-care citations.",
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1600&q=85",
    href: "/work/innovation/mediguide-ai",
    variant: "bottom-right" as const,
  },
  {
    type: "CLIENT ENGAGEMENT",
    industry: "FINANCIAL SERVICES & BANKING",
    headline: "Enterprise CRM & Unified Revenue Operations Workspace",
    challenge: "Siloed customer interaction records and disconnected sales pipelines slowing strategic account execution.",
    approach: "Implemented custom Customer 360 Workspace integrated with transactional accounting and predictive account health telemetry.",
    technology: "CRM Platform · REST APIs · Predictive Revenue Models",
    outcome: "Unified Customer 360 engagement with automated transactional ERP reconciliation.",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=85",
    href: "/platforms/crm",
    variant: "bottom-left" as const,
  },
];

export default function SelectedWorkSection() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="selected-work" className="bg-[#FFFDF8] text-[#261F1B] py-24 sm:py-28 lg:py-32 border-b border-[#D8D0C5]">
      <div className="mkt-shell">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end pb-10 border-b border-[#D8D0C5]">
          <div>
            <SectionLabel tone="burgundy">SELECTED WORK &amp; SOLUTION SHOWCASES</SectionLabel>
            <h2 className="mt-3 font-serif text-3xl font-semibold tracking-tight text-[#261F1B] sm:text-4xl lg:text-5xl">
              Proven outcomes in production.
            </h2>
          </div>

          <Link
            href="/work"
            className="group inline-flex items-center gap-1.5 text-sm font-semibold text-[#B63A3A] hover:text-[#942E31] transition-colors"
          >
            <span>Explore all solution showcases</span>
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        {/* Alternating Editorial Rows with generous 96-120px breathing room */}
        <div className="mt-20 space-y-24 lg:space-y-28">
          {showcases.map((cs, idx) => {
            const isEven = idx % 2 === 1;

            return (
              <motion.article
                key={cs.headline}
                initial={shouldReduceMotion ? {} : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center rounded-2xl border border-[#D8D0C5] bg-[#F7F3EC] p-6 sm:p-8 lg:p-10 shadow-[0_16px_40px_rgba(38,31,27,0.06)]"
              >
                {/* 1. Image Block (48% on desktop) with Clipped Corner Asymmetry */}
                <div
                  className={`lg:col-span-6 ${isEven ? "lg:order-2" : "lg:order-1"}`}
                >
                  <ClippedImage
                    src={cs.image}
                    alt={cs.headline}
                    variant={cs.variant}
                    overlay={
                      <div className="absolute inset-0 bg-gradient-to-t from-[#211E1B]/70 via-transparent to-transparent pointer-events-none">
                        <div className="absolute bottom-4 left-4 right-4">
                          <span className="inline-flex rounded bg-[#211E1B]/80 px-2.5 py-1 text-[0.62rem] font-bold uppercase tracking-wider text-[#D8C5AA] border border-[#D8D0C5]/30">
                            {cs.industry}
                          </span>
                        </div>
                      </div>
                    }
                  />
                </div>

                {/* 2. Structured Content Block (52% on desktop) */}
                <div
                  className={`lg:col-span-6 space-y-4 ${isEven ? "lg:order-1" : "lg:order-2"}`}
                >
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#B63A3A]" />
                    <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#B63A3A]">
                      {cs.type}
                    </span>
                  </div>

                  <h3 className="font-serif text-2xl sm:text-3xl font-bold leading-tight text-[#261F1B]">
                    {cs.headline}
                  </h3>

                  <div className="space-y-3 pt-2 text-xs sm:text-sm">
                    <div className="border-l-2 border-[#B63A3A] pl-3">
                      <span className="font-bold text-[#261F1B]">Challenge: </span>
                      <span className="text-[#695F57]">{cs.challenge}</span>
                    </div>

                    <div className="border-l-2 border-[#D8D0C5] pl-3">
                      <span className="font-bold text-[#261F1B]">Solution: </span>
                      <span className="text-[#695F57]">{cs.approach}</span>
                    </div>

                    <div className="border-l-2 border-[#357C78] pl-3">
                      <span className="font-bold text-[#261F1B]">Outcome: </span>
                      <span className="text-[#695F57]">{cs.outcome}</span>
                    </div>
                  </div>

                  <div className="pt-3">
                    <Link
                      href={cs.href}
                      className="group inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#B63A3A] hover:text-[#942E31] transition-colors"
                    >
                      <span>Read Full Showcase</span>
                      <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </Link>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
