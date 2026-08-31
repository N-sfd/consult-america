"use client";

import Link from "next/link";
import { ArrowDown, ArrowUpRight, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

import SectionLabel from "@/components/marketing/SectionLabel";

const ecosystemTiers = [
  {
    layer: "01. CUSTOMER",
    title: "CRM Workspace",
    href: "/platforms/crm",
    summary: "Account intelligence, opportunity tracking, deal staging, and customer service governance.",
    tags: ["Customer 360", "Opportunities", "Pipeline", "Service Cases"],
  },
  {
    layer: "02. TALENT",
    title: "ATS & Talent Platform",
    href: "/platforms/ats",
    summary: "Job requisitions, public job board synchronization, interview scorecards, and offer approvals.",
    tags: ["Requisitions", "Candidate Pipeline", "Interview Loops", "Offer Letters"],
  },
  {
    layer: "03. PEOPLE",
    title: "Core HR & Employee Self-Service",
    href: "/platforms/hr",
    summary: "Single source of truth for employee records, digital onboarding checklists, and SOC2 document vault.",
    tags: ["Employee Records", "Digital Onboarding", "Document Vault", "Profile Updates"],
  },
  {
    layer: "04. WORKFORCE",
    title: "Time, Leave & Enterprise Payroll",
    href: "/platforms/workforce",
    summary: "Weekly timesheets, manager approval workflows, PTO balance calculation, and Oracle GL integration.",
    tags: ["Timesheets", "PTO Accruals", "Payroll Calculation", "General Ledger Export"],
  },
];

export default function PlatformsEcosystem() {
  return (
    <section id="enterprise-platforms" className="mkt-section bg-[#F4EFE6] text-[#261F1B]">
      <div className="mkt-shell">
        <SectionLabel tone="burgundy">Unified Platform Suite</SectionLabel>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-end lg:gap-12">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="lg:col-span-7"
          >
            <h2 className="text-3xl font-bold tracking-[-0.03em] text-[#261F1B] sm:text-4xl lg:text-5xl">
              Connected software for customer and workforce operations.
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
              Eliminate disconnected spreadsheets and fragmented vendor tools with
              a single integrated software fabric spanning revenue, recruiting, HR,
              and payroll.
            </p>
          </motion.div>
        </div>

        {/* Cohesive Ecosystem Architecture Flow */}
        <div className="mt-14 space-y-4">
          {ecosystemTiers.map((tier, idx) => (
            <motion.div
              key={tier.layer}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
            >
              <div className="rounded-2xl border border-[#D7CCBD] bg-[#FFFDF8] p-6 sm:p-8 shadow-[0_8px_24px_rgba(38,31,27,0.04)] transition-all hover:border-[#7D2639]/40 hover:shadow-md">
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-center">
                  <div className="lg:col-span-4">
                    <span className="text-xs font-bold uppercase tracking-[0.14em] text-[#7D2639]">
                      {tier.layer}
                    </span>
                    <h3 className="mt-1.5 text-xl font-bold text-[#261F1B] sm:text-2xl">
                      {tier.title}
                    </h3>
                  </div>

                  <div className="lg:col-span-5">
                    <p className="text-sm leading-relaxed text-[#695F57]">
                      {tier.summary}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {tier.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-md border border-[#D7CCBD] bg-[#FFFAF2] px-2.5 py-0.5 text-xs font-semibold text-[#261F1B]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="lg:col-span-3 flex lg:justify-end">
                    <Link
                      href={tier.href}
                      className="inline-flex items-center gap-1.5 text-sm font-bold text-[#7D2639] hover:text-[#681F30]"
                    >
                      <span>Explore Component</span>
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>

              {idx < ecosystemTiers.length - 1 && (
                <div className="flex justify-center py-1">
                  <ArrowDown className="h-4 w-4 text-[#7D2639]" />
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Global Architecture Summary Strip */}
        <div className="mt-10 rounded-xl border border-[#D7CCBD] bg-[#DFE4DA] p-5 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#261F1B]">
            Automated Flow: Requisition → Candidate → Employee → Timesheet → General Ledger
          </p>
        </div>
      </div>
    </section>
  );
}
