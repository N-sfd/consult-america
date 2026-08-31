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
            className="text-3xl font-bold tracking-[-0.03em] sm:text-4xl lg:text-5xl"
          >
            Outcomes in production.
          </motion.h2>
          <Link
            href="/work/case-studies"
            className="group inline-flex items-center gap-1.5 text-sm font-bold text-[#7D2639] hover:text-[#681F30]"
          >
            <span>View All Case Studies</span>
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        {/* 1 Large Featured Case Study */}
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-14 overflow-hidden rounded-2xl border border-[#D7CCBD] bg-[#FFFDF8] shadow-[0_16px_40px_rgba(38,31,27,0.06)]"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12">
            <div className="relative aspect-[16/10] lg:aspect-auto lg:col-span-6 overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1600&q=80"
                alt="Enterprise multi-entity finance operations center"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#261F1B]/60 via-transparent to-transparent" />
              <div className="absolute top-6 left-6">
                <span className="rounded-md bg-[#FFFDF8]/90 px-3 py-1 text-xs font-bold text-[#7D2639] backdrop-blur-xs">
                  Featured Oracle Practice
                </span>
              </div>
            </div>

            <div className="p-8 sm:p-10 lg:col-span-6 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-[0.14em] text-[#7D2639]">
                  Oracle Cloud Transformation
                </span>
                <h3 className="mt-2 text-2xl font-bold tracking-[-0.02em] text-[#261F1B] sm:text-3xl">
                  Connecting enterprise operations across finance, procurement and projects.
                </h3>

                <div className="mt-6 space-y-4 text-sm text-[#695F57]">
                  <div>
                    <h4 className="font-bold text-[#261F1B]">Challenge</h4>
                    <p className="mt-1 leading-relaxed">
                      Disconnected ERP instances across business units resulted in
                      manual close reconciliations and delayed financial reporting.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-bold text-[#261F1B]">Approach</h4>
                    <p className="mt-1 leading-relaxed">
                      Phased entity-by-entity cutover with a standardized chart of
                      accounts, automated integration pipelines, and parallel-close validation.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-bold text-[#261F1B]">Outcome</h4>
                    <ul className="mt-1 space-y-1.5">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-[#657766] shrink-0" />
                        <span>Unified system of record across all operating entities</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-[#657766] shrink-0" />
                        <span>Month-end close cycle shortened by days with zero missed periods</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-[#D7CCBD]">
                <Link
                  href="/work/case-studies/oracle-cloud-transformation"
                  className="inline-flex items-center gap-1.5 font-bold text-sm text-[#7D2639] hover:text-[#681F30]"
                >
                  <span>Read Full Case Study</span>
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </motion.article>

        {/* 2 Supporting Case Studies */}
        <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Supporting 1: AI Document Intelligence */}
          <motion.article
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="overflow-hidden rounded-2xl border border-[#D7CCBD] bg-[#FFFDF8] p-6 sm:p-8 flex flex-col justify-between shadow-[0_8px_24px_rgba(38,31,27,0.04)] hover:border-[#7D2639]/40"
          >
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.14em] text-[#7D2639]">
                AI &amp; Data Practice
              </span>
              <h3 className="mt-2 text-xl font-bold text-[#261F1B]">
                AI Document Intelligence at Enterprise Scale
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[#695F57]">
                Automated extraction and clause validation across thousands of
                active agreements with human-in-the-loop review queues and
                traceable provenance.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#D7CCBD]">
              <Link
                href="/work/case-studies/ai-document-intelligence"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#7D2639] hover:text-[#681F30]"
              >
                <span>Read Case Study</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </motion.article>

          {/* Supporting 2: Public Sector Transformation */}
          <motion.article
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.08 }}
            className="overflow-hidden rounded-2xl border border-[#D7CCBD] bg-[#FFFDF8] p-6 sm:p-8 flex flex-col justify-between shadow-[0_8px_24px_rgba(38,31,27,0.04)] hover:border-[#7D2639]/40"
          >
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.14em] text-[#7D2639]">
                Public Sector Practice
              </span>
              <h3 className="mt-2 text-xl font-bold text-[#261F1B]">
                Multi-Agency Finance &amp; Procurement Platform
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[#695F57]">
                Modernized financial management and grant accounting while preserving
                statutory compliance, appropriations controls, and audit trails.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#D7CCBD]">
              <Link
                href="/work/case-studies/public-sector-finance-procurement"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#7D2639] hover:text-[#681F30]"
              >
                <span>Read Case Study</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </motion.article>
        </div>
      </div>
    </section>
  );
}
