"use client";

import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

import SectionLabel from "@/components/marketing/SectionLabel";

const journeySteps = [
  { step: "01", name: "DISCOVER", detail: "Intent & Audience Signals" },
  { step: "02", name: "ENGAGE", detail: "Personalized Outreach" },
  { step: "03", name: "SELL", detail: "Pipeline & Deal Staging" },
  { step: "04", name: "SERVE", detail: "Case & Service Governance" },
  { step: "05", name: "EXPAND", detail: "Lifecycle & Retention" },
];

const connectedLayers = [
  "Customer Data",
  "CRM",
  "Service",
  "Marketing",
  "AI",
  "ERP",
  "Integration",
  "Analytics",
];

const capabilities = [
  "CRM Strategy & Architecture",
  "Sales Cloud Modernization",
  "Omnichannel Service Governance",
  "Customer Data Platforms (CDP)",
  "Digital Experience & Portals",
  "Integration & API Workflows",
  "Revenue Process Automation",
  "AI-Enabled Customer Intelligence",
  "Ongoing Managed Services",
];

export default function CRMShowcase() {
  return (
    <section id="crm-cx" className="mkt-section bg-[#F4EFE6] text-[#261F1B]">
      <div className="mkt-shell">
        <SectionLabel tone="burgundy">CRM &amp; Customer Experience</SectionLabel>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-end lg:gap-12">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="lg:col-span-7"
          >
            <h2 className="text-3xl font-bold tracking-[-0.03em] text-[#261F1B] sm:text-4xl lg:text-5xl">
              Connect every customer moment to the enterprise behind it.
            </h2>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.08 }}
            className="lg:col-span-5"
          >
            <p className="text-base leading-relaxed text-[#695F57]">
              CRM works best when customer data, sales, service, operations and
              enterprise systems move together without disjointed handoffs or
              isolated silos.
            </p>
          </motion.div>
        </div>

        {/* Customer Journey Stepper Visual */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-14 rounded-2xl border border-[#D7CCBD] bg-[#FFFDF8] p-8 lg:p-10 shadow-[0_12px_36px_rgba(38,31,27,0.04)]"
        >
          <p className="text-[0.72rem] font-bold uppercase tracking-[0.14em] text-[#7D2639]">
            Unified Customer Journey
          </p>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {journeySteps.map((item, idx) => (
              <div
                key={item.name}
                className="relative flex flex-col justify-between rounded-xl border border-[#D7CCBD] bg-[#FFFAF2] p-4.5"
              >
                <div>
                  <span className="text-xs font-bold text-[#7D2639]">
                    {item.step}
                  </span>
                  <h3 className="mt-2 text-base font-bold text-[#261F1B]">
                    {item.name}
                  </h3>
                  <p className="mt-1 text-xs text-[#695F57]">{item.detail}</p>
                </div>
                {idx < journeySteps.length - 1 && (
                  <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                    <ArrowRight className="h-4 w-4 text-[#7D2639]" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Connected Enterprise Fabric */}
          <div className="mt-8 border-t border-[#D7CCBD] pt-6">
            <p className="text-xs font-semibold text-[#695F57]">
              Connected across the digital core:
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {connectedLayers.map((layer) => (
                <span
                  key={layer}
                  className="rounded-md border border-[#D7CCBD] bg-[#F4EFE6] px-3 py-1.5 text-xs font-semibold text-[#261F1B]"
                >
                  {layer}
                </span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Capabilities Grid */}
        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {capabilities.map((cap, idx) => (
            <motion.div
              key={cap}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.03 }}
              className="flex items-center gap-3 rounded-xl border border-[#D7CCBD] bg-[#FFFDF8] p-4 transition-colors hover:border-[#7D2639]/40"
            >
              <span className="h-2 w-2 rounded-full bg-[#7D2639]" />
              <span className="text-sm font-semibold text-[#261F1B]">{cap}</span>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-10 flex justify-start">
          <Link
            href="/platforms/crm"
            className="group inline-flex items-center gap-2 font-bold text-sm text-[#7D2639] hover:text-[#681F30]"
          >
            <span>Explore CRM &amp; Customer Experience</span>
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
