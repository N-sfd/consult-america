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
    <section className="relative overflow-hidden bg-[#F7F9FA] border-b border-[#DDE4E8] py-16 sm:py-20 lg:py-24 xl:py-28">
      {/* Subtle Architectural & Natural Light Backdrop (2-3% opacity, no heavy gradients/blobs) */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 85% 20%, rgba(53,124,120,0.04) 0%, transparent 45%), linear-gradient(to right, rgba(16,32,51,0.02) 1px, transparent 1px), linear-gradient(to bottom, rgba(16,32,51,0.02) 1px, transparent 1px)",
          backgroundSize: "100% 100%, 64px 64px, 64px 64px",
        }}
      />

      <div className="ca-shell relative z-10">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center lg:gap-14 xl:gap-16">
          {/* ========================================================= */}
          {/* LEFT COLUMN: 52% Split (Executive Positioning & CTAs)    */}
          {/* ========================================================= */}
          <div className="lg:col-span-7 xl:col-span-6 space-y-6 sm:space-y-7">
            {/* Eyebrow */}
            <motion.div
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2"
            >
              <span className="h-2 w-2 rounded-full bg-[#B63A3A]" />
              <span className="text-xs sm:text-[0.78rem] font-bold uppercase tracking-[0.16em] text-[#526170]">
                ENTERPRISE TRANSFORMATION · AI · ENGINEERING
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.06 }}
              className="font-serif text-4xl sm:text-5xl lg:text-6xl xl:text-[68px] font-semibold tracking-[-0.035em] text-[#102033] leading-[1.05]"
            >
              Transform the core.
              <br />
              Build what <span className="text-[#B63A3A]">comes next.</span>
            </motion.h1>

            {/* Supporting Copy */}
            <motion.p
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.12 }}
              className="max-w-xl text-base sm:text-lg lg:text-[1.12rem] leading-relaxed text-[#526170]"
            >
              Consult America helps organizations modernize enterprise platforms,
              connect data and workflows, operationalize AI, and engineer digital
              products from strategy through production.
            </motion.p>

            {/* Primary & Secondary Action CTAs */}
            <motion.div
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.18 }}
              className="flex flex-col gap-3.5 sm:flex-row sm:items-center pt-2"
            >
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="ca-button-primary !min-h-[52px] !px-8 text-sm font-semibold rounded-lg cursor-pointer flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(182,58,58,0.20)] hover:shadow-[0_6px_20px_rgba(182,58,58,0.28)] transition-all"
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

            {/* Small Supporting Practice Line (Clean & Uncluttered) */}
            <motion.div
              initial={shouldReduceMotion ? {} : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.24 }}
              className="pt-4 border-t border-[#DDE4E8]/80 text-xs sm:text-sm font-medium text-[#526170]"
            >
              <span>Oracle</span>
              <span className="mx-2 text-[#DDE4E8]">·</span>
              <span>CRM</span>
              <span className="mx-2 text-[#DDE4E8]">·</span>
              <span>AI &amp; Data</span>
              <span className="mx-2 text-[#DDE4E8]">·</span>
              <span>Application Engineering</span>
            </motion.div>
          </div>

          {/* ========================================================= */}
          {/* RIGHT COLUMN: 48% Split (One Powerful Premium Photograph) */}
          {/* ========================================================= */}
          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-5 xl:col-span-6 relative flex justify-center lg:justify-end"
          >
            {/* Main Editorial Photograph Container (480–540px height, 6–8px radius, subtle shadow) */}
            <div className="relative w-full max-w-[580px] h-[460px] sm:h-[500px] lg:h-[520px] rounded-lg overflow-hidden border border-[#DDE4E8] bg-white shadow-[0_20px_60px_rgba(16,32,51,0.09)]">
              <Image
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=1200&q=85"
                alt="Senior enterprise technology leaders and consultants collaborating in a modern corporate setting"
                fill
                priority
                className="object-cover object-center mkt-img-graded"
                sizes="(max-width: 1024px) 100vw, 48vw"
              />

              {/* Natural light vignette overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#102033]/30 via-transparent to-transparent pointer-events-none" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
