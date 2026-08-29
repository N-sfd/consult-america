"use client";

import Link from "next/link";
import { ArrowUpRight, TrendingUp, Users, DollarSign, Briefcase, Check, ShieldCheck, Activity } from "lucide-react";
import { motion } from "framer-motion";

import SectionLabel from "@/components/marketing/SectionLabel";

const RECENT_ACCOUNTS = [
  { name: "Acme Corp", stage: "Enterprise", value: "$1.4M", status: "Active" },
  { name: "Orion Health", stage: "Expansion", value: "$850k", status: "Review" },
  { name: "Meridian Gov", stage: "Renewal", value: "$2.1M", status: "Closing" },
];

const ATS_CANDIDATES = [
  { role: "Senior Oracle Lead", candidate: "Elena Rostova", step: "Technical Interview", match: "96%" },
  { role: "Data Engineer (AI)", candidate: "Marcus Vance", step: "Offer Extended", match: "94%" },
  { role: "Transformation Analyst", candidate: "Priya Sharma", step: "Hired → Onboarding", match: "98%" },
];

export default function EnterprisePlatforms() {
  return (
    <section id="platforms" className="mkt-section bg-[var(--mkt-white)]">
      <div className="mkt-shell">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <SectionLabel tone="blue">Enterprise Platforms</SectionLabel>
            <h2 className="mkt-section-heading mt-4 text-[var(--mkt-navy)]">
              Technology built around how organizations operate.
            </h2>
          </div>
          <p className="max-w-md text-sm text-[var(--mkt-slate)]">
            A cohesive suite bridging strategic consulting, CRM client intelligence,
            enterprise technology, and full lifecycle workforce management.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* 1. CRM Workspace Card */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="ca-app-window flex flex-col justify-between border border-[var(--mkt-border)] bg-[var(--mkt-white)] p-6 transition-all hover:shadow-[0_20px_48px_rgba(8,26,47,0.08)]"
          >
            <div>
              {/* Window Bar */}
              <div className="flex items-center justify-between border-b border-[var(--mkt-border)] pb-3">
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#d94b4b]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#d99a1b]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#16a36a]" />
                  <span className="ml-2 text-xs font-semibold uppercase tracking-[0.1em] text-[var(--mkt-navy)]">
                    CRM Workspace
                  </span>
                </div>
                <span className="rounded-full bg-[var(--mkt-cloud)] px-2 py-0.5 text-[0.65rem] font-semibold text-[var(--mkt-blue)]">
                  Customer 360
                </span>
              </div>

              {/* CRM Metrics Strip */}
              <div className="mt-4 grid grid-cols-3 gap-2 rounded-xl bg-[var(--mkt-ice)] p-3 text-center">
                <div>
                  <p className="text-[0.65rem] font-medium text-[var(--mkt-dim)] uppercase">Pipeline</p>
                  <p className="text-sm font-bold text-[var(--mkt-navy)]">$4.8M</p>
                </div>
                <div>
                  <p className="text-[0.65rem] font-medium text-[var(--mkt-dim)] uppercase">Accounts</p>
                  <p className="text-sm font-bold text-[var(--mkt-navy)]">126</p>
                </div>
                <div>
                  <p className="text-[0.65rem] font-medium text-[var(--mkt-dim)] uppercase">Growth</p>
                  <p className="text-sm font-bold text-[var(--mkt-success)]">+18%</p>
                </div>
              </div>

              {/* Opportunity Pipeline Chart Visual */}
              <div className="mt-4 rounded-xl border border-[var(--mkt-border)] bg-[var(--mkt-ice-soft)] p-3.5">
                <div className="flex items-center justify-between text-xs font-semibold text-[var(--mkt-navy)]">
                  <span className="flex items-center gap-1.5">
                    <TrendingUp className="h-3.5 w-3.5 text-[var(--mkt-blue)]" />
                    Quarterly Opportunity Stages
                  </span>
                  <span className="text-[0.68rem] text-[var(--mkt-dim)]">Q3 Goal: 92%</span>
                </div>
                <div className="mt-2.5 space-y-1.5">
                  <div>
                    <div className="flex justify-between text-[0.68rem] text-[var(--mkt-slate)]">
                      <span>Enterprise Proposals</span>
                      <span className="font-semibold text-[var(--mkt-navy)]">$2.4M</span>
                    </div>
                    <div className="mt-0.5 h-1.5 w-full rounded-full bg-[var(--mkt-border)]">
                      <div className="h-1.5 rounded-full bg-[var(--mkt-blue)]" style={{ width: "75%" }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-[0.68rem] text-[var(--mkt-slate)]">
                      <span>Expansion Accounts</span>
                      <span className="font-semibold text-[var(--mkt-navy)]">$1.6M</span>
                    </div>
                    <div className="mt-0.5 h-1.5 w-full rounded-full bg-[var(--mkt-border)]">
                      <div className="h-1.5 rounded-full bg-[#2ea7ff]" style={{ width: "55%" }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Accounts List */}
              <div className="mt-4">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.1em] text-[var(--mkt-dim)]">
                  Active Accounts
                </p>
                <div className="mt-2 divide-y divide-[var(--mkt-border)]">
                  {RECENT_ACCOUNTS.map((acc) => (
                    <div key={acc.name} className="flex items-center justify-between py-1.5 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-[var(--mkt-blue)]" />
                        <span className="font-medium text-[var(--mkt-navy)]">{acc.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[0.68rem] text-[var(--mkt-slate)]">{acc.stage}</span>
                        <span className="font-semibold text-[var(--mkt-navy)]">{acc.value}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 border-t border-[var(--mkt-border)] pt-4">
              <Link href="/capabilities/enterprise-transformation" className="ca-link text-sm font-semibold">
                Explore CRM Platform
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>

          {/* 2. Enterprise Tech Card */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="ca-app-window flex flex-col justify-between border border-[var(--mkt-border)] bg-[var(--mkt-white)] p-6 transition-all hover:shadow-[0_20px_48px_rgba(8,26,47,0.08)]"
          >
            <div>
              <div className="flex items-center justify-between border-b border-[var(--mkt-border)] pb-3">
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#d94b4b]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#d99a1b]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#16a36a]" />
                  <span className="ml-2 text-xs font-semibold uppercase tracking-[0.1em] text-[var(--mkt-navy)]">
                    Enterprise Tech Stack
                  </span>
                </div>
                <span className="rounded-full bg-[var(--mkt-cloud)] px-2 py-0.5 text-[0.65rem] font-semibold text-[var(--mkt-blue)]">
                  Cloud &amp; AI Core
                </span>
              </div>

              <div className="mt-4 space-y-2.5">
                <div className="rounded-xl border border-[var(--mkt-border)] bg-[var(--mkt-ice)] p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[var(--mkt-navy)]">Oracle Cloud Fusion</span>
                    <span className="text-[0.65rem] font-semibold text-[var(--mkt-blue)]">ERP · SCM · HCM</span>
                  </div>
                  <p className="mt-1 text-[0.68rem] text-[var(--mkt-slate)]">
                    Unified ledger, supply chain orchestration, and multi-entity workforce.
                  </p>
                </div>

                <div className="rounded-xl border border-[var(--mkt-border)] bg-[var(--mkt-cloud)] p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[var(--mkt-navy)]">Data Agent &amp; AI Engine</span>
                    <span className="text-[0.65rem] font-semibold text-[var(--mkt-success)]">Production Ready</span>
                  </div>
                  <p className="mt-1 text-[0.68rem] text-[var(--mkt-slate)]">
                    Deterministic parsing, Gemini embeddings, and verified citation audits.
                  </p>
                </div>

                <div className="rounded-xl border border-[var(--mkt-border)] bg-[var(--mkt-ice)] p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[var(--mkt-navy)]">API &amp; Integration Hub</span>
                    <span className="text-[0.65rem] font-semibold text-[var(--mkt-dim)]">REST · n8n</span>
                  </div>
                  <p className="mt-1 text-[0.68rem] text-[var(--mkt-slate)]">
                    Zero-trust secure conduits connecting legacy systems to cloud microservices.
                  </p>
                </div>
              </div>

              <div className="mt-4 rounded-lg border border-[var(--mkt-border)] bg-[var(--mkt-ice-soft)] p-3 text-xs text-[var(--mkt-slate)]">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-[var(--mkt-success)]" />
                  <span className="font-semibold text-[var(--mkt-navy)]">Enterprise Governance:</span>
                  <span>SOC2 · Role-based Access</span>
                </div>
              </div>
            </div>

            <div className="mt-6 border-t border-[var(--mkt-border)] pt-4">
              <Link href="/oracle" className="ca-link text-sm font-semibold">
                Explore Enterprise Tech
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>

          {/* 3. ATS + Talent Intelligence Card */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.16 }}
            className="ca-app-window flex flex-col justify-between border border-[var(--mkt-border)] bg-[var(--mkt-white)] p-6 transition-all hover:shadow-[0_20px_48px_rgba(8,26,47,0.08)]"
          >
            <div>
              <div className="flex items-center justify-between border-b border-[var(--mkt-border)] pb-3">
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#d94b4b]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#d99a1b]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#16a36a]" />
                  <span className="ml-2 text-xs font-semibold uppercase tracking-[0.1em] text-[var(--mkt-navy)]">
                    ATS &amp; Talent Platform
                  </span>
                </div>
                <span className="rounded-full bg-[var(--mkt-cloud)] px-2 py-0.5 text-[0.65rem] font-semibold text-[var(--mkt-blue)]">
                  Requisition → Hire
                </span>
              </div>

              {/* ATS Pipeline Stepper */}
              <div className="mt-4 flex items-center justify-between rounded-xl bg-[var(--mkt-ice)] p-2.5 text-[0.65rem] font-semibold text-[var(--mkt-slate)]">
                <span className="text-[var(--mkt-navy)] font-bold">1. Requisition</span>
                <span>→</span>
                <span className="text-[var(--mkt-blue)] font-bold">2. Interview</span>
                <span>→</span>
                <span>3. Offer</span>
                <span>→</span>
                <span className="text-[var(--mkt-success)] font-bold">4. Hire</span>
              </div>

              {/* Active Pipeline Candidates */}
              <div className="mt-3.5 space-y-2">
                {ATS_CANDIDATES.map((cand) => (
                  <div
                    key={cand.candidate}
                    className="rounded-lg border border-[var(--mkt-border)] bg-[var(--mkt-ice-soft)] p-2.5 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-[var(--mkt-navy)]">{cand.candidate}</span>
                      <span className="rounded-full bg-[var(--mkt-cloud)] px-1.5 py-0.5 text-[0.62rem] font-bold text-[var(--mkt-blue)]">
                        {cand.match} Match
                      </span>
                    </div>
                    <div className="mt-1 flex items-center justify-between text-[0.68rem] text-[var(--mkt-slate)]">
                      <span>{cand.role}</span>
                      <span className="font-medium text-[var(--mkt-navy)]">{cand.step}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-3.5 flex items-center justify-between text-xs text-[var(--mkt-slate)]">
                <span>Active Requisitions: <strong className="text-[var(--mkt-navy)]">6 live</strong></span>
                <span>Hire Rate: <strong className="text-[var(--mkt-success)]">94.2%</strong></span>
              </div>
            </div>

            <div className="mt-6 border-t border-[var(--mkt-border)] pt-4">
              <Link href="/jobs" className="ca-link text-sm font-semibold">
                Explore Talent Platform
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
