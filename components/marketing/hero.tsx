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
    <section className="relative overflow-hidden border-b border-[#D7CCBD]/80 min-h-[780px] lg:min-h-[85vh] flex items-center bg-[#F7F3EC]">
      {/* 1. Cinematic Background Image (Bleeds fully to right edge, enlarged presence, 0 rectangular edges) */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-full lg:w-[62%] h-full">
          <Image
            src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=2600&q=88"
            alt="Senior consultants and technology leaders collaborating in a modern corporate architectural environment"
            fill
            priority
            className="object-cover object-[right_center] opacity-85 filter grayscale contrast-120 scale-105"
            sizes="(max-width: 1024px) 100vw, 65vw"
          />
        </div>

        {/* Multi-Stop Seamless Gradient: Fades seamlessly into cream #F7F3EC */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, #F7F3EC 0%, #F7F3EC 38%, rgba(247,243,236,0.98) 48%, rgba(247,243,236,0.72) 64%, rgba(247,243,236,0.28) 82%, rgba(247,243,236,0.02) 100%)",
          }}
        />

        {/* Top and Bottom Atmosphere Fades */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(247,243,236,0.65) 0%, transparent 20%, transparent 80%, #F7F3EC 100%)",
          }}
        />

        {/* Subtle Warm Burgundy Depth */}
        <div className="absolute inset-0 bg-radial-[circle_at_82%_30%] from-[#7D2639]/8 via-transparent to-transparent" />
      </div>

      <div className="mkt-shell relative z-10 py-16 sm:py-20 lg:py-24 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 lg:items-center">
          {/* Left Editorial Core: Generous Whitespace, No Dashboard Clutter (~65% width) */}
          <div className="lg:col-span-8 xl:col-span-7">
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
              className="mt-6 font-serif text-[clamp(42px,5.5vw,76px)] leading-[0.96] tracking-[-0.04em] text-[#261F1B] max-w-[720px]"
            >
              Transform the core.
              <br />
              <span className="text-[#695F57] font-normal">Build what comes next.</span>
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
              className="mt-12 border-t border-[#D7CCBD] pt-5 max-w-2xl"
            >
              <p className="text-[0.65rem] font-bold uppercase tracking-[0.14em] text-[#695F57] mb-2.5">
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
        </div>
      </div>
    </section>
  );
}
