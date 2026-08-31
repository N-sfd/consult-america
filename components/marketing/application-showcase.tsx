"use client";

import Link from "next/link";
import { ArrowUpRight, CheckCircle2, Sparkles, FileText, Activity, Users, ShieldCheck, Database, Layers, Bot } from "lucide-react";
import { motion } from "framer-motion";

import SectionLabel from "@/components/marketing/SectionLabel";

export default function ApplicationShowcase() {
  return (
    <section id="applications-showcase" className="bg-[#FFFDF8] text-[#261F1B] py-20 sm:py-24 lg:py-28 border-b border-[#D7CCBD]">
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
            Consult America does not stop at advisory reports. We design, engineer and deploy
            production-ready enterprise applications that solve high-friction operational workflows.
          </p>
        </div>

        {/* Alternating Showcase Modules */}
        <div className="mt-16 space-y-20 lg:space-y-24">
          {/* SHOWCASE 1: DATA AGENT (TEXT | LARGE UI) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Left Column: Text */}
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55 }}
              className="lg:col-span-5 space-y-5"
            >
              <span className="text-[0.68rem] font-bold uppercase tracking-[0.16em] text-[#7D2639]">
                AI &amp; DATA FLAGSHIP
              </span>

              <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#261F1B] leading-tight">
                Turn complex enterprise documents into structured intelligence.
              </h3>

              <p className="text-sm sm:text-base leading-relaxed text-[#695F57]">
                Data Agent parses complex master service agreements, government RFP schedules, and supplier contracts into structured, verified database records while maintaining direct traceability back to the source PDF.
              </p>

              <div className="space-y-2.5 pt-2">
                {[
                  "Automated FAR / DFARS regulatory clause extraction",
                  "100% source-grounded confidence indicators",
                  "Centralized contract repository with bulk comparison",
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
                  className="group inline-flex items-center gap-2 rounded-md bg-[#7D2639] px-6 py-3 text-xs sm:text-sm font-semibold text-white transition-colors hover:bg-[#681F30]"
                >
                  <span>Explore Data Agent</span>
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </div>
            </motion.div>

            {/* Right Column: Large UI Frame */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-7 rounded-2xl border border-[#D7CCBD] bg-[#FFFAF2] p-5 sm:p-6 shadow-[0_16px_50px_rgba(38,31,27,0.08)]"
            >
              <div className="flex items-center justify-between border-b border-[#D7CCBD] pb-3 text-xs font-mono">
                <div className="flex items-center gap-2 text-[#261F1B]">
                  <FileText className="h-4 w-4 text-[#7D2639]" />
                  <span className="font-bold">Data Agent · Contract Intelligence</span>
                </div>
                <span className="rounded bg-[#DFE4DA] px-2 py-0.5 text-[0.62rem] font-bold text-[#657766]">
                  Confidence: 99.8%
                </span>
              </div>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="rounded-lg border border-[#D7CCBD] bg-[#FFFDF8] p-3">
                  <p className="text-[0.6rem] font-bold uppercase text-[#695F57]">Extracted Entity</p>
                  <p className="text-sm font-bold text-[#261F1B] mt-0.5">Federal Defense Subcontract</p>
                  <p className="text-[0.65rem] text-[#695F57] mt-1">Prime: Aerospace Systems Corp</p>
                </div>
                <div className="rounded-lg border border-[#D7CCBD] bg-[#FFFDF8] p-3">
                  <p className="text-[0.6rem] font-bold uppercase text-[#695F57]">Payment Terms &amp; Value</p>
                  <p className="text-sm font-bold text-[#7D2639] mt-0.5">$14,250,000 USD · Net 30</p>
                  <p className="text-[0.65rem] text-[#657766] font-mono mt-1">Milestone-based disbursement</p>
                </div>
              </div>

              <div className="mt-3 rounded-lg border border-[#D7CCBD] bg-[#FFFDF8] p-3.5">
                <div className="flex items-center justify-between text-xs font-bold text-[#261F1B]">
                  <span>DFARS 252.204-7012 (Cybersecurity &amp; CDI)</span>
                  <span className="text-[#657766] font-mono">Verified (p. 24)</span>
                </div>
                <p className="mt-1.5 text-[0.68rem] text-[#695F57] leading-relaxed italic bg-[#F4EFE6] p-2 rounded border-l-2 border-[#7D2639]">
                  &ldquo;The Contractor shall provide adequate security on all covered defense information that resides on or transits through information systems...&rdquo;
                </p>
              </div>
            </motion.div>
          </div>

          {/* SHOWCASE 2: MEDIGUIDE AI (LARGE UI | TEXT) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Left Column: Large UI Frame */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-7 order-2 lg:order-1 rounded-2xl border border-[#D7CCBD] bg-[#FFFAF2] p-5 sm:p-6 shadow-[0_16px_50px_rgba(38,31,27,0.08)]"
            >
              <div className="flex items-center justify-between border-b border-[#D7CCBD] pb-3 text-xs font-mono">
                <div className="flex items-center gap-2 text-[#261F1B]">
                  <Activity className="h-4 w-4 text-[#657766]" />
                  <span className="font-bold">MediGuide AI · Clinical Workspace</span>
                </div>
                <span className="rounded bg-[#DFE4DA] px-2 py-0.5 text-[0.62rem] font-bold text-[#657766]">
                  Evidence Verified
                </span>
              </div>

              <div className="mt-4 rounded-lg border border-[#D7CCBD] bg-[#FFFDF8] p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#DFE4DA] text-[#657766] shrink-0 font-bold text-xs">
                    AI
                  </div>
                  <div className="text-xs text-[#261F1B] leading-relaxed">
                    <p className="font-bold">Comprehensive Lab &amp; Medication Review:</p>
                    <p className="mt-1 text-[#695F57]">
                      Based on latest panel results (08/2026), HbA1c is 6.2% (down from 7.1%). Metformin 500mg daily is well-tolerated. Kidney markers (eGFR 92) remain optimal.
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#D7CCBD]/60 flex items-center justify-between text-[0.68rem] font-mono text-[#657766]">
                  <span>Source: Quest Diagnostics (Ref #98214)</span>
                  <span className="text-[#7D2639] font-bold">Citation [1] Grounded</span>
                </div>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2 text-center text-xs">
                <div className="rounded border border-[#D7CCBD] bg-[#FFFDF8] p-2">
                  <p className="text-[0.6rem] text-[#695F57] uppercase">Patient Understanding</p>
                  <p className="font-bold text-[#261F1B] mt-0.5">Plain-Language Summary</p>
                </div>
                <div className="rounded border border-[#D7CCBD] bg-[#FFFDF8] p-2">
                  <p className="text-[0.6rem] text-[#695F57] uppercase">Visit Preparation</p>
                  <p className="font-bold text-[#657766] mt-0.5">Guided Questions Ready</p>
                </div>
              </div>
            </motion.div>

            {/* Right Column: Text */}
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55 }}
              className="lg:col-span-5 order-1 lg:order-2 space-y-5"
            >
              <span className="text-[0.68rem] font-bold uppercase tracking-[0.16em] text-[#657766]">
                APPLIED AI &amp; HEALTHCARE
              </span>

              <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#261F1B] leading-tight">
                Designing trustworthy AI experiences around complex information.
              </h3>

              <p className="text-sm sm:text-base leading-relaxed text-[#695F57]">
                MediGuide AI translates complex clinical charts, lab results, and discharge instructions into understandable, medically grounded guidance with rigorous evidence citations and voice playback.
              </p>

              <div className="space-y-2.5 pt-2">
                {[
                  "Clinical document intelligence with strict guardrails",
                  "Bi-directional patient & provider visit workspaces",
                  "Voice-assisted playback for accessibility",
                  "HIPAA-compliant zero-retention architecture",
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
                  className="group inline-flex items-center gap-2 rounded-md bg-[#657766] px-6 py-3 text-xs sm:text-sm font-semibold text-white transition-colors hover:bg-[#526353]"
                >
                  <span>Explore MediGuide AI</span>
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </div>
            </motion.div>
          </div>

          {/* SHOWCASE 3: CRM WORKSPACE (TEXT | LARGE UI) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Left Column: Text */}
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55 }}
              className="lg:col-span-5 space-y-5"
            >
              <span className="text-[0.68rem] font-bold uppercase tracking-[0.16em] text-[#7D2639]">
                ENTERPRISE CRM WORKSPACE
              </span>

              <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#261F1B] leading-tight">
                Connect customer intelligence with the work that drives revenue.
              </h3>

              <p className="text-sm sm:text-base leading-relaxed text-[#695F57]">
                Our enterprise CRM workspace brings together customer 360 histories, deal pipelines, account telemetry, and predictive AI deal coaching into a lightning-fast web application.
              </p>

              <div className="space-y-2.5 pt-2">
                {[
                  "Customer 360 profile with real-time ERP interaction history",
                  "Visual pipeline board with touchless stage tracking",
                  "AI revenue risk alerts and next-best-action guidance",
                  "Seamless bi-directional synchronization with Oracle & Salesforce",
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
                  className="group inline-flex items-center gap-2 rounded-md bg-[#7D2639] px-6 py-3 text-xs sm:text-sm font-semibold text-white transition-colors hover:bg-[#681F30]"
                >
                  <span>Explore CRM Workspace</span>
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </div>
            </motion.div>

            {/* Right Column: Large UI Frame */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-7 rounded-2xl border border-[#D7CCBD] bg-[#FFFAF2] p-5 sm:p-6 shadow-[0_16px_50px_rgba(38,31,27,0.08)]"
            >
              <div className="flex items-center justify-between border-b border-[#D7CCBD] pb-3 text-xs font-mono">
                <div className="flex items-center gap-2 text-[#261F1B]">
                  <Database className="h-4 w-4 text-[#7D2639]" />
                  <span className="font-bold">Enterprise CRM Workspace</span>
                </div>
                <span className="rounded bg-[#DFE4DA] px-2 py-0.5 text-[0.62rem] font-bold text-[#657766]">
                  Active Pipeline: $48.2M
                </span>
              </div>

              {/* Deal Stages Flow */}
              <div className="mt-4 grid grid-cols-4 gap-2 text-center text-[0.62rem] font-bold">
                <div className="rounded border border-[#D7CCBD] bg-[#FFFDF8] p-2">
                  <p className="text-[#695F57]">QUALIFIED</p>
                  <p className="text-xs font-bold text-[#261F1B] mt-0.5">$12.4M</p>
                </div>
                <div className="rounded border border-[#D7CCBD] bg-[#FFFDF8] p-2">
                  <p className="text-[#695F57]">SOLUTION</p>
                  <p className="text-xs font-bold text-[#261F1B] mt-0.5">$18.1M</p>
                </div>
                <div className="rounded border border-[#D7CCBD] bg-[#FFFDF8] p-2">
                  <p className="text-[#695F57]">PROPOSAL</p>
                  <p className="text-xs font-bold text-[#7D2639] mt-0.5">$11.5M</p>
                </div>
                <div className="rounded border border-[#D7CCBD] bg-[#DFE4DA] p-2">
                  <p className="text-[#657766]">CLOSED WON</p>
                  <p className="text-xs font-bold text-[#657766] mt-0.5">$6.2M</p>
                </div>
              </div>

              <div className="mt-3 rounded-lg border border-[#D7CCBD] bg-[#FFFDF8] p-3 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#261F1B]">Global Logistics Platform Modernization</span>
                  <span className="text-[#7D2639] font-mono font-bold">$3,850,000</span>
                </div>
                <div className="flex items-center justify-between text-[0.68rem] text-[#695F57]">
                  <span>Account: Horizon Freight International</span>
                  <span className="rounded bg-[#F0E8DC] px-1.5 py-0.5 text-[#261F1B] font-semibold">Decision: 2 Weeks</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
