"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

import { LayeredPhoto } from "@/components/marketing/shaped-photo";
import { stockImage } from "@/lib/marketing/stock-images";

const capabilities = [
  {
    name: "FINANCE",
    detail: "Unify the general ledger, close faster, and govern financial operations across entities.",
    href: "/oracle",
  },
  {
    name: "PROCUREMENT",
    detail: "Automate source-to-pay and give procurement teams real visibility into spend.",
    href: "/oracle",
  },
  {
    name: "SUPPLY CHAIN",
    detail: "Connect planning, inventory, and fulfillment into one operational view.",
    href: "/oracle",
  },
  {
    name: "PROJECTS",
    detail: "Align project portfolios, costing, and billing with how delivery actually runs.",
    href: "/oracle",
  },
  {
    name: "INTEGRATION & DATA",
    detail: "Connect Oracle to the enterprise through governed integrations and analytics.",
    href: "/oracle",
  },
  {
    name: "TESTING & READINESS",
    detail: "Move from build to production with disciplined testing, cutover, and adoption.",
    href: "/oracle",
  },
];

export default function OracleFlagship() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="oracle-practice" className="bg-[#F0F6F4] text-[#0B4A47] py-16 sm:py-20 lg:py-24 border-b border-[#9BC4B8]/40 relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none opacity-60"
        style={{
          background: "radial-gradient(circle at 12% 50%, rgba(155,196,184,0.35) 0%, transparent 55%)",
        }}
      />

      <div className="mx-auto max-w-[1440px] px-6 lg:px-8 xl:px-10 relative z-10">
        <div className="inline-flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[#176A63]" />
          <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#176A63]">
            ORACLE FLAGSHIP PRACTICE
          </span>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center lg:gap-14">
          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-5 relative flex flex-col items-center sm:items-start"
          >
            <LayeredPhoto
              className="max-w-[460px]"
              backdropClassName="rounded-t-[110px] rounded-b-[16px] bg-[#E1ECE8] border border-[#9BC4B8]/50"
              main={{
                src: stockImage("oracleFlagship", { w: 1000, q: 85 }),
                alt: "Enterprise architectural structure and financial operations center",
                shape: "arch",
                className: "h-[360px] sm:h-[440px]",
                sizes: "(max-width: 1024px) 100vw, 42vw",
              }}
              secondary={{
                src: stockImage("capabilitiesOperate", { w: 600, q: 80 }),
                alt: "Operations and implementation testing team",
              }}
            />
          </motion.div>

          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="lg:col-span-7 space-y-6"
          >
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-[-0.03em] text-[#073B3A] leading-[1.08]">
              Modernize the digital core.
            </h2>

            <p className="text-base sm:text-lg leading-relaxed text-[#176A63]">
              Connect Oracle applications, processes, data and integrations around the way the enterprise actually operates.
            </p>

            <div className="mt-4 divide-y divide-[#9BC4B8]/40 border-y border-[#9BC4B8]/40">
              {capabilities.map((cap) => (
                <div
                  key={cap.name}
                  className="group py-3 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 hover:bg-[#E1ECE8]/60 transition-colors px-3 -mx-3 rounded-lg"
                >
                  <div className="sm:w-1/3">
                    <span className="text-xs font-bold uppercase tracking-[0.14em] text-[#073B3A] group-hover:text-[#0B4A47] transition-colors">
                      {cap.name}
                    </span>
                  </div>
                  <div className="sm:w-7/12">
                    <p className="text-xs sm:text-sm text-[#176A63] leading-relaxed">
                      {cap.detail}
                    </p>
                  </div>
                  <div className="sm:w-1/12 flex sm:justify-end">
                    <Link
                      href={cap.href}
                      aria-label={`Explore ${cap.name}`}
                      className="text-[#176A63] group-hover:text-[#0B4A47] transition-colors"
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
