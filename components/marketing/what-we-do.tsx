"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

import SectionLabel from "@/components/marketing/SectionLabel";

const modules = [
  {
    category: "ENTERPRISE TRANSFORMATION",
    title: "Operating models, delivery governance, and process architecture.",
    description: "Align business operations with modern digital workflows designed to survive cutover and drive adoption.",
    href: "/capabilities/enterprise-transformation",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1000&q=80",
    imageAlt: "Executive strategy workshop with senior enterprise transformation team",
  },
  {
    category: "ORACLE TRANSFORMATION",
    title: "Modernize finance, supply chain, procurement, and projects.",
    description: "From architecture and implementation to testing, integrations, and financial reconciliation across Fusion Cloud.",
    href: "/oracle",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1000&q=80",
    imageAlt: "Modern enterprise operations and financial systems architecture",
  },
  {
    category: "AI & DATA",
    title: "Create trusted data foundations and production AI workflows.",
    description: "Enterprise document intelligence, task-oriented agents, governed RAG, and automated operational pipelines.",
    href: "/ai-data",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1000&q=80",
    imageAlt: "Data engineering and machine learning analytics team",
  },
  {
    category: "APPLICATION ENGINEERING",
    title: "Build focused digital software where packaged systems stop.",
    description: "Custom enterprise portals, customer workspaces, talent intelligence platforms, and high-performance APIs.",
    href: "/capabilities/digital-engineering",
    image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1000&q=80",
    imageAlt: "Digital software engineering and modern interface team",
  },
];

export default function WhatWeDo() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="what-we-do" className="bg-[#FFFFFF] text-[#102033] py-20 sm:py-24 lg:py-28 border-b border-[#DDE4E8]">
      <div className="ca-shell">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end pb-12 border-b border-[#DDE4E8]">
          <div>
            <SectionLabel tone="burgundy">PRACTICES &amp; CAPABILITIES</SectionLabel>
            <h2 className="mt-3 font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-[-0.03em] text-[#102033]">
              What We Do
            </h2>
          </div>
          <p className="max-w-md text-base text-[#526170]">
            We work across business transformation, enterprise applications, AI, data, and digital engineering — connecting strategy with the systems organizations depend on.
          </p>
        </div>

        {/* Staggered Editorial Visual Practice Modules (No identical repetitive cards) */}
        <div className="mt-12 space-y-16 lg:space-y-20">
          {modules.map((mod, idx) => {
            const isEven = idx % 2 === 1;
            return (
              <motion.article
                key={mod.category}
                initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: idx * 0.05 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center"
              >
                {/* Image Side (Staggered Left/Right) */}
                <div
                  className={`lg:col-span-7 ${
                    isEven ? "lg:order-2" : "lg:order-1"
                  }`}
                >
                  <div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg border border-[#DDE4E8] bg-[#F7F9FA] shadow-[0_12px_36px_rgba(16,32,51,0.06)]">
                    <Image
                      src={mod.image}
                      alt={mod.imageAlt}
                      fill
                      className="object-cover mkt-img-graded transition-transform duration-700 hover:scale-[1.02]"
                      sizes="(max-width: 1024px) 100vw, 55vw"
                    />
                  </div>
                </div>

                {/* Content Side */}
                <div
                  className={`lg:col-span-5 space-y-5 ${
                    isEven ? "lg:order-1" : "lg:order-2"
                  }`}
                >
                  <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#B63A3A]">
                    {mod.category}
                  </span>

                  <h3 className="font-serif text-2xl sm:text-3xl lg:text-3xl font-bold text-[#102033] leading-snug">
                    {mod.title}
                  </h3>

                  <p className="text-base leading-relaxed text-[#526170]">
                    {mod.description}
                  </p>

                  <div className="pt-2">
                    <Link
                      href={mod.href}
                      className="group inline-flex items-center gap-2 text-sm font-bold text-[#102033] hover:text-[#B63A3A] transition-colors"
                    >
                      <span>Explore Practice</span>
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1.5 text-[#B63A3A]" />
                    </Link>
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
