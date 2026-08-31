"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

import SectionLabel from "@/components/marketing/SectionLabel";

const capabilityGroups = [
  {
    pillar: "FINANCE",
    modules: "Financials · General Ledger · Cash & Assets · Period Close",
  },
  {
    pillar: "PROCUREMENT",
    modules: "Source-to-Pay · Supplier Governance · Requisitions · Purchasing",
  },
  {
    pillar: "SUPPLY CHAIN",
    modules: "Demand Planning · Inventory Management · Order Fulfillment · Logistics",
  },
  {
    pillar: "PROJECTS",
    modules: "Project Financials · Costing & Billing · Grants · Program Accounting",
  },
  {
    pillar: "INTEGRATION & DATA",
    modules: "OIC & REST APIs · Analytics & Reporting · Data Migration · Lineage",
  },
  {
    pillar: "DELIVERY",
    modules: "End-to-End Testing · Cutover Controls · Readiness · Hypercare",
  },
];

export default function OracleFlagship() {
  return (
    <section id="oracle-practice" className="relative overflow-hidden py-24 sm:py-32 bg-[#2B2420] text-[#F7F0E7]">
      {/* Background Photography with Dark Warm Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1800&q=80"
          alt="Modern corporate architecture and digital core infrastructure"
          fill
          className="object-cover object-center opacity-25"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#2B2420]/92 via-[#2B2420]/95 to-[#2B2420]/98" />
      </div>

      <div className="mkt-shell relative z-10">
        <SectionLabel tone="light">Oracle Transformation Practice</SectionLabel>

        {/* Section Header Split */}
        <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-14">
          {/* Left: Headline & Intro */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="lg:col-span-5 space-y-6"
          >
            <h2 className="font-serif text-3xl font-semibold tracking-[-0.03em] text-[#F7F0E7] sm:text-4xl lg:text-5xl lg:leading-[1.12]">
              Modernize the digital core without losing sight of the business.
            </h2>
            <p className="text-base leading-relaxed text-[#CFC4BA]">
              Oracle transformation works when applications, processes, data,
              integration and adoption move together. Consult America connects
              those layers from architecture through testing, cutover and
              production optimization.
            </p>
            <div className="pt-2">
              <Link
                href="/oracle"
                className="group inline-flex items-center gap-2 rounded-md bg-[#FFFDF8] px-6 py-3.5 text-sm font-semibold text-[#261F1B] transition-colors hover:bg-[#FFFAF2] hover:text-[#7D2639]"
              >
                <span>Explore Oracle Transformation</span>
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </motion.div>

          {/* Right: Capability Groups with Thin Warm Dividers */}
          <div className="lg:col-span-7 space-y-5">
            {capabilityGroups.map((group, idx) => (
              <motion.div
                key={group.pillar}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: idx * 0.05 }}
                className="border-b border-[#6F6259]/60 pb-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                  <span className="text-xs font-bold uppercase tracking-[0.14em] text-[#D8C5AA] sm:w-44 shrink-0">
                    {group.pillar}
                  </span>
                  <span className="text-sm font-medium text-[#F7F0E7]">
                    {group.modules}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Oracle + AI Editorial Feature Module */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-16 rounded-lg border border-[#6F6259] bg-[#342B27]/80 backdrop-blur-xs p-8 lg:p-10"
        >
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-8">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-[#D8C5AA]" />
                <span className="text-xs font-bold uppercase tracking-[0.14em] text-[#D8C5AA]">
                  ORACLE + AI INTELLIGENCE
                </span>
              </div>
              <h3 className="mt-3 font-serif text-2xl font-semibold text-[#F7F0E7] sm:text-3xl">
                Extend Oracle workflows with intelligence.
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[#CFC4BA] sm:text-base">
                Use AI and document intelligence to reduce manual review, surface
                operational context, and automate repetitive enterprise tasks while
                keeping business users and controls in the loop.
              </p>
            </div>
            <div className="lg:col-span-4 flex lg:justify-end">
              <Link
                href="/ai-data"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#D8C5AA] hover:text-white transition-colors"
              >
                <span>Learn about AI &amp; Data Integration</span>
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
