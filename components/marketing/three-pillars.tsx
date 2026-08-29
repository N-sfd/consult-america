"use client";

import Link from "next/link";
import { ArrowUpRight, Compass, Cpu, Layers } from "lucide-react";
import { motion } from "framer-motion";

import SectionLabel from "@/components/marketing/SectionLabel";

const PILLARS = [
  {
    icon: Compass,
    title: "Consulting",
    tagline: "Enterprise Transformation & Delivery",
    description:
      "Modernize operating models, business processes, and program governance with small, senior teams attached directly to delivery.",
    items: [
      "Enterprise Strategy & Architecture",
      "Operating Model & Org Design",
      "Program Delivery & Cutover",
      "Managed Delivery Squads",
    ],
    href: "/capabilities/enterprise-transformation",
    linkText: "Explore Consulting Practice",
  },
  {
    icon: Cpu,
    title: "Technology",
    tagline: "Oracle, AI, Data & Engineering",
    description:
      "Build, integrate, and scale mission-critical technology estates across Oracle Fusion, AI agents, cloud platforms, and cybersecurity.",
    items: [
      "Oracle Fusion Cloud (ERP · HCM · SCM · EPM)",
      "AI Agents & Document Intelligence",
      "Data Platforms & Governed Lakes",
      "API Integration Hub & Microservices",
    ],
    href: "/oracle",
    linkText: "Explore Technology Systems",
  },
  {
    icon: Layers,
    title: "Platforms",
    tagline: "CRM, ATS, HR & Workforce Software",
    description:
      "A unified enterprise application suite spanning customer lifecycle, talent acquisition, employee self-service, and workforce payroll.",
    items: [
      "CRM (Customer 360 & Opportunity Pipeline)",
      "ATS & Recruiting (Requisition to Hire)",
      "Core HR, Onboarding & Documents",
      "Workforce Time, Leave & Payroll Runs",
    ],
    href: "/platforms",
    linkText: "Explore Platform Suite",
  },
];

export default function ThreePillars() {
  return (
    <section id="pillars" className="mkt-section bg-[var(--mkt-white)]">
      <div className="mkt-shell">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <SectionLabel tone="blue">Company Architecture</SectionLabel>
            <h2 className="mkt-section-heading mt-4 text-[var(--mkt-navy)]">
              Consulting. Technology. Platforms.
            </h2>
          </div>
          <p className="max-w-md text-sm text-[var(--mkt-slate)]">
            ConsultAmerica combines senior management consulting, specialized cloud
            and AI engineering, and production-grade enterprise software platforms.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {PILLARS.map((pillar, index) => {
            const Icon = pillar.icon;
            return (
              <motion.article
                key={pillar.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="group flex flex-col justify-between rounded-2xl border border-[var(--mkt-border)] bg-[var(--mkt-cloud)] p-6 sm:p-8 transition-all duration-300 hover:border-[var(--mkt-blue)]/50 hover:bg-white hover:shadow-[0_20px_48px_rgba(7,26,43,0.08)]"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--mkt-dim)]">
                      0{index + 1} · Pillar
                    </span>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[var(--mkt-blue)] shadow-xs transition-colors group-hover:bg-[var(--mkt-blue)] group-hover:text-white">
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>

                  <h3 className="mt-5 text-2xl font-bold tracking-[-0.02em] text-[var(--mkt-navy)] group-hover:text-[var(--mkt-blue)] transition-colors">
                    {pillar.title}
                  </h3>
                  <p className="mt-1 text-xs font-semibold text-[var(--mkt-blue)]">
                    {pillar.tagline}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-[var(--mkt-slate)]">
                    {pillar.description}
                  </p>

                  <div className="mt-6 space-y-2 border-t border-[var(--mkt-border)] pt-4">
                    {pillar.items.map((item) => (
                      <div
                        key={item}
                        className="flex items-center gap-2 text-xs font-medium text-[var(--mkt-navy)]"
                      >
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--mkt-blue)]" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8 border-t border-[var(--mkt-border)] pt-4">
                  <Link href={pillar.href} className="ca-link text-xs font-semibold">
                    {pillar.linkText}
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
