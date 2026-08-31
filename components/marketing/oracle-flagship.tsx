"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

import SectionLabel from "@/components/marketing/SectionLabel";

const capabilities = [
  {
    name: "FINANCE",
    detail: "General Ledger, subledger accounting, multi-entity consolidation and financial close governance.",
    href: "/oracle",
  },
  {
    name: "PROCUREMENT",
    detail: "Source-to-Pay automation, supplier onboarding, and contract compliance management.",
    href: "/oracle",
  },
  {
    name: "SUPPLY CHAIN",
    detail: "Inventory optimization, order management, demand planning, and warehouse workflows.",
    href: "/oracle",
  },
  {
    name: "PROJECTS",
    detail: "Project portfolio management, costing, billing milestones, and revenue recognition.",
    href: "/oracle",
  },
  {
    name: "INTEGRATION & DATA",
    detail: "Oracle Integration Cloud, application event streaming, and enterprise analytics.",
    href: "/oracle",
  },
  {
    name: "TESTING & READINESS",
    detail: "End-to-end PMO governance, automated regression testing, cutover planning, and user adoption.",
    href: "/oracle",
  },
];

export default function OracleFlagship() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="oracle-practice" className="bg-[#FFFFFF] text-[#163536] py-16 sm:py-20 lg:py-24 border-b border-[#DCE4E1]">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-8 xl:px-10">
        <div className="inline-flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[#103F3E]" />
          <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#596968]">
            ORACLE PRACTICE
          </span>
        </div>

        {/* 45% Image / 55% Content Editorial Layout */}
        <div className="mt-8 grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-start lg:gap-14">
          {/* Left Column (45%): Architectural Photography */}
          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="lg:col-span-5"
          >
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[10px] border border-[#DCE4E1] bg-white shadow-[0_16px_40px_rgba(11,51,50,0.08)]">
              <Image
                src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1000&q=85"
                alt="Enterprise architectural structure and financial operations center"
                fill
                className="object-cover mkt-img-graded"
                sizes="(max-width: 1024px) 100vw, 42vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B3332]/40 via-transparent to-transparent pointer-events-none" />
            </div>
          </motion.div>

          {/* Right Column (55%): Headline, Copy, 6 Clean Editorial Rows */}
          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.08 }}
            className="lg:col-span-7 space-y-6"
          >
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-[-0.03em] text-[#163536] leading-[1.08]">
              Modernize the digital core.
            </h2>

            <p className="text-base sm:text-lg leading-relaxed text-[#596968]">
              Connect Oracle applications, processes, data and integrations around the way the enterprise actually operates.
            </p>

            {/* 6 Editorial Rows with Thin Dividers */}
            <div className="mt-8 divide-y divide-[#DCE4E1] border-y border-[#DCE4E1]">
              {capabilities.map((cap) => (
                <div
                  key={cap.name}
                  className="group py-4 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 hover:bg-[#F8FAF9] transition-colors px-2.5 -mx-2.5 rounded"
                >
                  <div className="sm:w-1/3">
                    <span className="text-xs font-bold uppercase tracking-[0.14em] text-[#163536] group-hover:text-[#103F3E] transition-colors">
                      {cap.name}
                    </span>
                  </div>
                  <div className="sm:w-7/12">
                    <p className="text-xs sm:text-sm text-[#596968] leading-relaxed">
                      {cap.detail}
                    </p>
                  </div>
                  <div className="sm:w-1/12 flex sm:justify-end">
                    <Link
                      href={cap.href}
                      aria-label={`Explore ${cap.name}`}
                      className="text-[#596968] group-hover:text-[#103F3E] transition-colors"
                    >
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <Link
                href="/oracle"
                className="inline-flex h-[46px] items-center justify-center gap-2 rounded-[6px] bg-[#B63A3A] px-6 text-xs sm:text-sm font-semibold text-white shadow-[0_4px_16px_rgba(182,58,58,0.22)] hover:bg-[#992F31] transition-all cursor-pointer"
              >
                <span>Explore Oracle Practice</span>
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
