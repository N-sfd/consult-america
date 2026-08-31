"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

import SectionLabel from "@/components/marketing/SectionLabel";

const practices = [
  {
    number: "01",
    category: "ENTERPRISE TRANSFORMATION",
    title: "Transformation connected directly to delivery.",
    description:
      "Operating model redesign, business process architecture, program governance, and modernization engineered to survive cutover and drive adoption.",
    linkHref: "/capabilities/enterprise-transformation",
    linkLabel: "Explore Consulting",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1400&q=80",
    imageAlt: "Executive strategy workshop with senior enterprise transformation team",
  },
  {
    number: "02",
    category: "ORACLE CLOUD TRANSFORMATION",
    title: "Modernize finance, procurement, and supply chain.",
    description:
      "Architecture, clean-core implementation, OIC integrations, automated period-close, and continuous optimization across Fusion ERP, SCM, HCM, and EPM.",
    linkHref: "/oracle",
    linkLabel: "Explore Oracle Practice",
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1400&q=80",
    imageAlt: "Enterprise financial operations and digital infrastructure",
  },
  {
    number: "03",
    category: "AI & DATA ENGINEERING",
    title: "Trusted data foundations and production AI workflows.",
    description:
      "Autonomous agents, document intelligence pipelines, governed RAG, and operational analytics grounded in validated enterprise systems of record.",
    linkHref: "/ai-data",
    linkLabel: "Explore AI & Data",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1400&q=80",
    imageAlt: "Data analytics, machine learning, and enterprise intelligence dashboard",
  },
  {
    number: "04",
    category: "DIGITAL ENGINEERING & APPS",
    title: "Custom enterprise software where packaged solutions stop.",
    description:
      "Full-stack digital engineering, Customer 360 workspaces, workforce platforms, and low-latency API gateways engineered for high-availability production scale.",
    linkHref: "/capabilities/digital-engineering",
    linkLabel: "Explore Digital Engineering",
    image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1400&q=80",
    imageAlt: "Software engineering and digital product development team",
  },
];

export default function WhatWeDo() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="bg-[#F7F3EC] text-[#261F1B] py-24 sm:py-28 lg:py-32 border-b border-[#D7CCBD]/80">
      <div className="mkt-shell">
        {/* Section Header with generous whitespace */}
        <div className="max-w-3xl">
          <SectionLabel tone="burgundy">WHAT WE DO</SectionLabel>

          <h2 className="mt-4 font-serif text-3xl font-semibold tracking-tight text-[#261F1B] sm:text-4xl lg:text-5xl lg:leading-[1.1]">
            Strategy that reaches production.
          </h2>

          <p className="mt-5 text-base sm:text-lg leading-relaxed text-[#695F57]">
            We work across business transformation, enterprise applications,
            AI, data, and engineering—connecting executive strategy with the systems
            and workflows organizations depend on.
          </p>
        </div>

        {/* 4 Spacious Editorial Capability Modules with Oversized Numbers & Minimalist Restraint */}
        <div className="mt-20 space-y-24 lg:space-y-32">
          {practices.map((practice, idx) => {
            const isEven = idx % 2 === 1;

            return (
              <div
                key={practice.number}
                className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center"
              >
                {/* Text Content Block (~38%) */}
                <motion.div
                  initial={shouldReduceMotion ? {} : { opacity: 0, x: isEven ? 16 : -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.55 }}
                  className={`lg:col-span-5 space-y-5 ${isEven ? "lg:order-2" : "lg:order-1"}`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="h-0.5 w-5 bg-[#7D2639]" />
                    <span className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#7D2639]">
                      {practice.category}
                    </span>
                  </div>

                  <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#261F1B] leading-tight">
                    {practice.title}
                  </h3>

                  <p className="text-base leading-relaxed text-[#695F57]">
                    {practice.description}
                  </p>

                  <div className="pt-2">
                    <Link
                      href={practice.linkHref}
                      className="group inline-flex items-center gap-1.5 text-sm font-bold text-[#7D2639] hover:text-[#681F30] transition-colors"
                    >
                      <span>{practice.linkLabel}</span>
                      <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </Link>
                  </div>
                </motion.div>

                {/* Larger Image Container (~62%) with Oversized Editorial Number Overlap */}
                <motion.div
                  initial={shouldReduceMotion ? {} : { opacity: 0, scale: 0.98 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className={`lg:col-span-7 relative ${isEven ? "lg:order-1" : "lg:order-2"}`}
                >
                  {/* Oversized Editorial Number Partially Overlapping */}
                  <span
                    className={`absolute -top-10 sm:-top-14 font-serif text-7xl sm:text-8xl lg:text-9xl font-bold text-[#7D2639]/15 select-none z-0 pointer-events-none ${
                      isEven ? "right-2 sm:right-6" : "left-2 sm:left-6"
                    }`}
                    aria-hidden="true"
                  >
                    {practice.number}
                  </span>

                  <div className="relative z-10 aspect-[16/10] w-full overflow-hidden rounded-2xl border border-[#D7CCBD] bg-white shadow-[0_20px_50px_rgba(38,31,27,0.09)]">
                    <Image
                      src={practice.image}
                      alt={practice.imageAlt}
                      fill
                      className="object-cover mkt-img-graded transition-transform duration-700 hover:scale-103"
                      sizes="(max-width: 1024px) 100vw, 65vw"
                    />

                    {/* Gradient Depth Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#261F1B]/60 via-transparent to-transparent" />
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
