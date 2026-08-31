"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

import { useContactPanel } from "@/components/providers/contact-provider";

const practiceAreas = [
  { label: "Oracle", href: "/oracle" },
  { label: "CRM", href: "/platforms/crm" },
  { label: "AI & Data", href: "/ai-data" },
  { label: "Cloud", href: "/capabilities/digital-engineering" },
  { label: "Application Engineering", href: "/capabilities/digital-engineering" },
];

export default function Hero() {
  const { setOpen } = useContactPanel();
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-[#F7F9FA] border-b border-[#DDE4E8] py-16 sm:py-20 lg:py-24">
      {/* Subtle Atmospheric Gradient & Architectural Grid (2–3% opacity) */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 80% 20%, rgba(53,124,120,0.10) 0%, transparent 35%), radial-gradient(circle at 15% 85%, rgba(71,115,155,0.06) 0%, transparent 30%), linear-gradient(to right, rgba(16,32,51,0.02) 1px, transparent 1px), linear-gradient(to bottom, rgba(16,32,51,0.02) 1px, transparent 1px)",
          backgroundSize: "100% 100%, 100% 100%, 48px 48px, 48px 48px",
        }}
      />

      <div className="ca-shell relative z-10">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center lg:gap-12 xl:gap-16">
          {/* Left Column: 55% Split */}
          <div className="lg:col-span-7">
            {/* Eyebrow */}
            <motion.div
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="flex items-center gap-2.5"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[#B63A3A]" />
              <span className="text-[0.72rem] sm:text-[0.75rem] font-bold uppercase tracking-[0.14em] text-[#B63A3A]">
                ENTERPRISE TRANSFORMATION · AI · ENGINEERING
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.08 }}
              className="mt-6 font-serif text-4xl sm:text-5xl lg:text-6xl xl:text-[68px] font-semibold tracking-[-0.035em] text-[#102033] leading-[1.04]"
            >
              Transform the core.
              <br />
              Build what <span className="text-[#B63A3A]">comes next.</span>
            </motion.h1>

            {/* Supporting Copy */}
            <motion.p
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.16 }}
              className="mt-6 max-w-xl text-base sm:text-lg leading-relaxed text-[#526170]"
            >
              Consult America helps organizations modernize enterprise platforms,
              connect data and workflows, operationalize AI, and engineer digital
              products from strategy through production.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.24 }}
              className="mt-8 flex flex-col gap-3.5 sm:flex-row sm:items-center"
            >
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="ca-button-primary !min-h-[50px] !px-7 text-sm font-semibold rounded-lg cursor-pointer flex items-center justify-center gap-2"
              >
                Talk to an Expert
                <ArrowUpRight className="h-4 w-4" />
              </button>
              <Link
                href="/capabilities/enterprise-transformation"
                className="ca-button-light !min-h-[50px] !px-6 text-sm font-semibold rounded-lg flex items-center justify-center gap-2"
              >
                Explore What We Do
                <ArrowRight className="h-4 w-4 text-[#526170]" />
              </Link>
            </motion.div>

            {/* Understated Stack Category Rail */}
            <motion.div
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.32 }}
              className="mt-12 border-t border-[#DDE4E8] pt-6"
            >
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-semibold text-[#526170]">
                {practiceAreas.map((item, idx) => (
                  <div key={item.label} className="inline-flex items-center gap-5">
                    <Link
                      href={item.href}
                      className="transition-colors hover:text-[#B63A3A]"
                    >
                      {item.label}
                    </Link>
                    {idx < practiceAreas.length - 1 && (
                      <span className="text-[#DDE4E8] font-normal" aria-hidden="true">
                        /
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Column: 45% Split with Enterprise Photography & 1 Floating Foreground Panel */}
          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.65, delay: 0.15 }}
            className="lg:col-span-5 relative flex justify-center lg:justify-end"
          >
            {/* Main Photography Container (520–620px wide, 460–520px high) */}
            <div className="relative w-full max-w-[580px] h-[440px] sm:h-[480px] lg:h-[500px] rounded-lg overflow-hidden border border-[#DDE4E8] bg-white shadow-[0_16px_48px_rgba(16,32,51,0.08)]">
              <Image
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=1200&q=85"
                alt="Senior consultants and enterprise technology leaders collaborating in a modern corporate architectural setting"
                fill
                priority
                className="object-cover object-center mkt-img-graded"
                sizes="(max-width: 1024px) 100vw, 45vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#102033]/40 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* ONE Sophisticated Floating Foreground Panel (Section 10 Requirement) */}
            <motion.div
              initial={shouldReduceMotion ? {} : { y: 16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="absolute -bottom-6 left-4 sm:left-6 max-w-[320px] rounded-lg border border-[#DDE4E8] bg-white/96 p-4.5 shadow-[0_16px_40px_rgba(16,32,51,0.12)] backdrop-blur-md"
            >
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#357C78]" />
                <p className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#102033]">
                  STRATEGY TO PRODUCTION
                </p>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-[#526170]">
                Senior practitioners connecting business, enterprise platforms, AI and engineering.
              </p>
              <div className="mt-3 pt-2.5 border-t border-[#E9EEF1]">
                <Link
                  href="/capabilities/enterprise-transformation"
                  className="inline-flex items-center gap-1 text-[0.72rem] font-bold text-[#B63A3A] hover:text-[#942E31] transition-colors"
                >
                  How We Work <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
