"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ArrowRight, CheckCircle2, Shield, Sparkles, Layers, Cpu } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

import { useContactPanel } from "@/components/providers/contact-provider";

const practiceAreas = [
  { label: "Oracle Fusion", href: "/oracle", tag: "ERP / SCM" },
  { label: "CRM & CX", href: "/platforms/crm", tag: "Customer 360" },
  { label: "AI & Data", href: "/ai-data", tag: "Agents & RAG" },
  { label: "Cloud Modernization", href: "/capabilities/digital-engineering", tag: "Multi-Cloud" },
  { label: "Application Engineering", href: "/capabilities/digital-engineering", tag: "Labs" },
];

const heroStats = [
  { value: "Clean Core", label: "Architecture", detail: "Zero invasive ERP mods" },
  { value: "100%", label: "Grounded AI", detail: "Auditable source citations" },
  { value: "< 15ms", label: "Data Lineage", detail: "OIC & API event streaming" },
  { value: "Enterprise", label: "Production SLA", detail: "Strategy through cutover" },
];

export default function Hero() {
  const { setOpen } = useContactPanel();
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-[#F7F9FA] border-b border-[#DDE4E8] pt-14 pb-16 sm:pt-16 sm:pb-20 lg:pt-20 lg:pb-24">
      {/* Subtle Atmospheric Gradient & Precision Engineering Grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 82% 18%, rgba(53,124,120,0.08) 0%, transparent 40%), radial-gradient(circle at 12% 80%, rgba(71,115,155,0.06) 0%, transparent 35%), linear-gradient(to right, rgba(16,32,51,0.02) 1px, transparent 1px), linear-gradient(to bottom, rgba(16,32,51,0.02) 1px, transparent 1px)",
          backgroundSize: "100% 100%, 100% 100%, 48px 48px, 48px 48px",
        }}
      />

      <div className="ca-shell relative z-10">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center lg:gap-12 xl:gap-16">
          {/* ========================================================= */}
          {/* LEFT COLUMN: 55% Split (Editorial & Business Positioning) */}
          {/* ========================================================= */}
          <div className="lg:col-span-7">
            {/* Eyebrow Pill Badge */}
            <motion.div
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="inline-flex items-center gap-2 rounded-full border border-[#DDE4E8] bg-white px-3.5 py-1 shadow-2xs"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#B63A3A] opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#B63A3A]" />
              </span>
              <span className="text-[0.68rem] sm:text-[0.72rem] font-bold uppercase tracking-[0.14em] text-[#102033]">
                ENTERPRISE TRANSFORMATION · AI · ENGINEERING
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.08 }}
              className="mt-6 font-serif text-4xl sm:text-5xl lg:text-6xl xl:text-[68px] font-semibold tracking-[-0.035em] text-[#102033] leading-[1.04]"
            >
              Transform the core.
              <br />
              Build what <span className="text-[#B63A3A]">comes next.</span>
            </motion.h1>

            {/* Supporting Copy */}
            <motion.p
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.16 }}
              className="mt-6 max-w-xl text-base sm:text-lg leading-relaxed text-[#526170]"
            >
              Consult America helps organizations modernize enterprise platforms,
              connect data and workflows, operationalize AI, and engineer digital
              products from strategy through production.
            </motion.p>

            {/* Primary & Secondary Action CTAs */}
            <motion.div
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.24 }}
              className="mt-8 flex flex-col gap-3.5 sm:flex-row sm:items-center"
            >
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="ca-button-primary !min-h-[52px] !px-8 text-sm font-semibold rounded-lg cursor-pointer flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(182,58,58,0.22)] hover:shadow-[0_6px_20px_rgba(182,58,58,0.30)] transition-all"
              >
                <span>Talk to an Expert</span>
                <ArrowUpRight className="h-4 w-4" />
              </button>

              <Link
                href="/capabilities/enterprise-transformation"
                className="inline-flex !min-h-[52px] items-center justify-center gap-2 rounded-lg border border-[#DDE4E8] bg-white px-7 text-sm font-semibold text-[#102033] shadow-2xs hover:border-[#B63A3A] hover:text-[#B63A3A] transition-all"
              >
                <span>Explore What We Do</span>
                <ArrowRight className="h-4 w-4 text-[#526170]" />
              </Link>
            </motion.div>

            {/* Modern Pill Interactive Practice Rail (Image 1 & 2 inspired) */}
            <motion.div
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.32 }}
              className="mt-10 border-t border-[#DDE4E8] pt-6"
            >
              <p className="text-[0.62rem] font-bold uppercase tracking-[0.14em] text-[#526170] mb-3">
                Core Capabilities &amp; Specialized Practices
              </p>
              <div className="flex flex-wrap items-center gap-2">
                {practiceAreas.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="group inline-flex items-center gap-2 rounded-md border border-[#E9EEF1] bg-white px-3 py-1.5 text-xs font-semibold text-[#102033] shadow-2xs hover:border-[#B63A3A] hover:bg-[#F7F9FA] transition-all"
                  >
                    <span>{item.label}</span>
                    <span className="rounded bg-[#EEF3F4] px-1.5 py-0.5 text-[0.6rem] font-mono text-[#526170] group-hover:bg-[#DCEAE7] group-hover:text-[#357C78] transition-colors">
                      {item.tag}
                    </span>
                  </Link>
                ))}
              </div>
            </motion.div>
          </div>

          {/* ========================================================= */}
          {/* RIGHT COLUMN: 45% Split (Layered Enterprise UI & Photo)  */}
          {/* ========================================================= */}
          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.65, delay: 0.15 }}
            className="lg:col-span-5 relative flex justify-center lg:justify-end"
          >
            {/* Subtle Layered Backdrop Accent (Cool Blue-Gray & Teal) */}
            <div className="absolute -inset-2 rounded-2xl bg-gradient-to-tr from-[#DCEAE7]/50 via-[#EEF3F4]/60 to-[#E5EDF4]/40 blur-xl opacity-70 pointer-events-none" />

            {/* Main Executive Photography Container */}
            <div className="relative w-full max-w-[560px] h-[450px] sm:h-[490px] lg:h-[510px] rounded-xl overflow-hidden border border-[#DDE4E8] bg-white shadow-[0_20px_50px_rgba(16,32,51,0.10)]">
              <Image
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=1200&q=85"
                alt="Senior consultants and enterprise technology leaders collaborating in a modern corporate architectural setting"
                fill
                priority
                className="object-cover object-center mkt-img-graded"
                sizes="(max-width: 1024px) 100vw, 45vw"
              />

              {/* Natural light vignette overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#102033]/55 via-[#102033]/15 to-transparent pointer-events-none" />

              {/* Top-Right Floating Status Pill (Image 1 & 2 inspired) */}
              <div className="absolute top-4 right-4 flex items-center gap-2 rounded-full border border-white/25 bg-[#102033]/85 px-3 py-1 text-xs text-white backdrop-blur-md shadow-md">
                <span className="h-2 w-2 rounded-full bg-[#357C78]" />
                <span className="font-mono text-[0.65rem] font-semibold tracking-wide">
                  Clean Core Architecture
                </span>
              </div>
            </div>

            {/* ONE Sophisticated Floating Foreground Panel (Strategy to Production) */}
            <motion.div
              initial={shouldReduceMotion ? {} : { y: 16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="absolute -bottom-6 left-4 sm:left-6 max-w-[340px] rounded-xl border border-[#DDE4E8] bg-white/95 p-5 shadow-[0_20px_45px_rgba(16,32,51,0.14)] backdrop-blur-md"
            >
              <div className="flex items-center justify-between border-b border-[#E9EEF1] pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#B63A3A]" />
                  <p className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#102033]">
                    STRATEGY → PRODUCTION
                  </p>
                </div>
                <span className="font-mono text-[0.6rem] font-semibold text-[#357C78] bg-[#DCEAE7] px-2 py-0.5 rounded">
                  Enterprise Ready
                </span>
              </div>

              <p className="mt-2.5 text-xs leading-relaxed text-[#526170]">
                Senior practitioners connecting business strategy, Oracle Fusion, customer pipelines, and governed AI.
              </p>

              <div className="mt-3.5 pt-2.5 border-t border-[#E9EEF1] flex items-center justify-between">
                <Link
                  href="/capabilities/enterprise-transformation"
                  className="inline-flex items-center gap-1.5 text-[0.72rem] font-bold text-[#B63A3A] hover:text-[#942E31] transition-colors"
                >
                  <span>How We Deliver</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <span className="text-[0.65rem] text-[#526170] font-mono">0 Downtime Cutover</span>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* ========================================================= */}
        {/* EDITORIAL METRIC & VALUE STRIP (Inspired by Image 1 & 2)  */}
        {/* ========================================================= */}
        <div className="mt-16 sm:mt-20 pt-8 border-t border-[#DDE4E8]">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {heroStats.map((stat, idx) => (
              <motion.div
                key={stat.label}
                initial={shouldReduceMotion ? {} : { opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: idx * 0.06 }}
                className="rounded-lg border border-[#DDE4E8] bg-white p-4 sm:p-5 shadow-2xs hover:border-[#B63A3A]/40 transition-colors"
              >
                <div className="flex items-baseline gap-2">
                  <span className="font-serif text-2xl sm:text-3xl font-semibold text-[#102033]">
                    {stat.value}
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#B63A3A]">
                    {stat.label}
                  </span>
                </div>
                <p className="mt-1 text-xs text-[#526170]">
                  {stat.detail}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
