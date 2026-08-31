"use client";

import Link from "next/link";
import { ArrowUpRight, Sparkles, Activity, Workflow, Users, CheckCircle2, ShieldCheck, Database, FileText, Check } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

export default function LabsShowcase() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="labs-showcase" className="bg-[#211E1B] text-[#F7F3EC] py-20 sm:py-24 lg:py-28 relative overflow-hidden border-b border-[#3A302B]">
      {/* Background Architectural Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(to right, #F7F3EC 1px, transparent 1px), linear-gradient(to bottom, #F7F3EC 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />

      <div className="mkt-shell relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#52443D] bg-[#2B2420] px-3.5 py-1 text-[0.68rem] font-bold uppercase tracking-[0.16em] text-[#D8C5AA]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#D8C5AA]" />
            CONSULT AMERICA LABS
          </div>

          <h2 className="mt-4 font-serif text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl lg:leading-[1.1]">
            We don&apos;t only advise.
            <br />
            <span className="text-[#D8C5AA]">We build.</span>
          </h2>

          <p className="mt-5 text-base sm:text-lg leading-relaxed text-[#C5BCB3]">
            Turning recurring enterprise operational gaps into focused software applications.
            Each lab product is engineered for production deployment alongside existing systems of record.
          </p>
        </div>

        {/* 2x2 Large Visual Product Showcases */}
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
          {/* PRODUCT 1: DATA AGENT */}
          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="rounded-2xl border border-[#52443D] bg-[#2B2420] p-6 lg:p-7 flex flex-col justify-between shadow-xl"
          >
            <div>
              <div className="flex items-center justify-between border-b border-[#3A302B] pb-3 text-xs">
                <span className="font-bold text-[#D8C5AA] uppercase tracking-wider text-[0.68rem]">
                  AI &amp; DOCUMENT INTELLIGENCE
                </span>
                <span className="rounded bg-[#3A302B] px-2 py-0.5 text-[0.62rem] font-bold text-[#D8C5AA] border border-[#52443D]">
                  DFARS Verified
                </span>
              </div>

              <h3 className="mt-4 font-serif text-2xl font-bold text-white">
                Data Agent
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[#C5BCB3]">
                Extract complex regulatory clauses, payment schedules, and obligations with verifiable source text citations.
              </p>

              {/* Interface Simulation Container */}
              <div className="mt-5 rounded-xl border border-[#3A302B] bg-[#1C1815] p-4 text-xs space-y-2.5">
                <div className="flex items-center justify-between text-[#D8C5AA] font-mono text-[0.65rem] border-b border-[#3A302B] pb-2">
                  <span>Contract: Federal_MSA_2026.pdf</span>
                  <span>Verified Grounding</span>
                </div>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-bold text-white">FAR 52.227-14 Rights in Data</p>
                    <p className="text-[0.68rem] text-[#A4B1BE]">Unlimited rights clause mapped to Oracle ERP</p>
                  </div>
                  <span className="text-[0.62rem] font-bold text-[#657766] bg-[#2B2420] px-1.5 py-0.5 rounded">
                    Page 14
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#3A302B] flex items-center justify-between">
              <Link
                href="/work/innovation/data-agent"
                className="inline-flex items-center gap-1 text-xs font-bold text-[#D8C5AA] hover:text-white transition-colors"
              >
                Explore Data Agent <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
              <span className="text-[0.65rem] text-[#A4B1BE]">Enterprise Ready</span>
            </div>
          </motion.div>

          {/* PRODUCT 2: MEDIGUIDE AI */}
          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.08 }}
            className="rounded-2xl border border-[#52443D] bg-[#2B2420] p-6 lg:p-7 flex flex-col justify-between shadow-xl"
          >
            <div>
              <div className="flex items-center justify-between border-b border-[#3A302B] pb-3 text-xs">
                <span className="font-bold text-[#D8C5AA] uppercase tracking-wider text-[0.68rem]">
                  CLINICAL INTELLIGENCE
                </span>
                <span className="rounded bg-[#3A302B] px-2 py-0.5 text-[0.62rem] font-bold text-[#657766] border border-[#52443D]">
                  Clinical Governance
                </span>
              </div>

              <h3 className="mt-4 font-serif text-2xl font-bold text-white">
                MediGuide AI
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[#C5BCB3]">
                Synthesize patient lab timelines, medication history, and evidence-grounded physician visit summaries.
              </p>

              {/* Lab Timeline Simulation Container */}
              <div className="mt-5 rounded-xl border border-[#3A302B] bg-[#1C1815] p-4 text-xs space-y-2">
                <div className="flex items-center justify-between text-[#D8C5AA] font-mono text-[0.65rem] border-b border-[#3A302B] pb-1.5">
                  <span>Patient Lab Timeline</span>
                  <span>Recent Panel (08/2026)</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center text-[0.65rem]">
                  <div className="rounded bg-[#2B2420] p-1.5">
                    <p className="text-[#A4B1BE]">Hemoglobin</p>
                    <p className="font-bold text-white mt-0.5">13.8 g/dL</p>
                    <p className="text-[#657766] text-[0.6rem]">Normal</p>
                  </div>
                  <div className="rounded bg-[#2B2420] p-1.5">
                    <p className="text-[#A4B1BE]">LDL</p>
                    <p className="font-bold text-[#D8C5AA] mt-0.5">112 mg/dL</p>
                    <p className="text-[#D8C5AA] text-[0.6rem]">Review</p>
                  </div>
                  <div className="rounded bg-[#2B2420] p-1.5">
                    <p className="text-[#A4B1BE]">A1C</p>
                    <p className="font-bold text-white mt-0.5">5.4%</p>
                    <p className="text-[#657766] text-[0.6rem]">Normal</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#3A302B] flex items-center justify-between">
              <Link
                href="/work/innovation/mediguide-ai"
                className="inline-flex items-center gap-1 text-xs font-bold text-[#D8C5AA] hover:text-white transition-colors"
              >
                Explore MediGuide AI <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
              <span className="text-[0.65rem] text-[#A4B1BE]">Provider &amp; Patient Portals</span>
            </div>
          </motion.div>

          {/* PRODUCT 3: CONVERA INTEGRATION GATEWAY */}
          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.16 }}
            className="rounded-2xl border border-[#52443D] bg-[#2B2420] p-6 lg:p-7 flex flex-col justify-between shadow-xl"
          >
            <div>
              <div className="flex items-center justify-between border-b border-[#3A302B] pb-3 text-xs">
                <span className="font-bold text-[#D8C5AA] uppercase tracking-wider text-[0.68rem]">
                  INTEGRATION &amp; APIS
                </span>
                <span className="rounded bg-[#3A302B] px-2 py-0.5 text-[0.62rem] font-bold text-[#A4B1BE] border border-[#52443D]">
                  &lt;15ms Latency
                </span>
              </div>

              <h3 className="mt-4 font-serif text-2xl font-bold text-white">
                Convera Integration Hub
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[#C5BCB3]">
                Managed API gateway and message routing bridge connecting Oracle, Salesforce, and custom microservices.
              </p>

              {/* Architecture Gateway Diagram */}
              <div className="mt-5 rounded-xl border border-[#3A302B] bg-[#1C1815] p-3.5 text-xs space-y-2">
                <div className="flex items-center justify-between font-mono text-[0.62rem] text-[#A4B1BE]">
                  <span>Source Apps (Oracle / CRM / HR)</span>
                  <span>→ CONVERA Hub →</span>
                  <span>Enterprise Services</span>
                </div>
                <div className="rounded bg-[#2B2420] p-2 flex items-center justify-between text-[0.65rem]">
                  <span className="text-white font-semibold">Token Auth &amp; Schema Transform</span>
                  <span className="text-[#657766] font-mono">0 Dropped Events</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#3A302B] flex items-center justify-between">
              <Link
                href="/capabilities/digital-engineering"
                className="inline-flex items-center gap-1 text-xs font-bold text-[#D8C5AA] hover:text-white transition-colors"
              >
                Explore Convera Architecture <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
              <span className="text-[0.65rem] text-[#A4B1BE]">Zero-Trust Security</span>
            </div>
          </motion.div>

          {/* PRODUCT 4: HR & TALENT / ATS */}
          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.24 }}
            className="rounded-2xl border border-[#52443D] bg-[#2B2420] p-6 lg:p-7 flex flex-col justify-between shadow-xl"
          >
            <div>
              <div className="flex items-center justify-between border-b border-[#3A302B] pb-3 text-xs">
                <span className="font-bold text-[#D8C5AA] uppercase tracking-wider text-[0.68rem]">
                  WORKFORCE PLATFORMS
                </span>
                <span className="rounded bg-[#3A302B] px-2 py-0.5 text-[0.62rem] font-bold text-[#657766] border border-[#52443D]">
                  Unified Suite
                </span>
              </div>

              <h3 className="mt-4 font-serif text-2xl font-bold text-white">
                ATS &amp; Core HR Suite
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[#C5BCB3]">
                Applicant tracking, automated convert-to-hire, timesheets, PTO approvals, and payroll reporting.
              </p>

              {/* Workforce Lifecycle Stepper */}
              <div className="mt-5 rounded-xl border border-[#3A302B] bg-[#1C1815] p-3.5 text-xs">
                <div className="grid grid-cols-4 gap-1.5 text-center text-[0.62rem] font-bold">
                  <div className="rounded bg-[#2B2420] text-[#D8C5AA] py-1.5">RECRUIT</div>
                  <div className="rounded bg-[#2B2420] text-[#D8C5AA] py-1.5">ONBOARD</div>
                  <div className="rounded bg-[#2B2420] text-[#D8C5AA] py-1.5">TIMESHEET</div>
                  <div className="rounded bg-[#7D2639] text-white py-1.5">PAYROLL</div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#3A302B] flex items-center justify-between">
              <Link
                href="/platforms/ats"
                className="inline-flex items-center gap-1 text-xs font-bold text-[#D8C5AA] hover:text-white transition-colors"
              >
                Explore Talent Platform <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
              <span className="text-[0.65rem] text-[#A4B1BE]">Live in Production</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
