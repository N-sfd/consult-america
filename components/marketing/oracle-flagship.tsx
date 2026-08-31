"use client";

import Link from "next/link";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

import SectionLabel from "@/components/marketing/SectionLabel";

const capabilityTiers = [
  {
    pillar: "FINANCE",
    modules: ["Financials", "Accounting", "Cash", "Assets", "Close"],
  },
  {
    pillar: "PROCUREMENT",
    modules: ["Source-to-Pay", "Supplier Management", "Purchasing"],
  },
  {
    pillar: "SUPPLY CHAIN",
    modules: ["Planning", "Inventory", "Order Management", "Logistics"],
  },
  {
    pillar: "PROJECTS",
    modules: ["Project Financials", "Cost", "Billing", "Program Delivery"],
  },
  {
    pillar: "INTEGRATION & DATA",
    modules: ["APIs", "OIC / Integration", "Analytics", "Reporting", "Data Migration"],
  },
  {
    pillar: "DELIVERY",
    modules: ["Testing", "Cutover", "Readiness", "Optimization"],
  },
];

export default function OracleFlagship() {
  return (
    <section id="oracle-practice" className="mkt-section bg-[#2B2420] text-[#F7F0E7]">
      <div className="mkt-shell">
        <SectionLabel tone="light">Oracle Transformation Practice</SectionLabel>

        {/* Section Header */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-end lg:gap-12">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="lg:col-span-7"
          >
            <h2 className="text-3xl font-bold tracking-[-0.03em] text-[#F7F0E7] sm:text-4xl lg:text-5xl">
              Modernize the digital core.
            </h2>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.08 }}
            className="lg:col-span-5"
          >
            <p className="text-base leading-relaxed text-[#CFC4BA]">
              Oracle transformation succeeds when applications, process, data,
              integrations, controls and adoption move together as one cohesive
              operating system.
            </p>
          </motion.div>
        </div>

        {/* Capability Architecture Grid */}
        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {capabilityTiers.map((tier, idx) => (
            <motion.div
              key={tier.pillar}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: idx * 0.05 }}
              className="rounded-xl border border-[#6F6259] bg-[#342B27] p-6 transition-all duration-200 hover:border-[#D8C5AA]/50"
            >
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#D8C5AA]">
                {tier.pillar}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {tier.modules.map((mod) => (
                  <span
                    key={mod}
                    className="rounded-md border border-[#6F6259]/60 bg-[#2B2420] px-2.5 py-1 text-xs font-medium text-[#F7F0E7]"
                  >
                    {mod}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Oracle + AI Editorial Feature Module */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-12 rounded-2xl border border-[#6F6259] bg-[#3A302B] p-8 lg:p-10"
        >
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-8">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-[#D8C5AA]" />
                <span className="text-xs font-bold uppercase tracking-[0.14em] text-[#D8C5AA]">
                  Oracle + AI
                </span>
              </div>
              <h3 className="mt-3 text-2xl font-bold text-[#F7F0E7] sm:text-3xl">
                Extending enterprise workflows with document intelligence and automated controls.
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[#CFC4BA] sm:text-base">
                We bridge Oracle Fusion and EPM with intelligent agents that
                extract contract terms, reconcile multi-entity journals, and validate
                invoices before cutover—freeing finance and supply chain teams from
                repetitive manual reconciliation.
              </p>
            </div>
            <div className="lg:col-span-4 flex flex-col gap-3 sm:flex-row lg:flex-col lg:items-end">
              <Link
                href="/oracle"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-[#FFFDF8] px-6 text-sm font-bold text-[#261F1B] transition-all hover:bg-[#FFFAF2] hover:text-[#7D2639] w-full sm:w-auto"
              >
                Explore Oracle Transformation
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
