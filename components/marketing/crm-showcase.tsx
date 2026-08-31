"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

import SectionLabel from "@/components/marketing/SectionLabel";
import { stockImage } from "@/lib/marketing/stock-images";

const journeySteps = [
  { step: "01", name: "DISCOVER", detail: "Account intelligence" },
  { step: "02", name: "ENGAGE", detail: "Multi-channel outreach" },
  { step: "03", name: "SELL", detail: "Pipeline & deal governance" },
  { step: "04", name: "SERVE", detail: "Omni-channel resolution" },
  { step: "05", name: "EXPAND", detail: "Lifecycle retention" },
];

const architectureNodes = [
  "Customer Data",
  "CRM",
  "Service",
  "Marketing",
  "AI",
  "ERP",
  "Integration",
  "Analytics",
];

export default function CRMShowcase() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="crm-cx" className="bg-[#EEF3F1] text-[#163536] py-16 sm:py-20 lg:py-24 border-b border-[#DCE4E1]">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-8 xl:px-10">
        <div className="inline-flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[#103F3E]" />
          <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#596968]">
            CRM &amp; CUSTOMER EXPERIENCE
          </span>
        </div>

        {/* 50/50 Split */}
        <div className="mt-8 grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center lg:gap-14">
          {/* Left Column */}
          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="lg:col-span-6 space-y-6"
          >
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-[-0.03em] text-[#163536] leading-[1.08]">
              Connect every customer moment to the enterprise behind it.
            </h2>

            <p className="text-base sm:text-lg leading-relaxed text-[#596968]">
              CRM delivers real value when customer data, sales, service, and backend ERP operations move together seamlessly without friction or disconnected silos.
            </p>

            {/* Journey: DISCOVER → ENGAGE → SELL → SERVE → EXPAND with Dark Green Line and Red Accent */}
            <div className="pt-2">
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {journeySteps.map((item, idx) => (
                  <div
                    key={item.name}
                    className={`border-t-2 pt-3 ${
                      idx === 2 ? "border-[#B63A3A]" : "border-[#103F3E]/30"
                    }`}
                  >
                    <span className={`font-mono text-xs font-bold ${
                      idx === 2 ? "text-[#B63A3A]" : "text-[#103F3E]"
                    }`}>
                      {item.step}
                    </span>
                    <h3 className="mt-1 text-xs font-bold uppercase tracking-wider text-[#163536]">
                      {item.name}
                    </h3>
                    <p className="mt-1 text-xs text-[#596968] leading-tight">
                      {item.detail}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/platforms/crm"
                className="inline-flex h-[46px] items-center justify-center gap-2 rounded-[6px] bg-[#B63A3A] px-6 text-xs sm:text-sm font-semibold text-white shadow-[0_4px_16px_rgba(182,58,58,0.22)] hover:bg-[#992F31] transition-all cursor-pointer"
              >
                <span>Explore CRM Solutions</span>
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>

          {/* Right Column: Customer/Business Image */}
          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.08 }}
            className="lg:col-span-6"
          >
            <div className="relative aspect-[4/3] sm:aspect-[16/11] w-full overflow-hidden rounded-[10px] border border-[#DCE4E1] bg-white shadow-[0_16px_40px_rgba(11,51,50,0.08)]">
              <Image
                src={stockImage("crmShowcase", { w: 1200, q: 85 })}
                alt="Executive enterprise customer relationship and sales operations review"
                fill
                className="object-cover mkt-img-graded"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="mkt-overlay" />
            </div>
          </motion.div>
        </div>

        {/* Elegant Horizontal Architecture Line */}
        <div className="mt-14 border-t border-[#DCE4E1] pt-8">
          <p className="text-[0.68rem] font-bold uppercase tracking-[0.16em] text-[#596968] mb-4">
            CONNECTED ENTERPRISE ARCHITECTURE
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-xs sm:text-sm font-semibold text-[#163536]">
            {architectureNodes.map((node, idx) => (
              <div key={node} className="inline-flex items-center gap-6">
                <span className="hover:text-[#103F3E] transition-colors">{node}</span>
                {idx < architectureNodes.length - 1 && (
                  <span className="text-[#DCE4E1] font-normal" aria-hidden="true">
                    →
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
