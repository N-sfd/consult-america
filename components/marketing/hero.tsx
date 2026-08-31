"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

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

  return (
    <section className="relative overflow-hidden min-h-[clamp(720px,86vh,920px)] flex items-center bg-[#14181C] border-b border-[#261F1B]/30">
      {/* 1. LAYER 1: Full-Bleed Architectural Enterprise Background (On-load entrance only: 1.025 -> 1 over 1.8s, then still) */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <motion.div
          initial={shouldReduceMotion ? { scale: 1 } : { scale: 1.025 }}
          animate={{ scale: 1 }}
          transition={{
            duration: 1.8,
            ease: [0.2, 0.8, 0.2, 1],
          }}
          className="relative h-full w-full"
        >
          <Image
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2600&q=90"
            alt="Consult America Enterprise Technology Architecture"
            fill
            priority
            quality={92}
            className="object-cover object-[center_right] lg:object-center filter contrast-[1.05] brightness-[0.95]"
            sizes="100vw"
          />
        </motion.div>

        {/* 2. Dark Cinematic Left Gradient Scrim (Guarantees WCAG AA Text Contrast while preserving photography) */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(16,20,24,0.96) 0%, rgba(16,20,24,0.88) 36%, rgba(16,20,24,0.60) 58%, rgba(16,20,24,0.20) 80%, rgba(16,20,24,0.04) 100%)",
          }}
        />

        {/* Top Gradient for Header Contrast & Bottom Gradient for Section Transition */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(14,18,22,0.70) 0%, transparent 22%, transparent 78%, rgba(14,18,22,0.65) 100%)",
          }}
        />

        {/* Subtle Warm Burgundy Ambient Depth */}
        <div className="absolute inset-0 bg-radial-[circle_at_80%_25%] from-[#B63A3A]/8 via-transparent to-transparent" />
      </div>

      {/* 3. LAYER 2: Hero Content Staggered Animation Sequence */}
      <div className="mkt-shell relative z-10 py-16 sm:py-20 lg:py-24 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 lg:items-center">
          {/* Left Column: ~58% width on desktop */}
          <div className="lg:col-span-8 xl:col-span-7">
            {/* Eyebrow */}
            <motion.div
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="flex items-center gap-3"
            >
              <span className="h-0.5 w-6 rounded-full bg-[#B63A3A]" />
              <span className="text-[0.72rem] sm:text-[0.78rem] font-semibold uppercase tracking-[0.16em] text-[#D8C5AA]">
                ENTERPRISE TRANSFORMATION · AI · ENGINEERING
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mt-6 font-serif text-[clamp(46px,5.8vw,88px)] leading-[0.93] tracking-[-0.048em] text-[#FFFDF8] max-w-[780px]"
            >
              <span className="block text-[0.93em] text-[#FFFDF8]/95 font-medium">Transform the core.</span>
              <span className="block text-[#FFFDF8] font-bold">Build what comes next.</span>
            </motion.h1>

            {/* Supporting Copy */}
            <motion.p
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.2 }}
              className="mt-6 max-w-xl text-base leading-relaxed text-[#FFFDF8]/82 sm:text-lg lg:text-[1.125rem]"
            >
              Consult America helps organizations modernize enterprise platforms,
              connect data and workflows, operationalize AI, and engineer the
              digital products that move the business forward.
            </motion.p>

            {/* Action CTAs */}
            <motion.div
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center"
            >
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="group/cta ca-button-primary !min-h-[54px] !px-8 text-sm font-semibold rounded-[6px] cursor-pointer !bg-[#B63A3A] hover:!bg-[#9E2E2E] !text-white shadow-[0_8px_24px_rgba(182,58,58,0.35)] hover:shadow-[0_12px_28px_rgba(182,58,58,0.45)]"
              >
                <span>Start a conversation</span>
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover/cta:translate-x-1 group-hover/cta:-translate-y-0.5" />
              </button>
              <Link
                href="/capabilities/enterprise-transformation"
                className="inline-flex min-h-[54px] items-center justify-center gap-2 px-5 text-sm font-semibold text-[#FFFDF8] transition-colors hover:text-[#D8C5AA]"
              >
                Explore our capabilities →
              </Link>
            </motion.div>

            {/* Practice Areas Rail */}
            <motion.div
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="mt-12 border-t border-white/15 pt-5 max-w-2xl"
            >
              <p className="text-[0.62rem] font-bold uppercase tracking-[0.16em] text-white/50 mb-2.5">
                PRACTICE AREAS
              </p>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs sm:text-sm font-semibold text-white/80">
                {practiceAreas.map((item, idx) => (
                  <div key={item.label} className="inline-flex items-center gap-4">
                    <Link
                      href={item.href}
                      className="group/item relative py-0.5 hover:text-white transition-colors inline-flex items-center gap-1"
                    >
                      <span>{item.label}</span>
                      <span className="absolute inset-x-0 bottom-0 h-0.5 bg-[#B63A3A] scale-x-0 transition-transform origin-left group-hover/item:scale-x-100" />
                    </Link>
                    {idx < practiceAreas.length - 1 && (
                      <span className="text-white/25 font-normal" aria-hidden="true">
                        /
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
