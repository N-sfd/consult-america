"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Sparkles, Activity, CheckCircle2, ChevronRight, Layers, Database, Cpu } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

import { useContactPanel } from "@/components/providers/contact-provider";

const practiceAreas = [
  { label: "Oracle", href: "/oracle" },
  { label: "AI + Data", href: "/ai-data" },
  { label: "Cloud", href: "/capabilities/digital-engineering" },
  { label: "CRM", href: "/platforms/crm" },
  { label: "Digital Engineering", href: "/capabilities/digital-engineering" },
];

export default function Hero() {
  const { setOpen } = useContactPanel();
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden border-b border-[#D7CCBD]/80 min-h-[790px] h-[min(88vh,900px)] flex items-center bg-[#F7F3EC]">
      {/* 1. Full-Width Cinematic Background Photograph */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Image
          src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2400&q=85"
          alt="Modern enterprise architecture and operations center"
          fill
          priority
          className="object-cover object-right sm:object-center opacity-35 filter grayscale contrast-115"
          sizes="100vw"
        />

        {/* Warm Editorial Left-to-Right Scrim (100% Headline Legibility on Left) */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(247,243,236,0.99) 0%, rgba(247,243,236,0.97) 24%, rgba(247,243,236,0.88) 43%, rgba(247,243,236,0.48) 62%, rgba(247,243,236,0.16) 100%)",
          }}
        />

        {/* Subtle Bottom Fade */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(180deg, transparent 65%, rgba(247,243,236,0.85) 100%)",
          }}
        />

        {/* Subtle Atmospheric Burgundy Wash */}
        <div className="absolute inset-0 bg-radial-[circle_at_80%_25%] from-[#7D2639]/8 via-transparent to-transparent" />
      </div>

      <div className="mkt-shell relative z-10 py-10 sm:py-14 w-full">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center lg:gap-8 xl:gap-12">
          {/* Left Column: 50–52% width */}
          <div className="lg:col-span-6 xl:col-span-6">
            {/* Sophisticated Editorial Eyebrow */}
            <motion.div
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="flex items-center gap-2.5"
            >
              <span className="h-0.5 w-6 rounded-full bg-[#7D2639]" />
              <span className="text-[0.72rem] sm:text-[0.78rem] font-medium uppercase tracking-[0.14em] text-[#7D2639]">
                ENTERPRISE TRANSFORMATION · AI · ORACLE · ENGINEERING
              </span>
            </motion.div>

            {/* Commanding Headline */}
            <motion.h1
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.08 }}
              className="mt-5 font-serif text-4xl sm:text-5xl lg:text-6xl xl:text-[70px] leading-[0.94] tracking-[-0.045em] text-[#261F1B] max-w-[720px]"
            >
              Engineering what’s
              <br />
              <span>possible next.</span>
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
                className="group/cta ca-button-primary !min-h-[54px] !px-8 text-sm font-semibold rounded-lg cursor-pointer shadow-[0_10px_25px_rgba(125,38,57,0.25)] hover:shadow-[0_14px_32px_rgba(125,38,57,0.35)]"
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

            {/* Slim Horizontal Practice Rail */}
            <motion.div
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.32 }}
              className="mt-10 border-t border-[#D7CCBD] pt-4"
            >
              <p className="text-[0.65rem] font-bold uppercase tracking-[0.14em] text-[#695F57] mb-2">
                PRACTICE AREAS
              </p>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs sm:text-sm font-semibold text-[#261F1B]">
                {practiceAreas.map((item, idx) => (
                  <div key={item.label} className="inline-flex items-center gap-4">
                    <Link
                      href={item.href}
                      className="group/item relative py-0.5 hover:text-[#7D2639] transition-colors inline-flex items-center gap-1"
                    >
                      <span>{item.label}</span>
                      <ArrowUpRight className="h-3 w-3 opacity-0 -translate-y-0.5 transition-all group-hover/item:opacity-100 group-hover/item:text-[#7D2639]" />
                      <span className="absolute inset-x-0 bottom-0 h-0.5 bg-[#7D2639] scale-x-0 transition-transform origin-left group-hover/item:scale-x-100" />
                    </Link>
                    {idx < practiceAreas.length - 1 && (
                      <span className="text-[#D7CCBD] font-normal" aria-hidden="true">
                        |
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Column: Simplified Transformation Command Center Floating Application */}
          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.65, delay: 0.15 }}
            className="lg:col-span-6 xl:col-span-6 relative"
          >
            {/* Background Offset Ambient Glow */}
            <div className="absolute -inset-2 -right-3 rounded-2xl border border-[#D7CCBD]/80 bg-[#FFFAF2]/85 -rotate-1 hidden sm:block shadow-sm" />

            {/* Main Application Container */}
            <div className="relative rounded-[22px] border border-[rgba(80,60,50,0.12)] bg-[rgba(255,255,255,0.92)] shadow-[0_30px_80px_rgba(24,18,14,0.16)] overflow-hidden backdrop-blur-[18px]">
              {/* Window Header */}
              <div className="flex items-center justify-between border-b border-[#D7CCBD]/80 bg-[#F7F3EC]/95 px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#D7CCBD]" />
                    <span className="h-2.5 w-2.5 rounded-full bg-[#D7CCBD]" />
                    <span className="h-2.5 w-2.5 rounded-full bg-[#D7CCBD]" />
                  </div>
                  <span className="ml-2 font-mono text-[0.68rem] font-bold tracking-wider text-[#261F1B] uppercase">
                    Transformation Command Center
                  </span>
                </div>
                <div className="flex items-center gap-1.5 bg-[#DFE4DA] px-2.5 py-0.5 rounded-full">
                  <span className="h-2 w-2 rounded-full bg-[#657766] animate-pulse" />
                  <span className="text-[0.62rem] font-bold text-[#657766] uppercase tracking-wider">
                    LIVE TELEMETRY
                  </span>
                </div>
              </div>

              {/* 4 Key Metrics Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3.5 border-b border-[#D7CCBD]/60 bg-[#FFFAF2]/60">
                <div className="rounded-xl border border-[#D7CCBD]/70 bg-white/90 p-2.5 text-center sm:text-left">
                  <p className="text-[0.58rem] font-bold uppercase tracking-wider text-[#695F57]">Active Programs</p>
                  <p className="font-serif text-lg font-bold text-[#261F1B] mt-0.5">14 Active</p>
                </div>
                <div className="rounded-xl border border-[#D7CCBD]/70 bg-white/90 p-2.5 text-center sm:text-left">
                  <p className="text-[0.58rem] font-bold uppercase tracking-wider text-[#695F57]">Automation</p>
                  <p className="font-serif text-lg font-bold text-[#7D2639] mt-0.5">82%</p>
                </div>
                <div className="rounded-xl border border-[#D7CCBD]/70 bg-white/90 p-2.5 text-center sm:text-left">
                  <p className="text-[0.58rem] font-bold uppercase tracking-wider text-[#695F57]">Data Quality</p>
                  <p className="font-serif text-lg font-bold text-[#657766] mt-0.5">99%</p>
                </div>
                <div className="rounded-xl border border-[#D7CCBD]/70 bg-white/90 p-2.5 text-center sm:text-left">
                  <p className="text-[0.58rem] font-bold uppercase tracking-wider text-[#695F57]">Delivery Health</p>
                  <p className="font-serif text-lg font-bold text-[#657766] mt-0.5">98%</p>
                </div>
              </div>

              {/* Transformation Stream Architecture */}
              <div className="p-4 space-y-3.5">
                <div className="rounded-xl border border-[#D7CCBD]/80 bg-[#F7F3EC]/70 p-3">
                  <div className="flex items-center justify-between text-xs font-bold text-[#261F1B] mb-2">
                    <span className="font-mono text-[0.65rem] uppercase tracking-wider text-[#7D2639] flex items-center gap-1.5">
                      <Activity className="h-3.5 w-3.5" /> Transformation Stream
                    </span>
                    <span className="text-[0.62rem] text-[#657766] font-mono">Synchronized</span>
                  </div>

                  {/* Connected Linear Stream */}
                  <div className="grid grid-cols-4 gap-1.5 text-center text-[0.68rem] font-bold">
                    <div className="rounded-lg bg-white border border-[#D7CCBD] p-2 text-[#261F1B]">
                      Oracle
                    </div>
                    <div className="rounded-lg bg-white border border-[#D7CCBD] p-2 text-[#261F1B]">
                      Data
                    </div>
                    <div className="rounded-lg bg-white border border-[#D7CCBD] p-2 text-[#7D2639]">
                      AI
                    </div>
                    <div className="rounded-lg bg-[#DFE4DA] border border-[#D7CCBD] p-2 text-[#657766]">
                      Production
                    </div>
                  </div>
                </div>

                {/* AI Recommendations (Only TWO High-Impact Items) */}
                <div className="rounded-xl border border-[#D7CCBD]/80 bg-white/95 p-3.5">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5 text-[#7D2639]" />
                      <span className="text-xs font-bold text-[#261F1B] uppercase tracking-wider">
                        AI Recommendations
                      </span>
                    </div>
                    <span className="rounded bg-[#DFE4DA] px-2 py-0.5 text-[0.6rem] font-bold text-[#657766]">
                      Actionable
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 rounded-lg border border-[#D7CCBD]/60 bg-[#FFFAF2] px-3 py-2 text-xs text-[#261F1B]">
                      <CheckCircle2 className="h-3.5 w-3.5 text-[#657766] shrink-0" />
                      <span className="font-medium">Validate migration batch for Fusion GL subledgers</span>
                    </div>
                    <div className="flex items-center gap-2 rounded-lg border border-[#D7CCBD]/60 bg-[#FFFAF2] px-3 py-2 text-xs text-[#261F1B]">
                      <CheckCircle2 className="h-3.5 w-3.5 text-[#657766] shrink-0" />
                      <span className="font-medium">Optimize OIC event throughput across Core HR pipeline</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Exactly ONE Supporting Floating Card: DATA AGENT (Bottom Left) */}
            <motion.div
              initial={shouldReduceMotion ? {} : { y: 15, opacity: 0 }}
              animate={shouldReduceMotion ? {} : { y: [0, -4, 0], opacity: 1 }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-6 -left-4 sm:-left-6 hidden sm:block rounded-xl border border-[#D7CCBD] bg-white/95 p-3.5 shadow-xl z-20 backdrop-blur-md max-w-[240px]"
            >
              <div className="flex items-center justify-between border-b border-[#D7CCBD]/60 pb-1.5">
                <span className="text-[0.62rem] font-bold uppercase tracking-wider text-[#7D2639] flex items-center gap-1">
                  <Sparkles className="h-3 w-3" /> DATA AGENT
                </span>
                <span className="rounded bg-[#DFE4DA] px-1.5 py-0.2 text-[0.58rem] font-bold text-[#657766]">
                  99.8% Grounded
                </span>
              </div>
              <p className="mt-1.5 text-xs font-bold text-[#261F1B]">Contract Intelligence</p>
              <p className="mt-0.5 text-[0.65rem] text-[#657766]">DFARS Clause Verified · Citation Traceable</p>
              <Link href="/work/innovation/data-agent" className="mt-2 inline-flex items-center gap-1 text-[0.65rem] font-bold text-[#7D2639] hover:underline">
                View results →
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
