"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, CheckCircle2, Layers, Cpu, Database, Sparkles, Workflow, Check, Activity, Network } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";

import SectionLabel from "@/components/marketing/SectionLabel";

const compactChips = [
  { code: "ERP", label: "Financials" },
  { code: "HCM", label: "Human Capital" },
  { code: "SCM", label: "Supply Chain" },
  { code: "EPM", label: "Planning" },
  { code: "CX", label: "Customer Experience" },
  { code: "PPM", label: "Projects" },
  { code: "OIC", label: "Integration" },
  { code: "Analytics", label: "Intelligence" },
];

const pillars = [
  { id: "finance", name: "Finance", code: "ERP", desc: "Multi-entity general ledger, subledgers, cash management", icon: Database },
  { id: "procure", name: "Procurement", code: "S2P", desc: "Source-to-pay, supplier contract governance", icon: Layers },
  { id: "scm", name: "Supply Chain", code: "SCM", desc: "Demand planning, inventory, order fulfillment", icon: Workflow },
  { id: "projects", name: "Projects", code: "PPM", desc: "Costing, billing, project resource management", icon: Activity },
  { id: "hcm", name: "Human Capital", code: "HCM", desc: "Core HR, payroll, global workforce lifecycle", icon: CheckCircle2 },
  { id: "cx", name: "Customer Experience", code: "CX", desc: "B2B service, configure-price-quote, sales", icon: Sparkles },
];

