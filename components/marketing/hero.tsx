"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  ArrowRight,
  Layers,
  Sparkles,
  Cpu,
  Database,
  Cloud,
  Code2,
} from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

import { useContactPanel } from "@/components/providers/contact-provider";
import { stockImage } from "@/lib/marketing/stock-images";

export default function Hero() {
  const { setOpen } = useContactPanel();
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-[#F8FAF9] border-b border-[#DCE4E1] py-12 sm:py-16 lg:py-20 min-h-[630px] lg:min-h-[670px] flex items-center">
      {/* Subtle Cool Radial Gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 70% 40%, rgba(16,63,62,0.08) 0%, transparent 60%)",
        }}
      />

      {/* Background Architectural Texture with very low opacity */}
      <div
        className="absolute inset-0 pointer-events-none bg-cover bg-right opacity-[0.04]"
        style={{
          backgroundImage:
            `url('${stockImage("heroTexture", { w: 1920, q: 80 })}')`,
        }}
      />

      <div className="mx-auto max-w-[1440px] px-6 lg:px-8 xl:px-10 relative z-10 w-full">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center lg:gap-10 xl:gap-14">
          {/* ========================================================= */}
          {/* LEFT COLUMN: 47–50% Split (Positioning, Messaging & CTAs) */}
          {/* ========================================================= */}
          <div className="lg:col-span-6 xl:col-span-6 space-y-5 sm:space-y-6">
            {/* Eyebrow */}
            <motion.div
              initial={shouldReduceMotion ? {} : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.35 }}
              className="inline-flex items-center gap-2"
            >
              <span className="h-2 w-2 rounded-full bg-[#103F3E]" />
              <span className="text-xs sm:text-[0.78rem] font-bold uppercase tracking-[0.16em] text-[#596968]">
                ENTERPRISE TRANSFORMATION · AI · ENGINEERING
              </span>
            </motion.div>

            {/* Headline with "comes next." in Dark Green #103F3E */}
            <motion.h1
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.05 }}
              className="font-serif text-4xl sm:text-5xl lg:text-[54px] xl:text-[62px] font-semibold tracking-[-0.035em] text-[#163536] leading-[1.08]"
            >
              Transform the core.
              <br />
              Build what <span className="text-[#103F3E]">comes next.</span>
            </motion.h1>

            {/* Supporting Copy (Max width 560px) */}
            <motion.p
              initial={shouldReduceMotion ? {} : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.45, delay: 0.1 }}
              className="max-w-[560px] text-base sm:text-[1.06rem] leading-relaxed text-[#596968]"
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
                className="inline-flex h-[48px] sm:h-[50px] items-center justify-center gap-2 rounded-[6px] bg-[#B63A3A] px-7 text-sm font-semibold text-white shadow-[0_4px_16px_rgba(182,58,58,0.22)] hover:bg-[#992F31] hover:shadow-[0_6px_20px_rgba(182,58,58,0.30)] transition-all cursor-pointer"
              >
                <span>Talk to an Expert</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <Link
                href="/capabilities/enterprise-transformation"
                className="inline-flex h-[48px] sm:h-[50px] items-center justify-center gap-2 rounded-[6px] border border-[#103F3E] bg-white px-6 text-sm font-semibold text-[#103F3E] shadow-2xs hover:bg-[#EEF3F1] transition-all"
              >
                <span>Explore What We Do</span>
                <ArrowRight className="h-4 w-4 text-[#103F3E]" />
              </Link>
            </motion.div>

            {/* Capability Navigation with Line Icons & Teal Hover (Section 15 Specification) */}
            <motion.div
              initial={shouldReduceMotion ? {} : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="pt-4 border-t border-[#DCE4E1]"
            >
              <div className="flex flex-wrap items-center gap-y-2 text-xs sm:text-[0.82rem] font-medium text-[#596968]">
                <Link
                  href="/oracle"
                  className="inline-flex items-center gap-1.5 hover:text-[#103F3E] transition-colors"
                >
                  <Layers className="h-3.5 w-3.5 text-[#103F3E]" />
                  <span>Oracle</span>
                </Link>
                <span className="mx-2.5 text-[#DCE4E1]">|</span>

                <Link
                  href="/crm"
                  className="inline-flex items-center gap-1.5 hover:text-[#103F3E] transition-colors"
                >
                  <Cpu className="h-3.5 w-3.5 text-[#103F3E]" />
                  <span>CRM</span>
                </Link>
                <span className="mx-2.5 text-[#DCE4E1]">|</span>

                <Link
                  href="/ai-data"
                  className="inline-flex items-center gap-1.5 hover:text-[#103F3E] transition-colors"
                >
                  <Database className="h-3.5 w-3.5 text-[#103F3E]" />
                  <span>AI &amp; Data</span>
                </Link>
                <span className="mx-2.5 text-[#DCE4E1]">|</span>

                <Link
                  href="/capabilities"
                  className="inline-flex items-center gap-1.5 hover:text-[#103F3E] transition-colors"
                >
                  <Cloud className="h-3.5 w-3.5 text-[#103F3E]" />
                  <span>Cloud</span>
                </Link>
                <span className="mx-2.5 text-[#DCE4E1]">|</span>

                <Link
                  href="/capabilities/digital-engineering"
                  className="inline-flex items-center gap-1.5 hover:text-[#103F3E] transition-colors"
                >
                  <Code2 className="h-3.5 w-3.5 text-[#103F3E]" />
                  <span>Application Engineering</span>
                </Link>
              </div>
            </motion.div>
          </div>

          {/* ========================================================= */}
          {/* RIGHT COLUMN: 50–53% Split (Executive Collaboration Scene)*/}
          {/* ========================================================= */}
          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, x: 18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55, delay: 0.12 }}
            className="lg:col-span-6 xl:col-span-6 relative flex flex-col items-center lg:items-end"
          >
            {/* Subtle architectural frame accent */}
            <div className="absolute -top-3 -right-3 sm:-top-3.5 sm:-right-3.5 w-[86%] h-[92%] rounded-[10px] border border-[#DCE4E1] bg-[#EEF3F1]/70 -z-0 hidden sm:block" />

            {/* Main Editorial Photograph Container */}
            <div className="relative z-10 w-full max-w-[620px] h-[320px] sm:h-[400px] lg:h-[460px] rounded-[10px] overflow-hidden border border-[#DCE4E1] bg-white shadow-[0_24px_70px_rgba(11,51,50,0.10)]">
              <Image
                src={stockImage("hero", { w: 1400, q: 85 })}
                alt="Senior enterprise technology practitioners and leaders collaborating on digital transformation in a modern office"
                fill
                priority
                className="object-cover object-center mkt-img-graded"
                sizes="(max-width: 1024px) 100vw, 52vw"
              />

              {/* Natural subtle ambient lighting gradient */}
              <div className="mkt-overlay-soft" />
            </div>

            {/* Floating Strategy Panel */}
            <motion.div
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.25 }}
              className="mt-4 lg:mt-0 lg:absolute lg:-bottom-5 lg:right-6 z-20 w-full max-w-[240px] sm:max-w-[260px] rounded-[10px] border border-[#DCE4E1] bg-white/97 p-4 shadow-[0_18px_45px_rgba(11,51,50,0.12)] backdrop-blur-md"
            >
              <div className="flex items-center gap-2 border-b border-[#DCE4E1] pb-2">
                <span className="h-2 w-2 rounded-full bg-[#103F3E]" />
                <p className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#103F3E]">
                  STRATEGY → PRODUCTION
                </p>
              </div>

              <div className="mt-2.5 space-y-1.5 text-xs font-semibold text-[#163536]">
                <div className="flex items-center gap-2">
                  <span className="h-1 w-1 rounded-full bg-[#103F3E]" />
                  <span>Enterprise Platforms</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-1 w-1 rounded-full bg-[#103F3E]" />
                  <span>AI + Data</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-1 w-1 rounded-full bg-[#103F3E]" />
                  <span>Application Engineering</span>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-[#DCE4E1]">
                <Link
                  href="/capabilities/enterprise-transformation"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#103F3E] hover:text-[#0B3332] transition-colors"
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
