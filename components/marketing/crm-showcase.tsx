"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

import SectionLabel from "@/components/marketing/SectionLabel";

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
    <section id="crm-cx" className="bg-[#F7F9FA] text-[#102033] py-20 sm:py-24 lg:py-28 border-b border-[#DDE4E8]">
      <div className="ca-shell">
        <SectionLabel tone="burgundy">CRM &amp; CUSTOMER EXPERIENCE</SectionLabel>

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
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-[-0.03em] text-[#102033] leading-[1.08]">
              Connect every customer moment to the enterprise behind it.
            </h2>

            <p className="text-base sm:text-lg leading-relaxed text-[#526170]">
              CRM delivers real value when customer data, sales, service, and backend ERP operations move together seamlessly without friction or disconnected silos.
            </p>

            {/* Journey: DISCOVER → ENGAGE → SELL → SERVE → EXPAND */}
            <div className="pt-2">
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {journeySteps.map((item) => (
                  <div
                    key={item.name}
                    className="border-t border-[#DDE4E8] pt-3"
                  >
                    <span className="font-mono text-xs font-bold text-[#B63A3A]">
                      {item.step}
                    </span>
                    <h3 className="mt-1 text-xs font-bold uppercase tracking-wider text-[#102033]">
                      {item.name}
                    </h3>
                    <p className="mt-1 text-xs text-[#526170] leading-tight">
                      {item.detail}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/platforms/crm"
                className="ca-button-primary inline-flex items-center gap-2 !min-h-[48px] !px-7 text-sm font-semibold rounded-lg cursor-pointer"
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
            <div className="relative aspect-[4/3] sm:aspect-[16/11] w-full overflow-hidden rounded-lg border border-[#DDE4E8] bg-white shadow-[0_16px_40px_rgba(16,32,51,0.08)]">
              <Image
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&q=85"
                alt="Executive enterprise customer relationship and sales operations review"
                fill
                className="object-cover mkt-img-graded"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#102033]/35 via-transparent to-transparent pointer-events-none" />
            </div>
          </motion.div>
        </div>

        {/* Elegant Horizontal Architecture Line (No dashboard-style boxes) */}
        <div className="mt-16 border-t border-[#DDE4E8] pt-8">
          <p className="text-[0.68rem] font-bold uppercase tracking-[0.16em] text-[#526170] mb-4">
            CONNECTED ENTERPRISE ARCHITECTURE
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-xs sm:text-sm font-semibold text-[#102033]">
            {architectureNodes.map((node, idx) => (
              <div key={node} className="inline-flex items-center gap-6">
                <span className="hover:text-[#B63A3A] transition-colors">{node}</span>
                {idx < architectureNodes.length - 1 && (
                  <span className="text-[#DDE4E8] font-normal" aria-hidden="true">
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
