"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

import SectionLabel from "@/components/marketing/SectionLabel";

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

        {/* Alternating Editorial Rows (Requirement 18: ~48% Image / ~52% Content) */}
        <div className="mt-16 space-y-16 lg:space-y-24">
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
                {/* 1. Image Block (48% on desktop) with Clipped Corner Asymmetry (Shape D & Requirement 19) */}
                <div
                  className={`lg:col-span-6 relative ${isEven ? "lg:order-2" : "lg:order-1"}`}
                >
                  {/* Offset Decorative Backing Shape */}
                  <div
                    className={`absolute inset-0 translate-x-3 translate-y-3 sm:translate-x-4 sm:translate-y-4 ${
                      isEven
                        ? "ca-shape-clipped-corner-alt bg-[#B63A3A]/8"
                        : "ca-shape-clipped-corner bg-[#D8C5AA]/35"
                    } -z-10`}
                    aria-hidden="true"
                  />

                  <div
                    className={`relative aspect-[16/10] w-full border border-[#D8D0C5] bg-[#211E1B] shadow-[0_12px_32px_rgba(38,31,27,0.08)] ${
                      isEven ? "ca-shape-clipped-corner-alt" : "ca-shape-clipped-corner"
                    }`}
                  >
                    <Image
                      src={cs.image}
                      alt={cs.headline}
                      fill
                      className="object-cover mkt-img-graded"
                      sizes="(max-width: 1024px) 100vw, 48vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#211E1B]/70 via-transparent to-transparent pointer-events-none" />
                    
                    <div className="absolute bottom-3.5 left-4 right-4 flex items-center justify-between">
                      <span className="rounded-full bg-[#211E1B]/80 backdrop-blur-md px-3 py-1 text-[0.62rem] font-bold uppercase tracking-wider text-[#FFFDF8] border border-white/20">
                        {cs.industry}
                      </span>
                      <span className="rounded-full bg-[#B63A3A] px-2.5 py-0.5 text-[0.58rem] font-mono font-bold uppercase tracking-wider text-white">
                        {cs.type}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 2. Structured Content Block (52% on desktop) */}
                <div
                  className={`lg:col-span-6 space-y-4 ${isEven ? "lg:order-1" : "lg:order-2"}`}
                >
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#261F1B] leading-snug">
                    {cs.headline}
                  </h3>

                  <div className="space-y-2.5 text-xs sm:text-sm leading-relaxed text-[#695F57]">
                    <p>
                      <strong className="text-[#261F1B]">Challenge:</strong> {cs.challenge}
                    </p>
                    <p>
                      <strong className="text-[#261F1B]">Approach:</strong> {cs.approach}
                    </p>
                    <p>
                      <strong className="text-[#261F1B]">Outcome:</strong> {cs.outcome}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-[#D8D0C5] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <span className="font-mono text-[0.68rem] text-[#695F57] truncate">
                      {cs.technology}
                    </span>
                    <Link
                      href={cs.href}
                      className="group inline-flex items-center gap-1.5 text-xs font-bold text-[#B63A3A] hover:text-[#942E31] transition-colors shrink-0"
                    >
                      <span>Explore Showcase</span>
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
