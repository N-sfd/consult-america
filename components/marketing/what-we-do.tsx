"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, CheckCircle2, Sparkles, Database, Layers, Cpu } from "lucide-react";
import { motion } from "framer-motion";

import SectionLabel from "@/components/marketing/SectionLabel";

const practices = [
  {
    number: "01",
    category: "ENTERPRISE TRANSFORMATION",
    title: "Transformation that stays connected to delivery.",
    description:
      "Operating models, process architecture, program PMO governance and modernization engineered to survive cutover and adoption.",
    linkHref: "/capabilities/enterprise-transformation",
    linkLabel: "Explore Consulting",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Executive strategy workshop with senior enterprise transformation team",
    uiOverlay: {
      tag: "Operating Model",
      metric: "Target State Architected",
      status: "Cutover Governance Ready",
      icon: Layers,
    },
  },
  {
    number: "02",
    category: "ORACLE CLOUD TRANSFORMATION",
    title: "Modernize finance, procurement, supply chain and operations.",
    description:
      "From architecture and implementation to testing, OIC integrations and period-close optimization across Fusion ERP, SCM, HCM and EPM.",
    linkHref: "/oracle",
    linkLabel: "Explore Oracle Practice",
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Enterprise financial operations and digital infrastructure",
    uiOverlay: {
      tag: "Fusion Cloud ERP",
      metric: "Multi-Entity Ledgers",
      status: "Subledger Automation 99.4%",
      icon: Database,
    },
  },
  {
    number: "03",
    category: "AI & DATA ENGINEERING",
    title: "Create trusted data foundations and production AI workflows.",
    description:
      "Enterprise AI agents, document extraction pipelines, governed RAG, analytics and workflow automation built on validated operational data.",
    linkHref: "/ai-data",
    linkLabel: "Explore AI & Data",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Data analytics, machine learning, and enterprise intelligence dashboard",
    uiOverlay: {
      tag: "Data Agent AI",
      metric: "FAR/DFARS Verified",
      status: "Source Grounding 99.8%",
      icon: Sparkles,
    },
  },
  {
    number: "04",
    category: "DIGITAL ENGINEERING & APPS",
    title: "Build enterprise applications where packaged software stops.",
    description:
      "Modern application engineering, Customer 360 CRM workspaces, workforce portals and low-latency APIs engineered for production scale.",
    linkHref: "/capabilities/digital-engineering",
    linkLabel: "Explore Digital Engineering",
    image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Software engineering and digital product development team",
    uiOverlay: {
      tag: "Platform Suite",
      metric: "Microservices & APIs",
      status: "Zero Downtime Deploy",
      icon: Cpu,
    },
  },
];

export default function WhatWeDo() {
  return (
    <section className="bg-[#F4EFE6] text-[#261F1B] py-20 sm:py-24 lg:py-28 border-b border-[#D7CCBD]/80">
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

        {/* 4 Large Alternating Practice Showcases with Editorial Photography & UI Overlays */}
        <div className="mt-16 space-y-16 lg:space-y-20">
          {practices.map((practice, idx) => {
            const isEven = idx % 2 === 1;
            const Icon = practice.uiOverlay.icon;

            return (
              <div
                key={practice.number}
                className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center"
              >
                {/* Text Content Block */}
                <motion.div
                  initial={{ opacity: 0, x: isEven ? 16 : -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.55 }}
                  className={`lg:col-span-6 space-y-5 ${isEven ? "lg:order-2" : "lg:order-1"}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold tracking-widest text-[#7D2639]">
                      {practice.number}
                    </span>
                    <span className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#695F57]">
                      {practice.category}
                    </span>
                  </div>

                  <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#261F1B] leading-tight">
                    {practice.title}
                  </h3>

                  <p className="text-sm sm:text-base leading-relaxed text-[#695F57]">
                    {practice.description}
                  </p>

                  <div className="pt-2">
                    <Link
                      href={practice.linkHref}
                      className="group inline-flex items-center gap-2 rounded-md bg-[#7D2639] px-6 py-3 text-xs sm:text-sm font-semibold text-white transition-colors hover:bg-[#681F30]"
                    >
                      <span>{practice.linkLabel}</span>
                      <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </Link>
                  </div>
                </motion.div>

                {/* Image + UI Overlay Block */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className={`lg:col-span-6 relative ${isEven ? "lg:order-1" : "lg:order-2"}`}
                >
                  <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-[#D7CCBD] bg-[#FFFDF8] shadow-[0_16px_45px_rgba(38,31,27,0.08)]">
                    <Image
                      src={practice.image}
                      alt={practice.imageAlt}
                      fill
                      className="object-cover mkt-img-graded transition-transform duration-700 hover:scale-103"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />

                    {/* Warm Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#261F1B]/70 via-transparent to-transparent" />

                    {/* Floating Product UI Indicator */}
                    <div className="absolute bottom-4 left-4 right-4 sm:left-6 sm:right-6 rounded-xl border border-white/20 bg-[#FFFDF8]/90 p-3.5 backdrop-blur-md shadow-lg flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#7D2639] text-white">
                          <Icon className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-bold text-[#261F1B]">{practice.uiOverlay.tag}</p>
                          <p className="text-[0.65rem] text-[#695F57]">{practice.uiOverlay.metric}</p>
                        </div>
                      </div>
                      <span className="rounded bg-[#DFE4DA] px-2 py-1 text-[0.62rem] font-bold text-[#657766] uppercase">
                        {practice.uiOverlay.status}
                      </span>
                    </div>
                  </div>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
