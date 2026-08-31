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
      // Normalized pointer response
      const normX = (e.clientX / innerWidth) - 0.5;
      const normY = (e.clientY / innerHeight) - 0.5;
      setMouseOffset({ x: normX, y: normY });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [shouldReduceMotion, isDesktop]);

  return (
    <section className="relative overflow-hidden min-h-[clamp(720px,86vh,920px)] flex items-center bg-[#211E1B] border-b border-[#3A302B]">
      {/* 1. LAYER 1: Large Full-Bleed Architectural Background Image (BACK LAYER) */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <motion.div
          initial={shouldReduceMotion ? { scale: 1 } : { scale: 1.04 }}
          animate={
            shouldReduceMotion || !isDesktop
              ? { scale: 1 }
              : {
                  scale: [1.015, 1.025, 1.015],
                  x: [0 + mouseOffset.x * 3, -7 + mouseOffset.x * 3, 0 + mouseOffset.x * 3],
                  y: [0 + mouseOffset.y * 3, -3 + mouseOffset.y * 3, 0 + mouseOffset.y * 3],
                }
          }
          transition={
            shouldReduceMotion || !isDesktop
              ? { duration: 1.8, ease: [0.2, 0.8, 0.2, 1] }
              : {
                  scale: { duration: 20, repeat: Infinity, ease: "easeInOut" },
                  x: { duration: 20, repeat: Infinity, ease: "easeInOut" },
                  y: { duration: 20, repeat: Infinity, ease: "easeInOut" },
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

        {/* 2. LAYER 2: Glass/Structural Foreground Element (MID LAYER) */}
        {!shouldReduceMotion && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={
              isDesktop
                ? {
                    opacity: 0.85,
                    x: [0 + mouseOffset.x * 4, 5 + mouseOffset.x * 4, 0 + mouseOffset.x * 4],
                    y: [0 + mouseOffset.y * 4, -5 + mouseOffset.y * 4, 0 + mouseOffset.y * 4],
                  }
                : { opacity: 0.4 }
            }
            transition={{
              opacity: { duration: 1.2, delay: 0.3 },
              x: { duration: 13, repeat: Infinity, ease: "easeInOut" },
              y: { duration: 13, repeat: Infinity, ease: "easeInOut" },
            }}
            className="hidden lg:block absolute right-0 bottom-0 top-0 w-2/5 pointer-events-none z-[1]"
          >
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

        {/* 3. LAYER 3: Architectural Human & Structural Detail (FRONT LAYER) */}
        {!shouldReduceMotion && isDesktop && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{
              opacity: 1,
              y: [0 + mouseOffset.y * 6, -7 + mouseOffset.y * 6, 0 + mouseOffset.y * 6],
              x: mouseOffset.x * 6,
            }}
            transition={{
              opacity: { duration: 1.0, delay: 0.6 },
              y: { duration: 9, repeat: Infinity, ease: "easeInOut" },
            }}
            className="hidden xl:block absolute right-16 bottom-16 z-[3] pointer-events-none"
          >
            <div className="rounded-xl border border-[#D8D0C5]/30 bg-[#211E1B]/85 backdrop-blur-md p-3.5 shadow-2xl max-w-[220px]">
              <div className="flex items-center gap-2.5">
                <span className="h-2 w-2 rounded-full bg-[#357C78] animate-pulse" />
                <span className="font-mono text-[0.62rem] font-bold uppercase tracking-wider text-[#D8C5AA]">
                  Production Active
                </span>
              </div>
              <p className="mt-1 text-[0.7rem] text-[#FFFDF8] font-medium leading-tight">
                Oracle Cloud • AI Agents • Core ERP
              </p>
            </div>
          </motion.div>
        )}

        {/* 4. Recurring Brand Arc Motif 1/3 (Subtle CA C-Curve in Hero) */}
        <div
          className="ca-brand-arc-motif -top-32 -right-32 sm:-top-24 sm:-right-24 w-[380px] h-[380px] sm:w-[480px] sm:h-[480px] opacity-40 pointer-events-none"
          aria-hidden="true"
        />

        {/* Cinematic Gradient Overlays */}
        <div
          className="absolute inset-0 z-[2] pointer-events-none"
          style={{
            background:
              "linear-gradient(90deg, rgba(33,30,27,0.98) 0%, rgba(33,30,27,0.88) 42%, rgba(33,30,27,0.45) 75%, rgba(33,30,27,0.2) 100%)",
          }}
        />
        <div className="absolute inset-0 z-[2] bg-radial-[circle_at_15%_25%] from-[#B63A3A]/10 via-transparent to-transparent pointer-events-none" />
      </div>

      <div className="ca-shell relative z-10 w-full py-20 sm:py-24 lg:py-32">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8 items-center">
          {/* Left Column: 48% Headline, Copy, Practice Areas, CTAs */}
          <div className="lg:col-span-7 xl:col-span-6 space-y-8">
            <motion.div
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2.5 rounded-full border border-[#D8D0C5]/30 bg-[#2B2420]/80 px-3.5 py-1 text-xs font-semibold text-[#D8C5AA] backdrop-blur-sm"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[#B63A3A]" />
              <span>ENTERPRISE TRANSFORMATION &amp; CLOUD ARCHITECTURE</span>
            </motion.div>

            <motion.h1
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-serif text-4xl font-bold tracking-tight text-[#FFFDF8] sm:text-5xl lg:text-6xl sm:leading-[1.08]"
            >
              Transform the core.
              <br />
              <span className="text-[#D8C5AA] italic font-serif">
                Build what comes next.
              </span>
            </motion.h1>

            <motion.p
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base sm:text-lg leading-relaxed text-[rgba(255,253,248,0.78)] max-w-xl"
            >
              We advise, build, and run production transformations across Oracle Cloud, enterprise AI, data engineering, and bespoke software systems.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap items-center gap-4 pt-2"
            >
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="group inline-flex items-center gap-2 rounded-lg bg-[#B63A3A] px-7 py-3.5 text-sm font-bold text-white shadow-lg transition-all hover:bg-[#942E31] cursor-pointer"
              >
                <span>Talk to a Practice Lead</span>
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>

              <Link
                href="/work"
                className="inline-flex items-center gap-2 rounded-lg border border-[#D8D0C5]/40 bg-white/5 px-6 py-3.5 text-sm font-semibold text-[#FFFDF8] backdrop-blur-sm transition-all hover:bg-white/10 hover:border-[#D8D0C5]"
              >
                <span>Explore Selected Work</span>
              </Link>
            </motion.div>

            {/* Practice Badges Strip */}
            <motion.div
              initial={shouldReduceMotion ? {} : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="pt-4 border-t border-[#3A302B]"
            >
              <p className="text-[0.68rem] font-bold uppercase tracking-widest text-[#D8C5AA]/70 mb-3">
                CORE PRACTICES
              </p>
              <div className="flex flex-wrap gap-2">
                {practiceAreas.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="inline-flex items-center rounded-md border border-[#D8D0C5]/20 bg-[#2B2420]/60 px-3 py-1 text-xs font-medium text-[#FFFDF8]/80 hover:text-white hover:border-[#B63A3A] transition-colors"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Column: 52% space for photographic composition */}
          <div className="lg:col-span-5 xl:col-span-6 hidden lg:block" />
        </div>
      </div>
    </section>
  );
}
