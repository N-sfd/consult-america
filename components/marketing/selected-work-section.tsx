"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

import SectionLabel from "@/components/marketing/SectionLabel";

const featuredCase = {
  client: "GLOBAL PUBLIC-SECTOR & DEFENSE ENTERPRISE",
  title: "Multi-Entity Fusion Cloud Modernization & Core Financials Cutover",
  challenge: "Fragmented legacy ERP systems across 12 operating entities causing delayed period-close cycles, disparate charts of accounts, and manual reconciliations.",
  approach: "Architected a unified Oracle Fusion ERP & SCM environment with standardized subledger accounting, custom validation rules, and live OIC data streaming.",
  outcome: "Accelerated monthly financial close cycle with standardized subledger accounting and complete audit traceability.",
  image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=85",
  href: "/work",
};

const secondaryCases = [
  {
    industry: "DEFENSE & AEROSPACE CONTRACTOR",
    headline: "Autonomous Contract Intelligence & Compliance Extraction",
    challenge: "Complex multi-thousand page subcontracts requiring rigorous compliance verification across federal acquisition frameworks.",
    approach: "Deployed Data Agent platform to automatically extract, ground, and verify contract clauses with traceable source citations.",
    outcome: "Structured clause extraction and significant reduction in contract review cycle times across procurement teams.",
    linkHref: "/work/innovation/data-agent",
    tag: "Data Agent AI",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80",
  },
  {
    industry: "HEALTHCARE TECHNOLOGY",
    headline: "AI-Enabled Clinical Intelligence & Patient Visit Preparation",
    challenge: "High clinician cognitive load synthesizing disparate patient records, lab histories, and medication changes.",
    approach: "Engineered MediGuide AI to summarize clinical timelines and generate grounded, evidence-backed patient guidance.",
    outcome: "Streamlined clinical chart review with fully verified source citations for every summary item.",
    linkHref: "/work/innovation/mediguide-ai",
    tag: "MediGuide AI",
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80",
  },
];

export default function SelectedWorkSection() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="selected-work" className="bg-[#F7F9FA] text-[#102033] py-20 sm:py-24 lg:py-28 border-b border-[#DDE4E8]">
      <div className="ca-shell">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end pb-8 border-b border-[#DDE4E8]">
          <div>
            <SectionLabel tone="burgundy">CASE STUDIES</SectionLabel>
            <h2 className="mt-3 font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-[-0.03em] text-[#102033]">
              Transformation in practice.
            </h2>
          </div>

          <Link
            href="/work"
            className="group inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#B63A3A] hover:text-[#942E31]"
          >
            <span>Explore all case studies</span>
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        {/* Featured Case Study (55% Contextual Photo / 45% Story) */}
        <motion.article
          initial={shouldReduceMotion ? {} : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="mt-12 overflow-hidden rounded-lg border border-[#DDE4E8] bg-white shadow-sm"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
            {/* Left 55%: Contextual Photograph */}
            <div className="relative aspect-[16/10] lg:aspect-auto lg:col-span-7 overflow-hidden bg-[#0C2233]">
              <Image
                src={featuredCase.image}
                alt={featuredCase.title}
                fill
                className="object-cover mkt-img-graded"
                sizes="(max-width: 1024px) 100vw, 55vw"
              />
            </div>

            {/* Right 45%: Story (Challenge, Approach, Outcome) */}
            <div className="p-8 lg:p-10 lg:col-span-5 flex flex-col justify-between space-y-6">
              <div>
                <span className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#B63A3A]">
                  {featuredCase.client}
                </span>

                <h3 className="mt-2.5 font-serif text-xl sm:text-2xl font-bold text-[#102033] leading-snug">
                  {featuredCase.title}
                </h3>

                <div className="mt-6 space-y-3.5 text-xs sm:text-sm leading-relaxed">
                  <div>
                    <strong className="text-[#102033]">Challenge:</strong>{" "}
                    <span className="text-[#526170]">{featuredCase.challenge}</span>
                  </div>
                  <div>
                    <strong className="text-[#102033]">Approach:</strong>{" "}
                    <span className="text-[#526170]">{featuredCase.approach}</span>
                  </div>
                  <div>
                    <strong className="text-[#102033]">Outcome:</strong>{" "}
                    <span className="text-[#526170]">{featuredCase.outcome}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#E9EEF1]">
                <Link
                  href={featuredCase.href}
                  className="ca-link text-xs font-semibold text-[#B63A3A]"
                >
                  Read full case study →
                </Link>
              </div>
            </div>
          </div>
        </motion.article>

        {/* 2 Secondary Case-Study Modules with Large Photography (No generic cards) */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          {secondaryCases.map((cs, idx) => (
            <motion.article
              key={cs.headline}
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              className="group flex flex-col rounded-lg border border-[#DDE4E8] bg-white overflow-hidden shadow-2xs hover:border-[#B63A3A]/40 transition-all duration-300"
            >
              <div className="relative aspect-[16/9] w-full bg-[#0C2233] overflow-hidden">
                <Image
                  src={cs.image}
                  alt={cs.headline}
                  fill
                  className="object-cover mkt-img-graded transition-transform duration-600 group-hover:scale-102"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>

              <div className="p-7 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#B63A3A]">
                      {cs.industry}
                    </span>
                    <span className="rounded bg-[#DCEAE7] px-2 py-0.5 text-[0.62rem] font-bold text-[#357C78]">
                      {cs.tag}
                    </span>
                  </div>

                  <h3 className="mt-3 font-serif text-lg sm:text-xl font-bold text-[#102033] group-hover:text-[#B63A3A] transition-colors leading-snug">
                    {cs.headline}
                  </h3>

                  <div className="mt-4 space-y-2 text-xs leading-relaxed">
                    <div>
                      <strong className="text-[#102033]">Challenge:</strong>{" "}
                      <span className="text-[#526170]">{cs.challenge}</span>
                    </div>
                    <div>
                      <strong className="text-[#102033]">Approach:</strong>{" "}
                      <span className="text-[#526170]">{cs.approach}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#E9EEF1]">
                  <Link
                    href={cs.linkHref}
                    className="ca-link text-xs font-semibold text-[#B63A3A]"
                  >
                    Explore capability →
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
