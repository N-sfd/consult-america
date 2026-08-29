"use client";

import Link from "next/link";
import { ArrowUpRight, Compass, Users2, Cpu, UserCheck, FolderCheck, CreditCard } from "lucide-react";
import { motion } from "framer-motion";

import SectionLabel from "@/components/marketing/SectionLabel";

const PLATFORM_STEPS = [
  {
    step: "01",
    name: "Consulting",
    tagline: "Strategy · Transformation · Delivery",
    detail: "Executive alignment, target operating model design, and program management governance.",
    icon: Compass,
    href: "/capabilities/enterprise-transformation",
  },
  {
    step: "02",
    name: "CRM",
    tagline: "Customer · Sales · Service",
    detail: "Unified 360 customer intelligence, opportunity tracking, and account expansion.",
    icon: Users2,
    href: "/app/dashboard",
  },
  {
    step: "03",
    name: "Technology",
    tagline: "Oracle · Cloud · Data · AI",
    detail: "Connected Fusion architecture, autonomous AI agents, and resilient data engineering.",
    icon: Cpu,
    href: "/oracle",
  },
  {
    step: "04",
    name: "ATS",
    tagline: "Jobs · Candidates · Interviews · Offers",
    detail: "End-to-end talent acquisition with candidate scoring, interview loops, and offer conversion.",
    icon: UserCheck,
    href: "/jobs",
  },
  {
    step: "05",
    name: "HR",
    tagline: "Employees · Onboarding · Documents",
    detail: "Paperless employee onboarding, verification, document repository, and compliance.",
    icon: FolderCheck,
    href: "/employee",
  },
  {
    step: "06",
    name: "Workforce",
    tagline: "Time · Leave · Approvals · Payroll",
    detail: "Self-service time tracking, PTO balance management, manager sign-offs, and payroll runs.",
    icon: CreditCard,
    href: "/employee/time",
  },
];

export default function PlatformExperience() {
  return (
    <section id="experience" className="mkt-section bg-[var(--mkt-cloud)]">
      <div className="mkt-shell">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <SectionLabel tone="blue">From Consulting to Operations</SectionLabel>
            <h2 className="mkt-section-heading mt-4 text-[var(--mkt-navy)]">
              The unified enterprise platform lifecycle.
            </h2>
          </div>
          <p className="max-w-md text-sm text-[var(--mkt-slate)]">
            ConsultAmerica connects the entire business continuum from boardroom
            strategy down to daily operational payroll execution.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PLATFORM_STEPS.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.article
                key={item.name}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: index * 0.04 }}
                className="group flex flex-col justify-between rounded-2xl border border-[var(--mkt-border)] bg-[var(--mkt-white)] p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--mkt-blue)]/40 hover:shadow-[0_16px_40px_rgba(8,26,47,0.06)]"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--mkt-dim)]">
                      {item.step} · Platform Layer
                    </span>
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--mkt-cloud)] text-[var(--mkt-blue)] group-hover:bg-[var(--mkt-blue)] group-hover:text-white transition-colors">
                      <Icon className="h-4 w-4" />
                    </div>
                  </div>

                  <h3 className="mt-4 text-xl font-semibold text-[var(--mkt-navy)] group-hover:text-[var(--mkt-blue)] transition-colors">
                    {item.name}
                  </h3>
                  <p className="mt-1 text-xs font-semibold text-[var(--mkt-blue)]">
                    {item.tagline}
                  </p>
                  <p className="mt-2.5 text-xs leading-5.5 text-[var(--mkt-slate)]">
                    {item.detail}
                  </p>
                </div>

                <div className="mt-6 border-t border-[var(--mkt-border)] pt-4">
                  <Link href={item.href} className="ca-link text-xs font-semibold">
                    Explore {item.name}
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
