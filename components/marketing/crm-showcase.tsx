"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

import SectionLabel from "@/components/marketing/SectionLabel";

const journeySteps = [
  { step: "01", name: "DISCOVER", detail: "Account intelligence & intent signals" },
  { step: "02", name: "ENGAGE", detail: "Personalized multi-channel outreach" },
  { step: "03", name: "SELL", detail: "Pipeline, quotes & deal governance" },
  { step: "04", name: "SERVE", detail: "Case deflection & omni-channel support" },
  { step: "05", name: "EXPAND", detail: "Lifecycle health & contract renewal" },
];

const ecosystemNodes = [
  "CUSTOMER DATA",
  "CRM",
  "SERVICE",
  "MARKETING",
  "AI",
  "ERP",
  "INTEGRATION",
  "ANALYTICS",
];

export default function CRMShowcase() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="crm-cx" className="bg-[#FFFFFF] text-[#102033] py-20 sm:py-24 lg:py-28 border-b border-[#DDE4E8]">
      <div className="ca-shell">
        <SectionLabel tone="burgundy">CRM &amp; CUSTOMER EXPERIENCE</SectionLabel>

        {/* 50/50 Split: Left Content + Journey, Right Professional Customer-Facing Photography */}
        <div className="mt-8 grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center lg:gap-14">
          {/* Left Column: Heading, Copy, Journey Steps */}
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
              <p className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#B63A3A]">
                Unified Customer Journey
              </p>
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-5 gap-2">
                {journeySteps.map((item, idx) => (
                  <div
                    key={item.name}
                    className="rounded border border-[#DDE4E8] bg-[#F7F9FA] p-2.5 transition-all hover:border-[#B63A3A]"
                  >
                    <span className="font-mono text-[0.62rem] font-bold text-[#B63A3A]">
                      {item.step}
                    </span>
                    <h3 className="mt-0.5 text-xs font-bold text-[#102033]">
                      {item.name}
                    </h3>
                    <p className="mt-1 text-[0.62rem] leading-tight text-[#526170]">
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

          {/* Right Column: Professional Customer-Facing Photography */}
          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6 relative"
          >
            <div className="relative aspect-[4/3] sm:aspect-[16/11] w-full overflow-hidden rounded-lg border border-[#DDE4E8] bg-[#F7F9FA] shadow-sm">
              <Image
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&q=85"
                alt="Executive enterprise customer meeting and relationship consultation"
                fill
                className="object-cover mkt-img-graded"
                sizes="(max-width: 1024px) 100vw, 45vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#102033]/50 via-transparent to-transparent" />

              <div className="absolute bottom-4 left-4 right-4 rounded border border-white/20 bg-white/95 p-3.5 backdrop-blur-md shadow-md text-xs">
                <p className="font-bold text-[#102033]">Customer 360 &amp; Enterprise Pipeline</p>
                <p className="text-[0.68rem] text-[#526170] mt-0.5">Unified telemetry across Salesforce, Microsoft Dynamics, and Oracle ERP</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Clean Horizontal System Diagram (Section 19 Requirement) */}
        <div className="mt-16 rounded-xl border border-[#DDE4E8] bg-[#F7F9FA] p-6 lg:p-8">
          <div className="flex items-center justify-between pb-4 border-b border-[#DDE4E8]">
            <p className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#526170]">
              CONNECTED ENTERPRISE ARCHITECTURE
            </p>
            <span className="text-[0.68rem] font-mono font-semibold text-[#357C78]">
              Bi-Directional Lineage
            </span>
          </div>

          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {ecosystemNodes.map((node, index) => (
              <div
                key={node}
                className="relative flex flex-col items-center justify-center rounded-lg border border-[#DDE4E8] bg-white p-3 text-center shadow-2xs hover:border-[#B63A3A] transition-colors"
              >
                <span className="font-mono text-[0.6rem] text-[#526170]">
                  0{index + 1}
                </span>
                <span className="mt-1 text-xs font-bold text-[#102033]">
                  {node}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
