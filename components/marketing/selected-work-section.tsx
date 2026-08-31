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
    outcome: "Streamlined monthly close operations with controlled enterprise cutover and complete audit compliance.",
    image: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1600&q=85",
    href: "/work",
    cornerClass: "rounded-tr-[56px] rounded-tl-[12px] rounded-bl-[12px] rounded-br-[12px]",
  },
  {
    type: "SOLUTION SHOWCASE",
    industry: "DEFENSE & AEROSPACE CONTRACTING",
    headline: "Autonomous Contract Intelligence & Regulatory Clause Verification",
    challenge: "Complex multi-thousand page subcontracts requiring manual compliance verification across federal regulations.",
    approach: "Deployed Data Agent platform to automatically extract, ground, and verify DFARS clauses with direct document citations.",
    outcome: "Accelerated regulatory contract review with verified, auditable source-grounded evidence.",
    image: "https://images.unsplash.com/photo-1517976487502-8693c0429f55?auto=format&fit=crop&w=1600&q=85",
    href: "/work/innovation/data-agent",
    cornerClass: "rounded-tl-[56px] rounded-tr-[12px] rounded-bl-[12px] rounded-br-[12px]",
  },
  {
    type: "SOLUTION SHOWCASE",
    industry: "HEALTHCARE & LIFE SCIENCES",
    headline: "Clinical Documentation Intelligence & Longitudinal Patient Summaries",
    challenge: "High clinician cognitive load synthesizing disparate patient records, lab histories, and medication changes.",
    approach: "Engineered MediGuide AI to summarize clinical timelines and generate grounded, evidence-backed patient visit preparation.",
    outcome: "Synthesized clinical record timelines with verified physician point-of-care citations.",
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1600&q=85",
    href: "/work/innovation/mediguide-ai",
    cornerClass: "rounded-br-[56px] rounded-tl-[12px] rounded-tr-[12px] rounded-bl-[12px]",
  },
  {
    type: "CLIENT ENGAGEMENT",
    industry: "FINANCIAL SERVICES & BANKING",
    headline: "Enterprise CRM & Unified Revenue Operations Workspace",
    challenge: "Siloed customer interaction records and disconnected sales pipelines slowing strategic account execution.",
    approach: "Implemented custom Customer 360 Workspace integrated with transactional accounting and predictive account health telemetry.",
    outcome: "Unified Customer 360 engagement with automated transactional ERP reconciliation.",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=85",
    href: "/platforms/crm",
    cornerClass: "rounded-bl-[56px] rounded-tl-[12px] rounded-tr-[12px] rounded-br-[12px]",
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

        {/* Oversized editorial rows — no cards, 45–50% image, generous breathing room */}
        <div className="mt-20 space-y-28 lg:space-y-32">
          {showcases.map((cs, idx) => {
            const isEven = idx % 2 === 1;

            return (
              <motion.article
                key={cs.headline}
                initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 xl:gap-20 items-center"
              >
                {/* Large editorial photograph — 48% width, one exaggerated corner */}
                <div className={`lg:col-span-6 ${isEven ? "lg:order-2" : "lg:order-1"}`}>
                  <motion.div
                    initial={shouldReduceMotion ? {} : { opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
                    className={`group relative aspect-[16/10] w-full overflow-hidden border border-[#D8D0C5] bg-[#211E1B] shadow-[0_20px_50px_rgba(38,31,27,0.1)] ${cs.cornerClass}`}
                  >
                    <Image
                      src={cs.image}
                      alt={cs.headline}
                      fill
                      className="object-cover mkt-img-graded transition-transform duration-700 group-hover:scale-[1.02]"
                      sizes="(max-width: 1024px) 100vw, 48vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#211E1B]/60 via-transparent to-transparent pointer-events-none" />
                    <span className="absolute bottom-4 left-4 inline-flex rounded bg-[#211E1B]/80 px-2.5 py-1 text-[0.62rem] font-bold uppercase tracking-wider text-[#D8C5AA] border border-[#D8D0C5]/30">
                      {cs.industry}
                    </span>
                  </motion.div>
                </div>

                {/* Content — open layout, no card wrapper */}
                <div className={`lg:col-span-6 space-y-5 ${isEven ? "lg:order-1" : "lg:order-2"}`}>
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#B63A3A]" />
                    <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#B63A3A]">
                      {cs.type}
                    </span>
                  </div>

                  <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight text-[#261F1B]">
                    {cs.headline}
                  </h3>

                  <div className="space-y-4 pt-1 text-sm">
                    <div className="border-l-2 border-[#B63A3A] pl-4">
                      <span className="font-bold text-[#261F1B]">Challenge. </span>
                      <span className="text-[#695F57]">{cs.challenge}</span>
                    </div>
                    <div className="border-l-2 border-[#D8D0C5] pl-4">
                      <span className="font-bold text-[#261F1B]">Approach. </span>
                      <span className="text-[#695F57]">{cs.approach}</span>
                    </div>
                    <div className="border-l-2 border-[#357C78] pl-4">
                      <span className="font-bold text-[#261F1B]">Outcome. </span>
                      <span className="text-[#695F57]">{cs.outcome}</span>
                    </div>
                  </div>

                  <div className="pt-4">
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
