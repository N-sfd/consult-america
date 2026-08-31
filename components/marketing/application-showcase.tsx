"use client";

import Link from "next/link";
import { ArrowUpRight, CheckCircle2, Sparkles, FileText, Activity, Users, ShieldCheck, Database, Layers, Bot, Building2, PhoneCall } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

import SectionLabel from "@/components/marketing/SectionLabel";

export default function ApplicationShowcase() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="applications-showcase" className="bg-[#FFFDF8] text-[#261F1B] py-24 sm:py-28 lg:py-32 border-b border-[#D7CCBD]">
      <div className="mkt-shell">
        {/* Section Header */}
        <div className="max-w-3xl">
          <SectionLabel tone="burgundy">BUILT BY CONSULT AMERICA</SectionLabel>

          <h2 className="mt-4 font-serif text-3xl font-semibold tracking-tight text-[#261F1B] sm:text-4xl lg:text-5xl lg:leading-[1.1]">
            From enterprise strategy
            <br />
            <span className="text-[#7D2639]">to working software.</span>
          </h2>

          <p className="mt-5 text-base sm:text-lg leading-relaxed text-[#695F57]">
            Consult America does not stop at advisory reports. We design, engineer, and deploy
            production-ready enterprise applications that solve high-friction operational workflows.
          </p>
        </div>

        {/* Expansive Showcase Modules (~35% copy | ~65% visual) */}
        <div className="mt-20 space-y-28 lg:space-y-36">
          {/* SHOWCASE 1: DATA AGENT */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Left Column: Text (~35%) */}
            <motion.div
              initial={shouldReduceMotion ? {} : { opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55 }}
              className="lg:col-span-5 xl:col-span-4 space-y-5"
            >
              <div className="flex items-center gap-2">
                <span className="h-0.5 w-5 bg-[#7D2639]" />
                <span className="text-[0.68rem] font-bold uppercase tracking-[0.16em] text-[#7D2639]">
                  AI &amp; DATA FLAGSHIP
                </span>
              </div>

              <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#261F1B] leading-tight">
                Turn complex enterprise documents into structured intelligence.
              </h3>

              <p className="text-base leading-relaxed text-[#695F57]">
                Data Agent parses master service agreements, government RFP schedules, and supplier contracts into structured database records while maintaining direct traceability back to the source document.
              </p>

              <div className="space-y-2.5 pt-2">
                {[
                  "Automated FAR / DFARS regulatory clause extraction",
                  "Source-grounded confidence and page citations",
                  "Direct export to Oracle Procurement and ERP ledgers",
                ].map((feat) => (
                  <div key={feat} className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-[#261F1B]">
                    <CheckCircle2 className="h-4 w-4 text-[#657766] shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4">
                <Link
                  href="/work/innovation/data-agent"
                  className="group inline-flex items-center gap-2 rounded-lg bg-[#7D2639] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#681F30]"
                >
                  <span>Explore Data Agent</span>
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </div>
            </motion.div>

            {/* Right Column: Standardized Browser Frame (~65%) */}
            <motion.div
              initial={shouldReduceMotion ? {} : { opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-7 xl:col-span-8 rounded-[20px] border border-black/8 bg-white shadow-[0_28px_70px_rgba(0,0,0,0.12)] overflow-hidden"
            >
              {/* Standardized 48px Browser Top Bar */}
              <div className="flex h-12 items-center justify-between border-b border-[#D7CCBD]/70 bg-[#F7F3EC]/90 px-4">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#D7CCBD]" />
                    <span className="h-2.5 w-2.5 rounded-full bg-[#D7CCBD]" />
                    <span className="h-2.5 w-2.5 rounded-full bg-[#D7CCBD]" />
                  </div>
                  <div className="ml-3 hidden sm:flex items-center rounded-md bg-white/80 px-3 py-1 text-[0.68rem] text-[#695F57] font-mono border border-[#D7CCBD]/60">
                    https://app.consultamerica.net/data-agent/workspaces/contracts
                  </div>
                </div>
                <span className="rounded bg-[#DFE4DA] px-2.5 py-0.5 text-[0.62rem] font-bold text-[#657766]">
                  Verified Grounding
                </span>
              </div>

              {/* Data Agent UI Workspace */}
              <div className="p-6 sm:p-7 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                  <div className="rounded-xl border border-[#D7CCBD]/80 bg-[#FFFAF2] p-4">
                    <p className="text-[0.62rem] font-bold uppercase tracking-wider text-[#695F57]">Extracted Entity</p>
                    <p className="text-base font-bold text-[#261F1B] mt-1">Federal Defense Subcontract</p>
                    <p className="text-[0.7rem] text-[#695F57] mt-1 font-mono">Prime: Aerospace Systems Corp</p>
                  </div>
                  <div className="rounded-xl border border-[#D7CCBD]/80 bg-[#FFFAF2] p-4">
                    <p className="text-[0.62rem] font-bold uppercase tracking-wider text-[#695F57]">Payment Terms &amp; Value</p>
                    <p className="text-base font-bold text-[#7D2639] mt-1">$14,250,000 USD · Net 30</p>
                    <p className="text-[0.7rem] text-[#657766] font-mono mt-1">Milestone-based disbursement</p>
                  </div>
                </div>

                <div className="rounded-xl border border-[#D7CCBD] bg-white p-4 text-xs">
                  <div className="flex items-center justify-between font-bold text-[#261F1B]">
                    <span>DFARS 252.204-7012 (Cybersecurity &amp; CDI)</span>
                    <span className="text-[#657766] font-mono text-[0.7rem]">Source Citation: p. 24</span>
                  </div>
                  <p className="mt-2 text-[0.75rem] text-[#695F57] leading-relaxed italic bg-[#F7F3EC] p-3.5 rounded-lg border-l-2 border-[#7D2639]">
                    &ldquo;The Contractor shall provide adequate security on all covered defense information that resides on or transits through information systems...&rdquo;
                  </p>
                </div>

                <div className="flex items-center justify-between pt-1 text-xs text-[#695F57]">
                  <span>47 Fields extracted · Full Source Traceability</span>
                  <span className="font-bold text-[#7D2639]">Oracle ERP Synced</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* SHOWCASE 2: MEDIGUIDE AI (LARGE UI ~65% LEFT | TEXT ~35% RIGHT) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Left Column: Standardized Browser Frame (~65%) */}
            <motion.div
              initial={shouldReduceMotion ? {} : { opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-7 xl:col-span-8 lg:order-1 rounded-[20px] border border-black/8 bg-white shadow-[0_28px_70px_rgba(0,0,0,0.12)] overflow-hidden"
            >
              <div className="flex h-12 items-center justify-between border-b border-[#D7CCBD]/70 bg-[#F7F3EC]/90 px-4">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#D7CCBD]" />
                    <span className="h-2.5 w-2.5 rounded-full bg-[#D7CCBD]" />
                    <span className="h-2.5 w-2.5 rounded-full bg-[#D7CCBD]" />
                  </div>
                  <div className="ml-3 hidden sm:flex items-center rounded-md bg-white/80 px-3 py-1 text-[0.68rem] text-[#695F57] font-mono border border-[#D7CCBD]/60">
                    https://app.consultamerica.net/mediguide/clinical-summary
                  </div>
                </div>
                <span className="rounded bg-[#DFE4DA] px-2.5 py-0.5 text-[0.62rem] font-bold text-[#657766]">
                  Clinical Data Governance
                </span>
              </div>

              {/* MediGuide Patient Timeline */}
              <div className="p-6 sm:p-7 space-y-4">
                <div className="flex items-center justify-between border-b border-[#D7CCBD]/60 pb-3">
                  <div>
                    <h4 className="text-base font-bold text-[#261F1B]">Patient Clinical Profile · ID #MED-8910</h4>
                    <p className="text-[0.7rem] text-[#695F57]">Longitudinal History &amp; Lab Trajectories</p>
                  </div>
                  <span className="rounded bg-[#DFE4DA] px-2.5 py-0.5 text-[0.62rem] font-bold text-[#657766]">
                    Evidence Grounded
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3 text-center text-xs">
                  <div className="rounded-xl border border-[#D7CCBD]/80 bg-[#FFFAF2] p-3.5">
                    <p className="text-[0.62rem] font-bold uppercase text-[#695F57]">Hemoglobin</p>
                    <p className="font-serif text-lg font-bold text-[#261F1B] mt-0.5">13.8 g/dL</p>
                    <p className="text-[0.65rem] text-[#657766] font-bold mt-0.5">Normal</p>
                  </div>
                  <div className="rounded-xl border border-[#D7CCBD]/80 bg-[#FFFAF2] p-3.5">
                    <p className="text-[0.62rem] font-bold uppercase text-[#695F57]">LDL Cholesterol</p>
                    <p className="font-serif text-lg font-bold text-[#7D2639] mt-0.5">112 mg/dL</p>
                    <p className="text-[0.65rem] text-[#7D2639] font-bold mt-0.5">Review</p>
                  </div>
                  <div className="rounded-xl border border-[#D7CCBD]/80 bg-[#FFFAF2] p-3.5">
                    <p className="text-[0.62rem] font-bold uppercase text-[#695F57]">A1C Level</p>
                    <p className="font-serif text-lg font-bold text-[#261F1B] mt-0.5">5.4%</p>
                    <p className="text-[0.65rem] text-[#657766] font-bold mt-0.5">Optimal</p>
                  </div>
                </div>

                <div className="rounded-xl border border-[#D7CCBD] bg-white p-4 text-xs">
                  <p className="font-bold text-[#7D2639] flex items-center gap-1.5 uppercase text-[0.7rem]">
                    <Sparkles className="h-3.5 w-3.5" /> Physician Visit Preparation Summary
                  </p>
                  <p className="text-[0.75rem] text-[#695F57] mt-1.5 leading-relaxed">
                    Prioritize lipid panel review following statin dose adjustment · Medication reconciliation completed without contraindications.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Right Column: Text (~35%) */}
            <motion.div
              initial={shouldReduceMotion ? {} : { opacity: 0, x: 16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55 }}
              className="lg:col-span-5 xl:col-span-4 lg:order-2 space-y-5"
            >
              <div className="flex items-center gap-2">
                <span className="h-0.5 w-5 bg-[#657766]" />
                <span className="text-[0.68rem] font-bold uppercase tracking-[0.16em] text-[#657766]">
                  CLINICAL INTELLIGENCE
                </span>
              </div>

              <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#261F1B] leading-tight">
                Synthesize clinical timelines with evidence-grounded clarity.
              </h3>

              <p className="text-base leading-relaxed text-[#695F57]">
                MediGuide AI assists clinical teams by aggregating patient health records, lab trajectories, and medication schedules into verified point-of-care summaries.
              </p>

              <div className="space-y-2.5 pt-2">
                {[
                  "Longitudinal lab result trend analysis",
                  "Verified citations for clinical insights",
                  "Automated physician visit prep documentation",
                ].map((feat) => (
                  <div key={feat} className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-[#261F1B]">
                    <CheckCircle2 className="h-4 w-4 text-[#657766] shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4">
                <Link
                  href="/work/innovation/mediguide-ai"
                  className="group inline-flex items-center gap-2 rounded-lg bg-[#657766] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#526353]"
                >
                  <span>Explore MediGuide AI</span>
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </div>
            </motion.div>
          </div>

          {/* SHOWCASE 3: CRM WORKSPACE */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Left Column: Text (~35%) */}
            <motion.div
              initial={shouldReduceMotion ? {} : { opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55 }}
              className="lg:col-span-5 xl:col-span-4 space-y-5"
            >
              <div className="flex items-center gap-2">
                <span className="h-0.5 w-5 bg-[#7D2639]" />
                <span className="text-[0.68rem] font-bold uppercase tracking-[0.16em] text-[#7D2639]">
                  REVENUE OPERATIONS
                </span>
              </div>

              <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#261F1B] leading-tight">
                Connect customer engagement directly to the operational core.
              </h3>

              <p className="text-base leading-relaxed text-[#695F57]">
                Unify sales pipeline, contract milestones, service ticketing, and transactional ERP billing in one high-performance Customer 360 workspace.
              </p>

              <div className="space-y-2.5 pt-2">
                {[
                  "Customer 360 account relationship telemetry",
                  "Predictive AI next best action guidance",
                  "Automated reconciliation with Oracle Fusion ERP",
                ].map((feat) => (
                  <div key={feat} className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-[#261F1B]">
                    <CheckCircle2 className="h-4 w-4 text-[#657766] shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4">
                <Link
                  href="/platforms/crm"
                  className="group inline-flex items-center gap-2 rounded-lg bg-[#7D2639] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#681F30]"
                >
                  <span>Explore CRM Workspace</span>
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </div>
            </motion.div>

            {/* Right Column: Standardized Browser Frame (~65%) */}
            <motion.div
              initial={shouldReduceMotion ? {} : { opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-7 xl:col-span-8 rounded-[20px] border border-black/8 bg-white shadow-[0_28px_70px_rgba(0,0,0,0.12)] overflow-hidden"
            >
              <div className="flex h-12 items-center justify-between border-b border-[#D7CCBD]/70 bg-[#F7F3EC]/90 px-4">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#D7CCBD]" />
                    <span className="h-2.5 w-2.5 rounded-full bg-[#D7CCBD]" />
                    <span className="h-2.5 w-2.5 rounded-full bg-[#D7CCBD]" />
                  </div>
                  <div className="ml-3 hidden sm:flex items-center rounded-md bg-white/80 px-3 py-1 text-[0.68rem] text-[#695F57] font-mono border border-[#D7CCBD]/60">
                    https://app.consultamerica.net/crm/accounts/acme-corp
                  </div>
                </div>
                <span className="font-mono text-xs font-bold text-[#7D2639] uppercase">
                  Customer 360
                </span>
              </div>

              <div className="p-6 sm:p-7 space-y-4">
                <div className="flex items-center justify-between border-b border-[#D7CCBD]/60 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#7D2639] text-white">
                      <Building2 className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-[#261F1B]">Acme Corporation</h4>
                      <p className="text-[0.68rem] text-[#695F57]">Account ID: ACME-GLOBAL-09</p>
                    </div>
                  </div>
                  <span className="rounded bg-[#DFE4DA] px-2.5 py-0.5 text-[0.62rem] font-bold text-[#657766]">
                    Tier 1 Strategic
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3 text-center text-xs">
                  <div className="rounded-xl border border-[#D7CCBD]/80 bg-[#FFFAF2] p-3.5">
                    <p className="text-[0.62rem] font-bold text-[#695F57]">Relationship Health</p>
                    <p className="font-serif text-lg font-bold text-[#657766] mt-0.5">Optimal</p>
                  </div>
                  <div className="rounded-xl border border-[#D7CCBD]/80 bg-[#FFFAF2] p-3.5">
                    <p className="text-[0.62rem] font-bold text-[#695F57]">Active Pipeline</p>
                    <p className="font-serif text-lg font-bold text-[#7D2639] mt-0.5">$2.4M</p>
                  </div>
                  <div className="rounded-xl border border-[#D7CCBD]/80 bg-[#FFFAF2] p-3.5">
                    <p className="text-[0.62rem] font-bold text-[#695F57]">Open Deals</p>
                    <p className="font-serif text-lg font-bold text-[#261F1B] mt-0.5">8 Programs</p>
                  </div>
                </div>

                <div className="rounded-xl border border-[#D7CCBD] bg-white p-4 text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-[#7D2639] uppercase text-[0.7rem]">
                    <Sparkles className="h-3.5 w-3.5" /> AI Next Best Action
                  </div>
                  <p className="mt-1.5 text-[0.75rem] text-[#261F1B] font-medium">
                    Schedule executive follow-up for Fusion ERP expansion · Contract renewal in progress
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
