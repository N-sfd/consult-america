"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

import SectionLabel from "@/components/marketing/SectionLabel";

export default function SelectedWorkSection() {
  return (
    <section id="selected-work" className="mkt-section bg-[#FFFAF2] text-[#261F1B]">
      <div className="mkt-shell">
        <SectionLabel tone="burgundy">Selected Work &amp; Case Studies</SectionLabel>

        <div className="mt-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="font-serif text-3xl font-semibold tracking-[-0.03em] sm:text-4xl lg:text-5xl"
          >
            Outcomes in production.
          </motion.h2>
          <Link
            href="/work/case-studies"
            className="group inline-flex items-center gap-1.5 text-sm font-semibold text-[#7D2639] hover:text-[#681F30]"
          >
            <span>View All Case Studies</span>
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        {/* 1 Dominant Featured Case Study: Oracle Transformation (58% Image / 42% Copy) */}
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-16 overflow-hidden rounded-lg border border-[#D7CCBD] bg-[#FFFDF8] shadow-[0_16px_40px_rgba(38,31,27,0.06)]"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
            {/* Image Col (58%) */}
            <div className="relative aspect-[16/10] lg:aspect-auto lg:col-span-7 min-h-[340px] overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1600&q=80"
                alt="Enterprise multi-entity finance operations center"
                fill
                className="object-cover mkt-img-graded"
                sizes="(max-width: 1024px) 100vw, 58vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#261F1B]/60 via-transparent to-transparent" />
              <div className="absolute top-6 left-6">
                <span className="rounded bg-[#FFFDF8]/95 px-3 py-1 text-[0.68rem] font-bold uppercase tracking-wider text-[#7D2639] backdrop-blur-xs">
                  Featured Oracle Case
                </span>
              </div>
            </div>

            {/* Copy Col (42%) */}
            <div className="p-8 sm:p-10 lg:col-span-5 flex flex-col justify-between">
              <div>
                <span className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#7D2639]">
                  ORACLE CLOUD TRANSFORMATION
                </span>
                <h3 className="mt-2 font-serif text-2xl font-semibold tracking-[-0.02em] text-[#261F1B] sm:text-3xl">
                  Connecting enterprise operations across finance, procurement and projects.
                </h3>

                <div className="mt-6 space-y-4 text-xs leading-relaxed text-[#695F57]">
                  <div>
                    <h4 className="font-bold text-[#261F1B] uppercase tracking-wider text-[0.68rem]">
                      Challenge
                    </h4>
                    <p className="mt-1">
                      Disconnected legacy ERP instances across operating units caused
                      delays in closing the books and required extensive manual consolidation.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-bold text-[#261F1B] uppercase tracking-wider text-[0.68rem]">
                      Approach
                    </h4>
                    <p className="mt-1">
                      Staged cutover with a standardized chart of accounts, monitored
                      integration pipelines, and parallel-close validation.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-bold text-[#261F1B] uppercase tracking-wider text-[0.68rem]">
                      Outcome
                    </h4>
                    <ul className="mt-1 space-y-1">
                      <li className="flex items-center gap-1.5 text-[#261F1B]">
                        <CheckCircle2 className="h-3.5 w-3.5 text-[#657766] shrink-0" />
                        <span>Single source of truth across all operating entities</span>
                      </li>
                      <li className="flex items-center gap-1.5 text-[#261F1B]">
                        <CheckCircle2 className="h-3.5 w-3.5 text-[#657766] shrink-0" />
                        <span>Month-end close shortened with zero missed close cycles</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-[#D7CCBD]">
                <Link
                  href="/work/case-studies/oracle-cloud-transformation"
                  className="group inline-flex items-center gap-2 text-sm font-semibold text-[#7D2639] hover:text-[#681F30]"
                >
                  <span>Read Full Case Study</span>
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </div>
            </div>
          </div>
        </motion.article>

        {/* 2 Wide Photographic Supporting Cases */}
        <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Supporting 1: AI Document Intelligence */}
          <motion.article
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="overflow-hidden rounded-lg border border-[#D7CCBD] bg-[#FFFDF8] shadow-[0_8px_24px_rgba(38,31,27,0.04)]"
          >
            <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#2B2420]">
              <Image
                src="https://images.unsplash.com/photo-1568992687947-868a62a9f521?auto=format&fit=crop&w=1200&q=80"
                alt="AI Document Intelligence workspace and data extraction pipeline"
                fill
                className="object-cover mkt-img-graded"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#261F1B]/60 via-transparent to-transparent" />
              <div className="absolute top-4 left-4">
                <span className="rounded bg-[#FFFDF8]/90 px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-wider text-[#7D2639]">
                  AI &amp; Data Case
                </span>
              </div>
            </div>
            <div className="p-6">
              <h3 className="font-serif text-xl font-semibold text-[#261F1B]">
                AI Document Intelligence at Scale
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-[#695F57]">
                Automated extraction and clause verification across active contracts
                with human review queues and traceable provenance.
              </p>
              <div className="mt-4 pt-3 border-t border-[#D7CCBD]/60">
                <Link
                  href="/work/case-studies/ai-document-intelligence"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#7D2639] hover:text-[#681F30]"
                >
                  <span>Read Case Study</span>
                  <ArrowUpRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </motion.article>

          {/* Supporting 2: Public Sector */}
          <motion.article
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.08 }}
            className="overflow-hidden rounded-lg border border-[#D7CCBD] bg-[#FFFDF8] shadow-[0_8px_24px_rgba(38,31,27,0.04)]"
          >
            <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#2B2420]">
              <Image
                src="https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1200&q=80"
                alt="Public sector operations and reporting environment"
                fill
                className="object-cover mkt-img-graded"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#261F1B]/60 via-transparent to-transparent" />
              <div className="absolute top-4 left-4">
                <span className="rounded bg-[#FFFDF8]/90 px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-wider text-[#7D2639]">
                  Public Sector Case
                </span>
              </div>
            </div>
            <div className="p-6">
              <h3 className="font-serif text-xl font-semibold text-[#261F1B]">
                Public Sector Data Platform
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-[#695F57]">
                Connected financial management and grant tracking with statutory
                appropriations compliance and audit trails intact.
              </p>
              <div className="mt-4 pt-3 border-t border-[#D7CCBD]/60">
                <Link
                  href="/work/case-studies/public-sector-finance-procurement"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#7D2639] hover:text-[#681F30]"
                >
                  <span>Read Case Study</span>
                  <ArrowUpRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </motion.article>
        </div>
      </div>
    </section>
  );
}
