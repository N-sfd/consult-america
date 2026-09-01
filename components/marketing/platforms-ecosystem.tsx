"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

import SectionLabel from "@/components/marketing/SectionLabel";

const journeyTiers = [
  {
    stage: "01. CUSTOMER",
    domain: "CRM",
    items: ["Accounts", "Pipeline", "Service Cases", "Customer 360"],
    href: "/platforms/crm",
  },
  {
    stage: "02. TALENT",
    domain: "JobLens",
    items: ["Resume Analysis", "ATS Feedback", "Job Matching", "Applications"],
    href: "/work/innovation/joblens",
  },
  {
    stage: "03. PEOPLE",
    domain: "Core HR",
    items: ["Employee Record", "Onboarding", "Documents", "Self-Service"],
    href: "/platforms/hr",
  },
  {
    stage: "04. WORKFORCE",
    domain: "Time & Operations",
    items: ["Timesheets", "Leave Approvals", "Payroll Calculation", "General Ledger"],
    href: "/platforms/workforce",
  },
];

export default function PlatformsEcosystem() {
  return (
    <section id="enterprise-platforms" className="mkt-section bg-[#F4F6F7] text-[#101828]">
      <div className="mkt-shell">
        <SectionLabel tone="burgundy">Enterprise Platforms</SectionLabel>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-end lg:gap-12">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="lg:col-span-7"
          >
            <h2 className="font-serif text-3xl font-semibold tracking-[-0.03em] text-[#101828] sm:text-4xl lg:text-5xl lg:leading-[1.12]">
              One connected operating experience.
            </h2>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.08 }}
            className="lg:col-span-5"
          >
            <p className="text-base leading-relaxed text-[#475467]">
              Connect customer, recruiting, employee and workforce processes
              without forcing users across disconnected tools.
            </p>
          </motion.div>
        </div>

        {/* One Cohesive Connected Journey Flow */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-14 rounded-xl border border-[#E2E7EC] bg-[#FFFFFF] p-8 lg:p-12 shadow-[0_12px_36px_rgba(20,30,45,0.06)]"
        >
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {journeyTiers.map((tier, idx) => (
              <div key={tier.stage} className="relative flex flex-col justify-between">
                <div className="rounded-lg border border-[#E2E7EC] bg-[#FCFCFD] p-5 shadow-2xs">
                  <span className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#B63838]">
                    {tier.stage}
                  </span>
                  <h3 className="mt-1.5 text-base font-bold text-[#101828]">
                    {tier.domain}
                  </h3>
                  <ul className="mt-3 space-y-1.5 text-xs text-[#475467]">
                    {tier.items.map((item) => (
                      <li key={item} className="flex items-center gap-1.5">
                        <span className="h-1 w-1 rounded-full bg-[#B63838]" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-4 pt-3 border-t border-[#E2E7EC]/80">
                    <Link
                      href={tier.href}
                      className="group inline-flex items-center gap-1 text-[0.72rem] font-bold text-[#B63838] hover:text-[#8F292D]"
                    >
                      <span>Explore</span>
                      <ArrowUpRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </Link>
                  </div>
                </div>

                {idx < journeyTiers.length - 1 && (
                  <div className="hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                    <span className="text-sm font-bold text-[#B63838]">→</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-8 border-t border-[#E2E7EC] pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#475467]">
            <p>
              Single source of truth: Candidate → Employee Hire → Timesheet Approval → General Ledger
            </p>
            <Link
              href="/platforms"
              className="inline-flex items-center gap-1 font-semibold text-[#B63838] hover:text-[#8F292D]"
            >
              <span>View Connected Architecture</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
