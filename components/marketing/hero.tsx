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

export default function Hero() {
  const { setOpen } = useContactPanel();
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-[#F8FAFA] border-b border-[#DCE3E5] py-12 sm:py-16 lg:py-20 min-h-[630px] lg:min-h-[670px] flex items-center">
      {/* Subtle Cool Radial Gradient (Section 16 Specification) */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 70% 40%, rgba(220,235,232,0.45), transparent 42%)",
        }}
      />

      {/* Background Architectural Texture with very low opacity */}
      <div
        className="absolute inset-0 pointer-events-none bg-cover bg-right opacity-[0.05]"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1920&q=80')",
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
              <span className="h-2 w-2 rounded-full bg-[#0E514E]" />
              <span className="text-xs sm:text-[0.78rem] font-bold uppercase tracking-[0.16em] text-[#5A6770]">
                ENTERPRISE TRANSFORMATION · AI · ENGINEERING
              </span>
            </motion.div>

            {/* Headline with "comes next." in Dark Teal #0E514E */}
            <motion.h1
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.05 }}
              className="font-serif text-4xl sm:text-5xl lg:text-[54px] xl:text-[62px] font-semibold tracking-[-0.035em] text-[#102033] leading-[1.08]"
            >
              Transform the core.
              <br />
              Build what <span className="text-[#0E514E]">comes next.</span>
            </motion.h1>

            {/* Supporting Copy (Max width 560px) */}
            <motion.p
              initial={shouldReduceMotion ? {} : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.45, delay: 0.1 }}
              className="max-w-[560px] text-base sm:text-[1.06rem] leading-relaxed text-[#5A6770]"
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
                className="inline-flex h-[48px] sm:h-[50px] items-center justify-center gap-2 rounded-[6px] bg-[#BA3535] px-7 text-sm font-semibold text-white shadow-[0_4px_16px_rgba(186,53,53,0.22)] hover:bg-[#9E2C2C] hover:shadow-[0_6px_20px_rgba(186,53,53,0.30)] transition-all cursor-pointer"
              >
                <span>Talk to an Expert</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <Link
                href="/capabilities/enterprise-transformation"
                className="inline-flex h-[48px] sm:h-[50px] items-center justify-center gap-2 rounded-[6px] border border-[#DCE3E5] bg-white px-6 text-sm font-semibold text-[#102033] shadow-2xs hover:border-[#0E514E] hover:text-[#0E514E] transition-all"
              >
                <span>Explore What We Do</span>
                <ArrowRight className="h-4 w-4 text-[#5A6770]" />
              </Link>
            </motion.div>

            {/* Capability Navigation with Line Icons & Teal Hover (Section 15 Specification) */}
            <motion.div
              initial={shouldReduceMotion ? {} : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="pt-4 border-t border-[#DCE3E5]"
            >
              <div className="flex flex-wrap items-center gap-y-2 text-xs sm:text-[0.82rem] font-medium text-[#5A6770]">
                <Link
                  href="/oracle"
                  className="inline-flex items-center gap-1.5 hover:text-[#0E514E] transition-colors"
                >
                  <Layers className="h-3.5 w-3.5 text-[#0E514E]" />
                  <span>Oracle</span>
                </Link>
                <span className="mx-2.5 text-[#DCE3E5]">|</span>

                <Link
                  href="/crm"
                  className="inline-flex items-center gap-1.5 hover:text-[#0E514E] transition-colors"
                >
                  <Cpu className="h-3.5 w-3.5 text-[#0E514E]" />
                  <span>CRM</span>
                </Link>
                <span className="mx-2.5 text-[#DCE3E5]">|</span>

                <Link
                  href="/ai-data"
                  className="inline-flex items-center gap-1.5 hover:text-[#0E514E] transition-colors"
                >
                  <Database className="h-3.5 w-3.5 text-[#0E514E]" />
                  <span>AI &amp; Data</span>
                </Link>
                <span className="mx-2.5 text-[#DCE3E5]">|</span>

                <Link
                  href="/capabilities"
                  className="inline-flex items-center gap-1.5 hover:text-[#0E514E] transition-colors"
                >
                  <Cloud className="h-3.5 w-3.5 text-[#0E514E]" />
                  <span>Cloud</span>
                </Link>
                <span className="mx-2.5 text-[#DCE3E5]">|</span>

                <Link
                  href="/capabilities/digital-engineering"
                  className="inline-flex items-center gap-1.5 hover:text-[#0E514E] transition-colors"
                >
                  <Code2 className="h-3.5 w-3.5 text-[#0E514E]" />
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
            <div className="absolute -top-3 -right-3 sm:-top-3.5 sm:-right-3.5 w-[86%] h-[92%] rounded-[10px] border border-[#DCE3E5] bg-[#EEF2F3]/70 -z-0 hidden sm:block" />

            {/* Main Editorial Photograph Container (580–640px width, 420–500px height, 8–10px radius) */}
            <div className="relative z-10 w-full max-w-[620px] h-[320px] sm:h-[400px] lg:h-[460px] rounded-[10px] overflow-hidden border border-[#DCE3E5] bg-white shadow-[0_24px_70px_rgba(16,32,51,0.10)]">
              <Image
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1400&q=85"
                alt="Senior enterprise technology practitioners and leaders collaborating on digital transformation in a modern office"
                fill
                priority
                className="object-cover object-center mkt-img-graded"
                sizes="(max-width: 1024px) 100vw, 52vw"
              />

              {/* Natural subtle ambient lighting gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#102033]/30 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* Floating Strategy Panel (Section 14 Specification: Bottom-Right over image / static on mobile) */}
            <motion.div
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.25 }}
              className="mt-4 lg:mt-0 lg:absolute lg:-bottom-5 lg:right-6 z-20 w-full max-w-[240px] sm:max-w-[260px] rounded-[10px] border border-[#DCE3E5] bg-white/97 p-4 shadow-[0_18px_45px_rgba(16,32,51,0.12)] backdrop-blur-md"
            >
              <div className="flex items-center gap-2 border-b border-[#E1E7E8] pb-2">
                <span className="h-2 w-2 rounded-full bg-[#0E514E]" />
                <p className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#0E514E]">
                  STRATEGY → PRODUCTION
                </p>
              </div>

              <div className="mt-2.5 space-y-1.5 text-xs font-semibold text-[#102033]">
                <div className="flex items-center gap-2">
                  <span className="h-1 w-1 rounded-full bg-[#0E514E]" />
                  <span>Enterprise Platforms</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-1 w-1 rounded-full bg-[#0E514E]" />
                  <span>AI + Data</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-1 w-1 rounded-full bg-[#0E514E]" />
                  <span>Application Engineering</span>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-[#E1E7E8]">
                <Link
                  href="/capabilities/enterprise-transformation"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0E514E] hover:text-[#0A3D3B] transition-colors"
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
