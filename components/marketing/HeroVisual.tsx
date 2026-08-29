"use client";

import { useState } from "react";
import { Users, UserCheck, FolderGit2, Briefcase, BarChart3, Database, Cpu, ShieldCheck, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const DOMAINS = [
  {
    id: "crm",
    label: "CRM",
    icon: Users,
    header: "Customer Operations",
    metric1: "Active Pipelines",
    val1: "Multi-Tier",
    metric2: "Account Intelligence",
    val2: "Customer 360",
    status: "Connected to Enterprise Core",
  },
  {
    id: "ats",
    label: "ATS & Talent",
    icon: UserCheck,
    header: "Talent Acquisition Pipeline",
    metric1: "Hiring Workflow",
    val1: "Requisition → Hire",
    metric2: "Candidate Review",
    val2: "Screening Loops",
    status: "Integrated with Core HR",
  },
  {
    id: "hr",
    label: "Core HR",
    icon: FolderGit2,
    header: "Workforce & Compliance",
    metric1: "Employee Records",
    val1: "Unified Ledger",
    metric2: "Document Vault",
    val2: "Verified E-Sign",
    status: "SOC2 & RBAC Governed",
  },
  {
    id: "workforce",
    label: "Workforce",
    icon: Briefcase,
    header: "Time, Leave & Payroll",
    metric1: "Time Tracking",
    val1: "Weekly Approvals",
    metric2: "Payroll Engine",
    val2: "Automated Runs",
    status: "Direct GL Integration",
  },
  {
    id: "analytics",
    label: "Analytics",
    icon: BarChart3,
    header: "Executive Intelligence",
    metric1: "Cross-Domain Data",
    val1: "Real-Time",
    metric2: "Audit Trails",
    val2: "Production-Grade",
    status: "Oracle Fusion + AI Agent Core",
  },
];

export default function HeroVisual({ className }: { className?: string }) {
  const [activeTab, setActiveTab] = useState("crm");
  const current = DOMAINS.find((d) => d.id === activeTab) ?? DOMAINS[0];

  return (
    <div
      className={`ca-app-window-dark relative flex flex-col overflow-hidden bg-[#071a2b] border border-white/15 p-4 sm:p-6 shadow-[0_24px_60px_rgba(0,0,0,0.5)] ${
        className ?? ""
      }`}
    >
      {/* Top Application Bar with Traffic Lights */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3.5">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[#d94b4b]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#d99a1b]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#16a36a]" />
          <span className="ml-2 text-[0.72rem] font-bold uppercase tracking-[0.14em] text-white/90">
            ConsultAmerica Enterprise Platform
          </span>
        </div>
        <span className="rounded-full bg-[#2563eb]/30 px-2.5 py-0.5 text-[0.65rem] font-semibold text-[#31a8ff]">
          Production Environment
        </span>
      </div>

      {/* Platform Domain Tabs */}
      <div className="mt-3.5 flex flex-wrap items-center gap-1.5 border-b border-white/10 pb-3">
        {DOMAINS.map((domain) => {
          const Icon = domain.icon;
          const isActive = activeTab === domain.id;
          return (
            <button
              key={domain.id}
              type="button"
              onClick={() => setActiveTab(domain.id)}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                isActive
                  ? "bg-[#2563eb] text-white shadow-[0_0_12px_rgba(37,99,235,0.5)]"
                  : "bg-white/[0.05] text-white/70 hover:bg-white/[0.1] hover:text-white"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{domain.label}</span>
            </button>
          );
        })}
      </div>

      {/* Active Domain Workspace View */}
      <div className="mt-4 rounded-xl border border-white/12 bg-[#0b2844] p-4 sm:p-5">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[0.65rem] font-bold uppercase tracking-[0.12em] text-[#31a8ff]">
                  Domain Workspace
                </span>
                <h4 className="mt-0.5 text-base font-semibold text-white sm:text-lg">
                  {current.header}
                </h4>
              </div>
              <span className="rounded-md bg-white/[0.07] px-2 py-1 text-[0.68rem] text-white/80">
                Active Node
              </span>
            </div>

            {/* 2-Column Capability Metrics */}
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-white/10 bg-white/[0.04] p-3">
                <p className="text-[0.68rem] text-white/60 uppercase tracking-[0.08em] font-medium">
                  {current.metric1}
                </p>
                <p className="mt-1 text-sm font-bold text-white sm:text-base">
                  {current.val1}
                </p>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/[0.04] p-3">
                <p className="text-[0.68rem] text-white/60 uppercase tracking-[0.08em] font-medium">
                  {current.metric2}
                </p>
                <p className="mt-1 text-sm font-bold text-white sm:text-base">
                  {current.val2}
                </p>
              </div>
            </div>

            {/* Underlying Architecture Connector */}
            <div className="mt-4 flex items-center justify-between rounded-lg border border-[#31a8ff]/30 bg-[#071a2b] px-3.5 py-2.5 text-xs text-white/90">
              <div className="flex items-center gap-2">
                <Cpu className="h-4 w-4 text-[#31a8ff]" />
                <span className="font-semibold text-[#31a8ff]">Core Backbone:</span>
                <span className="text-white/75">{current.status}</span>
              </div>
              <ShieldCheck className="h-4 w-4 text-[#16a36a]" />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Enterprise Platform Core Footer Strip */}
      <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3 text-[0.72rem] text-white/60">
        <span>Oracle Cloud · AI &amp; Data · Integration Hub</span>
        <span className="font-semibold text-[#31a8ff]">Unified Platform</span>
      </div>
    </div>
  );
}
