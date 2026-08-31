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
      "Operating model redesign, enterprise process architecture, and modernization engineered to survive cutover and drive adoption.",
    linkHref: "/capabilities/enterprise-transformation",
    linkLabel: "Explore Consulting",
    image: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1600&q=85",
    imageAlt: "Executive enterprise transformation and strategic architecture environment",
    detailImage: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80",
    detailBadge: "OPERATING MODEL",
  },
  {
    number: "02",
    category: "ORACLE CLOUD TRANSFORMATION",
    title: "Modernize finance, procurement, and supply chain.",
    description:
      "Clean-core implementation, OIC integrations, automated period-close, and continuous optimization across Fusion Cloud.",
    linkHref: "/oracle",
    linkLabel: "Explore Oracle Practice",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=85",
    imageAlt: "Enterprise financial operations and digital infrastructure architecture",
    detailImage: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80",
    detailBadge: "FUSION FABRIC",
  },
  {
    number: "03",
    category: "AI & DATA ENGINEERING",
    title: "Trusted data foundations and production AI workflows.",
    description:
      "Autonomous agents, document intelligence pipelines, and operational analytics grounded in enterprise systems of record.",
    linkHref: "/ai-data",
    linkLabel: "Explore AI & Data",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1600&q=85",
    imageAlt: "Enterprise data analytics and AI intelligence workspace",
    detailImage: "https://images.unsplash.com/photo-1517976487502-8693c0429f55?auto=format&fit=crop&w=600&q=80",
    detailBadge: "DATA LINEAGE",
  },
  {
    number: "04",
    category: "DIGITAL ENGINEERING & APPS",
    title: "Custom enterprise software where packaged solutions stop.",
    description:
      "Full-stack digital engineering, Customer 360 workspaces, and high-throughput API gateways built for production scale.",
    linkHref: "/capabilities/digital-engineering",
    linkLabel: "Explore Digital Engineering",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1600&q=85",
    imageAlt: "Software engineering and digital product development environment",
    detailImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80",
    detailBadge: "PRODUCTION APPS",
  },
];

export default function WhatWeDo() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="bg-[#FFFDF8] text-[#261F1B] py-24 sm:py-28 lg:py-32 border-b border-[#D8D0C5] relative overflow-hidden">
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

        {/* 4 Spacious Editorial Capability Modules with Offset Editorial Frames (Shape B) */}
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
                    <span className="h-0.5 w-5 bg-[#B63A3A]" />
                    <span className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#B63A3A]">
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
                      className="group inline-flex items-center gap-1.5 text-sm font-bold text-[#B63A3A] hover:text-[#942E31] transition-colors"
                    >
                      <span>{practice.linkLabel}</span>
                      <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </Link>
                  </div>
                </motion.div>

                {/* Two-Layer Composition: Large Offset Frame + Overlapping Detail Layer (~62%) */}
                <div
                  className={`lg:col-span-7 relative ${isEven ? "lg:order-1" : "lg:order-2"}`}
                >
                  {/* Oversized Editorial Number Overlap */}
                  <span
                    className={`absolute -top-10 sm:-top-14 font-serif text-7xl sm:text-8xl lg:text-9xl font-bold text-[#B63A3A]/12 select-none z-0 pointer-events-none ${
                      isEven ? "right-2 sm:right-6" : "left-2 sm:left-6"
                    }`}
                    aria-hidden="true"
                  >
                    {practice.number}
                  </span>

                  {/* Offset Decorative Backing Shape (Requirement 2 & 14) */}
                  <div
                    className={`absolute inset-0 translate-x-3 translate-y-3 sm:translate-x-4 sm:translate-y-4 ${
                      isEven
                        ? "ca-shape-offset-frame-alt bg-[#B63A3A]/8"
                        : "ca-shape-offset-frame bg-[#D8C5AA]/30"
                    } -z-10`}
                    aria-hidden="true"
                  />

                  {/* 1. Main Large Photograph with Offset Editorial Frame (Shape B) */}
                  <motion.div
                    initial={shouldReduceMotion ? {} : { opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    className={`group/main relative z-10 aspect-[16/10] w-full border border-[#D8D0C5] bg-white shadow-[0_20px_50px_rgba(38,31,27,0.06)] ${
                      isEven ? "ca-shape-offset-frame-alt" : "ca-shape-offset-frame"
                    }`}
                  >
                    <Image
                      src={practice.image}
                      alt={practice.imageAlt}
                      fill
                      className="object-cover mkt-img-graded"
                      sizes="(max-width: 1024px) 100vw, 65vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#261F1B]/50 via-transparent to-transparent pointer-events-none" />
                  </motion.div>

                  {/* 2. Secondary Overlapping Detail Image (Requirement 11, 12, 13) */}
                  <motion.div
                    initial={
                      shouldReduceMotion
                        ? {}
                        : { opacity: 0, y: 34, rotate: isEven ? 2 : -2 }
                    }
                    whileInView={{ opacity: 1, y: 0, rotate: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.14 }}
                    className={`absolute bottom-[-16px] sm:bottom-[-22px] z-20 w-[110px] h-[110px] sm:w-[140px] sm:h-[140px] shadow-[0_16px_36px_rgba(38,31,27,0.18)] border-2 border-white bg-white ca-shape-squircle overflow-hidden ${
                      isEven ? "left-[-12px] sm:left-[-18px]" : "right-[-12px] sm:right-[-18px]"
                    }`}
                  >
                    <div className="relative h-full w-full">
                      <Image
                        src={practice.detailImage}
                        alt=""
                        fill
                        className="object-cover mkt-img-graded"
                        sizes="140px"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#211E1B]/80 via-transparent to-transparent pointer-events-none" />
                      <span className="absolute bottom-2 left-2 right-2 text-center text-[0.52rem] sm:text-[0.58rem] font-mono font-bold tracking-wider text-white uppercase truncate bg-[#211E1B]/80 backdrop-blur-xs py-0.5 rounded">
                        {practice.detailBadge}
                      </span>
                    </div>
                  </motion.div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
