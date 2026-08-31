"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

import SectionLabel from "@/components/marketing/SectionLabel";

const capabilities = [
  {
    number: "01",
    title: "Enterprise Transformation",
    description:
      "Operating models, process redesign, program delivery and modernization.",
    linkHref: "/capabilities/enterprise-transformation",
    linkLabel: "Explore Transformation",
    bullets: ["Operating model redesign", "Program PMO & cutover", "Change management"],
  },
  {
    number: "02",
    title: "Oracle Cloud",
    description:
      "ERP, HCM, SCM, CX, EPM, integrations, analytics and optimization.",
    linkHref: "/oracle",
    linkLabel: "Explore Oracle Practice",
    bullets: ["Fusion ERP & SCM cutover", "OIC & API integration", "EPM financial analytics"],
  },
  {
    number: "03",
    title: "AI & Data",
    description:
      "Enterprise AI agents, document intelligence, analytics and governed automation.",
    linkHref: "/ai-data",
    linkLabel: "Explore AI & Data",
    bullets: ["Contract & doc intelligence", "Governed RAG & agents", "Enterprise data engineering"],
  },
  {
    number: "04",
    title: "Digital Engineering",
    description:
      "Applications, platforms, APIs and digital experiences engineered for production.",
    linkHref: "/capabilities/digital-engineering",
    linkLabel: "Explore Engineering",
    bullets: ["Custom portals & CRM", "Microservices & APIs", "Full-stack cloud architectures"],
  },
];

export default function WhatWeDo() {
  return (
    <section className="bg-[#F4EFE6] py-16 sm:py-20 lg:py-24 border-b border-[#D7CCBD]/80">
      <div className="mkt-shell">
        {/* Section Header */}
        <div className="max-w-3xl">
          <SectionLabel tone="burgundy">WHAT WE DO</SectionLabel>

          <h2 className="mt-4 font-serif text-3xl font-semibold tracking-tight text-[#261F1B] sm:text-4xl lg:text-5xl lg:leading-[1.1]">
            Strategy that reaches production.
          </h2>

          <p className="mt-5 text-base sm:text-lg leading-relaxed text-[#695F57]">
            We work across business transformation, enterprise applications,
            AI, data and engineering—connecting strategy with the systems,
            workflows and products organizations actually depend on.
          </p>
        </div>

        {/* 4 Minimal Capability Columns with Typography and Whitespace */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6 xl:gap-8">
          {capabilities.map((cap, idx) => (
            <motion.div
              key={cap.number}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              className="group flex flex-col justify-between rounded-xl border border-[#D7CCBD] bg-[#FFFDF8] p-6 lg:p-7 transition-all duration-200 hover:border-[#7D2639]/40 hover:shadow-[0_12px_30px_rgba(38,31,27,0.06)]"
            >
              <div>
                <span className="font-mono text-xs font-bold tracking-widest text-[#7D2639]">
                  {cap.number}
                </span>

                <h3 className="mt-3 font-serif text-xl sm:text-2xl font-bold text-[#261F1B] group-hover:text-[#7D2639] transition-colors">
                  {cap.title}
                </h3>

                <p className="mt-3 text-sm leading-relaxed text-[#695F57]">
                  {cap.description}
                </p>

                <div className="mt-5 pt-4 border-t border-[#D7CCBD]/60 space-y-1.5">
                  {cap.bullets.map((b) => (
                    <div key={b} className="flex items-center gap-2 text-xs text-[#695F57]">
                      <span className="h-1 w-1 rounded-full bg-[#7D2639]" />
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-7 pt-4 border-t border-[#D7CCBD]/80">
                <Link
                  href={cap.linkHref}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#261F1B] group-hover:text-[#7D2639] transition-colors"
                >
                  {cap.linkLabel}
                  <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
