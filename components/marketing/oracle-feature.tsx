"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

import EditorialHeading from "@/components/marketing/EditorialHeading";
import OracleArchitectureDiagram from "@/components/marketing/OracleArchitectureDiagram";
import SectionLabel from "@/components/marketing/SectionLabel";

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

export default function OracleFeature({
  headingLevel = "h2",
  linkToDetail = true,
}: {
  headingLevel?: "h1" | "h2";
  linkToDetail?: boolean;
}) {
  return (
    <section id="oracle" className="mkt-section bg-[#F4EFE6]">
      <div className="mkt-shell">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-5">
            <SectionLabel tone="burgundy">Oracle</SectionLabel>

            <motion.div
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.7 }}
              className="mt-8"
            >
              <EditorialHeading
                as={headingLevel}
                size={headingLevel === "h1" ? "hero" : "section"}
                className="max-w-xl text-[#261F1B]"
              >
                Transform the enterprise.
                <br />
                Not just the software.
              </EditorialHeading>

              <p className="mkt-body-lg mt-8 max-w-md text-[#695F57]">
                Modernize finance, procurement, supply chain, HR, projects,
                planning, integration, and analytics through connected Oracle
                enterprise platforms.
              </p>

              {linkToDetail && (
                <Link href="/oracle" className="ca-button-primary mt-10 inline-flex font-semibold">
                  Explore Oracle
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              )}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="lg:col-span-7"
          >
            <OracleArchitectureDiagram />
          </motion.div>
        </div>

        <div className="mt-16 border-t border-[#D7CCBD]">
          <div className="grid md:grid-cols-2 lg:grid-cols-4">
            {oracleAreas.map((area, index) => (
              <motion.div
                key={area}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.04 }}
                className="group border-b border-[#D7CCBD] py-7 md:border-r md:px-6 md:[&:nth-child(2n)]:border-r-0 lg:[&:nth-child(2n)]:border-r lg:[&:nth-child(4n)]:border-r-0"
              >
                <p className="text-sm font-semibold text-[#695F57]">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <p className="mt-3 text-lg font-bold text-[#261F1B] transition-colors duration-200 group-hover:text-[#7D2639]">
                  {area}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="mt-14 border-t border-[#D7CCBD] pt-10">
          <p className="mkt-eyebrow text-[#695F57]">End-to-end delivery</p>
          <div className="mt-8 flex flex-wrap gap-x-8 gap-y-4">
            {lifecycle.map((item, index) => (
              <div key={item} className="flex items-center gap-8">
                <span className="text-sm font-semibold text-[#261F1B]">
                  {item}
                </span>
                {index < lifecycle.length - 1 && (
                  <span aria-hidden="true" className="text-[#D7CCBD]">
                    →
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
