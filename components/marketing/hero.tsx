"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

import { useContactPanel } from "@/components/providers/contact-provider";

export default function Hero() {
  const { setOpen } = useContactPanel();
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-[#F7F9FA] border-b border-[#DDE4E8] py-14 sm:py-18 lg:py-22 xl:py-26 min-h-[650px] lg:min-h-[700px] flex items-center">
      {/* Background Architectural Texture (Section 17 Specification) */}
      <div
        className="absolute inset-0 pointer-events-none bg-cover bg-right opacity-[0.14]"
        style={{
          backgroundImage:
            "linear-gradient(90deg, rgba(247,249,250,1) 0%, rgba(247,249,250,0.98) 38%, rgba(247,249,250,0.76) 60%, rgba(247,249,250,0.24) 100%), url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1920&q=80')",
        }}
      />

      {/* Subtle Architectural Grid (Section 18 Specification: 2-3% opacity) */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(16,32,51,0.02) 1px, transparent 1px), linear-gradient(to bottom, rgba(16,32,51,0.02) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      <div className="ca-shell relative z-10 w-full">
        <div className="grid grid-cols-1 gap-10 sm:gap-12 lg:grid-cols-12 lg:items-center lg:gap-12 xl:gap-16">
          {/* ========================================================= */}
          {/* LEFT COLUMN: 52–55% Split (Positioning, Messaging & CTAs) */}
          {/* ========================================================= */}
          <div className="lg:col-span-7 xl:col-span-6 space-y-6 sm:space-y-7">
            {/* Eyebrow */}
            <motion.div
              initial={shouldReduceMotion ? {} : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.35 }}
              className="inline-flex items-center gap-2"
            >
              <span className="h-2 w-2 rounded-full bg-[#B63A3A]" />
              <span className="text-xs sm:text-[0.78rem] font-bold uppercase tracking-[0.16em] text-[#526170]">
                ENTERPRISE TRANSFORMATION · AI · ENGINEERING
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.05 }}
              className="font-serif text-4xl sm:text-5xl lg:text-6xl xl:text-[66px] font-semibold tracking-[-0.035em] text-[#102033] leading-[1.05]"
            >
              Transform the core.
              <br />
              Build what <span className="text-[#B63A3A]">comes next.</span>
            </motion.h1>

            {/* Supporting Copy */}
            <motion.p
              initial={shouldReduceMotion ? {} : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.45, delay: 0.1 }}
              className="max-w-xl text-base sm:text-lg lg:text-[1.12rem] leading-relaxed text-[#526170]"
            >
              Consult America helps organizations modernize enterprise platforms,
              connect data and workflows, operationalize AI, and engineer digital
              products from strategy through production.
            </motion.p>

            {/* Action CTAs */}
            <motion.div
              initial={shouldReduceMotion ? {} : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="flex flex-col gap-3 sm:flex-row sm:items-center pt-1"
            >
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="ca-button-primary !min-h-[50px] !px-7 text-sm font-semibold rounded-lg cursor-pointer flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(182,58,58,0.20)] hover:shadow-[0_6px_20px_rgba(182,58,58,0.28)] transition-all"
              >
                <span>Talk to an Expert</span>
                <ArrowUpRight className="h-4 w-4" />
              </button>

              <Link
                href="/capabilities/enterprise-transformation"
                className="inline-flex !min-h-[50px] items-center justify-center gap-2 rounded-lg border border-[#C9D1D8] bg-white px-6 text-sm font-semibold text-[#102033] shadow-2xs hover:border-[#B63A3A] hover:text-[#B63A3A] transition-all"
              >
                <span>Explore What We Do</span>
                <ArrowRight className="h-4 w-4 text-[#526170]" />
              </Link>
            </motion.div>

            {/* Capability Line (Section 11 Requirement) */}
            <motion.div
              initial={shouldReduceMotion ? {} : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="pt-4 border-t border-[#DDE4E8] text-xs sm:text-sm font-medium text-[#526170]"
            >
              <span>Oracle</span>
              <span className="mx-2 text-[#DDE4E8]">·</span>
              <span>CRM</span>
              <span className="mx-2 text-[#DDE4E8]">·</span>
              <span>AI &amp; Data</span>
              <span className="mx-2 text-[#DDE4E8]">·</span>
              <span>Cloud</span>
              <span className="mx-2 text-[#DDE4E8]">·</span>
              <span>Application Engineering</span>
            </motion.div>
          </div>

          {/* ========================================================= */}
          {/* RIGHT COLUMN: 45–48% Split (Layered Visual Composition)   */}
          {/* ========================================================= */}
          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55, delay: 0.12 }}
            className="lg:col-span-5 xl:col-span-6 relative flex justify-center lg:justify-end"
          >
            {/* Layered Visual Background Accent (Section 15: Image 2 Layering Idea) */}
            <div className="absolute -top-3 -right-3 sm:-top-4 sm:-right-4 w-[85%] h-[90%] rounded-lg border border-[#DDE4E8] bg-[#EEF3F4]/80 -z-0 hidden sm:block" />

            {/* Main Editorial Photograph Container (550–620px width, 470–520px height, 6–10px radius) */}
            <div className="relative z-10 w-full max-w-[580px] h-[300px] sm:h-[420px] lg:h-[490px] rounded-lg overflow-hidden border border-[#DDE4E8] bg-white shadow-[0_24px_70px_rgba(16,32,51,0.10)]">
              <Image
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=1200&q=85"
                alt="Senior enterprise technology consultants and business leaders collaborating in a modern corporate setting"
                fill
                priority
                className="object-cover object-center mkt-img-graded"
                sizes="(max-width: 1024px) 100vw, 48vw"
              />

              {/* Natural light vignette overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#102033]/35 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* Simple Floating Foreground Panel (Section 16 Specification) */}
            <motion.div
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.25 }}
              className="absolute -bottom-5 left-3 sm:left-6 z-20 max-w-[320px] sm:max-w-[340px] rounded-[10px] border border-[#DDE4E8] bg-white/96 p-4 sm:p-4.5 shadow-[0_16px_40px_rgba(16,32,51,0.10)] backdrop-blur-md"
            >
              <div className="flex items-center justify-between border-b border-[#E9EEF1] pb-2">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#B63A3A]" />
                  <p className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#102033]">
                    STRATEGY → PRODUCTION
                  </p>
                </div>
              </div>

              <div className="mt-2.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-semibold text-[#102033]">
                <span>Enterprise Platforms</span>
                <span className="text-[#DDE4E8]">·</span>
                <span>AI + Data</span>
                <span className="text-[#DDE4E8]">·</span>
                <span>Application Engineering</span>
              </div>

              <div className="mt-3 pt-2 border-t border-[#E9EEF1]">
                <Link
                  href="/capabilities/enterprise-transformation"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#B63A3A] hover:text-[#942E31] transition-colors"
                >
                  <span>How We Work</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
