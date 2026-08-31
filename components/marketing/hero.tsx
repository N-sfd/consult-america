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
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const checkDesktop = () => setIsDesktop(window.innerWidth >= 1024);
    checkDesktop();
    window.addEventListener("resize", checkDesktop);
    return () => window.removeEventListener("resize", checkDesktop);
  }, []);

  useEffect(() => {
    if (shouldReduceMotion || !isDesktop) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      // Background ±3px, Foreground ±8px pointer response
      const normX = (e.clientX / innerWidth) - 0.5;
      const normY = (e.clientY / innerHeight) - 0.5;
      setMouseOffset({ x: normX, y: normY });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [shouldReduceMotion, isDesktop]);

  return (
    <section className="relative overflow-hidden min-h-[clamp(720px,86vh,920px)] flex items-center bg-[#211E1B] border-b border-[#3A302B]">
      {/* 1. LAYER 1: Full-Bleed Architectural Background (Shape A Mask on Desktop) */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <motion.div
          initial={shouldReduceMotion ? { scale: 1 } : { scale: 1.045 }}
          animate={
            shouldReduceMotion || !isDesktop
              ? { scale: 1 }
              : {
                  scale: [1.015, 1.025, 1.015],
                  x: [0 + mouseOffset.x * 6, -10 + mouseOffset.x * 6, 0 + mouseOffset.x * 6],
                  y: [0 + mouseOffset.y * 6, -4 + mouseOffset.y * 6, 0 + mouseOffset.y * 6],
                }
          }
          transition={
            shouldReduceMotion || !isDesktop
              ? { duration: 2.0, ease: [0.2, 0.8, 0.2, 1] }
              : {
                  scale: { duration: 22, repeat: Infinity, ease: "easeInOut" },
                  x: { duration: 22, repeat: Infinity, ease: "easeInOut" },
                  y: { duration: 22, repeat: Infinity, ease: "easeInOut" },
                }
          }
          className="relative h-full w-full ca-shape-hero-mask"
        >
          <Image
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2600&q=90"
            alt="Consult America Enterprise Technology Architecture"
            fill
            priority
            quality={92}
            className="object-cover object-[center_right] lg:object-center filter contrast-[1.04] brightness-[0.96]"
            sizes="100vw"
          />
        </motion.div>

        {/* 2. LAYER 2: Foreground Architectural Element / Depth Layer (Desktop only) */}
        {!shouldReduceMotion && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={
              isDesktop
                ? {
                    opacity: 0.85,
                    x: [0 + mouseOffset.x * 16, 4 + mouseOffset.x * 16, 0 + mouseOffset.x * 16],
                    y: [0 + mouseOffset.y * 16, -8 + mouseOffset.y * 16, 0 + mouseOffset.y * 16],
                  }
                : { opacity: 0.5 }
            }
            transition={{
              opacity: { duration: 1.2, delay: 0.4 },
              x: { duration: 9.5, repeat: Infinity, ease: "easeInOut" },
              y: { duration: 9.5, repeat: Infinity, ease: "easeInOut" },
            }}
            className="hidden lg:block absolute right-0 bottom-0 top-0 w-2/5 pointer-events-none z-[1]"
          >
            {/* Architectural structural glass facade overlay */}
            <div className="relative h-full w-full overflow-hidden opacity-30">
              <Image
                src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1600&q=80"
                alt=""
                fill
                className="object-cover object-left filter contrast-125"
                sizes="40vw"
              />
              <div className="absolute inset-0 bg-gradient-to-l from-transparent via-[#211E1B]/60 to-[#211E1B]" />
            </div>
          </motion.div>
        )}

        {/* 3. Recurring Brand Arc / Geometric Motif (Inspired by the CA Monogram) */}
        <div
          className="ca-brand-arc-motif -top-32 -right-32 sm:-top-24 sm:-right-24 w-[380px] h-[380px] sm:w-[480px] sm:h-[480px] opacity-40"
          aria-hidden="true"
        />

        {/* 4. Natural Neutral Left Gradient Scrim (WCAG AA Text Contrast while preserving photography) */}
        <div
          className="absolute inset-0 z-[2]"
          style={{
            background:
              "linear-gradient(90deg, rgba(24,22,20,0.88) 0%, rgba(24,22,20,0.68) 38%, rgba(24,22,20,0.22) 68%, rgba(24,22,20,0) 100%)",
          }}
        />

        {/* Top & Bottom Gradient Depth */}
        <div
          className="absolute inset-0 z-[2]"
          style={{
            background:
              "linear-gradient(180deg, rgba(14,18,22,0.65) 0%, transparent 22%, transparent 78%, rgba(24,22,20,0.60) 100%)",
          }}
        />

        {/* Subtle Warm Burgundy Accent Depth */}
        <div className="absolute inset-0 z-[2] bg-radial-[circle_at_75%_30%] from-[#B63A3A]/10 via-transparent to-transparent" />
      </div>

      {/* 5. LAYER 3: Hero Content Staggered Animation Sequence */}
      <div className="mkt-shell relative z-10 py-16 sm:py-20 lg:py-24 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 lg:items-center">
          {/* Left Column: ~58% width on desktop */}
          <div className="lg:col-span-8 xl:col-span-7">
            {/* Eyebrow */}
            <motion.div
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-3"
            >
              <span className="h-0.5 w-6 rounded-full bg-[#B63A3A]" />
              <span className="text-[0.72rem] sm:text-[0.78rem] font-semibold uppercase tracking-[0.16em] text-[#D8C5AA]">
                ENTERPRISE TRANSFORMATION · AI · ENGINEERING
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.12 }}
              className="mt-6 font-serif text-[clamp(46px,5.8vw,88px)] leading-[0.93] tracking-[-0.048em] text-[#FFFDF8] max-w-[780px]"
            >
              <span className="block text-[0.93em] text-[#FFFDF8]/95 font-medium">Transform the core.</span>
              <span className="block text-[#FFFDF8] font-bold">Build what comes next.</span>
            </motion.h1>

            {/* Supporting Copy */}
            <motion.p
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.24 }}
              className="mt-6 max-w-xl text-base leading-relaxed text-[#FFFDF8]/82 sm:text-lg lg:text-[1.125rem]"
            >
              Consult America helps organizations modernize enterprise platforms,
              connect data and workflows, operationalize AI, and engineer the
              digital products that move the business forward.
            </motion.p>

            {/* Action CTAs */}
            <motion.div
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.36 }}
              className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center"
            >
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="group/cta ca-button-primary !min-h-[54px] !px-8 text-sm font-semibold rounded-[6px] cursor-pointer !bg-[#B63A3A] hover:!bg-[#942E31] !text-white shadow-[0_8px_24px_rgba(182,58,58,0.35)] hover:shadow-[0_12px_28px_rgba(182,58,58,0.45)]"
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
              transition={{ duration: 0.5, delay: 0.48 }}
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
