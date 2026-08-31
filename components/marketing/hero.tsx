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
    <section className="mkt-hero-bg mkt-grid-pattern relative overflow-hidden pt-12 pb-16 sm:pt-16 sm:pb-20 lg:pt-20 lg:pb-24">
      <div className="mkt-shell relative z-10">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center lg:gap-12 xl:gap-16">
          {/* Left Column: ~58% width */}
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
              className="mt-5 font-serif text-4xl font-semibold tracking-[-0.03em] text-[#101828] sm:text-5xl lg:text-6xl xl:text-[68px] xl:leading-[1.02]"
            >
              Transform the core.
              <br />
              <span className="text-[#B63838]">Build what comes next.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.16 }}
              className="mt-6 max-w-xl text-base leading-relaxed text-[#475467] sm:text-lg lg:text-[1.125rem]"
            >
              Consult America helps organizations modernize enterprise platforms,
              connect data and workflows, operationalize AI, and engineer the
              digital products that move the business forward.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.24 }}
              className="mt-8 flex flex-col gap-3.5 sm:flex-row sm:items-center"
            >
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="group/cta ca-button-primary !min-h-12 !px-7 text-sm font-semibold rounded-md cursor-pointer"
              >
                Talk to an expert
                <ArrowUpRight className="mkt-cta-arrow h-4 w-4" />
              </button>
              <Link
                href="/capabilities/enterprise-transformation"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-[#101828] px-6 text-sm font-semibold text-[#101828] transition-colors hover:border-[#B63838] hover:text-[#B63838]"
              >
                Explore what we do
              </Link>
            </motion.div>

            {/* Restrained Practice Areas Row */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.32 }}
              className="mt-10 border-t border-[#E2E7EC] pt-6"
            >
              <p className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#475467]">
                Practice Areas
              </p>
              <div className="mt-2.5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-semibold text-[#101828]">
                {capabilitiesRow.map((cap, idx) => (
                  <div key={cap.label} className="inline-flex items-center gap-5">
                    <Link
                      href={cap.href}
                      className="transition-colors hover:text-[#B63838]"
                    >
                      {cap.label}
                    </Link>
                    {idx < capabilitiesRow.length - 1 && (
                      <span className="text-[#E2E7EC] font-normal" aria-hidden="true">
                        /
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Column: ~42% width with Offset Framing + Foreground Editorial Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.65, delay: 0.15 }}
            className="lg:col-span-5 xl:col-span-5 relative"
          >
            {/* Subtle background offset frame */}
            <div className="absolute -inset-2 -right-2 rounded-lg border border-[#E2E7EC]/80 bg-[#EEF2F5] -rotate-1 hidden sm:block" />

            <div className="relative overflow-hidden rounded-lg border border-[#E2E7EC] bg-[#FFFFFF] p-2 shadow-[0_16px_40px_rgba(20,30,45,0.07)]">
              <div className="relative aspect-[4/3] sm:aspect-[5/4] lg:h-[440px] w-full overflow-hidden rounded-md bg-[#EEF2F5]">
                <Image
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80"
                  alt="Senior enterprise technology and consulting team in strategy session"
                  fill
                  priority
                  className="object-cover mkt-img-graded"
                  sizes="(max-width: 1024px) 100vw, 42vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#101828]/50 via-transparent to-transparent" />

                {/* Subtle image caption */}
                <div className="absolute top-3.5 right-3.5">
                  <span className="rounded bg-[#101828]/75 backdrop-blur-xs px-2.5 py-1 text-[0.68rem] font-mono tracking-wider text-[#EEF2F5]">
                    Strategy → Architecture → Production
                  </span>
                </div>
              </div>

              {/* Elegant Foreground Detail Panel */}
              <div className="relative -mt-10 mx-3 mb-2 rounded-md border border-[#E2E7EC] bg-[#FFFFFF] p-4 shadow-[0_8px_24px_rgba(20,30,45,0.06)]">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#B63838]" />
                  <span className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#B63838]">
                    STRATEGY TO PRODUCTION
                  </span>
                </div>
                <p className="mt-1.5 text-xs font-medium leading-relaxed text-[#101828]">
                  Senior practitioners connected directly to delivery across enterprise platforms, AI and engineering.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
