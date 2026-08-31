"use client";

import Link from "next/link";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

import SectionLabel from "@/components/marketing/SectionLabel";

const ATS_REQS = [
  { role: "Senior Oracle Fusion Lead", applicants: "14 applicants", stage: "Interview Loop" },
  { role: "Enterprise Data Engineer", applicants: "9 applicants", stage: "Technical Screen" },
  { role: "Transformation Analyst", applicants: "6 applicants", stage: "Offer Stage" },
];

export default function EnterprisePlatforms() {
  return (
    <section id="platforms" className="mkt-section bg-[#FFFAF2]">
      <div className="mkt-shell">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <SectionLabel tone="burgundy">Enterprise Platforms</SectionLabel>
            <h2 className="mkt-section-heading mt-4 text-[#261F1B]">
              Software built around operational excellence.
            </h2>
          </div>
          <p className="max-w-md text-sm text-[#695F57]">
            A production application suite connecting client lifecycle, talent
            acquisition, employee records, and workforce payroll operations.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* 1. CRM Workspace */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="ca-app-window flex flex-col justify-between border border-[#D7CCBD] bg-[#FFFDF8] p-6"
          >
            <div>
              <div className="flex items-center justify-between border-b border-[#D7CCBD] pb-3">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-[#B93838]" />
                    <span className="h-2 w-2 rounded-full bg-[#C77A16]" />
                    <span className="h-2 w-2 rounded-full bg-[#657766]" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-[0.1em] text-[#261F1B]">
                    CRM Workspace
                  </span>
                </div>
                <span className="rounded-full bg-[#DFE4DA] px-2 py-0.5 text-[0.65rem] font-bold text-[#657766]">
                  Platform preview
                </span>
              </div>

              {/* CRM Navigation Tabs */}
              <div className="mt-4 flex items-center gap-1 text-[0.72rem] font-medium text-[#695F57]">
                <span className="rounded-md bg-[#7D2639] px-2.5 py-1 font-bold text-white">
                  Overview
                </span>
                <span className="px-2 py-1">Accounts</span>
                <span className="px-2 py-1">Opportunities</span>
                <span className="px-2 py-1">Service</span>
              </div>

              {/* Pipeline Stages Visual */}
              <div className="mt-4 rounded-xl border border-[#D7CCBD] bg-[#F4EFE6] p-3.5">
                <p className="text-[0.68rem] font-bold uppercase tracking-[0.1em] text-[#695F57]">
                  Pipeline Distribution
                </p>
                <div className="mt-2.5 space-y-2">
                  <div>
                    <div className="flex justify-between text-[0.72rem] text-[#695F57]">
                      <span>Discovery</span>
                      <span className="font-bold text-[#261F1B]">Stage 1</span>
                    </div>
                    <div className="mt-1 h-1.5 w-full rounded-full bg-[#D7CCBD]">
                      <div className="h-1.5 rounded-full bg-[#7D2639]" style={{ width: "70%" }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-[0.72rem] text-[#695F57]">
                      <span>Proposal &amp; SOW</span>
                      <span className="font-bold text-[#261F1B]">Stage 2</span>
                    </div>
                    <div className="mt-1 h-1.5 w-full rounded-full bg-[#D7CCBD]">
                      <div className="h-1.5 rounded-full bg-[#D8C5AA]" style={{ width: "50%" }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-[0.72rem] text-[#695F57]">
                      <span>Executive Review</span>
                      <span className="font-bold text-[#261F1B]">Stage 3</span>
                    </div>
                    <div className="mt-1 h-1.5 w-full rounded-full bg-[#D7CCBD]">
                      <div className="h-1.5 rounded-full bg-[#657766]" style={{ width: "85%" }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Core capabilities list */}
              <div className="mt-4 space-y-1.5 text-xs text-[#261F1B] font-medium">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#657766]" />
                  <span>Customer 360 Intelligence</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#657766]" />
                  <span>Opportunity Stage Governance</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#657766]" />
                  <span>Account Expansion Analytics</span>
                </div>
              </div>
            </div>

            <div className="mt-6 border-t border-[#D7CCBD] pt-4">
              <Link href="/platforms/crm" className="ca-link text-xs font-semibold text-[#7D2639] hover:text-[#681F30]">
                Explore CRM Platform
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </motion.div>

          {/* 2. ATS & Talent Intelligence */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="ca-app-window flex flex-col justify-between border border-[#D7CCBD] bg-[#FFFDF8] p-6"
          >
            <div>
              <div className="flex items-center justify-between border-b border-[#D7CCBD] pb-3">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-[#B93838]" />
                    <span className="h-2 w-2 rounded-full bg-[#C77A16]" />
                    <span className="h-2 w-2 rounded-full bg-[#657766]" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-[0.1em] text-[#261F1B]">
                    ATS &amp; Talent Platform
                  </span>
                </div>
                <span className="rounded-full bg-[#DFE4DA] px-2 py-0.5 text-[0.65rem] font-bold text-[#657766]">
                  Recruiting engine
                </span>
              </div>

              {/* End-to-End Pipeline Stepper */}
              <div className="mt-4 flex items-center justify-between rounded-lg border border-[#D7CCBD] bg-[#F4EFE6] p-2 text-[0.65rem] font-bold text-[#695F57]">
                <span className="text-[#261F1B]">Applied</span>
                <span>→</span>
                <span className="text-[#7D2639]">Screen</span>
                <span>→</span>
                <span className="text-[#7D2639]">Interview</span>
                <span>→</span>
                <span className="text-[#657766]">Offer</span>
              </div>

              {/* Sanitized Requisition Queue */}
              <div className="mt-3.5 space-y-2">
                {ATS_REQS.map((req) => (
                  <div
                    key={req.role}
                    className="rounded-lg border border-[#D7CCBD] bg-[#FFFDF8] p-2.5 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-[#261F1B]">{req.role}</span>
                      <span className="rounded-md bg-[#DFE4DA] px-1.5 py-0.5 text-[0.65rem] font-bold text-[#657766]">
                        {req.stage}
                      </span>
                    </div>
                    <p className="mt-1 text-[0.68rem] text-[#695F57]">{req.applicants}</p>
                  </div>
                ))}
              </div>

              {/* Connected Lifecycle Callout */}
              <div className="mt-3.5 rounded-lg border border-[#657766]/40 bg-[#DFE4DA] p-2.5 text-xs text-[#261F1B]">
                <p className="font-bold text-[#7D2639]">Connected Loop:</p>
                <p className="mt-0.5 text-[0.68rem] text-[#261F1B]/80 leading-relaxed">
                  Requisition → Careers → Screening → Interview → Offer → Employee Onboarding
                </p>
              </div>
            </div>

            <div className="mt-6 border-t border-[#D7CCBD] pt-4">
              <Link href="/platforms/ats" className="ca-link text-xs font-semibold text-[#7D2639] hover:text-[#681F30]">
                Explore ATS Platform
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </motion.div>

          {/* 3. Core HR & Workforce */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.16 }}
            className="ca-app-window flex flex-col justify-between border border-[#D7CCBD] bg-[#FFFDF8] p-6"
          >
            <div>
              <div className="flex items-center justify-between border-b border-[#D7CCBD] pb-3">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-[#B93838]" />
                    <span className="h-2 w-2 rounded-full bg-[#C77A16]" />
                    <span className="h-2 w-2 rounded-full bg-[#657766]" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-[0.1em] text-[#261F1B]">
                    Core HR &amp; Workforce
                  </span>
                </div>
                <span className="rounded-full bg-[#DFE4DA] px-2 py-0.5 text-[0.65rem] font-bold text-[#657766]">
                  Operations &amp; Pay
                </span>
              </div>

              <div className="mt-4 space-y-2.5">
                <div className="rounded-xl border border-[#D7CCBD] bg-[#FFFDF8] p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#261F1B]">Employee Self-Service</span>
                    <span className="text-[0.65rem] font-bold text-[#7D2639]">Portal</span>
                  </div>
                  <p className="mt-1 text-[0.68rem] text-[#695F57]">
                    Profile management, onboarding verification, and document vault.
                  </p>
                </div>

                <div className="rounded-xl border border-[#D7CCBD] bg-[#FFFDF8] p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#261F1B]">Time &amp; Leave System</span>
                    <span className="text-[0.65rem] font-bold text-[#7D2639]">Workforce</span>
                  </div>
                  <p className="mt-1 text-[0.68rem] text-[#695F57]">
                    Timesheet submissions, manager sign-offs, and PTO balance accruals.
                  </p>
                </div>

                <div className="rounded-xl border border-[#D7CCBD] bg-[#FFFDF8] p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#261F1B]">Enterprise Payroll</span>
                    <span className="text-[0.65rem] font-bold text-[#657766]">GL Connected</span>
                  </div>
                  <p className="mt-1 text-[0.68rem] text-[#695F57]">
                    Pay runs, earnings calculations, tax reporting, and direct deposits.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 border-t border-[#D7CCBD] pt-4">
              <Link href="/platforms/payroll" className="ca-link text-xs font-semibold text-[#7D2639] hover:text-[#681F30]">
                Explore Workforce &amp; Payroll
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
