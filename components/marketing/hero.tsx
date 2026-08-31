"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

import SectionLabel from "@/components/marketing/SectionLabel";
import { useContactPanel } from "@/components/providers/contact-provider";

const capabilitiesRow = [
  { label: "Oracle", href: "/oracle" },
  { label: "CRM", href: "/platforms/crm" },
  { label: "AI + Data", href: "/ai-data" },
  { label: "Cloud", href: "/capabilities/digital-engineering" },
  { label: "Application Engineering", href: "/capabilities/digital-engineering" },
];

export default function Hero() {
  const { setOpen } = useContactPanel();

  return (
    <section className="mkt-hero-bg mkt-editorial-texture relative overflow-hidden pt-12 pb-16 sm:pt-16 sm:pb-20 lg:pt-24 lg:pb-28">
      <div className="mkt-shell relative z-10">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center lg:gap-14">
          {/* Left Column (65% width on desktop) */}
          <div className="lg:col-span-7 xl:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
            >
              <SectionLabel tone="burgundy">
                ENTERPRISE TRANSFORMATION · AI · ENGINEERING
              </SectionLabel>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.08 }}
              className="mt-5 text-4xl font-extrabold tracking-[-0.03em] text-[#261F1B] sm:text-5xl lg:text-6xl xl:text-[68px] xl:leading-[1.02]"
            >
              Transform the core.
              <br />
              <span className="text-[#7D2639]">Build what comes next.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.16 }}
              className="mt-6 max-w-xl text-lg leading-relaxed text-[#695F57] sm:text-xl lg:text-[1.18rem]"
            >
              Consult America helps organizations modernize enterprise platforms,
              connect data and workflows, operationalize AI, and engineer the
              digital products that move the business forward.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.24 }}
              className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center"
            >
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="group/cta ca-button-primary !min-h-12 !px-7 text-base font-semibold"
              >
                Start a conversation
                <ArrowUpRight className="mkt-cta-arrow h-4 w-4" />
              </button>
              <Link
                href="/capabilities/enterprise-transformation"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-[#261F1B] px-6 text-sm font-semibold text-[#261F1B] transition-colors hover:border-[#7D2639] hover:text-[#7D2639]"
              >
                Explore our capabilities
              </Link>
            </motion.div>

            {/* Restrained Capability Row */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.32 }}
              className="mt-12 border-t border-[#D7CCBD] pt-6"
            >
              <p className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#695F57]">
                Practice Areas
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-semibold text-[#261F1B]">
                {capabilitiesRow.map((cap, idx) => (
                  <Link
                    key={cap.label}
                    href={cap.href}
                    className="group inline-flex items-center gap-1 transition-colors hover:text-[#7D2639]"
                  >
                    <span>{cap.label}</span>
                    {idx < capabilitiesRow.length - 1 && (
                      <span className="ml-5 text-[#D7CCBD] font-normal">/</span>
                    )}
                  </Link>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Column (35% width on desktop: Senior Editorial / Executive Collaboration Image) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.65, delay: 0.15 }}
            className="lg:col-span-5 xl:col-span-5"
          >
            <div className="relative overflow-hidden rounded-2xl border border-[#D7CCBD] bg-[#FFFDF8] p-2.5 shadow-[0_20px_50px_rgba(38,31,27,0.08)]">
              <div className="relative aspect-[4/3] sm:aspect-[16/11] lg:aspect-[4/5] overflow-hidden rounded-xl">
                <Image
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80"
                  alt="Enterprise technology and consulting team in strategic session"
                  fill
                  priority
                  className="object-cover transition-transform duration-700 hover:scale-[1.02]"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#261F1B]/70 via-[#261F1B]/15 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <p className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#D8C5AA]">
                    Strategy to Production
                  </p>
                  <p className="mt-1 text-sm font-semibold leading-tight text-[#F7F0E7]">
                    Senior practitioners attached to delivery across platforms, AI, and engineering.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
