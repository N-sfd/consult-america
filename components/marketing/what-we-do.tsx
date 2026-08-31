"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

import SectionLabel from "@/components/marketing/SectionLabel";

const capabilities = [
  {
    category: "ENTERPRISE TRANSFORMATION",
    title: "Reshape operating models, process flows, and delivery programs.",
    description:
      "Help leaders align strategy, business architecture, governance, and organizational readiness so large-scale change delivers lasting operational value.",
    linkHref: "/capabilities/enterprise-transformation",
    linkLabel: "Explore Consulting",
    image:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Enterprise transformation strategy workshop with leadership team",
  },
  {
    category: "ORACLE TRANSFORMATION",
    title: "Modernize finance, procurement, supply chain, and operations.",
    description:
      "Full lifecycle Oracle Cloud delivery across Fusion Financials, SCM, HCM, EPM, and Project Portfolio Management with robust integration architecture.",
    linkHref: "/oracle",
    linkLabel: "Explore Oracle",
    image:
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Enterprise operations and finance technology infrastructure",
  },
  {
    category: "AI + DATA",
    title: "Create trusted data foundations and production-ready AI workflows.",
    description:
      "Connect enterprise data pipelines, agentic workflows, document intelligence, and governed models into everyday business decisions.",
    linkHref: "/ai-data",
    linkLabel: "Explore AI & Data",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Data analytics, machine learning, and enterprise intelligence dashboard",
  },
  {
    category: "APPLICATION ENGINEERING",
    title: "Build enterprise applications and integrations around critical workflow gaps.",
    description:
      "Engineer bespoke portals, integration hubs, and digital products where off-the-shelf software stops and differentiation begins.",
    linkHref: "/capabilities/digital-engineering",
    linkLabel: "Explore Engineering",
    image:
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Software engineers designing scalable cloud architecture",
  },
];

export default function WhatWeDo() {
  return (
    <section id="what-we-do" className="mkt-section bg-[#FFFAF2] text-[#261F1B]">
      <div className="mkt-shell">
        <SectionLabel tone="burgundy">What We Do</SectionLabel>

        <div className="mt-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="text-3xl font-bold tracking-[-0.03em] sm:text-4xl lg:text-5xl"
          >
            From operating model to production.
          </motion.h2>
          <p className="max-w-md text-sm text-[#695F57] sm:text-base">
            Four interconnected practices designed to turn strategic vision into
            reliable day-to-day operations.
          </p>
        </div>

        {/* 4 Large Alternating Editorial Blocks */}
        <div className="mt-16 space-y-16 lg:space-y-24">
          {capabilities.map((cap, index) => {
            const isReversed = index % 2 === 1;
            return (
              <motion.article
                key={cap.category}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-14 border-t border-[#D7CCBD] pt-12"
              >
                {/* Text Content */}
                <div
                  className={`lg:col-span-6 ${
                    isReversed ? "lg:order-2" : "lg:order-1"
                  }`}
                >
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#7D2639]">
                    {cap.category}
                  </p>
                  <h3 className="mt-3 text-2xl font-bold tracking-[-0.02em] text-[#261F1B] sm:text-3xl">
                    {cap.title}
                  </h3>
                  <p className="mt-4 text-base leading-relaxed text-[#695F57]">
                    {cap.description}
                  </p>
                  <div className="mt-6">
                    <Link
                      href={cap.linkHref}
                      className="group inline-flex items-center gap-1.5 text-sm font-semibold text-[#7D2639] transition-colors hover:text-[#681F30]"
                    >
                      <span>{cap.linkLabel}</span>
                      <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </Link>
                  </div>
                </div>

                {/* Photography Module */}
                <div
                  className={`lg:col-span-6 ${
                    isReversed ? "lg:order-1" : "lg:order-2"
                  }`}
                >
                  <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-[#D7CCBD] bg-[#FFFDF8] shadow-[0_12px_36px_rgba(38,31,27,0.06)]">
                    <Image
                      src={cap.image}
                      alt={cap.imageAlt}
                      fill
                      className="object-cover transition-transform duration-700 hover:scale-[1.02]"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#261F1B]/30 via-transparent to-transparent" />
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
