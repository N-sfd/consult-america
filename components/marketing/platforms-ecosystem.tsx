"use client";

import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "lucide-react";
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
    domain: "ATS & Recruiting",
    items: ["Requisitions", "Candidates", "Interview Loops", "Offers"],
    href: "/platforms/ats",
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
    <section id="enterprise-platforms" className="mkt-section bg-[#F4EFE6] text-[#261F1B]">
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
            <h2 className="font-serif text-3xl font-semibold tracking-[-0.03em] text-[#261F1B] sm:text-4xl lg:text-5xl lg:leading-[1.12]">
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
            <p className="text-base leading-relaxed text-[#695F57]">
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
          className="mt-14 rounded-lg border border-[#D7CCBD] bg-[#FFFDF8] p-8 lg:p-12 shadow-[0_12px_36px_rgba(38,31,27,0.05)]"
        >
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {journeyTiers.map((tier, idx) => (
              <div key={tier.stage} className="relative flex flex-col justify-between">
                <div className="rounded-md border border-[#D7CCBD] bg-[#FFFAF2] p-5">
                  <span className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#7D2639]">
                    {tier.stage}
                  </span>
                  <h3 className="mt-1.5 text-base font-bold text-[#261F1B]">
                    {tier.domain}
                  </h3>
                  <ul className="mt-3 space-y-1.5 text-xs text-[#695F57]">
                    {tier.items.map((item) => (
                      <li key={item} className="flex items-center gap-1.5">
                        <span className="h-1 w-1 rounded-full bg-[#7D2639]" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-4 pt-3 border-t border-[#D7CCBD]/60">
                    <Link
                      href={tier.href}
                      className="group inline-flex items-center gap-1 text-[0.72rem] font-bold text-[#7D2639] hover:text-[#681F30]"
                    >
                      <span>Explore</span>
                      <ArrowUpRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </Link>
                  </div>
                </div>

                {idx < journeyTiers.length - 1 && (
                  <div className="hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                    <span className="text-sm font-bold text-[#7D2639]">→</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-8 border-t border-[#D7CCBD] pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#695F57]">
            <p>
              Single source of truth: Candidate → Employee Hire → Timesheet Approval → General Ledger
            </p>
            <Link
              href="/platforms"
              className="font-semibold text-[#7D2639] hover:underline"
            >
              View Full Platform Architecture →
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
