"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

import SectionLabel from "@/components/marketing/SectionLabel";
import { OffsetImage } from "@/components/marketing/image-system";

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
    variant: "bottom-right" as const,
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
    variant: "top-left" as const,
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
    variant: "bottom-left" as const,
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
    variant: "top-right" as const,
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

        {/* 4 Spacious Editorial Capability Modules with Reusable Offset Editorial Frames */}
        <div className="mt-20 space-y-24 lg:space-y-32">
          {practices.map((practice, idx) => {
            const isEven = idx % 2 === 1;

            return (
              <div
                key={practice.number}
                className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center"
              >
                {/* Text Content Block */}
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
                      className="group inline-flex items-center gap-2 text-sm font-semibold text-[#261F1B] hover:text-[#B63A3A] transition-colors"
                    >
                      <span>{practice.linkLabel}</span>
                      <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </Link>
                  </div>
                </motion.div>

                {/* Offset Image Frame with 4-way alternating geometric accent plane */}
                <div className={`lg:col-span-7 ${isEven ? "lg:order-1" : "lg:order-2"}`}>
                  <OffsetImage
                    src={practice.image}
                    alt={practice.imageAlt}
                    variant={practice.variant}
                    detailImage={practice.detailImage}
                    detailBadge={practice.detailBadge}
                    badge={
                      <span className="font-serif text-2xl sm:text-3xl font-bold text-white/90 drop-shadow-md">
                        {practice.number}
                      </span>
                    }
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
