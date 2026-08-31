"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, CheckCircle2 } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

import SectionLabel from "@/components/marketing/SectionLabel";

const capabilities = [
  {
    name: "FINANCE",
    detail: "General Ledger, AP/AR, Subledger Accounting & multi-entity consolidation.",
    href: "/oracle",
  },
  {
    name: "PROCUREMENT",
    detail: "Source-to-Pay automation, contract obligations & supplier qualifications.",
    href: "/oracle",
  },
  {
    name: "SUPPLY CHAIN",
    detail: "Inventory control, order management, demand forecasting & warehouse flows.",
    href: "/oracle",
  },
  {
    name: "PROJECTS",
    detail: "PPM project costing, billing milestones, capital assets & revenue recognition.",
    href: "/oracle",
  },
  {
    name: "INTEGRATION & DATA",
    detail: "Oracle Integration Cloud (OIC), high-throughput event buses & FDI analytics.",
    href: "/oracle",
  },
  {
    name: "DELIVERY",
    detail: "End-to-end PMO governance, automated regression testing & zero-downtime cutovers.",
    href: "/oracle",
  },
];

export default function OracleFlagship() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="oracle-practice" className="bg-[#F7F9FA] text-[#102033] py-20 sm:py-24 lg:py-28 border-b border-[#DDE4E8]">
      <div className="ca-shell">
        <SectionLabel tone="burgundy">ORACLE CLOUD TRANSFORMATION</SectionLabel>

        {/* 45% Image / 55% Content Layout (Section 17 Requirement) */}
        <div className="mt-8 grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-start lg:gap-14">
          {/* Left Column (45%): Large Architecture / Enterprise Operations Image */}
          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 space-y-6"
          >
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-lg border border-[#DDE4E8] bg-white shadow-sm">
              <Image
                src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1000&q=85"
                alt="Modern enterprise architecture and corporate financial operations"
                fill
                className="object-cover mkt-img-graded"
                sizes="(max-width: 1024px) 100vw, 42vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#102033]/60 via-transparent to-transparent" />
              
              <div className="absolute bottom-5 left-5 right-5 rounded-lg border border-white/20 bg-white/95 p-4 backdrop-blur-md shadow-md text-xs">
                <p className="font-bold text-[#102033]">Enterprise Architecture &amp; Delivery</p>
                <p className="text-[0.68rem] text-[#526170] mt-0.5">Fusion ERP · SCM · HCM · EPM · OIC</p>
              </div>
            </div>
          </motion.div>

          {/* Right Column (55%): Headline, Copy, Text Rows with Thin Dividers */}
          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="lg:col-span-7 space-y-6"
          >
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-[-0.03em] text-[#102033] leading-[1.08]">
              Modernize the digital core.
            </h2>

            <p className="text-base sm:text-lg leading-relaxed text-[#526170]">
              Connect Oracle applications, processes, data and integrations around the way the enterprise actually operates.
            </p>

            {/* Large Capability Text Rows with Thin Dividers */}
            <div className="mt-8 divide-y divide-[#DDE4E8] border-y border-[#DDE4E8]">
              {capabilities.map((cap) => (
                <div
                  key={cap.name}
                  className="group py-4 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 hover:bg-white/60 transition-colors px-2 -mx-2 rounded"
                >
                  <div className="sm:w-1/3">
                    <span className="text-xs font-bold uppercase tracking-[0.14em] text-[#102033] group-hover:text-[#B63A3A] transition-colors">
                      {cap.name}
                    </span>
                  </div>
                  <div className="sm:w-7/12">
                    <p className="text-xs sm:text-sm text-[#526170]">
                      {cap.detail}
                    </p>
                  </div>
                  <div className="sm:w-1/12 flex sm:justify-end">
                    <Link
                      href={cap.href}
                      aria-label={`Explore ${cap.name}`}
                      className="text-[#526170] group-hover:text-[#B63A3A] transition-colors"
                    >
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <Link
                href="/oracle"
                className="ca-button-primary inline-flex items-center gap-2 !min-h-[48px] !px-7 text-sm font-semibold rounded-lg cursor-pointer"
              >
                <span>Explore Oracle Transformation</span>
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>
        </div>

        {/* One Controlled Dark Moment (Section 18 Requirement) */}
        <div className="mt-16 relative overflow-hidden rounded-xl border border-[#1E3752] shadow-xl">
          <div
            className="relative p-8 sm:p-12 text-white"
            style={{
              background: `linear-gradient(90deg, rgba(12,34,51,0.96) 0%, rgba(12,34,51,0.85) 60%, rgba(12,34,51,0.72) 100%), url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1600&q=80')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="max-w-3xl space-y-4">
              <span className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#B63A3A]">
                CUTOVER &amp; PRODUCTION GOVERNANCE
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-white">
                De-risking large-scale multi-entity go-lives.
              </h3>
              <p className="text-sm sm:text-base text-[#DDE4E8] leading-relaxed">
                Our practitioners combine financial subledger reconciliation, automated testing frameworks, and OIC event orchestration to guarantee clean period close and audited compliance on day one.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
