"use client";

import Link from "next/link";
import { ArrowUpRight, CheckCircle2, Sparkles, Activity, ShieldCheck, Database, Cpu, ChevronRight, Layers } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";

import SectionLabel from "@/components/marketing/SectionLabel";
import { useContactPanel } from "@/components/providers/contact-provider";

const credibilityBadges = [
  "Oracle",
  "AI & Data",
  "Cloud",
  "CRM",
  "Digital Engineering",
];

export default function Hero() {
  const { setOpen } = useContactPanel();
  const shouldReduceMotion = useReducedMotion();
  const [activeTab, setActiveTab] = useState<"overview" | "programs" | "ai" | "delivery">("overview");

  return (
    <section className="mkt-hero-bg mkt-grid-pattern relative overflow-hidden pt-10 pb-16 sm:pt-14 sm:pb-20 lg:pt-16 lg:pb-24 border-b border-[#D7CCBD]/60">
      <div className="mkt-shell relative z-10">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center lg:gap-10 xl:gap-14">
          {/* Left Column: 56% width */}
          <div className="lg:col-span-7 xl:col-span-7">
            <motion.div
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
            >
              <SectionLabel tone="burgundy">
                ENTERPRISE TRANSFORMATION · AI · ORACLE · ENGINEERING
              </SectionLabel>
            </motion.div>

            <motion.h1
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.08 }}
              className="mt-5 font-serif text-4xl font-semibold tracking-[-0.035em] text-[#261F1B] sm:text-5xl lg:text-6xl xl:text-[66px] xl:leading-[1.02]"
            >
              Engineering what’s
              <br />
              <span className="text-[#7D2639]">possible next.</span>
            </motion.h1>

            <motion.p
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.16 }}
              className="mt-6 max-w-xl text-base leading-relaxed text-[#695F57] sm:text-lg lg:text-[1.125rem]"
            >
              Consult America combines enterprise consulting, Oracle expertise,
              AI, data and digital engineering to modernize critical operations
              and turn complex transformation programs into production-ready solutions.
            </motion.p>

            <motion.div
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.24 }}
              className="mt-8 flex flex-col gap-3.5 sm:flex-row sm:items-center"
            >
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="group/cta ca-button-primary !min-h-12 !px-7 text-sm font-semibold rounded-md cursor-pointer"
              >
                Talk to an expert
                <ArrowUpRight className="mkt-cta-arrow h-4 w-4" />
              </button>
              <Link
                href="/work"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-[#261F1B] bg-transparent px-6 text-sm font-semibold text-[#261F1B] transition-colors hover:border-[#7D2639] hover:text-[#7D2639]"
              >
                Explore our work
              </Link>
            </motion.div>

            {/* Credibility Line */}
            <motion.div
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.32 }}
              className="mt-10 border-t border-[#D7CCBD] pt-5"
            >
              <p className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#695F57]">
                Practice Leadership Across The Core
              </p>
              <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs sm:text-sm font-semibold text-[#261F1B]">
                {credibilityBadges.map((item, idx) => (
                  <div key={item} className="inline-flex items-center gap-4">
                    <span className="hover:text-[#7D2639] transition-colors cursor-default">
                      {item}
                    </span>
                    {idx < credibilityBadges.length - 1 && (
                      <span className="text-[#D7CCBD] font-normal" aria-hidden="true">
                        ·
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Visual: Enterprise Transformation Workspace (44% width) */}
          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.65, delay: 0.15 }}
            className="lg:col-span-5 xl:col-span-5 relative"
          >
            {/* Background Layer Offset Frame */}
            <div className="absolute -inset-2 -right-3 rounded-2xl border border-[#D7CCBD]/80 bg-[#FFFAF2] -rotate-1 hidden sm:block shadow-sm" />

            {/* Main Application Container */}
            <div className="relative rounded-xl border border-[#D7CCBD] bg-[#FFFDF8] shadow-[0_20px_50px_rgba(38,31,27,0.08)] overflow-hidden">
              {/* Workspace Top Bar */}
              <div className="flex items-center justify-between border-b border-[#D7CCBD] bg-[#F4EFE6] px-4 py-2.5">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#D7CCBD]" />
                    <span className="h-2.5 w-2.5 rounded-full bg-[#D7CCBD]" />
                    <span className="h-2.5 w-2.5 rounded-full bg-[#D7CCBD]" />
                  </div>
                  <span className="ml-2 font-mono text-[0.68rem] font-bold tracking-wider text-[#261F1B]">
                    Transformation Command Center
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-[#657766] animate-pulse" />
                  <span className="text-[0.62rem] font-semibold text-[#657766] uppercase tracking-wider">
                    Systems connected
                  </span>
                </div>
              </div>

              {/* Navigation Rail */}
              <div className="flex items-center gap-1 border-b border-[#D7CCBD]/80 bg-[#FFFAF2] px-3 py-1.5 overflow-x-auto text-[0.68rem] font-semibold">
                {[
                  { id: "overview", label: "Overview" },
                  { id: "programs", label: "Programs" },
                  { id: "ai", label: "AI Agents" },
                  { id: "delivery", label: "Delivery" },
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setActiveTab(t.id as any)}
                    className={`rounded px-2.5 py-1 transition-colors cursor-pointer ${
                      activeTab === t.id
                        ? "bg-[#7D2639] text-white shadow-2xs"
                        : "text-[#695F57] hover:text-[#261F1B] hover:bg-[#F4EFE6]"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Top Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-3 border-b border-[#D7CCBD]/60 bg-[#FFFDF8]">
                <div className="rounded-md border border-[#D7CCBD]/60 bg-[#FFFAF2] p-2">
                  <p className="text-[0.6rem] uppercase tracking-wider text-[#695F57]">Active Programs</p>
                  <p className="font-serif text-lg font-bold text-[#7D2639]">14 Active</p>
                </div>
                <div className="rounded-md border border-[#D7CCBD]/60 bg-[#FFFAF2] p-2">
                  <p className="text-[0.6rem] uppercase tracking-wider text-[#695F57]">Automation</p>
                  <p className="font-serif text-lg font-bold text-[#657766]">82.4%</p>
                </div>
                <div className="rounded-md border border-[#D7CCBD]/60 bg-[#FFFAF2] p-2">
                  <p className="text-[0.6rem] uppercase tracking-wider text-[#695F57]">Data Quality</p>
                  <p className="font-serif text-lg font-bold text-[#261F1B]">99.4%</p>
                </div>
                <div className="rounded-md border border-[#D7CCBD]/60 bg-[#FFFAF2] p-2">
                  <p className="text-[0.6rem] uppercase tracking-wider text-[#695F57]">Health</p>
                  <p className="font-serif text-lg font-bold text-[#7D2639]">98.6%</p>
                </div>
              </div>

              {/* Main Workspace Body */}
              <div className="p-3.5 space-y-3">
                {/* Operational Progress Visualization */}
                <div className="rounded-lg border border-[#D7CCBD] bg-[#FFFAF2] p-3">
                  <div className="flex items-center justify-between text-xs font-bold text-[#261F1B]">
                    <div className="flex items-center gap-1.5">
                      <Activity className="h-3.5 w-3.5 text-[#7D2639]" />
                      <span>Enterprise Transformation Stream</span>
                    </div>
                    <span className="text-[0.68rem] text-[#657766] font-mono">Stage 4 of 5</span>
                  </div>

                  {/* Flow Stages */}
                  <div className="mt-2.5 grid grid-cols-4 gap-1.5 text-center text-[0.62rem] font-bold">
                    <div className="rounded bg-[#DFE4DA] text-[#657766] py-1">01 ARCH</div>
                    <div className="rounded bg-[#DFE4DA] text-[#657766] py-1">02 ORACLE</div>
                    <div className="rounded bg-[#DFE4DA] text-[#657766] py-1">03 AI &amp; DATA</div>
                    <div className="rounded bg-[#7D2639] text-white py-1">04 CUTOVER</div>
                  </div>

                  <div className="mt-2.5 flex items-center justify-between text-[0.65rem] text-[#695F57]">
                    <span>Current: Fusion ERP Multi-Entity Cutover</span>
                    <span className="font-bold text-[#7D2639]">Zero Discrepancy</span>
                  </div>
                </div>

                {/* AI Recommendations Panel */}
                <div className="rounded-lg border border-[#D7CCBD] bg-[#FFFDF8] p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5 text-[#7D2639]" />
                      <span className="text-xs font-bold text-[#261F1B]">AI Operational Recommendations</span>
                    </div>
                    <span className="rounded bg-[#DFE4DA] px-1.5 py-0.5 text-[0.6rem] font-bold text-[#657766]">
                      4 Real-time
                    </span>
                  </div>

                  <div className="mt-2.5 space-y-1.5">
                    {[
                      { text: "Resolve integration dependency (OIC Bridge #4)", badge: "Oracle", status: "Verified" },
                      { text: "Review procurement exception (PO-8821)", badge: "SCM", status: "Active" },
                      { text: "Validate migration batch (Fusion GL Delta)", badge: "Finance", status: "Ready" },
                      { text: "Optimize approval workflow (Time & Billing)", badge: "Core HR", status: "Optimized" },
                    ].map((rec) => (
                      <div
                        key={rec.text}
                        className="flex items-center justify-between rounded border border-[#D7CCBD]/60 bg-[#FFFAF2] px-2.5 py-1.5 text-[0.68rem]"
                      >
                        <div className="flex items-center gap-2 overflow-hidden">
                          <CheckCircle2 className="h-3 w-3 text-[#657766] shrink-0" />
                          <span className="truncate font-medium text-[#261F1B]">{rec.text}</span>
                        </div>
                        <span className="shrink-0 text-[0.6rem] font-bold text-[#7D2639] bg-[#F0E8DC] px-1.5 py-0.5 rounded">
                          {rec.badge}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Workspace Bottom Bar */}
              <div className="border-t border-[#D7CCBD] bg-[#F4EFE6] px-3.5 py-2 flex items-center justify-between text-[0.68rem] text-[#695F57]">
                <span>Data Agent · MediGuide AI · CRM · Oracle Cloud</span>
                <Link
                  href="/work/innovation"
                  className="font-bold text-[#7D2639] hover:underline flex items-center gap-0.5"
                >
                  Inspect Platform Workspaces <ChevronRight className="h-3 w-3" />
                </Link>
              </div>
            </div>

            {/* Floating Layer 1: Data Agent Extraction Verification */}
            <motion.div
              initial={shouldReduceMotion ? {} : { y: 20, opacity: 0 }}
              animate={shouldReduceMotion ? {} : { y: [0, -6, 0], opacity: 1 }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-5 -left-4 sm:-left-6 hidden sm:flex items-center gap-3 rounded-lg border border-[#D7CCBD] bg-[#FFFDF8] p-3 shadow-lg z-20"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#DFE4DA] text-[#657766]">
                <Database className="h-4 w-4" />
              </div>
              <div>
                <p className="text-[0.68rem] font-bold text-[#261F1B]">Data Agent Intelligence</p>
                <p className="text-[0.62rem] text-[#657766] font-semibold">DFARS Clause Verified (99.8% Grounded)</p>
              </div>
            </motion.div>

            {/* Floating Layer 2: Oracle Cloud Cutover */}
            <motion.div
              initial={shouldReduceMotion ? {} : { y: -15, opacity: 0 }}
              animate={shouldReduceMotion ? {} : { y: [0, 6, 0], opacity: 1 }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute -top-4 -right-3 hidden sm:flex items-center gap-2.5 rounded-lg border border-[#D7CCBD] bg-[#FFFDF8] px-3 py-2 shadow-md z-20"
            >
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-[#7D2639] text-white">
                <Layers className="h-3.5 w-3.5" />
              </div>
              <span className="text-[0.68rem] font-bold text-[#261F1B]">
                Oracle Fusion Cloud · Production Cutover
              </span>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
