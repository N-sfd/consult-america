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
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <SectionLabel light>ORACLE</SectionLabel>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-8"
          >
            <h2 className="ca-h2 max-w-5xl text-white">
              Transform the enterprise.
              <br />
              Not just the software.
            </h2>

            <p className="mt-8 max-w-3xl text-lg leading-8 text-white/70">
              We help organizations modernize finance, procurement, supply
              chain, HR, projects, planning, integration, and analytics through
              connected Oracle enterprise platforms.
            </p>

            <p className="mt-5 max-w-3xl text-base leading-7 text-white/55">
              Our approach brings together business process transformation,
              solution architecture, implementation, integration, testing,
              adoption, and production support.
            </p>

            <Link href="/oracle" className="ca-button-light mt-10">
              Explore Oracle
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>

        <div className="mt-20 border-t border-white/10">
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
