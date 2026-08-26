"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

import Container from "@/components/layout/container";
import Section from "@/components/layout/section";
import SectionLabel from "@/components/shared/section-label";

const oracleAreas = [
  "Oracle Fusion Cloud",
  "Financials",
  "Procurement & SCM",
  "HCM",
  "EPM",
  "Projects & PPM",
  "OIC & Integration",
  "Analytics",
];

const lifecycle = [
  "Discover",
  "Design",
  "Implement",
  "Integrate",
  "Test",
  "Adopt",
  "Operate",
];

export default function OracleFeature() {
  return (
    <Section
      id="oracle"
      className="relative overflow-hidden bg-[#071A2F] text-white"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
          backgroundSize: "72px 72px",
        }}
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 top-20 h-96 w-96 rounded-full bg-[var(--ca-blue)]/10 blur-3xl"
      />

      <Container className="relative z-10">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-5">
            <SectionLabel light>ORACLE</SectionLabel>

            <motion.div
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.7 }}
              className="mt-8"
            >
              <h2 className="ca-h2 max-w-xl text-white">
                Transform the enterprise.
                <br />
                Not just the software.
              </h2>

              <p className="mt-8 max-w-md text-lg leading-8 text-white/70">
                Modernize finance, procurement, supply chain, HR, projects,
                planning, integration, and analytics through connected Oracle
                enterprise platforms.
              </p>

              <Link href="/oracle" className="ca-button-light mt-10">
                Explore Oracle
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="lg:col-span-7"
          >
            <OracleProductVisual />
          </motion.div>
        </div>

        <div className="mt-16 border-t border-white/10">
          <div className="grid md:grid-cols-2 lg:grid-cols-4">
            {oracleAreas.map((area, index) => (
              <motion.div
                key={area}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.04,
                }}
                className="group border-b border-white/10 py-7 md:border-r md:px-6 md:[&:nth-child(2n)]:border-r-0 lg:[&:nth-child(2n)]:border-r lg:[&:nth-child(4n)]:border-r-0"
              >
                <p className="text-sm text-white/35">
                  {String(index + 1).padStart(2, "0")}
                </p>

                <p className="mt-3 text-lg font-medium text-white transition-colors duration-200 group-hover:text-[#93c5fd]">
                  {area}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6 }}
          className="mt-16 border-t border-white/10 pt-10"
        >
          <p className="ca-eyebrow text-white/40">END-TO-END DELIVERY</p>

          <div className="mt-8 flex flex-wrap gap-x-8 gap-y-4">
            {lifecycle.map((item, index) => (
              <div key={item} className="flex items-center gap-8">
                <span className="text-sm font-medium text-white/75">{item}</span>

                {index < lifecycle.length - 1 && (
                  <span aria-hidden="true" className="text-white/20">
                    →
                  </span>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </Container>
    </Section>
  );
}

function OracleProductVisual() {
  return (
    <div className="overflow-hidden border border-white/12 bg-[#05070d]/60 shadow-[0_40px_100px_rgba(0,0,0,0.35)] backdrop-blur-sm">
      <div className="flex items-center justify-between border-b border-white/10 px-5 py-3">
        <div className="flex items-center gap-3">
          <span className="text-[0.65rem] font-semibold tracking-[0.14em] text-white/70">
            ORACLE FUSION
          </span>
          <span className="rounded bg-[var(--ca-blue)]/20 px-2 py-0.5 text-[0.6rem] text-[#93c5fd]">
            Cloud ERP
          </span>
        </div>
        <span className="text-[0.65rem] text-white/35">Finance · Period close</span>
      </div>

      <div className="grid gap-px bg-white/10 md:grid-cols-3">
        {[
          { label: "Open invoices", value: "1,284", delta: "−12% MoM" },
          { label: "PO cycle time", value: "4.2d", delta: "−1.6d" },
          { label: "Close status", value: "Day 3", delta: "On track" },
        ].map((card) => (
          <div key={card.label} className="bg-[#071A2F] p-5">
            <p className="text-[0.65rem] uppercase tracking-[0.12em] text-white/40">
              {card.label}
            </p>
            <p className="mt-3 text-3xl font-medium tracking-[-0.03em] text-white">
              {card.value}
            </p>
            <p className="mt-2 text-xs text-[var(--ca-blue)]">{card.delta}</p>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-[1.2fr_0.8fr]">
        <div className="border-b border-white/10 p-5 md:border-b-0 md:border-r">
          <p className="text-[0.65rem] uppercase tracking-[0.12em] text-white/40">
            Process flow
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-2">
            {["Requisition", "Approval", "PO", "Receipt", "Invoice", "Payment"].map(
              (step, i, arr) => (
                <div key={step} className="flex items-center gap-2">
                  <span className="border border-white/15 bg-white/5 px-2.5 py-1.5 text-xs text-white/75">
                    {step}
                  </span>
                  {i < arr.length - 1 && (
                    <span className="text-white/25">→</span>
                  )}
                </div>
              ),
            )}
          </div>
          <div className="mt-6 space-y-2">
            {[
              { name: "AP matching exceptions", pct: 18 },
              { name: "Auto-approved POs", pct: 74 },
              { name: "Period close tasks done", pct: 86 },
            ].map((row) => (
              <div key={row.name}>
                <div className="mb-1 flex justify-between text-xs text-white/50">
                  <span>{row.name}</span>
                  <span>{row.pct}%</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full bg-[var(--ca-blue)]"
                    style={{ width: `${row.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-5">
          <p className="text-[0.65rem] uppercase tracking-[0.12em] text-white/40">
            Connected modules
          </p>
          <ul className="mt-4 space-y-3">
            {[
              "Financials",
              "Procurement",
              "Projects",
              "OIC Integration",
              "OTBI Analytics",
            ].map((mod) => (
              <li
                key={mod}
                className="flex items-center justify-between border-b border-white/8 pb-2 text-sm last:border-0"
              >
                <span className="text-white/75">{mod}</span>
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
