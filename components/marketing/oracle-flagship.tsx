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
    <section id="oracle-practice" className="mkt-section bg-[#F1F2EE] text-[#101828]">
      <div className="mkt-shell">
        <SectionLabel tone="burgundy">Oracle Transformation Practice</SectionLabel>

        {/* Split Layout: Left Text & CTA / Right Architectural Image */}
        <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center lg:gap-14">
          {/* Left: Headline & Intro */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="lg:col-span-6 space-y-6"
          >
            <h2 className="font-serif text-3xl font-semibold tracking-[-0.03em] text-[#101828] sm:text-4xl lg:text-5xl lg:leading-[1.12]">
              Modernize the digital core.
            </h2>
            <p className="text-base leading-relaxed text-[#475467]">
              Oracle transformation works when applications, processes, data,
              integration and adoption move together. Consult America connects
              those layers from architecture through testing, cutover and
              production optimization.
            </p>
            <div className="pt-2">
              <Link
                href="/oracle"
                className="group inline-flex items-center gap-2 rounded-md bg-[#B63838] px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#8F292D] cursor-pointer"
              >
                <span>Explore Oracle Transformation</span>
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </motion.div>

          {/* Right: Modern Architecture / Business Operations Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6"
          >
            <div className="relative aspect-[16/10] lg:h-[380px] w-full overflow-hidden rounded-lg border border-[#E2E7EC] bg-[#FFFFFF] shadow-[0_12px_36px_rgba(20,30,45,0.06)]">
              <Image
                src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80"
                alt="Modern corporate architecture and digital core operations"
                fill
                className="object-cover mkt-img-graded"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#101828]/40 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#EEF2F5]">
                  ENTERPRISE BACKBONE
                </span>
                <p className="mt-1 text-xs text-[#F5F7FA]">
                  Connected Fusion architecture from general ledger to shop-floor supply chain.
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Capability Groups with Thin Gray Dividers */}
        <div className="mt-16 border-t border-[#E2E7EC] pt-12">
          <p className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#B63838]">
            Oracle Practice Breadth
          </p>
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {capabilityGroups.map((group, idx) => (
              <motion.div
                key={group.pillar}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: idx * 0.05 }}
                className="rounded-md border border-[#E2E7EC] bg-[#FFFFFF] p-5 shadow-xs"
              >
                <span className="text-xs font-bold uppercase tracking-[0.14em] text-[#B63838]">
                  {group.pillar}
                </span>
                <p className="mt-2 text-xs leading-relaxed text-[#475467]">
                  {group.modules}
                </p>
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
          className="mt-12 rounded-lg border border-[#E2E7EC] bg-[#FFFFFF] p-8 lg:p-10 shadow-sm"
        >
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-8">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-[#B63838]" />
                <span className="text-xs font-bold uppercase tracking-[0.14em] text-[#B63838]">
                  ORACLE + AI INTELLIGENCE
                </span>
              </div>
              <h3 className="mt-3 font-serif text-2xl font-semibold text-[#101828] sm:text-3xl">
                Extend Oracle workflows with intelligence.
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[#475467] sm:text-base">
                Use AI and document intelligence to reduce manual review, surface
                operational context, and automate repetitive enterprise tasks while
                keeping business users and controls in the loop.
              </p>
            </div>
            <div className="lg:col-span-4 flex lg:justify-end">
              <Link
                href="/ai-data"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#B63838] hover:text-[#8F292D] transition-colors"
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
