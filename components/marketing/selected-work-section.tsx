"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

import SectionLabel from "@/components/marketing/SectionLabel";

const featuredCase = {
  client: "PUBLIC SECTOR ENTERPRISE",
  title: "Multi-Entity Financial Platform Modernization & Operations Cutover",
  challenge: "Disparate legacy finance and procurement systems across operating units creating delayed period close cycles, inconsistent charts of accounts, and manual audit reconciliations.",
  approach: "Architected a unified Oracle Fusion ERP foundation with standardized subledger accounting, automated validation rules, and direct integration pipelines.",
  outcome: "Consolidated financial workflows across entities, streamlined monthly period close, and established complete audit traceability across general ledger transactions.",
  image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=85",
  href: "/work",
};

const secondaryCases = [
  {
    industry: "COMMERCIAL & AEROSPACE CONTRACTING",
    headline: "Autonomous Contract Intelligence & Compliance Analysis",
    challenge: "High overhead and friction reviewing complex multi-hundred page master agreements and vendor obligation schedules.",
    approach: "Deployed Data Agent platform to automatically extract, structure, and verify critical terms with traceable source citations.",
    outcome: "Structured clause extraction and significant reduction in review cycle times across procurement and commercial operations teams.",
    linkHref: "/work/innovation/data-agent",
    tag: "Data Agent AI",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80",
  },
  {
    industry: "HEALTHCARE TECHNOLOGY",
    headline: "Clinical Intelligence & Structured Patient Intake Workflows",
    challenge: "High cognitive load synthesizing fragmented health histories, intake records, and care instructions.",
    approach: "Engineered MediGuide AI to summarize clinical timelines and generate grounded, evidence-backed patient guidance with safety guardrails.",
    outcome: "Streamlined intake preparation with clear source citations for every synthesized care topic.",
    linkHref: "/work/innovation/mediguide-ai",
    tag: "MediGuide AI",
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80",
  },
];

export default function SelectedWorkSection() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="selected-work" className="bg-[#FFFFFF] text-[#102033] py-16 sm:py-20 lg:py-24 border-b border-[#DCE3E5]">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-8 xl:px-10">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end pb-8 border-b border-[#DCE3E5]">
          <div>
            <div className="inline-flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#0E514E]" />
              <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#5A6770]">
                FEATURED WORK
              </span>
            </div>
            <h2 className="mt-3 font-serif text-3xl sm:text-4xl lg:text-[42px] font-semibold tracking-[-0.03em] text-[#102033] leading-tight">
              Solving complex challenges.
              <br />
              <span className="text-[#0E514E]">Creating lasting value.</span>
            </h2>
          </div>

          <Link
            href="/work"
            className="group inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#0E514E] hover:text-[#BA3535] transition-colors"
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
          className="mt-10 overflow-hidden rounded-[10px] border border-[#DCE3E5] bg-white shadow-sm"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
            {/* Left 55%: Contextual Photograph */}
            <div className="relative aspect-[16/10] lg:aspect-auto lg:col-span-7 overflow-hidden bg-[#0B1F2D]">
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
                <span className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#0E514E]">
                  {featuredCase.client}
                </span>

                <h3 className="mt-2.5 font-serif text-xl sm:text-2xl font-bold text-[#102033] leading-snug">
                  {featuredCase.title}
                </h3>

                <div className="mt-6 space-y-3.5 text-xs sm:text-sm leading-relaxed">
                  <div>
                    <strong className="text-[#102033]">Challenge:</strong>{" "}
                    <span className="text-[#5A6770]">{featuredCase.challenge}</span>
                  </div>
                  <div>
                    <strong className="text-[#102033]">Approach:</strong>{" "}
                    <span className="text-[#5A6770]">{featuredCase.approach}</span>
                  </div>
                  <div>
                    <strong className="text-[#102033]">Outcome:</strong>{" "}
                    <span className="text-[#5A6770]">{featuredCase.outcome}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#E1E7E8]">
                <Link
                  href={featuredCase.href}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#BA3535] hover:text-[#9E2C2C] transition-colors"
                >
                  <span>Read full case study →</span>
                </Link>
              </div>
            </div>
          </div>
        </motion.article>

        {/* 2 Secondary Case-Study Modules with Large Photography */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          {secondaryCases.map((cs, idx) => (
            <motion.article
              key={cs.headline}
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              className="group flex flex-col rounded-[10px] border border-[#DCE3E5] bg-white overflow-hidden shadow-2xs hover:border-[#0E514E]/40 transition-all duration-300"
            >
              <div className="relative aspect-[16/9] w-full bg-[#0B1F2D] overflow-hidden">
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
                    <span className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#0E514E]">
                      {cs.industry}
                    </span>
                    <span className="rounded bg-[#DCEBE8] px-2 py-0.5 text-[0.62rem] font-bold text-[#0E514E]">
                      {cs.tag}
                    </span>
                  </div>

                  <h3 className="mt-3 font-serif text-lg sm:text-xl font-bold text-[#102033] group-hover:text-[#0E514E] transition-colors leading-snug">
                    {cs.headline}
                  </h3>

                  <div className="mt-4 space-y-2 text-xs leading-relaxed">
                    <div>
                      <strong className="text-[#102033]">Challenge:</strong>{" "}
                      <span className="text-[#5A6770]">{cs.challenge}</span>
                    </div>
                    <div>
                      <strong className="text-[#102033]">Approach:</strong>{" "}
                      <span className="text-[#5A6770]">{cs.approach}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#E1E7E8]">
                  <Link
                    href={cs.linkHref}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#BA3535] hover:text-[#9E2C2C] transition-colors"
                  >
                    <span>Explore capability →</span>
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
