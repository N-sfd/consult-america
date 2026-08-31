"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, CheckCircle2, Layers, Sparkles, Database } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

import SectionLabel from "@/components/marketing/SectionLabel";

const featuredOracleCase = {
  client: "GLOBAL PUBLIC-SECTOR & DEFENSE ENTERPRISE",
  title: "Multi-Entity Fusion Cloud Modernization & Core Financials Cutover",
  challenge: "Fragmented legacy ERP systems across 12 entities causing delayed reporting, unaligned charts of accounts, and manual audit reconciliations.",
  approach: "Engineered a clean-core Oracle Fusion ERP & SCM model with automated subledger reconciliation and live OIC data streaming.",
  outcome: "75% compression in monthly close cycle with zero cutover downtime and complete SOX compliance pass.",
  image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
  href: "/work",
};

const supportingCases = [
  {
    industry: "DEFENSE & AEROSPACE CONTRACTOR",
    headline: "Autonomous Contract Intelligence & DFARS Compliance Extraction",
    challenge: "Complex multi-thousand page subcontracts requiring manual compliance verification across federal regulations.",
    approach: "Deployed Data Agent platform to automatically extract, ground, and verify DFARS clauses with 100% source citations.",
    outcome: "99.8% extraction accuracy and 85% reduction in contract review cycle times.",
    linkHref: "/work/innovation/data-agent",
    tag: "Data Agent AI",
  },
  {
    industry: "HEALTHCARE TECHNOLOGY CONCEPT",
    headline: "AI-Enabled Clinical Intelligence & Patient Visit Preparation",
    challenge: "High clinician cognitive load synthesizing disparate patient records, lab histories, and medication changes.",
    approach: "Engineered MediGuide AI to summarize clinical timelines and generate grounded, evidence-backed patient guidance.",
    outcome: "88% faster clinical chart review with fully verified source evidence for every recommendation.",
    linkHref: "/work/innovation/mediguide-ai",
    tag: "MediGuide AI",
  },
];

export default function SelectedWorkSection() {
  const shouldReduceMotion = useReducedMotion();

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

        {/* Featured Case Study (Dominant 50/50 Card) */}
        <motion.article
          initial={shouldReduceMotion ? {} : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="mt-12 overflow-hidden rounded-2xl border border-[#D7CCBD] bg-[#FFFAF2] shadow-[0_16px_50px_rgba(38,31,27,0.06)]"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Left Image (~48%) */}
            <div className="relative aspect-[16/10] lg:aspect-auto lg:col-span-6 overflow-hidden bg-[#211E1B]">
              <Image
                src={featuredOracleCase.image}
                alt={featuredOracleCase.title}
                fill
                className="object-cover mkt-img-graded"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#211E1B]/80 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-[#FFFAF2]" />

              {/* Floating Status Indicator on Image */}
              <div className="absolute bottom-4 left-4 rounded-lg border border-white/20 bg-[#FFFDF8]/90 p-3 backdrop-blur-md shadow-md text-xs">
                <p className="font-bold text-[#261F1B] flex items-center gap-1.5">
                  <Layers className="h-3.5 w-3.5 text-[#7D2639]" /> Oracle Cloud Core
                </p>
                <p className="text-[0.65rem] text-[#657766] font-mono mt-0.5">100% Clean Cutover</p>
              </div>
            </div>

            {/* Right Copy & Outcomes (~52%) */}
            <div className="p-8 lg:p-10 lg:col-span-6 flex flex-col justify-between space-y-6">
              <div>
                <span className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#7D2639]">
                  {featuredOracleCase.client}
                </span>

                <h3 className="mt-2.5 font-serif text-2xl sm:text-3xl font-bold text-[#261F1B] leading-snug">
                  {featuredOracleCase.title}
                </h3>

                <div className="mt-6 space-y-3.5 text-xs sm:text-sm leading-relaxed">
                  <div>
                    <strong className="text-[#261F1B]">Challenge:</strong>{" "}
                    <span className="text-[#695F57]">{featuredOracleCase.challenge}</span>
                  </div>
                  <div>
                    <strong className="text-[#261F1B]">Approach:</strong>{" "}
                    <span className="text-[#695F57]">{featuredOracleCase.approach}</span>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-[#D7CCBD] flex items-center justify-between">
                <div>
                  <span className="block text-[0.62rem] uppercase tracking-wider text-[#695F57]">Production Outcome</span>
                  <span className="text-sm font-bold text-[#261F1B]">{featuredOracleCase.outcome}</span>
                </div>
                <Link
                  href={featuredOracleCase.href}
                  className="rounded-full bg-[#7D2639] text-white p-3 hover:bg-[#681F30] transition-colors"
                  aria-label="View Oracle case study"
                >
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </motion.article>

        {/* 2 Supporting Case Studies */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          {supportingCases.map((cs, idx) => (
            <motion.article
              key={cs.headline}
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              className="group flex flex-col justify-between rounded-2xl border border-[#D7CCBD] bg-[#FFFAF2] p-7 transition-all duration-200 hover:border-[#7D2639]/40 hover:bg-[#FFFDF8] hover:shadow-[0_12px_36px_rgba(38,31,27,0.06)]"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#7D2639]">
                    {cs.industry}
                  </span>
                  <span className="rounded bg-[#DFE4DA] px-2 py-0.5 text-[0.62rem] font-bold text-[#657766]">
                    {cs.tag}
                  </span>
                </div>

                <h3 className="mt-3 font-serif text-xl sm:text-2xl font-bold text-[#261F1B] group-hover:text-[#7D2639] transition-colors leading-snug">
                  {cs.headline}
                </h3>

                <div className="mt-5 space-y-3 text-xs leading-relaxed">
                  <div>
                    <strong className="text-[#261F1B]">Challenge:</strong>{" "}
                    <span className="text-[#695F57]">{cs.challenge}</span>
                  </div>
                  <div>
                    <strong className="text-[#261F1B]">Approach:</strong>{" "}
                    <span className="text-[#695F57]">{cs.approach}</span>
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
                  className="rounded-full bg-[#FFFDF8] p-2.5 border border-[#D7CCBD] group-hover:border-[#7D2639] group-hover:bg-[#7D2639] group-hover:text-white transition-all text-[#261F1B]"
                  aria-label="View case study"
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
