"use client";

import Link from "next/link";
import { ArrowUpRight, CheckCircle2, Layers, Cpu, Database, Sparkles, Workflow, Check, Activity, ShieldCheck } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

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

const modules = [
  { name: "Finance", code: "GL / AP / AR", status: "Subledger Synced", icon: Database },
  { name: "Procurement", code: "Source-to-Pay", status: "Contract Grounded", icon: Layers },
  { name: "Supply Chain", code: "Inventory / SCM", status: "Route Optimized", icon: Workflow },
  { name: "Projects", code: "PPM / Costing", status: "Billing Active", icon: Activity },
  { name: "Human Capital", code: "Core HR / Payroll", status: "Workforce Live", icon: CheckCircle2 },
  { name: "Customer Experience", code: "CX / B2B Quotes", status: "Pipeline Connected", icon: Sparkles },
];

export default function OracleFlagship() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="oracle-practice" className="bg-[#FFFAF2] text-[#261F1B] py-20 sm:py-24 lg:py-28 border-b border-[#D7CCBD]">
      <div className="mkt-shell">
        <SectionLabel tone="burgundy">ORACLE</SectionLabel>

        <div className="mt-6 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-start lg:gap-12">
          {/* Left Column: Editorial Headline & Copy */}
          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 16 }}
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
                className="group ca-button-primary inline-flex items-center gap-2 !min-h-[52px] !px-7 text-sm font-semibold rounded-lg cursor-pointer"
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
                    className="rounded-lg border border-[#D7CCBD] bg-[#FFFDF8] p-2.5 text-center"
                  >
                    <p className="font-mono text-xs font-bold text-[#7D2639]">{cap.code}</p>
                    <p className="text-[0.62rem] text-[#695F57] truncate mt-0.5">{cap.name}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right Column: Oracle Transformation Control Center Application Mockup */}
          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 rounded-2xl border border-[#D7CCBD] bg-[#FFFDF8] p-6 lg:p-7 shadow-[0_18px_55px_rgba(38,31,27,0.08)] relative overflow-hidden"
          >
            {/* Control Center Top Bar */}
            <div className="flex items-center justify-between border-b border-[#D7CCBD] pb-4">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#7D2639] text-white font-bold text-xs">
                  O
                </div>
                <div>
                  <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#261F1B]">
                    Oracle Transformation Control Center
                  </h3>
                  <p className="text-[0.62rem] text-[#695F57]">Fusion Cloud Ecosystem Architecture</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 bg-[#DFE4DA] px-2.5 py-1 rounded-full text-[0.62rem] font-bold text-[#657766]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#657766] animate-pulse" />
                <span>All Modules Synchronized</span>
              </div>
            </div>

            {/* Central Hub & Interconnected Modules Layout */}
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3">
              {modules.map((mod, idx) => {
                const Icon = mod.icon;
                return (
                  <div
                    key={mod.name}
                    className="rounded-xl border border-[#D7CCBD]/80 bg-[#FFFAF2] p-3 transition-all hover:border-[#7D2639]/50 hover:bg-[#F4EFE6]"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[0.58rem] font-bold text-[#7D2639] uppercase">
                        {mod.code}
                      </span>
                      <Icon className="h-3.5 w-3.5 text-[#657766]" />
                    </div>
                    <h4 className="mt-1.5 text-xs font-bold text-[#261F1B]">
                      {mod.name}
                    </h4>
                    <p className="mt-1 text-[0.62rem] text-[#657766] font-medium flex items-center gap-1">
                      <Check className="h-2.5 w-2.5 text-[#657766]" /> {mod.status}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Connected Foundation Rail */}
            <div className="mt-5 rounded-xl border border-[#D7CCBD] bg-[#F4EFE6] p-4">
              <div className="flex items-center justify-between text-xs font-bold text-[#261F1B] border-b border-[#D7CCBD] pb-2.5">
                <span className="flex items-center gap-1.5 font-mono text-[0.68rem] uppercase tracking-wider text-[#7D2639]">
                  <Workflow className="h-3.5 w-3.5" /> Connected Core Integration Fabric
                </span>
                <span className="text-[0.62rem] text-[#657766] font-mono">Telemetry: Active</span>
              </div>

              <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                <div className="rounded border border-[#D7CCBD] bg-[#FFFDF8] p-2">
                  <p className="font-mono text-[0.62rem] font-bold text-[#261F1B]">OIC Bridge</p>
                  <p className="text-[0.58rem] text-[#657766]">14 Event Streams</p>
                </div>
                <div className="rounded border border-[#D7CCBD] bg-[#FFFDF8] p-2">
                  <p className="font-mono text-[0.62rem] font-bold text-[#261F1B]">REST APIs</p>
                  <p className="text-[0.58rem] text-[#657766]">&lt;15ms Latency</p>
                </div>
                <div className="rounded border border-[#D7CCBD] bg-[#FFFDF8] p-2">
                  <p className="font-mono text-[0.62rem] font-bold text-[#261F1B]">Enterprise Data</p>
                  <p className="text-[0.58rem] text-[#657766]">100% Reconciled</p>
                </div>
                <div className="rounded border border-[#D7CCBD] bg-[#FFFDF8] p-2">
                  <p className="font-mono text-[0.62rem] font-bold text-[#261F1B]">AI Automation</p>
                  <p className="text-[0.58rem] text-[#657766]">Zero Touch GL</p>
                </div>
              </div>
            </div>

            {/* Bottom Proof Strip */}
            <div className="mt-4 pt-3 border-t border-[#D7CCBD]/80 flex items-center justify-between text-xs text-[#695F57]">
              <span>Zero-downtime cutover framework tested across multi-entity programs</span>
              <Link
                href="/work"
                className="font-bold text-[#7D2639] hover:underline flex items-center gap-1 text-[0.7rem]"
              >
                View Case Studies →
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
