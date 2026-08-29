"use client";

import Link from "next/link";
import { ArrowUpRight, CheckCircle2, UserCheck, Users, FolderGit2, Calendar, FileText, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

import SectionLabel from "@/components/marketing/SectionLabel";

const ATS_REQS = [
  { role: "Senior Oracle Fusion Lead", applicants: "14 applicants", stage: "Interview Loop" },
  { role: "Enterprise Data Engineer", applicants: "9 applicants", stage: "Technical Screen" },
  { role: "Transformation Analyst", applicants: "6 applicants", stage: "Offer Stage" },
];

export default function EnterprisePlatforms() {
  return (
    <section id="platforms" className="mkt-section bg-[var(--mkt-cloud)]">
      <div className="mkt-shell">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <SectionLabel tone="blue">Enterprise Platforms</SectionLabel>
            <h2 className="mkt-section-heading mt-4 text-[var(--mkt-navy)]">
              Software built around operational excellence.
            </h2>
          </div>
          <p className="max-w-md text-sm text-[var(--mkt-slate)]">
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
            className="ca-app-window flex flex-col justify-between p-6"
          >
            <div>
              <div className="flex items-center justify-between border-b border-[var(--mkt-border)] pb-3">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-[#d94b4b]" />
                    <span className="h-2 w-2 rounded-full bg-[#d99a1b]" />
                    <span className="h-2 w-2 rounded-full bg-[#16a36a]" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-[0.1em] text-[var(--mkt-navy)]">
                    CRM Workspace
                  </span>
                </div>
                <span className="rounded-full bg-[var(--mkt-ice)] px-2 py-0.5 text-[0.65rem] font-semibold text-[var(--mkt-blue)]">
                  Platform preview
                </span>
              </div>

              {/* CRM Navigation Tabs */}
              <div className="mt-4 flex items-center gap-1 text-[0.72rem] font-medium text-[var(--mkt-slate)]">
                <span className="rounded-md bg-[var(--mkt-navy)] px-2.5 py-1 font-bold text-white">
                  Overview
                </span>
                <span className="px-2 py-1">Accounts</span>
                <span className="px-2 py-1">Opportunities</span>
                <span className="px-2 py-1">Service</span>
              </div>

              {/* Pipeline Stages Visual */}
              <div className="mt-4 rounded-xl border border-[var(--mkt-border)] bg-[var(--mkt-cloud)] p-3.5">
                <p className="text-[0.68rem] font-bold uppercase tracking-[0.1em] text-[var(--mkt-dim)]">
                  Pipeline Distribution
                </p>
                <div className="mt-2.5 space-y-2">
                  <div>
                    <div className="flex justify-between text-[0.72rem] text-[var(--mkt-slate)]">
                      <span>Discovery</span>
                      <span className="font-semibold text-[var(--mkt-navy)]">Stage 1</span>
                    </div>
                    <div className="mt-1 h-1.5 w-full rounded-full bg-[var(--mkt-border)]">
                      <div className="h-1.5 rounded-full bg-[var(--mkt-blue)]" style={{ width: "70%" }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-[0.72rem] text-[var(--mkt-slate)]">
                      <span>Proposal &amp; SOW</span>
                      <span className="font-semibold text-[var(--mkt-navy)]">Stage 2</span>
                    </div>
                    <div className="mt-1 h-1.5 w-full rounded-full bg-[var(--mkt-border)]">
                      <div className="h-1.5 rounded-full bg-[#31a8ff]" style={{ width: "50%" }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-[0.72rem] text-[var(--mkt-slate)]">
                      <span>Executive Review</span>
                      <span className="font-semibold text-[var(--mkt-navy)]">Stage 3</span>
                    </div>
                    <div className="mt-1 h-1.5 w-full rounded-full bg-[var(--mkt-border)]">
                      <div className="h-1.5 rounded-full bg-[#16a36a]" style={{ width: "85%" }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Core capabilities list */}
              <div className="mt-4 space-y-1.5 text-xs text-[var(--mkt-navy)] font-medium">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[var(--mkt-blue)]" />
                  <span>Customer 360 Intelligence</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[var(--mkt-blue)]" />
                  <span>Opportunity Stage Governance</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[var(--mkt-blue)]" />
                  <span>Account Expansion Analytics</span>
                </div>
              </div>
            </div>

            <div className="mt-6 border-t border-[var(--mkt-border)] pt-4">
              <Link href="/platforms/crm" className="ca-link text-xs font-semibold">
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
            className="ca-app-window flex flex-col justify-between p-6"
          >
            <div>
              <div className="flex items-center justify-between border-b border-[var(--mkt-border)] pb-3">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-[#d94b4b]" />
                    <span className="h-2 w-2 rounded-full bg-[#d99a1b]" />
                    <span className="h-2 w-2 rounded-full bg-[#16a36a]" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-[0.1em] text-[var(--mkt-navy)]">
                    ATS &amp; Talent Platform
                  </span>
                </div>
                <span className="rounded-full bg-[var(--mkt-ice)] px-2 py-0.5 text-[0.65rem] font-semibold text-[var(--mkt-blue)]">
                  Recruiting engine
                </span>
              </div>

              {/* End-to-End Pipeline Stepper */}
              <div className="mt-4 flex items-center justify-between rounded-lg bg-[var(--mkt-cloud)] p-2 text-[0.65rem] font-bold text-[var(--mkt-slate)]">
                <span className="text-[var(--mkt-navy)]">Applied</span>
                <span>→</span>
                <span className="text-[var(--mkt-blue)]">Screen</span>
                <span>→</span>
                <span className="text-[var(--mkt-blue)]">Interview</span>
                <span>→</span>
                <span className="text-[var(--mkt-success)]">Offer</span>
              </div>

              {/* Sanitized Requisition Queue */}
              <div className="mt-3.5 space-y-2">
                {ATS_REQS.map((req) => (
                  <div
                    key={req.role}
                    className="rounded-lg border border-[var(--mkt-border)] bg-white p-2.5 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-[var(--mkt-navy)]">{req.role}</span>
                      <span className="rounded-md bg-[var(--mkt-ice)] px-1.5 py-0.5 text-[0.65rem] font-semibold text-[var(--mkt-blue)]">
                        {req.stage}
                      </span>
                    </div>
                    <p className="mt-1 text-[0.68rem] text-[var(--mkt-slate)]">{req.applicants}</p>
                  </div>
                ))}
              </div>

              {/* Connected Lifecycle Callout */}
              <div className="mt-3.5 rounded-lg border border-[#31a8ff]/30 bg-[#eaf1f8] p-2.5 text-xs text-[var(--mkt-navy)]">
                <p className="font-semibold text-[var(--mkt-blue)]">Connected Loop:</p>
                <p className="mt-0.5 text-[0.68rem] text-[var(--mkt-slate)]">
                  Requisition → Careers → Screening → Interview → Offer → Employee Onboarding
                </p>
              </div>
            </div>

            <div className="mt-6 border-t border-[var(--mkt-border)] pt-4">
              <Link href="/platforms/ats" className="ca-link text-xs font-semibold">
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
            className="ca-app-window flex flex-col justify-between p-6"
          >
            <div>
              <div className="flex items-center justify-between border-b border-[var(--mkt-border)] pb-3">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-[#d94b4b]" />
                    <span className="h-2 w-2 rounded-full bg-[#d99a1b]" />
                    <span className="h-2 w-2 rounded-full bg-[#16a36a]" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-[0.1em] text-[var(--mkt-navy)]">
                    Core HR &amp; Workforce
                  </span>
                </div>
                <span className="rounded-full bg-[var(--mkt-ice)] px-2 py-0.5 text-[0.65rem] font-semibold text-[var(--mkt-blue)]">
                  Operations &amp; Pay
                </span>
              </div>

              <div className="mt-4 space-y-2.5">
                <div className="rounded-xl border border-[var(--mkt-border)] bg-white p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[var(--mkt-navy)]">Employee Self-Service</span>
                    <span className="text-[0.65rem] font-semibold text-[var(--mkt-blue)]">Portal</span>
                  </div>
                  <p className="mt-1 text-[0.68rem] text-[var(--mkt-slate)]">
                    Profile management, onboarding verification, and document vault.
                  </p>
                </div>

                <div className="rounded-xl border border-[var(--mkt-border)] bg-white p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[var(--mkt-navy)]">Time &amp; Leave System</span>
                    <span className="text-[0.65rem] font-semibold text-[var(--mkt-blue)]">Workforce</span>
                  </div>
                  <p className="mt-1 text-[0.68rem] text-[var(--mkt-slate)]">
                    Timesheet submissions, manager sign-offs, and PTO balance accruals.
                  </p>
                </div>

                <div className="rounded-xl border border-[var(--mkt-border)] bg-white p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[var(--mkt-navy)]">Enterprise Payroll</span>
                    <span className="text-[0.65rem] font-semibold text-[var(--mkt-success)]">GL Connected</span>
                  </div>
                  <p className="mt-1 text-[0.68rem] text-[var(--mkt-slate)]">
                    Pay runs, earnings calculations, tax reporting, and direct deposits.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 border-t border-[var(--mkt-border)] pt-4">
              <Link href="/platforms/payroll" className="ca-link text-xs font-semibold">
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
