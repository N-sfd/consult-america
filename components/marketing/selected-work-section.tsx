"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

import SectionLabel from "@/components/marketing/SectionLabel";

const featureCase = {
  client: "GLOBAL FINANCIAL SERVICES INSTITUTION",
  title: "Multi-Entity Fusion Cloud Modernization & Financial Close Acceleration",
  summary:
    "Consolidated 14 legacy ERP instances into a single Oracle Cloud model across 8 countries, cutting monthly close from 16 days to 4 days with zero audit discrepancies.",
  metrics: [
    { value: "75%", label: "Close Time Reduction" },
    { value: "14 → 1", label: "Instances Unified" },
    { value: "100%", label: "SOX Compliance Pass" },
  ],
  href: "/work/oracle-erp-transformation",
  image:
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
};

const supportingCases = [
  {
    client: "ENTERPRISE HEALTHCARE NETWORK",
    title: "Clinical Document Intelligence & AI Patient Preparation",
    summary:
      "Automated extraction and classification across 2.4M clinical records with human-verified citations for 1,200 providers.",
    metric: "88% faster chart review",
    href: "/work/innovation/mediguide-ai",
    image:
      "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80",
  },
  {
    client: "DEFENSE & AEROSPACE CONTRACTOR",
    title: "Autonomous Contract Intelligence & DFARS Compliance Pipeline",
    summary:
      "Deployed Data Agent for automated contract schedule parsing, clause risk scoring, and ERP billing sync.",
    metric: "94% clause accuracy",
    href: "/work/innovation/data-agent",
    image:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80",
  },
];

export default function SelectedWorkSection() {
  return (
    <section id="selected-work" className="mkt-section bg-[#FFFFFF] text-[#101828] border-y border-[#E2E7EC]">
      <div className="mkt-shell">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <SectionLabel tone="burgundy">Case Studies</SectionLabel>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55 }}
              className="mt-4 font-serif text-3xl font-semibold tracking-[-0.03em] sm:text-4xl lg:text-5xl"
            >
              Proven outcomes in production.
            </motion.h2>
          </div>

          <Link
            href="/work"
            className="group inline-flex items-center gap-1.5 text-sm font-semibold text-[#B63838] hover:text-[#8F292D]"
          >
            <span>View All Client Stories</span>
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        {/* Dominant Feature Case Study (55% Image / 45% Copy) */}
        <motion.article
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-14 grid grid-cols-1 overflow-hidden rounded-xl border border-[#E2E7EC] bg-[#FCFCFD] lg:grid-cols-12 shadow-[0_12px_36px_rgba(20,30,45,0.06)]"
        >
          {/* Image 55% */}
          <div className="relative min-h-[300px] lg:col-span-7 lg:min-h-[440px] bg-[#EEF2F5]">
            <Image
              src={featureCase.image}
              alt={featureCase.title}
              fill
              className="object-cover mkt-img-graded"
              sizes="(max-width: 1024px) 100vw, 58vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#101828]/40 via-transparent to-transparent" />
          </div>

          {/* Copy 45% */}
          <div className="flex flex-col justify-between p-8 lg:col-span-5 lg:p-10">
            <div>
              <span className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#B63838]">
                {featureCase.client}
              </span>
              <h3 className="mt-2.5 font-serif text-2xl font-semibold leading-tight text-[#101828] sm:text-3xl">
                {featureCase.title}
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-[#475467]">
                {featureCase.summary}
              </p>

              {/* Metrics */}
              <div className="mt-8 grid grid-cols-3 gap-3 border-t border-[#E2E7EC] pt-6">
                {featureCase.metrics.map((m) => (
                  <div key={m.label}>
                    <p className="font-serif text-2xl font-bold text-[#B63838] sm:text-3xl">
                      {m.value}
                    </p>
                    <p className="mt-1 text-[0.65rem] font-medium uppercase tracking-wider text-[#475467]">
                      {m.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-4">
              <Link
                href={featureCase.href}
                className="group inline-flex items-center gap-2 text-sm font-semibold text-[#B63838] hover:text-[#8F292D]"
              >
                <span>Read Full Case Study</span>
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </div>
        </motion.article>

        {/* 2 Supporting Wide Modules */}
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
          {supportingCases.map((cs, idx) => (
            <motion.article
              key={cs.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="grid grid-cols-1 sm:grid-cols-12 overflow-hidden rounded-xl border border-[#E2E7EC] bg-[#FCFCFD] shadow-2xs"
            >
              <div className="relative min-h-[180px] sm:col-span-5 bg-[#EEF2F5]">
                <Image
                  src={cs.image}
                  alt={cs.title}
                  fill
                  className="object-cover mkt-img-graded"
                  sizes="(max-width: 640px) 100vw, 25vw"
                />
              </div>
              <div className="flex flex-col justify-between p-6 sm:col-span-7">
                <div>
                  <span className="text-[0.65rem] font-bold uppercase tracking-[0.14em] text-[#B63838]">
                    {cs.client}
                  </span>
                  <h3 className="mt-1.5 font-serif text-base font-semibold text-[#101828]">
                    {cs.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-[#475467]">
                    {cs.summary}
                  </p>
                  <p className="mt-3 text-xs font-bold text-[#5F7D75]">
                    ✓ {cs.metric}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#E2E7EC]/80">
                  <Link
                    href={cs.href}
                    className="group inline-flex items-center gap-1 text-xs font-semibold text-[#B63838] hover:text-[#8F292D]"
                  >
                    <span>Read Case Story</span>
                    <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
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
