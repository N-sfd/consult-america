"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  CheckCircle2,
  Sparkles,
  Activity,
  ShieldCheck,
  Database,
  Cpu,
  ChevronRight,
  Layers,
  Workflow,
  Check,
  Server,
  Network,
  Lock,
  Zap,
  BarChart3,
  FileText,
  Building2,
  Bot
} from "lucide-react";
import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import { useState } from "react";

import { useContactPanel } from "@/components/providers/contact-provider";

type PracticeKey = "oracle" | "ai" | "core" | "crm" | "engineering";

interface PracticeConfig {
  key: PracticeKey;
  label: string;
  badge: string;
  headline: string;
  tagline: string;
}

const practices: PracticeConfig[] = [
  {
    key: "oracle",
    label: "Oracle Cloud Core",
    badge: "FUSION CLOUD SUITE",
    headline: "Oracle Cloud Transformation Control Center",
    tagline: "ERP · SCM · HCM · EPM · OIC Integration Fabric",
  },
  {
    key: "ai",
    label: "AI & Governed Data",
    badge: "DATA AGENT INTELLIGENCE",
    headline: "Autonomous Document & Workflow Intelligence",
    tagline: "DFARS Verified · 99.8% Grounding · Zero Hallucination",
  },
  {
    key: "core",
    label: "Enterprise Digital Core",
    badge: "MISSION CONTROL OS",
    headline: "Connected Multi-Cloud Operating System",
    tagline: "Real-time Telemetry · Zero-Downtime Governance",
  },
  {
    key: "crm",
    label: "Customer 360 & CRM",
    badge: "REVENUE INTELLIGENCE",
    headline: "Unified Customer & Contract Intelligence",
    tagline: "Pipeline Health · Automated ERP Invoicing Lineage",
  },
];

