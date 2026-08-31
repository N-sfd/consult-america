"use client";

import Link from "next/link";
import { ArrowUpRight, Sparkles, Building2, CheckCircle2, TrendingUp, AlertCircle, PhoneCall, ChevronRight, User } from "lucide-react";
import { motion } from "framer-motion";

import SectionLabel from "@/components/marketing/SectionLabel";

const journeySteps = [
  { step: "01", name: "DISCOVER", detail: "Intent & Account Intelligence" },
  { step: "02", name: "ENGAGE", detail: "Personalized Outreach & Signals" },
  { step: "03", name: "SELL", detail: "Pipeline & Deal Governance" },
  { step: "04", name: "SERVE", detail: "Case & Service Automation" },
  { step: "05", name: "EXPAND", detail: "Account Lifecycle & Renewal" },
];

export default function CRMShowcase() {
  return (
    <section id="crm-cx" className="bg-[#FFFDF8] text-[#261F1B] py-20 sm:py-24 lg:py-28 border-b border-[#D7CCBD]">
      <div className="mkt-shell">
        <SectionLabel tone="burgundy">CRM &amp; CUSTOMER EXPERIENCE</SectionLabel>

        {/* Split Layout: Headline & Customer Journey Left (~50%), Customer 360 UI Right (~50%) */}
        <div className="mt-8 grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center lg:gap-14">
          {/* Left Column: Messaging & Journey */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="lg:col-span-6 space-y-6"
          >
            <h2 className="font-serif text-3xl font-semibold tracking-[-0.03em] text-[#261F1B] sm:text-4xl lg:text-5xl lg:leading-[1.1]">
              Connect every customer moment to the enterprise behind it.
            </h2>
            <p className="text-base sm:text-lg leading-relaxed text-[#695F57]">
              CRM works best when customer data, sales, service, operations and
              enterprise ERP systems move together without disjointed handoffs or
              isolated silos.
            </p>

            {/* Customer Journey Stepper */}
            <div className="pt-2">
              <p className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#7D2639]">
                Unified Customer Journey
              </p>
              <div className="mt-3 grid grid-cols-2 sm:grid-cols-5 gap-2">
                {journeySteps.map((item) => (
                  <div
                    key={item.name}
                    className="rounded-lg border border-[#D7CCBD]/80 bg-[#FFFAF2] p-2.5 transition-all hover:border-[#7D2639]/40"
                  >
                    <span className="font-mono text-[0.62rem] font-bold text-[#7D2639]">
                      {item.step}
                    </span>
                    <h3 className="mt-0.5 text-xs font-bold text-[#261F1B]">
                      {item.name}
                    </h3>
                    <p className="mt-1 text-[0.62rem] leading-tight text-[#695F57]">
                      {item.detail}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/platforms/crm"
                className="group ca-button-primary inline-flex items-center gap-2 !min-h-[50px] !px-7 text-sm font-semibold rounded-lg cursor-pointer"
              >
                <span>Explore CRM Platform</span>
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </motion.div>

          {/* Right Column: Customer 360 Workspace Mockup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6 rounded-2xl border border-[#D7CCBD] bg-[#FFFAF2] p-5 sm:p-6 shadow-[0_18px_55px_rgba(38,31,27,0.08)]"
          >
            {/* Top Bar */}
            <div className="flex items-center justify-between border-b border-[#D7CCBD] pb-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#7D2639] text-white font-bold text-xs">
                  <Building2 className="h-4 w-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-[#261F1B]">Acme Corporation</h4>
                    <span className="rounded bg-[#DFE4DA] px-2 py-0.5 text-[0.6rem] font-bold text-[#657766]">
                      Tier 1 Strategic
                    </span>
                  </div>
                  <p className="text-[0.62rem] text-[#695F57]">Account ID: ACME-GLOBAL-09</p>
                </div>
              </div>
              <span className="font-mono text-xs font-bold text-[#7D2639] uppercase">
                Customer 360
              </span>
            </div>

            {/* Metrics Matrix (4 Items) */}
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
              <div className="rounded-lg border border-[#D7CCBD] bg-[#FFFDF8] p-2.5">
                <p className="text-[0.58rem] font-bold uppercase tracking-wider text-[#695F57]">Relationship Health</p>
                <p className="font-serif text-base font-bold text-[#657766] mt-0.5">92% Optimal</p>
              </div>
              <div className="rounded-lg border border-[#D7CCBD] bg-[#FFFDF8] p-2.5">
                <p className="text-[0.58rem] font-bold uppercase tracking-wider text-[#695F57]">Active Pipeline</p>
                <p className="font-serif text-base font-bold text-[#7D2639] mt-0.5">$2.4M</p>
              </div>
              <div className="rounded-lg border border-[#D7CCBD] bg-[#FFFDF8] p-2.5">
                <p className="text-[0.58rem] font-bold uppercase tracking-wider text-[#695F57]">Open Opps</p>
                <p className="font-serif text-base font-bold text-[#261F1B] mt-0.5">8 Deals</p>
              </div>
              <div className="rounded-lg border border-[#D7CCBD] bg-[#FFFDF8] p-2.5">
                <p className="text-[0.58rem] font-bold uppercase tracking-wider text-[#695F57]">Service Cases</p>
                <p className="font-serif text-base font-bold text-[#261F1B] mt-0.5">3 Active</p>
              </div>
            </div>

            {/* AI Next Best Action Highlight */}
            <div className="mt-3.5 rounded-xl border border-[#D7CCBD] bg-[#FFFDF8] p-3.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#7D2639]">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span className="uppercase tracking-wider">AI Next Best Action</span>
                </div>
                <span className="rounded bg-[#DFE4DA] px-1.5 py-0.5 text-[0.6rem] font-bold text-[#657766]">
                  High Confidence
                </span>
              </div>
              <div className="mt-2 flex items-center justify-between rounded-lg border border-[#D7CCBD]/60 bg-[#FFFAF2] p-2.5 text-xs">
                <div className="flex items-center gap-2">
                  <PhoneCall className="h-3.5 w-3.5 text-[#7D2639] shrink-0" />
                  <span className="font-bold text-[#261F1B]">Schedule executive follow-up for Fusion ERP expansion</span>
                </div>
                <span className="text-[0.65rem] text-[#657766] font-mono">Trigger: Contract Renewal</span>
              </div>
            </div>

            {/* Connected ERP & Billing Lineage */}
            <div className="mt-3 rounded-lg border border-[#D7CCBD] bg-[#F4EFE6] px-3 py-2 flex items-center justify-between text-[0.68rem] text-[#695F57]">
              <span>Oracle ERP Synced · 0 Billing Discrepancies</span>
              <span className="font-bold text-[#7D2639]">Auto-Invoiced</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
