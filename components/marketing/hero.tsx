"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Layers,
  Cpu,
  Database,
  Cloud,
  Code2,
  Sparkles,
} from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

import { useContactPanel } from "@/components/providers/contact-provider";
import { stockImage } from "@/lib/marketing/stock-images";

export default function Hero() {
  const { setOpen } = useContactPanel();
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-[#F0F6F4] border-b border-[#C9DDD7] py-14 sm:py-18 lg:py-24 min-h-[660px] lg:min-h-[720px] flex items-center">
      {/* Background Radial Emerald Atmosphere Glow */}
      <div
        className="absolute inset-0 pointer-events-none ca-bg-drift"
        style={{
          background:
            "radial-gradient(circle at 75% 38%, rgba(40,123,114,0.18) 0%, rgba(75,148,136,0.06) 40%, transparent 70%), linear-gradient(125deg, #FFFFFF 0%, #F0F6F4 52%, #E1ECE8 100%)",
        }}
      />

      {/* Subtle Architectural Texture Overlay */}
      <div
        className="absolute inset-0 pointer-events-none bg-cover bg-right opacity-[0.035]"
        style={{
          backgroundImage: `url('${stockImage("heroTexture", { w: 1920, q: 80 })}')`,
        }}
      />

      <div className="mx-auto max-w-[1440px] px-6 lg:px-8 xl:px-10 relative z-10 w-full">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center lg:gap-10 xl:gap-14">
          {/* ========================================================= */}
          {/* LEFT COLUMN: 46–48% Split (Positioning, Messaging & CTAs) */}
          {/* ========================================================= */}
          <div className="lg:col-span-5 xl:col-span-6 space-y-5 sm:space-y-6">
            {/* Eyebrow in Mid-Emerald */}
            <motion.div
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2"
            >
              <span className="h-2 w-2 rounded-full bg-[#176A63]" />
              <span className="text-xs sm:text-[0.78rem] font-bold uppercase tracking-[0.16em] text-[#176A63]">
                ENTERPRISE TRANSFORMATION · AI · ENGINEERING
              </span>
            </motion.div>

            {/* Headline with "comes next." in Deep Emerald #0B4A47 */}
            <motion.h1
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05 }}
              className="font-serif text-4xl sm:text-5xl lg:text-[54px] xl:text-[62px] font-semibold tracking-[-0.035em] text-[#122D2E] leading-[1.08]"
            >
              Transform the core.
              <br />
              Build what <span className="text-[#0B4A47]">comes next.</span>
            </motion.h1>

            {/* Supporting Copy */}
            <motion.p
              initial={shouldReduceMotion ? {} : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="max-w-[560px] text-base sm:text-[1.06rem] leading-relaxed text-[#5B6D6B]"
            >
              Consult America helps organizations modernize enterprise platforms,
              connect data and workflows, operationalize AI, and engineer digital
              products from strategy through production.
            </motion.p>

            {/* Action CTAs */}
            <motion.div
              initial={shouldReduceMotion ? {} : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.45, delay: 0.15 }}
              className="flex flex-col gap-3 sm:flex-row sm:items-center pt-2"
            >
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="inline-flex h-[50px] items-center justify-center gap-2 rounded-[8px] bg-[#B83A3A] px-7 text-sm font-semibold text-white shadow-[0_4px_18px_rgba(184,58,58,0.25)] hover:bg-[#992F31] hover:shadow-[0_6px_22px_rgba(184,58,58,0.32)] transition-all cursor-pointer"
              >
                <span>Talk to an Expert</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <Link
                href="/capabilities/enterprise-transformation"
                className="inline-flex h-[50px] items-center justify-center gap-2 rounded-[8px] border border-[#0B4A47] bg-white/90 px-6 text-sm font-semibold text-[#0B4A47] shadow-2xs hover:bg-[#E1ECE8] transition-all"
              >
                <span>Explore What We Do</span>
                <ArrowRight className="h-4 w-4 text-[#0B4A47]" />
              </Link>
            </motion.div>

            {/* Capability Navigation with Line Icons */}
            <motion.div
              initial={shouldReduceMotion ? {} : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.45, delay: 0.2 }}
              className="pt-5 border-t border-[#C9DDD7]"
            >
              <div className="flex flex-wrap items-center gap-y-2 text-xs sm:text-[0.82rem] font-medium text-[#5B6D6B]">
                <Link
                  href="/oracle"
                  className="inline-flex items-center gap-1.5 hover:text-[#0B4A47] transition-colors"
                >
                  <Layers className="h-3.5 w-3.5 text-[#0B4A47]" />
                  <span>Oracle</span>
                </Link>
                <span className="mx-2.5 text-[#C9DDD7]">|</span>

                <Link
                  href="/crm"
                  className="inline-flex items-center gap-1.5 hover:text-[#0B4A47] transition-colors"
                >
                  <Cpu className="h-3.5 w-3.5 text-[#0B4A47]" />
                  <span>CRM</span>
                </Link>
                <span className="mx-2.5 text-[#C9DDD7]">|</span>

                <Link
                  href="/ai-data"
                  className="inline-flex items-center gap-1.5 hover:text-[#0B4A47] transition-colors"
                >
                  <Database className="h-3.5 w-3.5 text-[#0B4A47]" />
                  <span>AI &amp; Data</span>
                </Link>
                <span className="mx-2.5 text-[#C9DDD7]">|</span>

                <Link
                  href="/capabilities"
                  className="inline-flex items-center gap-1.5 hover:text-[#0B4A47] transition-colors"
                >
                  <Cloud className="h-3.5 w-3.5 text-[#0B4A47]" />
                  <span>Cloud</span>
                </Link>
                <span className="mx-2.5 text-[#C9DDD7]">|</span>

                <Link
                  href="/capabilities/digital-engineering"
                  className="inline-flex items-center gap-1.5 hover:text-[#0B4A47] transition-colors"
                >
                  <Code2 className="h-3.5 w-3.5 text-[#0B4A47]" />
                  <span>Application Engineering</span>
                </Link>
              </div>
            </motion.div>
          </div>

          {/* ========================================================= */}
          {/* RIGHT COLUMN: 52–54% Split (Art-Directed Layered Composition) */}
          {/* ========================================================= */}
          <div className="lg:col-span-7 xl:col-span-6 relative flex flex-col items-center lg:items-end">
            <div className="relative w-full max-w-[620px] min-h-[380px] sm:min-h-[460px] lg:min-h-[500px]">
              {/* 1. Abstract Emerald Curved Background Shape (08 — HERO GREEN BACKGROUND SHAPE) */}
              <div
                className="absolute -top-6 -right-6 w-[90%] h-[92%] rounded-[180px_24px_140px_24px] pointer-events-none -z-0"
                style={{
                  background: "linear-gradient(145deg, #0B4A47, #287B72)",
                  opacity: 0.16,
                }}
              />

              {/* 2. Secondary Architectural Crop with Gentle Float (07 & 10 — HERO SECONDARY IMAGE) */}
              <div className="absolute -top-4 right-4 sm:right-8 w-[160px] sm:w-[220px] h-[200px] sm:h-[260px] rounded-t-[100px] rounded-b-[12px] overflow-hidden border border-[#C9DDD7] bg-white ca-shadow-overlap ca-hero-float z-1 hidden sm:block opacity-90">
                <Image
                  src={stockImage("heroArchitectural", { w: 600, q: 80 })}
                  alt="Modern glass architecture"
                  fill
                  className="object-cover object-center mkt-img-graded"
                  sizes="(max-width: 768px) 160px, 220px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#073B3A]/60 via-transparent to-transparent" />
              </div>

              {/* 3. Dominant Enterprise Collaboration Image with Architectural Asymmetric Arch (06 — MAIN SHAPE) */}
              <motion.div
                initial={shouldReduceMotion ? {} : { opacity: 0, y: 18, scale: 0.985 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
                className="relative z-10 w-full max-w-[540px] h-[320px] sm:h-[400px] lg:h-[450px] overflow-hidden border border-[#C9DDD7] bg-white ca-shadow-elevated rounded-[64px_14px_48px_14px] sm:rounded-[140px_20px_100px_20px]"
              >
                <Image
                  src={stockImage("hero", { w: 1400, q: 85 })}
                  alt="Senior enterprise technology leaders collaborating on digital transformation"
                  fill
                  priority
                  className="object-cover object-center mkt-img-graded"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                {/* Natural subtle ambient lighting gradient */}
                <div className="mkt-overlay-soft" />
              </motion.div>

              {/* 4. Small Overlapping Strategy Detail Badge (Foregound Depth Layer) */}
              <motion.div
                initial={shouldReduceMotion ? {} : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="mt-4 lg:mt-0 lg:absolute lg:-bottom-6 lg:left-0 z-20 w-full max-w-[250px] sm:max-w-[270px] rounded-[10px] border border-[#C9DDD7] bg-white/95 p-4 ca-shadow-overlap backdrop-blur-md"
              >
                <div className="flex items-center gap-2 border-b border-[#E1ECE8] pb-2">
                  <span className="h-2 w-2 rounded-full bg-[#176A63]" />
                  <p className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#0B4A47]">
                    STRATEGY → PRODUCTION
                  </p>
                </div>

                <div className="mt-2.5 space-y-1.5 text-xs font-semibold text-[#122D2E]">
                  <div className="flex items-center gap-2">
                    <span className="h-1 w-1 rounded-full bg-[#176A63]" />
                    <span>Enterprise Platforms</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-1 w-1 rounded-full bg-[#176A63]" />
                    <span>AI + Data Intelligence</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-1 w-1 rounded-full bg-[#176A63]" />
                    <span>Application Engineering</span>
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-[#E1ECE8]">
                  <Link
                    href="/capabilities/enterprise-transformation"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0B4A47] hover:text-[#176A63] transition-colors"
                  >
                    <span>How We Deliver</span>
                    <ArrowRight className="h-3.5 w-3.5 text-[#B83A3A]" />
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
