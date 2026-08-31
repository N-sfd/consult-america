"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Building2, Landmark, Stethoscope, Cpu, ShoppingBag, Briefcase, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

import SectionLabel from "@/components/marketing/SectionLabel";

const industries = [
  {
    id: "government",
    name: "Government & Public Sector",
    icon: Landmark,
    description: "Modernizing state and federal operations, grant disbursement, FAR/DFARS compliance, and public civilian workflows.",
    focusAreas: ["Federal & State ERP Modernization", "Grant Accounting & PPM", "DFARS / NIST Cybersecurity", "Citizen Self-Service Portals"],
    href: "/industries/public-sector",
    stat: "100% FedRAMP & FISMA Alignment",
  },
  {
    id: "finance",
    name: "Financial Services",
    icon: Building2,
    description: "Accelerating month-end close, consolidating international ledgers, and uniting banking CRM with transactional back-ends.",
    focusAreas: ["Multi-Entity Fusion Financials", "Real-time Subledger Accounting", "Unified Banking & Wealth CRM", "SOX & Regulatory Audit Trails"],
    href: "/industries/financial-services",
    stat: "75% Period-Close Compression",
  },
  {
    id: "healthcare",
    name: "Healthcare & Life Sciences",
    icon: Stethoscope,
    description: "Clinical documentation intelligence, patient record pipelines, and secure provider collaboration workspaces.",
    focusAreas: ["MediGuide Clinical Summaries", "HIPAA-Compliant AI Pipelines", "Provider Scheduling & ATS", "Medical Supply Chain Optimization"],
    href: "/industries/healthcare",
    stat: "88% Faster Chart Review",
  },
  {
    id: "technology",
    name: "Technology & Software",
    icon: Cpu,
    description: "Full-stack digital engineering, API platform ecosystems, modern data architecture, and AI scale.",
    focusAreas: ["Microservices & Cloud Native", "API Gateway & OIC Integration", "AI Agent System Architecture", "Continuous Delivery Governance"],
    href: "/industries/technology",
    stat: "Sub-Second Event Delivery",
  },
  {
    id: "retail",
    name: "Retail & Commerce",
    icon: ShoppingBag,
    description: "Omnichannel inventory synchronization, supplier procurement portals, and customer lifetime value intelligence.",
    focusAreas: ["Oracle SCM & Demand Forecasting", "Source-to-Pay Automation", "Customer 360 Loyalty CRM", "Dynamic Pricing & Catalogs"],
    href: "/platforms/crm",
    stat: "Real-time Inventory Visibility",
  },
  {
    id: "professional",
    name: "Professional Services",
    icon: Briefcase,
    description: "Project costing and billing, utilization analytics, talent recruiting pipelines, and contract lifecycle management.",
    focusAreas: ["Project Financials & Billing", "ATS & Talent Intelligence", "Timesheet & Expense Approvals", "Contract AI Extraction"],
    href: "/platforms/ats",
    stat: "Optimized Billing & Staffing",
  },
];

export default function IndustriesSection() {
  const [selectedIndustry, setSelectedIndustry] = useState(industries[0]);

  return (
    <section id="industries" className="bg-[#F4EFE6] text-[#261F1B] py-20 sm:py-24 lg:py-28 border-b border-[#D7CCBD]">
      <div className="mkt-shell">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end pb-10 border-b border-[#D7CCBD]">
          <div>
            <SectionLabel tone="burgundy">INDUSTRIES</SectionLabel>
            <h2 className="mt-3 font-serif text-3xl font-semibold tracking-tight text-[#261F1B] sm:text-4xl lg:text-5xl">
              Domain depth where operations matter most.
            </h2>
          </div>
          <p className="max-w-md text-sm sm:text-base text-[#695F57]">
            We tailor enterprise architectures to the specific regulatory, compliance, and workflow demands of each industry sector.
          </p>
        </div>

        {/* Interactive Industry Selector & Inspection Workspace */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Industry Selection List */}
          <div className="lg:col-span-5 space-y-2.5">
            {industries.map((ind) => {
              const Icon = ind.icon;
              const isSelected = selectedIndustry.id === ind.id;

              return (
                <button
                  key={ind.id}
                  type="button"
                  onClick={() => setSelectedIndustry(ind)}
                  onMouseEnter={() => setSelectedIndustry(ind)}
                  className={`w-full flex items-center justify-between rounded-xl border p-4 text-left transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? "border-[#7D2639] bg-[#FFFDF8] shadow-[0_4px_20px_rgba(38,31,27,0.06)] ring-1 ring-[#7D2639]/30"
                      : "border-[#D7CCBD] bg-[#FFFAF2] hover:bg-[#FFFDF8]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                      isSelected ? "bg-[#7D2639] text-white" : "bg-[#F4EFE6] text-[#695F57]"
                    }`}>
                      <Icon className="h-4.5 w-4.5" />
                    </div>
                    <span className="text-sm font-bold text-[#261F1B]">
                      {ind.name}
                    </span>
                  </div>
                  <ArrowUpRight className={`h-4 w-4 transition-transform ${
                    isSelected ? "text-[#7D2639] opacity-100" : "text-[#695F57] opacity-0 group-hover:opacity-100"
                  }`} />
                </button>
              );
            })}
          </div>

          {/* Inspection Showcase Card */}
          <motion.div
            key={selectedIndustry.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="lg:col-span-7 rounded-2xl border border-[#D7CCBD] bg-[#FFFDF8] p-7 lg:p-8 shadow-[0_16px_45px_rgba(38,31,27,0.06)]"
          >
            <div className="flex items-center justify-between border-b border-[#D7CCBD] pb-4">
              <span className="text-[0.68rem] font-bold uppercase tracking-wider text-[#7D2639]">
                INDUSTRY PRACTICE
              </span>
              <span className="rounded bg-[#DFE4DA] px-2.5 py-1 text-xs font-bold text-[#657766]">
                {selectedIndustry.stat}
              </span>
            </div>

            <h3 className="mt-5 font-serif text-2xl sm:text-3xl font-bold text-[#261F1B]">
              {selectedIndustry.name}
            </h3>

            <p className="mt-3 text-sm sm:text-base leading-relaxed text-[#695F57]">
              {selectedIndustry.description}
            </p>

            <div className="mt-6 pt-5 border-t border-[#D7CCBD]/80">
              <p className="text-xs font-bold uppercase tracking-wider text-[#261F1B]">
                Core Transformation Capabilities
              </p>
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {selectedIndustry.focusAreas.map((area) => (
                  <div
                    key={area}
                    className="flex items-center gap-2 rounded-lg border border-[#D7CCBD]/80 bg-[#FFFAF2] p-2.5 text-xs font-semibold text-[#261F1B]"
                  >
                    <CheckCircle2 className="h-4 w-4 text-[#657766] shrink-0" />
                    <span>{area}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-5 border-t border-[#D7CCBD] flex items-center justify-between">
              <Link
                href={selectedIndustry.href}
                className="group ca-button-primary inline-flex items-center gap-2 !min-h-11 !px-6 text-xs sm:text-sm font-semibold rounded-md"
              >
                <span>Explore {selectedIndustry.name}</span>
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>

              <Link
                href="/work"
                className="text-xs font-semibold text-[#695F57] hover:text-[#7D2639]"
              >
                View case studies →
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