export default function Hero() {
  const { setOpen } = useContactPanel();
  const shouldReduceMotion = useReducedMotion();
  const [activePractice, setActivePractice] = useState<PracticeKey>("oracle");

  return (
    <section className="relative overflow-hidden border-b border-[#D7CCBD]/80 min-h-[760px] lg:min-h-[86vh] flex items-center bg-[#F4EFE6]">
      {/* 1. Cinematic Photographic Background with Controlled Warm Overlays (Kyndryl & Jade Global standard) */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <motion.div
          animate={shouldReduceMotion ? {} : { scale: [1, 1.025, 1] }}
          transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
          className="relative h-full w-full"
        >
          <Image
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2400&q=85"
            alt="Modern enterprise architecture and operations center"
            fill
            priority
            className="object-cover object-center opacity-30 filter grayscale contrast-125"
            sizes="100vw"
          />
        </motion.div>

        {/* Sophisticated Warm Ivory Scrim Layering (Ensuring Left Copy Dominance) */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(244,239,230,0.98) 0%, rgba(244,239,230,0.94) 36%, rgba(244,239,230,0.72) 65%, rgba(244,239,230,0.25) 100%)",
          }}
        />
        {/* Subtle Ambient Depth Lighting */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#F4EFE6] via-transparent to-transparent opacity-95" />
        <div className="absolute inset-0 bg-radial-[circle_at_75%_25%] from-[#7D2639]/8 via-transparent to-transparent pointer-events-none" />
      </div>

      <div className="mkt-shell relative z-10 py-12 sm:py-16 lg:py-20 w-full">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center lg:gap-10 xl:gap-14">
          {/* Left Column: 50–52% width */}
          <div className="lg:col-span-6 xl:col-span-6">
            {/* Sophisticated Practice Badge */}
            <motion.div
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="flex items-center gap-2.5"
            >
              <span className="h-0.5 w-6 rounded-full bg-[#7D2639]" />
              <span className="text-[0.72rem] sm:text-[0.78rem] font-medium uppercase tracking-[0.14em] text-[#7D2639]">
                ENTERPRISE TRANSFORMATION · ORACLE CLOUD · AI &amp; DATA
              </span>
            </motion.div>

            {/* Commanding Authority Headline */}
            <motion.h1
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.08 }}
              className="mt-5 font-serif text-4xl font-semibold tracking-[-0.04em] text-[#261F1B] sm:text-5xl lg:text-6xl xl:text-[72px] xl:leading-[0.95] max-w-[780px]"
            >
              Transform the core.
              <br />
              <span className="text-[#7D2639]">Build what comes next.</span>
            </motion.h1>

            {/* Supporting Copy */}
            <motion.p
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.16 }}
              className="mt-6 max-w-xl text-base leading-relaxed text-[#695F57] sm:text-lg lg:text-[1.125rem]"
            >
              Consult America modernizes enterprise platforms, connects data and workflows,
              operationalizes AI, and engineers the digital systems that move the business forward.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.24 }}
              className="mt-8 flex flex-col gap-3.5 sm:flex-row sm:items-center"
            >
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="group/cta ca-button-primary !min-h-[54px] !px-8 text-sm font-semibold rounded-lg cursor-pointer shadow-[0_8px_22px_rgba(125,38,57,0.25)] hover:shadow-[0_12px_30px_rgba(125,38,57,0.35)]"
              >
                Start a conversation
                <ArrowUpRight className="mkt-cta-arrow h-4 w-4 transition-transform group-hover/cta:translate-x-1 group-hover/cta:-translate-y-0.5" />
              </button>
              <Link
                href="/oracle"
                className="inline-flex min-h-[54px] items-center justify-center gap-2 rounded-lg border border-[#261F1B]/70 bg-[#FFFDF8]/80 backdrop-blur-xs px-6 text-sm font-semibold text-[#261F1B] transition-all hover:border-[#7D2639] hover:text-[#7D2639] hover:bg-[#FFFDF8]"
              >
                Explore Oracle capabilities →
              </Link>
            </motion.div>

            {/* Interactive Capability Selector Rail (Kyndryl & Peloton Style) */}
            <motion.div
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.32 }}
              className="mt-10 border-t border-[#D7CCBD] pt-5"
            >
              <div className="flex items-center justify-between">
                <p className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#695F57]">
                  Interactive Solution Architecture
                </p>
                <span className="text-[0.65rem] text-[#7D2639] font-mono font-bold">
                  Click to inspect live OS
                </span>
              </div>

              {/* Solution Pill Buttons */}
              <div className="mt-3 flex flex-wrap gap-2">
                {practices.map((p) => {
                  const isActive = activePractice === p.key;
                  return (
                    <button
                      key={p.key}
                      type="button"
                      onClick={() => setActivePractice(p.key)}
                      className={`relative rounded-lg px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer border ${
                        isActive
                          ? "border-[#7D2639] bg-[#7D2639] text-white shadow-sm"
                          : "border-[#D7CCBD] bg-[#FFFDF8]/90 text-[#261F1B] hover:border-[#7D2639]/60 hover:bg-[#FFFDF8]"
                      }`}
                    >
                      <span>{p.label}</span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </div>

          {/* Right Column: Layered Enterprise Command Center (48–50% width) */}
          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.65, delay: 0.15 }}
            className="lg:col-span-6 xl:col-span-6 relative"
          >
            {/* Background Layer Offset Frame */}
            <div className="absolute -inset-2 -right-3 rounded-2xl border border-[#D7CCBD]/80 bg-[#FFFAF2]/90 -rotate-1 hidden sm:block shadow-sm" />

            {/* Main Application Container */}
            <div className="relative rounded-2xl border border-[#D7CCBD] bg-[#FFFDF8] shadow-[0_22px_65px_rgba(38,31,27,0.12)] overflow-hidden backdrop-blur-md">
              {/* Top Window Bar (Kyndryl Bridge / Oracle Cloud Console style) */}
              <div className="flex items-center justify-between border-b border-[#D7CCBD] bg-[#F4EFE6]/95 px-4 py-2.5">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#D7CCBD]" />
                    <span className="h-2.5 w-2.5 rounded-full bg-[#D7CCBD]" />
                    <span className="h-2.5 w-2.5 rounded-full bg-[#D7CCBD]" />
                  </div>
                  <span className="ml-2 font-mono text-[0.68rem] font-bold tracking-wider text-[#261F1B] uppercase flex items-center gap-1.5">
                    <Server className="h-3 w-3 text-[#7D2639]" /> Command Bridge OS
                  </span>
                </div>
                <div className="flex items-center gap-1.5 bg-[#DFE4DA] px-2.5 py-0.5 rounded-full">
                  <span className="h-2 w-2 rounded-full bg-[#657766] animate-pulse" />
                  <span className="text-[0.62rem] font-bold text-[#657766] uppercase tracking-wider">
                    PRODUCTION · MULTI-REGION
                  </span>
                </div>
              </div>

              {/* Live Telemetry Ticker Ribbon */}
              <div className="grid grid-cols-4 border-b border-[#D7CCBD]/80 bg-[#FFFAF2] text-center text-[0.65rem] py-2 px-1">
                <div className="border-r border-[#D7CCBD]/60">
                  <p className="text-[#695F57] text-[0.58rem] uppercase font-bold">Latency</p>
                  <p className="font-mono font-bold text-[#261F1B]">8.4 ms</p>
                </div>
                <div className="border-r border-[#D7CCBD]/60">
                  <p className="text-[#695F57] text-[0.58rem] uppercase font-bold">Data Quality</p>
                  <p className="font-mono font-bold text-[#657766]">99.4%</p>
                </div>
                <div className="border-r border-[#D7CCBD]/60">
                  <p className="text-[#695F57] text-[0.58rem] uppercase font-bold">Active Agents</p>
                  <p className="font-mono font-bold text-[#7D2639]">18 Live</p>
                </div>
                <div>
                  <p className="text-[#695F57] text-[0.58rem] uppercase font-bold">Cutover Health</p>
                  <p className="font-mono font-bold text-[#657766]">100% Ready</p>
                </div>
              </div>

              {/* Dynamic Interactive Workspace based on Selected Practice */}
              <div className="p-4 sm:p-5 min-h-[310px] flex flex-col justify-between">
                <AnimatePresence mode="wait">
                  {/* VIEW 1: ORACLE CLOUD CONTROL CENTER */}
                  {activePractice === "oracle" && (
                    <motion.div
                      key="oracle"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-mono text-[0.62rem] font-bold text-[#7D2639] uppercase tracking-wider">
                            FUSION CLOUD SUITE
                          </span>
                          <h4 className="font-serif text-sm sm:text-base font-bold text-[#261F1B]">
                            Oracle Transformation Control Center
                          </h4>
                        </div>
                        <span className="rounded bg-[#DFE4DA] px-2 py-0.5 text-[0.6rem] font-bold text-[#657766]">
                          OIC Synced
                        </span>
                      </div>

                      {/* Oracle Modules Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {[
                          { name: "Fusion Financials", code: "GL · AP · AR", status: "Subledger Synced", icon: Database },
                          { name: "Supply Chain", code: "SCM · Order Mgt", status: "Inventory Live", icon: Workflow },
                          { name: "Human Capital", code: "Core HR · Payroll", status: "Workforce Active", icon: CheckCircle2 },
                          { name: "Procurement", code: "Source-to-Pay", status: "FAR Compliant", icon: Layers },
                          { name: "Projects PPM", code: "Costing · Billing", status: "Zero Variance", icon: Activity },
                          { name: "OIC Hub", code: "REST · Event Bus", status: "<10ms Bridge", icon: Network },
                        ].map((m) => {
                          const Icon = m.icon;
                          return (
                            <div
                              key={m.name}
                              className="rounded-lg border border-[#D7CCBD]/80 bg-[#FFFAF2] p-2 text-xs"
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-[#261F1B] text-[0.68rem]">{m.name}</span>
                                <Icon className="h-3 w-3 text-[#7D2639]" />
                              </div>
                              <p className="text-[0.6rem] text-[#695F57] mt-0.5 font-mono">{m.code}</p>
                              <p className="text-[0.58rem] text-[#657766] font-bold mt-1 flex items-center gap-1">
                                <Check className="h-2.5 w-2.5" /> {m.status}
                              </p>
                            </div>
                          );
                        })}
                      </div>

                      {/* Period Close & Reconciliation Progress */}
                      <div className="rounded-lg border border-[#D7CCBD] bg-[#F4EFE6] p-2.5 flex items-center justify-between text-xs">
                        <span className="text-[0.68rem] font-bold text-[#261F1B]">
                          Period Close Automation: 75% Cycle Compression
                        </span>
                        <span className="font-mono text-[0.65rem] font-bold text-[#7D2639]">
                          Audit Passed
                        </span>
                      </div>
                    </motion.div>
                  )}

                  {/* VIEW 2: AI & DATA AGENT */}
                  {activePractice === "ai" && (
                    <motion.div
                      key="ai"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-mono text-[0.62rem] font-bold text-[#7D2639] uppercase tracking-wider">
                            DATA AGENT INTELLIGENCE
                          </span>
                          <h4 className="font-serif text-sm sm:text-base font-bold text-[#261F1B]">
                            Neural Document Extraction &amp; Verification
                          </h4>
                        </div>
                        <span className="rounded bg-[#DFE4DA] px-2 py-0.5 text-[0.6rem] font-bold text-[#657766]">
                          Grounding: 99.8%
                        </span>
                      </div>

                      {/* Extraction Flow Simulation */}
                      <div className="space-y-2 text-xs">
                        <div className="rounded-lg border border-[#D7CCBD] bg-[#FFFAF2] p-2.5">
                          <div className="flex items-center justify-between font-bold text-[#261F1B] text-[0.68rem]">
                            <span className="flex items-center gap-1.5 text-[#7D2639]">
                              <FileText className="h-3.5 w-3.5" /> Federal_Subcontract_MSA.pdf
                            </span>
                            <span className="text-[#657766] font-mono">Page 18 Chunk #14</span>
                          </div>
                          <p className="mt-1 text-[0.65rem] text-[#695F57] italic bg-[#FFFDF8] p-1.5 rounded border border-[#D7CCBD]/50">
                            &ldquo;FAR 52.227-14 Rights in Data &amp; DFARS 252.204-7012 Compliance Clause...&rdquo;
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div className="rounded-lg border border-[#D7CCBD] bg-[#FFFAF2] p-2">
                            <p className="text-[0.58rem] font-bold uppercase text-[#695F57]">Extracted Fields</p>
                            <p className="font-serif text-base font-bold text-[#261F1B] mt-0.5">47 Entities</p>
                            <p className="text-[0.58rem] text-[#657766]">100% Grounded</p>
                          </div>
                          <div className="rounded-lg border border-[#D7CCBD] bg-[#FFFAF2] p-2">
                            <p className="text-[0.58rem] font-bold uppercase text-[#695F57]">Oracle ERP Integration</p>
                            <p className="font-serif text-base font-bold text-[#7D2639] mt-0.5">Auto-Posted</p>
                            <p className="text-[0.58rem] text-[#695F57]">Zero Human Error</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* VIEW 3: ENTERPRISE DIGITAL CORE */}
                  {activePractice === "core" && (
                    <motion.div
                      key="core"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-mono text-[0.62rem] font-bold text-[#7D2639] uppercase tracking-wider">
                            CONNECTED CORE FABRIC
                          </span>
                          <h4 className="font-serif text-sm sm:text-base font-bold text-[#261F1B]">
                            Multi-Cloud Enterprise Orchestrator
                          </h4>
                        </div>
                        <span className="rounded bg-[#DFE4DA] px-2 py-0.5 text-[0.6rem] font-bold text-[#657766]">
                          Zero Downtime
                        </span>
                      </div>

                      <div className="space-y-2">
                        {[
                          { system: "Oracle Cloud Infrastructure", type: "Core Financials & SCM", uptime: "99.99%", latency: "6ms" },
                          { system: "Salesforce CRM Enterprise", type: "Customer 360 Pipeline", uptime: "99.98%", latency: "12ms" },
                          { system: "Snowflake / Lakehouse Fabric", type: "Analytics & Telemetry", uptime: "100%", latency: "18ms" },
                          { system: "Convera API Gateway", type: "Microservices & Auth", uptime: "99.99%", latency: "4ms" },
                        ].map((s) => (
                          <div
                            key={s.system}
                            className="flex items-center justify-between rounded-lg border border-[#D7CCBD]/80 bg-[#FFFAF2] p-2 text-xs"
                          >
                            <div>
                              <p className="font-bold text-[#261F1B] text-[0.68rem]">{s.system}</p>
                              <p className="text-[0.6rem] text-[#695F57]">{s.type}</p>
                            </div>
                            <div className="text-right font-mono text-[0.62rem]">
                              <span className="text-[#657766] font-bold">{s.uptime}</span>
                              <span className="text-[#695F57] block">{s.latency}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* VIEW 4: CUSTOMER 360 CRM */}
                  {activePractice === "crm" && (
                    <motion.div
                      key="crm"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-mono text-[0.62rem] font-bold text-[#7D2639] uppercase tracking-wider">
                            CUSTOMER 360 INTELLIGENCE
                          </span>
                          <h4 className="font-serif text-sm sm:text-base font-bold text-[#261F1B]">
                            Acme Corporation Enterprise Account
                          </h4>
                        </div>
                        <span className="rounded bg-[#DFE4DA] px-2 py-0.5 text-[0.6rem] font-bold text-[#657766]">
                          Tier 1 Strategic
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-center text-xs">
                        <div className="rounded-lg border border-[#D7CCBD] bg-[#FFFAF2] p-2">
                          <p className="text-[0.58rem] font-bold text-[#695F57]">Relationship</p>
                          <p className="font-serif text-base font-bold text-[#657766] mt-0.5">94% Health</p>
                        </div>
                        <div className="rounded-lg border border-[#D7CCBD] bg-[#FFFAF2] p-2">
                          <p className="text-[0.58rem] font-bold text-[#695F57]">Open Pipeline</p>
                          <p className="font-serif text-base font-bold text-[#7D2639] mt-0.5">$3.2M</p>
                        </div>
                        <div className="rounded-lg border border-[#D7CCBD] bg-[#FFFAF2] p-2">
                          <p className="text-[0.58rem] font-bold text-[#695F57]">Active Deals</p>
                          <p className="font-serif text-base font-bold text-[#261F1B] mt-0.5">6 Programs</p>
                        </div>
                      </div>

                      <div className="rounded-lg border border-[#D7CCBD] bg-[#FFFDF8] p-2.5 text-xs">
                        <p className="text-[0.6rem] font-bold text-[#7D2639] uppercase flex items-center gap-1">
                          <Sparkles className="h-3 w-3" /> AI Recommendation
                        </p>
                        <p className="text-[0.68rem] text-[#261F1B] font-medium mt-1">
                          Initiate Fusion ERP expansion review · Automated contract renewal ready
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Bottom Systems Connected Bar */}
              <div className="border-t border-[#D7CCBD] bg-[#F4EFE6] px-4 py-2.5 flex items-center justify-between text-[0.68rem] text-[#695F57]">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#261F1B]">Ecosystem:</span>
                  <div className="flex items-center gap-1.5 font-mono text-[0.62rem]">
                    <span className="bg-[#FFFDF8] px-1.5 py-0.5 rounded border border-[#D7CCBD]">Oracle Cloud</span>
                    <span className="bg-[#FFFDF8] px-1.5 py-0.5 rounded border border-[#D7CCBD]">Data Agent</span>
                    <span className="bg-[#FFFDF8] px-1.5 py-0.5 rounded border border-[#D7CCBD]">Salesforce</span>
                    <span className="bg-[#FFFDF8] px-1.5 py-0.5 rounded border border-[#D7CCBD]">OIC</span>
                  </div>
                </div>
                <span className="text-[#7D2639] font-bold hidden sm:inline">SLA: 100%</span>
              </div>
            </div>

            {/* FLOATING CARD 1: AI AGENT (Bottom Left) */}
            <motion.div
              initial={shouldReduceMotion ? {} : { y: 20, opacity: 0 }}
              animate={shouldReduceMotion ? {} : { y: [0, -5, 0], opacity: 1 }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-6 -left-4 sm:-left-6 hidden sm:block rounded-xl border border-[#D7CCBD] bg-[#FFFDF8]/95 p-3.5 shadow-xl z-20 backdrop-blur-md max-w-[240px]"
            >
              <div className="flex items-center justify-between border-b border-[#D7CCBD]/60 pb-1.5">
                <span className="text-[0.62rem] font-bold uppercase tracking-wider text-[#7D2639] flex items-center gap-1">
                  <Sparkles className="h-3 w-3" /> AI Agent
                </span>
                <span className="h-1.5 w-1.5 rounded-full bg-[#657766]" />
              </div>
              <p className="mt-1.5 text-xs font-bold text-[#261F1B]">Document review complete</p>
              <p className="mt-0.5 text-[0.65rem] text-[#695F57]">47 fields extracted · 100% citation grounded</p>
              <Link href="/work/innovation/data-agent" className="mt-2 inline-flex items-center gap-1 text-[0.65rem] font-bold text-[#7D2639] hover:underline">
                View results →
              </Link>
            </motion.div>

            {/* FLOATING CARD 2: ORACLE CLOUD (Top Right) */}
            <motion.div
              initial={shouldReduceMotion ? {} : { y: -15, opacity: 0 }}
              animate={shouldReduceMotion ? {} : { y: [0, 5, 0], opacity: 1 }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute -top-5 -right-3 hidden sm:block rounded-xl border border-[#D7CCBD] bg-[#FFFDF8]/95 px-3.5 py-2.5 shadow-lg z-20 backdrop-blur-md"
            >
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-md bg-[#7D2639] text-white">
                  <Layers className="h-3.5 w-3.5" />
                </div>
                <div>
                  <p className="text-[0.65rem] font-bold text-[#261F1B] uppercase tracking-wider">Oracle Cloud Core</p>
                  <p className="text-[0.6rem] text-[#657766]">Financials · SCM · Subledger Reconciled</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
