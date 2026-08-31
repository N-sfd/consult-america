"use client";

import Link from "next/link";
import { ArrowUpRight, CheckCircle2, Layers, Cpu, Database, Sparkles, Workflow, Building } from "lucide-react";
import { motion } from "framer-motion";

import SectionLabel from "@/components/marketing/SectionLabel";

const capabilityRail = [
  { code: "ERP", name: "Financials & GL" },
  { code: "HCM", name: "Human Capital" },
  { code: "SCM", name: "Supply Chain" },
  { code: "EPM", name: "Planning & Budgeting" },
  { code: "CX", name: "Customer Experience" },
  { code: "PPM", name: "Project Portfolio" },
  { code: "OIC", name: "Integration Cloud" },
  { code: "Analytics", name: "Fusion Data Intelligence" },
];

const pillars = [
  { name: "Finance", desc: "Multi-entity accounting, cash management, subledger reconciliation" },
  { name: "Procurement", desc: "Source-to-pay, supplier contract governance, punchout catalogs" },
  { name: "Projects", desc: "Project costing, billing, revenue recognition, grants accounting" },
  { name: "Supply Chain", desc: "Demand planning, inventory tracking, order fulfillment, logistics" },
  { name: "Human Capital", desc: "Core HR, talent acquisition, compensation, workforce modeling" },
  { name: "Customer Experience", desc: "Connected service, configure-price-quote, contract intelligence" },
];

export default function OracleFlagship() {
  return (
    <section id="oracle-practice" className="bg-[#FFFAF2] text-[#261F1B] py-20 sm:py-24 lg:py-28 border-b border-[#D7CCBD]">
      <div className="mkt-shell">
        <SectionLabel tone="burgundy">ORACLE</SectionLabel>

        <div className="mt-6 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-start lg:gap-12">
          {/* Left Column: Editorial Headline & Copy */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="lg:col-span-5 space-y-6"
          >
            <h2 className="font-serif text-3xl font-semibold tracking-[-0.03em] text-[#261F1B] sm:text-4xl lg:text-5xl lg:leading-[1.1]">
              Modernize the enterprise around Oracle Cloud.
            </h2>
            <p className="text-base sm:text-lg leading-relaxed text-[#695F57]">
              From strategy and implementation to integration, testing and optimization,
              Consult America helps organizations turn Oracle investments into connected,
              high-performing business operations.
            </p>

            <div className="pt-2">
              <Link
                href="/oracle"
                className="group ca-button-primary inline-flex items-center gap-2 !min-h-12 !px-7 text-sm font-semibold rounded-md cursor-pointer"
              >
                <span>Explore Oracle capabilities</span>
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>

            {/* Capability Rail Strip */}
            <div className="mt-10 border-t border-[#D7CCBD] pt-6">
              <p className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#695F57]">
                Fusion Cloud Capabilities
              </p>
              <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2">
                {capabilityRail.map((cap) => (
                  <div
                    key={cap.code}
                    className="rounded border border-[#D7CCBD] bg-[#FFFDF8] p-2 text-center"
                  >
                    <p className="font-mono text-xs font-bold text-[#7D2639]">{cap.code}</p>
                    <p className="text-[0.62rem] text-[#695F57] truncate mt-0.5">{cap.name}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right Column: Oracle Transformation Architecture Visualization */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 rounded-2xl border border-[#D7CCBD] bg-[#FFFDF8] p-6 lg:p-8 shadow-[0_16px_45px_rgba(38,31,27,0.06)]"
          >
            {/* Top Architecture Bar */}
            <div className="flex items-center justify-between border-b border-[#D7CCBD] pb-4">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-[#7D2639]" />
                <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#261F1B]">
                  Oracle Cloud Operating Architecture
                </h3>
              </div>
              <span className="rounded bg-[#DFE4DA] px-2 py-0.5 text-[0.65rem] font-bold text-[#657766]">
                Production Validated
              </span>
            </div>

            {/* Functional Pillars Grid */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {pillars.map((pillar) => (
                <div
                  key={pillar.name}
                  className="rounded-lg border border-[#D7CCBD]/80 bg-[#FFFAF2] p-3.5 transition-all hover:border-[#7D2639]/40 hover:bg-[#F4EFE6]"
                >
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-[#7D2639]" />
                    <span className="text-xs font-bold text-[#261F1B]">{pillar.name}</span>
                  </div>
                  <p className="mt-1.5 text-[0.68rem] leading-relaxed text-[#695F57]">
                    {pillar.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* Connected Foundation Layer */}
            <div className="mt-6 rounded-xl border border-[#D7CCBD] bg-[#F4EFE6] p-4.5">
              <div className="flex items-center justify-between text-xs font-bold text-[#261F1B] border-b border-[#D7CCBD] pb-2.5">
                <span className="flex items-center gap-1.5">
                  <Workflow className="h-4 w-4 text-[#7D2639]" />
                  Connected Core Fabric
                </span>
                <span className="text-[0.68rem] text-[#657766]">Unified Enterprise Backplane</span>
              </div>

              <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="rounded border border-[#D7CCBD] bg-[#FFFDF8] p-2.5">
                  <div className="flex items-center gap-1.5 font-bold text-[#261F1B]">
                    <Cpu className="h-3.5 w-3.5 text-[#7D2639]" />
                    <span>Oracle Integration Cloud</span>
                  </div>
                  <p className="mt-1 text-[0.65rem] text-[#695F57]">
                    Automated event bridges, API gateways &amp; subledger flows.
                  </p>
                </div>

                <div className="rounded border border-[#D7CCBD] bg-[#FFFDF8] p-2.5">
                  <div className="flex items-center gap-1.5 font-bold text-[#261F1B]">
                    <Database className="h-3.5 w-3.5 text-[#657766]" />
                    <span>Enterprise Data</span>
                  </div>
                  <p className="mt-1 text-[0.65rem] text-[#695F57]">
                    Fusion Analytics, data marts &amp; cross-system lineage.
                  </p>
                </div>

                <div className="rounded border border-[#D7CCBD] bg-[#FFFDF8] p-2.5">
                  <div className="flex items-center gap-1.5 font-bold text-[#261F1B]">
                    <Sparkles className="h-3.5 w-3.5 text-[#7D2639]" />
                    <span>AI &amp; Automation</span>
                  </div>
                  <p className="mt-1 text-[0.65rem] text-[#695F57]">
                    Exception triage, matching rules &amp; touchless AP processing.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
