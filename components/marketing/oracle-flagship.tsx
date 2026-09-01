"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

import OracleEnterpriseModel from "@/components/marketing/oracle-enterprise-model";
import PlatformLineSystem from "@/components/marketing/platform-line-system";
import SectionBackdrop from "@/components/marketing/section-backdrop";

const financePanel = [
  { label: "Financials", href: "/oracle" },
  { label: "Projects", href: "/oracle" },
  { label: "Reporting", href: "/oracle" },
];

const supplyPanel = [
  { label: "Procurement", href: "/oracle" },
  { label: "Supply Chain", href: "/oracle" },
  { label: "Integration", href: "/oracle" },
];

export default function OracleFlagship() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      id="oracle-practice"
      className="relative overflow-hidden border-b border-[#9BC4B8]/40 bg-[#F0F6F4] py-24 text-[#0B4A47] sm:py-28 lg:py-32 xl:py-36"
    >
      <SectionBackdrop variant="oracle" />
      <PlatformLineSystem className="opacity-[0.05]" />

      <div className="relative z-10 mx-auto max-w-[1440px] px-6 lg:px-8 xl:px-10">
        <motion.div
          initial={shouldReduceMotion ? {} : { opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl"
        >
          <div className="inline-flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#176A63]" />
            <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#176A63]">
              ORACLE FLAGSHIP PRACTICE
            </span>
          </div>

          <h2 className="mt-5 font-serif text-3xl font-semibold tracking-[-0.03em] text-[#073B3A] sm:text-4xl lg:text-5xl lg:leading-[1.08]">
            Modernize the digital core.
          </h2>

          <p className="mt-5 text-base leading-relaxed text-[#176A63] sm:text-lg">
            Connect Oracle applications, processes, data, and integrations around the way the
            enterprise actually operates.
          </p>
        </motion.div>

        <div className="mt-14 grid grid-cols-1 gap-8 lg:mt-20 lg:grid-cols-12 lg:items-center lg:gap-10 xl:gap-12">
          {/* Left panel */}
          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="order-3 lg:order-1 lg:col-span-3"
          >
            <div className="ca-side-panel border-[#DDE6E3] bg-white">
              <p className="text-[0.62rem] font-bold uppercase tracking-[0.14em] text-[#176A63]">
                Finance &amp; Projects
              </p>
              <ul className="mt-4 space-y-3">
                {financePanel.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="text-sm font-semibold text-[#073B3A] transition-colors hover:text-[#176A63]"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Center visual */}
          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="order-1 lg:order-2 lg:col-span-6"
          >
            <OracleEnterpriseModel />
          </motion.div>

          {/* Right panel */}
          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="order-4 lg:order-3 lg:col-span-3"
          >
            <div className="ca-side-panel border-[#DDE6E3] bg-[#F7FAF9]">
              <p className="text-[0.62rem] font-bold uppercase tracking-[0.14em] text-[#176A63]">
                Supply Chain &amp; Procurement
              </p>
              <ul className="mt-4 space-y-3">
                {supplyPanel.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="text-sm font-semibold text-[#073B3A] transition-colors hover:text-[#176A63]"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={shouldReduceMotion ? {} : { opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mt-14 text-center lg:mt-16"
        >
          <Link
            href="/oracle"
            className="inline-flex h-[48px] items-center justify-center gap-2 rounded-[8px] bg-[#B83A3A] px-6 text-sm font-semibold text-white shadow-[0_4px_16px_rgba(184,58,58,0.22)] transition-all hover:bg-[#992F31]"
          >
            Explore Oracle
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
