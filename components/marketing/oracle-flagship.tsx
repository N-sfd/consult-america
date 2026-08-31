"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

import { stockImage } from "@/lib/marketing/stock-images";

const capabilities = [
  {
    name: "FINANCE & CORE ERP",
    detail: "Unified general ledger, automated subledgers, and multi-entity financial close.",
    href: "/oracle",
  },
  {
    name: "SUPPLY CHAIN & PROCUREMENT",
    detail: "Direct source-to-pay automation and end-to-end inventory visibility.",
    href: "/oracle",
  },
  {
    name: "INTEGRATION & ANALYTICS",
    detail: "Resilient Oracle Integration Cloud (OIC) pipelines and governed enterprise analytics.",
    href: "/oracle",
  },
  {
    name: "PROGRAM GOVERNANCE",
    detail: "Predictable cutover architecture, automated testing, and operational adoption.",
    href: "/oracle",
  },
];

export default function OracleFlagship() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="oracle-practice" className="bg-[#FFFFFF] text-[#122D2E] py-16 sm:py-20 lg:py-24 border-b border-[#C9DDD7] relative overflow-hidden">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-8 xl:px-10">
        <div className="inline-flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[#176A63]" />
          <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#5B6D6B]">
            ORACLE FLAGSHIP PRACTICE
          </span>
        </div>

        {/* 45% Image Composition / 55% Content Executive Layout */}
        <div className="mt-8 grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center lg:gap-14">
          {/* Left Column (45%): Tall Arch Image Composition with Geometric Backdrop */}
          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 relative flex flex-col items-center sm:items-start"
          >
            <div className="relative w-full max-w-[460px]">
              {/* #E1ECE8 Pale Sage Geometric Backdrop Panel */}
              <div className="absolute -top-4 -left-4 w-[92%] h-[94%] rounded-t-[110px] rounded-b-[16px] bg-[#E1ECE8] border border-[#C9DDD7] -z-0 hidden sm:block" />

              {/* Dominant Architectural Image: Tall Arch Shape */}
              <div className="relative z-10 w-full h-[360px] sm:h-[440px] overflow-hidden border border-[#C9DDD7] bg-white ca-shadow-elevated rounded-t-[100px] rounded-b-[14px]">
                <Image
                  src={stockImage("oracleFlagship", { w: 1000, q: 85 })}
                  alt="Enterprise architectural structure and financial operations center"
                  fill
                  className="object-cover mkt-img-graded"
                  sizes="(max-width: 1024px) 100vw, 42vw"
                />
                <div className="mkt-overlay-soft" />
              </div>

              {/* Smaller Overlapping Operations Team Image */}
              <div className="absolute -bottom-6 right-2 sm:-right-4 z-20 w-[150px] sm:w-[190px] h-[120px] sm:h-[150px] rounded-[14px] overflow-hidden border-2 border-white bg-white ca-shadow-overlap hidden xs:block">
                <Image
                  src={stockImage("capabilitiesOperate", { w: 600, q: 80 })}
                  alt="Operations and implementation testing team"
                  fill
                  className="object-cover mkt-img-graded"
                  sizes="190px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#073B3A]/45 to-transparent" />
              </div>
            </div>
          </motion.div>

          {/* Right Column (55%): Executive Statement, Short Copy & 4 Clean Practice Rows */}
          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.08 }}
            className="lg:col-span-7 space-y-6"
          >
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-[-0.03em] text-[#122D2E] leading-[1.08]">
              Modernize the digital core.
            </h2>

            <p className="text-base sm:text-lg leading-relaxed text-[#5B6D6B]">
              Connect Oracle applications, processes, data and integrations around the way the enterprise actually operates.
            </p>

            {/* 4 Clean Editorial Rows with Thin Dividers */}
            <div className="mt-6 divide-y divide-[#C9DDD7] border-y border-[#C9DDD7]">
              {capabilities.map((cap) => (
                <div
                  key={cap.name}
                  className="group py-3.5 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 hover:bg-[#F0F6F4] transition-colors px-3 -mx-3 rounded-lg"
                >
                  <div className="sm:w-1/3">
                    <span className="text-xs font-bold uppercase tracking-[0.14em] text-[#122D2E] group-hover:text-[#0B4A47] transition-colors">
                      {cap.name}
                    </span>
                  </div>
                  <div className="sm:w-7/12">
                    <p className="text-xs sm:text-sm text-[#5B6D6B] leading-relaxed">
                      {cap.detail}
                    </p>
                  </div>
                  <div className="sm:w-1/12 flex sm:justify-end">
                    <Link
                      href={cap.href}
                      aria-label={`Explore ${cap.name}`}
                      className="text-[#5B6D6B] group-hover:text-[#0B4A47] transition-colors"
                    >
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <Link
                href="/oracle"
                className="inline-flex h-[48px] items-center justify-center gap-2 rounded-[8px] bg-[#B83A3A] px-6 text-xs sm:text-sm font-semibold text-white shadow-[0_4px_16px_rgba(184,58,58,0.22)] hover:bg-[#992F31] transition-all cursor-pointer"
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
