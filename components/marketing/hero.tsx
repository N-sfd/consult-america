"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Sparkles, Activity } from "lucide-react";
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
    <section className="relative overflow-hidden border-b border-[#D7CCBD]/80 min-h-[820px] lg:min-h-[88vh] flex items-center bg-[#F7F3EC]">
      {/* 1. Cinematic Background Image (Elevated 65% Opacity on Right, Controlled Warm Left Gradient) */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Image
          src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2400&q=85"
          alt="Modern enterprise architecture and operations center"
          fill
          priority
          className="object-cover object-right sm:object-[center_right] opacity-65 filter grayscale contrast-130"
          sizes="100vw"
        />

        {/* Controlled Warm Editorial Gradient Scrim behind Left Text */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(247,243,236,0.99) 0%, rgba(247,243,236,0.96) 34%, rgba(247,243,236,0.82) 54%, rgba(247,243,236,0.30) 78%, rgba(247,243,236,0.06) 100%)",
          }}
        />

        {/* Subtle Bottom Fade */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(180deg, transparent 65%, rgba(247,243,236,0.92) 100%)",
          }}
        />

        {/* Atmospheric Warm Burgundy Glow */}
        <div className="absolute inset-0 bg-radial-[circle_at_80%_25%] from-[#7D2639]/7 via-transparent to-transparent" />
      </div>

      <div className="mkt-shell relative z-10 py-12 sm:py-16 w-full">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center lg:gap-12 xl:gap-20">
          {/* Left Column: Negative Space & Headline (~60% desktop width) */}
          <div className="lg:col-span-7 xl:col-span-7">
            {/* Eyebrow */}
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

            {/* Headline */}
            <motion.h1
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.08 }}
              className="mt-5 font-serif text-[clamp(44px,5.8vw,80px)] leading-[0.94] tracking-[-0.045em] text-[#261F1B] max-w-[760px]"
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

            {/* Action CTAs */}
            <motion.div
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.24 }}
              className="mt-8 flex flex-col gap-3.5 sm:flex-row sm:items-center"
            >
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="group/cta ca-button-primary !min-h-[52px] !px-8 text-sm font-semibold rounded-lg cursor-pointer shadow-[0_10px_25px_rgba(125,38,57,0.22)] hover:shadow-[0_14px_32px_rgba(125,38,57,0.32)]"
              >
                Start the conversation
                <ArrowUpRight className="mkt-cta-arrow h-4 w-4 transition-transform group-hover/cta:translate-x-1 group-hover/cta:-translate-y-0.5" />
              </button>
              <Link
                href="/capabilities/enterprise-transformation"
                className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-lg border border-[#261F1B]/70 bg-[#FFFDF8]/80 backdrop-blur-xs px-6 text-sm font-semibold text-[#261F1B] transition-all hover:border-[#7D2639] hover:text-[#7D2639] hover:bg-[#FFFDF8]"
              >
                Explore our capabilities →
              </Link>
            </motion.div>

            {/* Practice Areas Rail */}
            <motion.div
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.32 }}
              className="mt-10 border-t border-[#D7CCBD] pt-4 max-w-2xl"
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

          {/* Right Column: Visually Restrained Transformation Workspace (~40% desktop width, shifted right) */}
          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="lg:col-span-5 xl:col-span-5 relative max-w-[460px] lg:ml-auto w-full"
          >
            {/* Background Frame */}
            <div className="absolute -inset-1.5 -right-2 rounded-[20px] border border-[#D7CCBD]/70 bg-[#FFFAF2]/80 -rotate-1 hidden sm:block shadow-xs" />

            {/* Main Application Container */}
            <div className="relative rounded-[18px] border border-[rgba(80,60,50,0.12)] bg-[rgba(255,255,255,0.94)] shadow-[0_20px_60px_rgba(24,18,14,0.11)] overflow-hidden backdrop-blur-[14px]">
              {/* Window Header */}
              <div className="flex items-center justify-between border-b border-[#D7CCBD]/70 bg-[#F7F3EC]/95 px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-[#D7CCBD]" />
                    <span className="h-2 w-2 rounded-full bg-[#D7CCBD]" />
                    <span className="h-2 w-2 rounded-full bg-[#D7CCBD]" />
                  </div>
                  <span className="ml-1.5 font-mono text-[0.62rem] font-bold tracking-wider text-[#261F1B] uppercase">
                    TRANSFORMATION COMMAND CENTER
                  </span>
                </div>
                <span className="text-[0.58rem] font-bold text-[#695F57] bg-[#EBE5DA] px-2 py-0.5 rounded-full uppercase tracking-wider">
                  ILLUSTRATIVE VIEW
                </span>
              </div>

              {/* 4 Core Balanced Program Metrics */}
              <div className="grid grid-cols-4 gap-2 p-3 border-b border-[#D7CCBD]/50 bg-[#FFFAF2]/40 text-center">
                <div className="rounded-md border border-[#D7CCBD]/60 bg-white/90 p-2">
                  <p className="font-serif text-base sm:text-lg font-bold text-[#261F1B]">14</p>
                  <p className="text-[0.55rem] font-bold uppercase tracking-wider text-[#695F57]">Programs</p>
                </div>
                <div className="rounded-md border border-[#D7CCBD]/60 bg-white/90 p-2">
                  <p className="font-serif text-base sm:text-lg font-bold text-[#7D2639]">82%</p>
                  <p className="text-[0.55rem] font-bold uppercase tracking-wider text-[#695F57]">Automation</p>
                </div>
                <div className="rounded-md border border-[#D7CCBD]/60 bg-white/90 p-2">
                  <p className="font-serif text-base sm:text-lg font-bold text-[#657766]">99%</p>
                  <p className="text-[0.55rem] font-bold uppercase tracking-wider text-[#695F57]">Quality</p>
                </div>
                <div className="rounded-md border border-[#D7CCBD]/60 bg-white/90 p-2">
                  <p className="font-serif text-base sm:text-lg font-bold text-[#261F1B]">98%</p>
                  <p className="text-[0.55rem] font-bold uppercase tracking-wider text-[#695F57]">Health</p>
                </div>
              </div>

              {/* Stream & Recommendations */}
              <div className="p-3.5 space-y-3">
                {/* Transformation Stream */}
                <div className="rounded-lg border border-[#D7CCBD]/70 bg-[#F7F3EC]/60 p-2.5">
                  <p className="font-mono text-[0.6rem] font-bold uppercase tracking-wider text-[#7D2639] mb-1.5 flex items-center gap-1.5">
                    <Activity className="h-3 w-3" /> TRANSFORMATION STREAM
                  </p>
                  <div className="flex items-center justify-between text-center font-mono text-[0.62rem] font-bold text-[#261F1B]">
                    <span className="rounded bg-white px-1.5 py-0.5 border border-[#D7CCBD]/80">Oracle</span>
                    <span className="text-[#D7CCBD] tracking-wider">━━━━</span>
                    <span className="rounded bg-white px-1.5 py-0.5 border border-[#D7CCBD]/80">Data</span>
                    <span className="text-[#D7CCBD] tracking-wider">━━━━</span>
                    <span className="rounded bg-white px-1.5 py-0.5 border border-[#D7CCBD]/80 text-[#7D2639]">AI</span>
                    <span className="text-[#D7CCBD] tracking-wider">━━━━</span>
                    <span className="rounded bg-[#DFE4DA] px-1.5 py-0.5 border border-[#D7CCBD]/80 text-[#657766]">Production</span>
                  </div>
                </div>

                {/* AI Recommendations (2 Focused Items) */}
                <div className="rounded-lg border border-[#D7CCBD]/70 bg-white p-3 space-y-1.5">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[0.62rem] font-bold uppercase tracking-wider text-[#261F1B] flex items-center gap-1">
                      <Sparkles className="h-3 w-3 text-[#7D2639]" /> AI RECOMMENDATIONS
                    </span>
                    <span className="text-[0.55rem] font-bold text-[#657766] bg-[#DFE4DA] px-1.5 py-0.2 rounded">Actionable</span>
                  </div>

                  <div className="flex items-center gap-2 rounded-md border border-[#D7CCBD]/50 bg-[#FFFAF2] px-2.5 py-1.5 text-[0.72rem] text-[#261F1B]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#7D2639] shrink-0" />
                    <span className="font-medium truncate">Resolve integration dependency in OIC Bridge</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-md border border-[#D7CCBD]/50 bg-[#FFFAF2] px-2.5 py-1.5 text-[0.72rem] text-[#261F1B]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#657766] shrink-0" />
                    <span className="font-medium truncate">Validate migration batch for Fusion GL subledgers</span>
                  </div>
                </div>
              </div>

              {/* Connected Systems Bar */}
              <div className="border-t border-[#D7CCBD]/80 bg-[#F7F3EC] px-3.5 py-2 text-center text-[0.65rem] text-[#695F57] font-mono">
                <span className="font-bold text-[#261F1B]">Connected:</span>{" "}
                <span className="text-[#7D2639] font-semibold">ORACLE · DATA · AI · APIs</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
