"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, CheckCircle2, Sparkles, Activity, ShieldCheck, Database, Cpu, ChevronRight, Layers, Workflow, Check } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";

import { useContactPanel } from "@/components/providers/contact-provider";

const practiceAreas = [
  { label: "Oracle", href: "/oracle" },
  { label: "CRM", href: "/platforms/crm" },
  { label: "AI + Data", href: "/ai-data" },
  { label: "Cloud", href: "/capabilities/digital-engineering" },
  { label: "Application Engineering", href: "/capabilities/digital-engineering" },
];

export default function Hero() {
  const { setOpen } = useContactPanel();
  const shouldReduceMotion = useReducedMotion();
  const [activeNav, setActiveNav] = useState<"Overview" | "Transformation" | "Applications" | "AI & Data" | "Delivery">("Transformation");

  return (
    <section className="relative overflow-hidden border-b border-[#D7CCBD]/80 min-h-[720px] lg:min-h-[82vh] flex items-center">
      {/* 1. Atmospheric Photographic Background with Controlled Warm Overlays */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <motion.div
          animate={shouldReduceMotion ? {} : { scale: [1, 1.025, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="relative h-full w-full"
        >
          <Image
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2200&q=85"
            alt="Modern enterprise architectural environment"
            fill
            priority
            className="object-cover object-center opacity-25 filter grayscale contrast-125"
            sizes="100vw"
          />
        </motion.div>

        {/* Sophisticated Warm Ivory & Atmospheric Gradient Layering */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(244,239,230,0.98) 0%, rgba(244,239,230,0.94) 35%, rgba(244,239,230,0.72) 65%, rgba(244,239,230,0.25) 100%)",
          }}
        />
        {/* Subtle Bottom & Burgundy Wash Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#F4EFE6] via-transparent to-transparent opacity-90" />
        <div className="absolute inset-0 bg-radial-[circle_at_80%_20%] from-[#7D2639]/5 via-transparent to-transparent pointer-events-none" />
      </div>

      <div className="mkt-shell relative z-10 py-12 sm:py-16 lg:py-20 w-full">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center lg:gap-10 xl:gap-14">
          {/* Left Column: 50–52% width */}
          <div className="lg:col-span-6 xl:col-span-6">
            {/* Sophisticated Eyebrow */}
            <motion.div
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="flex items-center gap-2.5"
            >
              <span className="h-0.5 w-6 rounded-full bg-[#7D2639]" />
              <span className="text-[0.72rem] sm:text-[0.78rem] font-medium uppercase tracking-[0.14em] text-[#7D2639]">
                ENTERPRISE TRANSFORMATION · AI · ENGINEERING
              </span>
            </motion.div>

            {/* Commanding Headline */}
            <motion.h1
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.08 }}
              className="mt-5 font-serif text-4xl font-semibold tracking-[-0.04em] text-[#261F1B] sm:text-5xl lg:text-6xl xl:text-[70px] xl:leading-[0.96] max-w-[780px]"
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
              Consult America helps organizations modernize enterprise platforms,
              connect data and workflows, operationalize AI, and engineer the
              digital products that move the business forward.
            </motion.p>

            {/* Primary & Secondary CTAs */}
            <motion.div
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.24 }}
              className="mt-8 flex flex-col gap-3.5 sm:flex-row sm:items-center"
            >
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="group/cta ca-button-primary !min-h-[54px] !px-8 text-sm font-semibold rounded-lg cursor-pointer shadow-[0_8px_20px_rgba(125,38,57,0.2)] hover:shadow-[0_12px_28px_rgba(125,38,57,0.3)]"
              >
                Start a conversation
                <ArrowUpRight className="mkt-cta-arrow h-4 w-4 transition-transform group-hover/cta:translate-x-1 group-hover/cta:-translate-y-0.5" />
              </button>
              <Link
                href="/capabilities/enterprise-transformation"
                className="inline-flex min-h-[54px] items-center justify-center gap-2 rounded-lg border border-[#261F1B]/70 bg-[#FFFDF8]/80 backdrop-blur-xs px-6 text-sm font-semibold text-[#261F1B] transition-all hover:border-[#7D2639] hover:text-[#7D2639] hover:bg-[#FFFDF8]"
              >
                Explore our capabilities →
              </Link>
            </motion.div>

            {/* Elegant Practice Areas Capability Rail */}
            <motion.div
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.32 }}
              className="mt-10 border-t border-[#D7CCBD] pt-5"
            >
              <p className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#695F57]">
                Practice Areas
              </p>
              <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs sm:text-sm font-semibold text-[#261F1B]">
                {practiceAreas.map((item, idx) => (
                  <div key={item.label} className="inline-flex items-center gap-4">
                    <Link
                      href={item.href}
                      className="group/pa relative py-0.5 hover:text-[#7D2639] transition-colors"
                    >
                      <span>{item.label}</span>
                      <span className="absolute inset-x-0 bottom-0 h-0.5 bg-[#7D2639] scale-x-0 transition-transform origin-left group-hover/pa:scale-x-100" />
                    </Link>
                    {idx < practiceAreas.length - 1 && (
                      <span className="text-[#D7CCBD] font-normal" aria-hidden="true">
                        /
                      </span>
                    )}
                  </div>
                ))}
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
            <div className="relative rounded-2xl border border-[#D7CCBD] bg-[#FFFDF8] shadow-[0_22px_60px_rgba(38,31,27,0.1)] overflow-hidden backdrop-blur-md">
              {/* Top Window Bar */}
              <div className="flex items-center justify-between border-b border-[#D7CCBD] bg-[#F4EFE6]/90 px-4 py-2.5">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#D7CCBD]" />
                    <span className="h-2.5 w-2.5 rounded-full bg-[#D7CCBD]" />
                    <span className="h-2.5 w-2.5 rounded-full bg-[#D7CCBD]" />
                  </div>
                  <span className="ml-2 font-mono text-[0.68rem] font-bold tracking-wider text-[#261F1B] uppercase">
                    Enterprise Command Center
                  </span>
                </div>
                <div className="flex items-center gap-1.5 bg-[#DFE4DA] px-2 py-0.5 rounded-full">
                  <span className="h-2 w-2 rounded-full bg-[#657766] animate-pulse" />
                  <span className="text-[0.62rem] font-bold text-[#657766] uppercase tracking-wider">
                    Enterprise Transformation LIVE
                  </span>
                </div>
              </div>

              {/* Navigation Rail */}
              <div className="flex items-center gap-1 border-b border-[#D7CCBD]/80 bg-[#FFFAF2] px-3 py-1.5 overflow-x-auto text-[0.68rem] font-semibold">
                {(["Overview", "Transformation", "Applications", "AI & Data", "Delivery"] as const).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveNav(tab)}
                    className={`rounded px-2.5 py-1 transition-colors cursor-pointer whitespace-nowrap ${
                      activeNav === tab
                        ? "bg-[#7D2639] text-white shadow-2xs font-bold"
                        : "text-[#695F57] hover:text-[#261F1B] hover:bg-[#F4EFE6]"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Top Metrics Grid (4 Key Indicators) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-3 border-b border-[#D7CCBD]/60 bg-[#FFFDF8]">
                <div className="rounded-lg border border-[#D7CCBD]/70 bg-[#FFFAF2] p-2.5">
                  <p className="text-[0.58rem] font-bold uppercase tracking-wider text-[#695F57]">Connected Workflows</p>
                  <p className="font-serif text-lg font-bold text-[#261F1B] mt-0.5">12 Workflows</p>
                </div>
                <div className="rounded-lg border border-[#D7CCBD]/70 bg-[#FFFAF2] p-2.5">
                  <p className="text-[0.58rem] font-bold uppercase tracking-wider text-[#695F57]">Data Quality</p>
                  <p className="font-serif text-lg font-bold text-[#657766] mt-0.5">98.7%</p>
                </div>
                <div className="rounded-lg border border-[#D7CCBD]/70 bg-[#FFFAF2] p-2.5">
                  <p className="text-[0.58rem] font-bold uppercase tracking-wider text-[#695F57]">Active Automations</p>
                  <p className="font-serif text-lg font-bold text-[#7D2639] mt-0.5">24 Active</p>
                </div>
                <div className="rounded-lg border border-[#D7CCBD]/70 bg-[#FFFAF2] p-2.5">
                  <p className="text-[0.58rem] font-bold uppercase tracking-wider text-[#695F57]">Delivery Status</p>
                  <p className="font-serif text-lg font-bold text-[#657766] mt-0.5 flex items-center gap-1">
                    <Check className="h-4 w-4" /> Healthy
                  </p>
                </div>
              </div>

              {/* Main Visualization & AI Recommendations */}
              <div className="p-3.5 space-y-3">
                {/* Main Progress Chart */}
                <div className="rounded-xl border border-[#D7CCBD] bg-[#FFFAF2] p-3.5">
                  <div className="flex items-center justify-between text-xs font-bold text-[#261F1B] mb-2.5">
                    <div className="flex items-center gap-1.5">
                      <Activity className="h-3.5 w-3.5 text-[#7D2639]" />
                      <span>Transformation Progress</span>
                    </div>
                    <span className="text-[0.65rem] text-[#657766] font-mono">Real-time Telemetry</span>
                  </div>

                  {/* Progress Bars */}
                  <div className="space-y-2">
                    {[
                      { name: "Oracle Cloud", pct: 82, color: "bg-[#7D2639]" },
                      { name: "Data & Integration", pct: 74, color: "bg-[#657766]" },
                      { name: "AI Automation", pct: 61, color: "bg-[#496E9C]" },
                      { name: "Digital Apps", pct: 88, color: "bg-[#7D2639]" },
                    ].map((item) => (
                      <div key={item.name} className="space-y-1">
                        <div className="flex items-center justify-between text-[0.65rem] font-semibold text-[#261F1B]">
                          <span>{item.name}</span>
                          <span className="font-mono">{item.pct}%</span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-[#E8E0D5] overflow-hidden">
                          <div
                            className={`h-full rounded-full ${item.color}`}
                            style={{ width: `${item.pct}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* AI Recommendations Panel */}
                <div className="rounded-xl border border-[#D7CCBD] bg-[#FFFDF8] p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5 text-[#7D2639]" />
                      <span className="text-xs font-bold text-[#261F1B] uppercase tracking-wider">
                        AI Recommendations
                      </span>
                    </div>
                    <span className="rounded bg-[#DFE4DA] px-1.5 py-0.5 text-[0.6rem] font-bold text-[#657766]">
                      3 Actionable
                    </span>
                  </div>

                  <div className="mt-2 space-y-1.5">
                    {[
                      "Review integration exception in OIC Bridge",
                      "Validate migration batch for Fusion GL",
                      "Resolve workflow dependency in Core HR",
                    ].map((rec) => (
                      <div
                        key={rec}
                        className="flex items-center gap-2 rounded border border-[#D7CCBD]/60 bg-[#FFFAF2] px-2.5 py-1.5 text-[0.68rem] text-[#261F1B]"
                      >
                        <CheckCircle2 className="h-3 w-3 text-[#657766] shrink-0" />
                        <span className="font-medium">{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Systems Connected Bar */}
              <div className="border-t border-[#D7CCBD] bg-[#F4EFE6] px-3.5 py-2 flex items-center justify-between text-[0.68rem] text-[#695F57]">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#261F1B]">Systems Connected:</span>
                  <div className="flex items-center gap-1.5 font-mono text-[0.62rem]">
                    <span className="bg-[#FFFDF8] px-1.5 py-0.5 rounded border border-[#D7CCBD]">Oracle</span>
                    <span className="bg-[#FFFDF8] px-1.5 py-0.5 rounded border border-[#D7CCBD]">CRM</span>
                    <span className="bg-[#FFFDF8] px-1.5 py-0.5 rounded border border-[#D7CCBD]">Data</span>
                    <span className="bg-[#FFFDF8] px-1.5 py-0.5 rounded border border-[#D7CCBD]">AI</span>
                    <span className="bg-[#FFFDF8] px-1.5 py-0.5 rounded border border-[#D7CCBD]">APIs</span>
                  </div>
                </div>
                <span className="text-[#7D2639] font-bold hidden sm:inline">99.9% Uptime</span>
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
              <p className="mt-0.5 text-[0.65rem] text-[#695F57]">47 fields extracted · 3 require verification</p>
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
                  <p className="text-[0.65rem] font-bold text-[#261F1B] uppercase tracking-wider">Oracle Cloud</p>
                  <p className="text-[0.6rem] text-[#657766]">Financials · Procurement · Connected</p>
                </div>
              </div>
            </motion.div>

            {/* FLOATING CARD 3: DELIVERY INTELLIGENCE (Bottom Right) */}
            <motion.div
              initial={shouldReduceMotion ? {} : { y: 15, opacity: 0 }}
              animate={shouldReduceMotion ? {} : { y: [0, -4, 0], opacity: 1 }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
              className="absolute -bottom-4 right-4 hidden md:block rounded-xl border border-[#D7CCBD] bg-[#FFFDF8]/95 p-3 shadow-lg z-20 backdrop-blur-md"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[0.6rem] font-bold uppercase tracking-wider text-[#695F57]">Delivery Intelligence</p>
                  <p className="text-[0.68rem] font-bold text-[#261F1B]">Readiness 86% · Cutover Ready</p>
                </div>
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#DFE4DA] text-[#657766] font-bold text-[0.65rem]">
                  ✓
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