export default function OracleFlagship() {
  const shouldReduceMotion = useReducedMotion();
  const [activePillar, setActivePillar] = useState(pillars[0]);

  return (
    <section id="oracle-practice" className="relative overflow-hidden bg-[#F7F3EC] text-[#261F1B] py-24 sm:py-28 lg:py-32 border-b border-[#D8D0C5]">
      {/* 1. Subtle Enterprise Operations Background Image */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.05]">
        <Image
          src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=2200&q=80"
          alt="Modern enterprise operations environment"
          fill
          className="object-cover object-center grayscale contrast-125"
          sizes="100vw"
        />
      </div>

      <div className="mkt-shell relative z-10">
        <SectionLabel tone="burgundy">ORACLE PRACTICE</SectionLabel>

        <div className="mt-8 grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center lg:gap-14">
          {/* Left Column: Editorial Headline & Compact Chips (~42%) */}
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
              From strategy and clean-core implementation to controlled enterprise cutovers, OIC integrations,
              and continuous optimization, Consult America helps organizations modernize finance, supply chain,
              and human capital to support clean period-close execution and audit-ready operations from go-live.
            </p>

            <div className="pt-2">
              <Link
                href="/oracle"
                className="group ca-button-primary inline-flex items-center gap-2 !min-h-[52px] !px-7 text-sm font-semibold rounded-lg cursor-pointer !bg-[#B63A3A] hover:!bg-[#942E31]"
              >
                <span>Explore Oracle practice</span>
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>

            {/* Compact Capability Chips */}
            <div className="mt-10 border-t border-[#D8D0C5] pt-6">
              <p className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#695F57] mb-3">
                Fusion Cloud Capabilities
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {compactChips.map((chip) => (
                  <div
                    key={chip.code}
                    className="rounded-lg border border-[#D8D0C5] bg-white/90 p-2 text-center shadow-xs"
                  >
                    <p className="font-mono text-xs font-bold text-[#B63A3A]">{chip.code}</p>
                    <p className="text-[0.6rem] text-[#695F57] truncate">{chip.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right Column: Central Oracle Cloud Hub Architecture (~58%) */}
          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 rounded-2xl border border-[#D8D0C5] bg-white p-6 lg:p-8 shadow-[0_20px_60px_rgba(38,31,27,0.06)] relative overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#D8D0C5] pb-4">
              <div>
                <span className="font-mono text-[0.62rem] font-bold uppercase tracking-wider text-[#B63A3A]">
                  OPERATING ARCHITECTURE
                </span>
                <h3 className="font-serif text-base sm:text-lg font-bold text-[#261F1B]">
                  Oracle Fusion Cloud Ecosystem
                </h3>
              </div>
              <span className="rounded bg-[#F7F3EC] border border-[#D8D0C5] px-2.5 py-1 text-[0.62rem] font-bold text-[#357C78]">
                Clean Core Architecture
              </span>
            </div>

            {/* Level 1: Oracle Fusion Cloud Center Node */}
            <div className="mt-6 rounded-xl border border-[#B63A3A]/30 bg-[#FFFDF8] p-4 text-center shadow-xs">
              <div className="flex items-center justify-center gap-2">
                <Database className="h-4 w-4 text-[#B63A3A]" />
                <span className="font-serif text-base sm:text-lg font-bold text-[#261F1B]">
                  ORACLE FUSION CLOUD
                </span>
              </div>
              <p className="text-[0.68rem] text-[#695F57] mt-0.5">
                Core unified ledger, procurement, supply chain, HCM &amp; customer platform
              </p>

              {/* 6 Business Domains Grid */}
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-2 text-left">
                {pillars.map((p) => {
                  const Icon = p.icon;
                  const isSelected = activePillar.id === p.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setActivePillar(p)}
                      className={`rounded-lg border p-2.5 transition-all cursor-pointer ${
                        isSelected
                          ? "border-[#B63A3A] bg-[#FFFDF8] shadow-xs ring-1 ring-[#B63A3A]"
                          : "border-[#D8D0C5] bg-white hover:border-[#B63A3A]/40 hover:bg-[#FFFDF8]/60"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[0.55rem] font-bold text-[#B63A3A] uppercase">
                          {p.code}
                        </span>
                        <Icon className="h-3 w-3 text-[#357C78]" />
                      </div>
                      <h4 className="mt-1 text-xs font-bold text-[#261F1B]">
                        {p.name}
                      </h4>
                      <p className="mt-0.5 text-[0.58rem] text-[#695F57] line-clamp-1">
                        {p.desc}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Animated Connector 1: Fusion -> Integration */}
            <div className="flex flex-col items-center justify-center my-2.5">
              <div className="h-4 w-0.5 bg-[#D8D0C5] relative overflow-hidden">
                <div className="absolute inset-x-0 h-2 bg-[#B63A3A] animate-pulse" />
              </div>
              <span className="text-[0.55rem] font-mono font-bold text-[#B63A3A] uppercase tracking-wider">
                ↓
              </span>
            </div>

            {/* Level 2: Integration & Data Layer */}
            <div className="rounded-xl border border-[#D8D0C5] bg-[#F7F3EC] p-3.5">
              <div className="flex items-center justify-between text-xs font-bold text-[#261F1B] border-b border-[#D8D0C5] pb-1.5">
                <span className="flex items-center gap-1.5 font-mono text-[0.65rem] uppercase tracking-wider text-[#B63A3A]">
                  <Workflow className="h-3.5 w-3.5" /> Integration &amp; Data Fabric
                </span>
                <span className="text-[0.58rem] text-[#357C78] font-mono">OIC · REST APIs · Enterprise Data</span>
              </div>

              <div className="mt-2.5 grid grid-cols-4 gap-1.5 text-center">
                <div className="rounded border border-[#D8D0C5] bg-white p-1.5">
                  <p className="font-mono text-[0.58rem] font-bold text-[#261F1B]">OIC</p>
                  <p className="text-[0.52rem] text-[#357C78]">Integration</p>
                </div>
                <div className="rounded border border-[#D8D0C5] bg-white p-1.5">
                  <p className="font-mono text-[0.58rem] font-bold text-[#261F1B]">REST APIs</p>
                  <p className="text-[0.52rem] text-[#357C78]">Services</p>
                </div>
                <div className="rounded border border-[#D8D0C5] bg-white p-1.5">
                  <p className="font-mono text-[0.58rem] font-bold text-[#261F1B]">Data</p>
                  <p className="text-[0.52rem] text-[#357C78]">Schemas</p>
                </div>
                <div className="rounded border border-[#D8D0C5] bg-white p-1.5">
                  <p className="font-mono text-[0.58rem] font-bold text-[#261F1B]">Analytics</p>
                  <p className="text-[0.52rem] text-[#357C78]">Intelligence</p>
                </div>
              </div>
            </div>

            {/* Animated Connector 2: Integration -> AI */}
            <div className="flex flex-col items-center justify-center my-2.5">
              <div className="h-4 w-0.5 bg-[#D8D0C5] relative overflow-hidden">
                <div className="absolute inset-x-0 h-2 bg-[#B63A3A] animate-pulse" />
              </div>
              <span className="text-[0.55rem] font-mono font-bold text-[#B63A3A] uppercase tracking-wider">
                ↓
              </span>
            </div>

            {/* Level 3: AI & Automation Layer */}
            <div className="rounded-xl border border-[#D8D0C5] bg-[#FFFDF8] p-3">
              <div className="flex items-center justify-between text-xs font-bold text-[#261F1B]">
                <span className="flex items-center gap-1.5 font-mono text-[0.65rem] uppercase tracking-wider text-[#357C78]">
                  <Sparkles className="h-3.5 w-3.5 text-[#B63A3A]" /> AI &amp; Automation Layer
                </span>
                <span className="text-[0.58rem] text-[#695F57] font-mono">Agents · Closed-Loop Actions</span>
              </div>
            </div>

            {/* Bottom Proof Strip */}
            <div className="mt-4 pt-3 border-t border-[#D8D0C5] flex items-center justify-between text-xs text-[#695F57]">
              <span className="text-[0.68rem]">Controlled enterprise cutover methodology across multi-entity programs</span>
              <Link
                href="/work"
                className="font-bold text-[#B63A3A] hover:underline flex items-center gap-1 text-[0.7rem]"
              >
                View Solution Showcases →
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
