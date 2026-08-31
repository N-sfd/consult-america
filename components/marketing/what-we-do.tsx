"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Workflow,
  Layers,
  Database,
  Code2,
} from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

import { stockImage } from "@/lib/marketing/stock-images";

const serviceCards = [
  {
    category: "ENTERPRISE TRANSFORMATION",
    title: "Operating models, delivery governance, and process architecture.",
    description:
      "Align business operations with modern digital workflows designed to survive cutover and drive adoption.",
    href: "/capabilities/enterprise-transformation",
    image: stockImage("whatWeDoTransform", { w: 800, q: 80 }),
    imageAlt: "Executive strategy workshop with senior enterprise transformation team",
    icon: Workflow,
  },
  {
    category: "ORACLE TRANSFORMATION",
    title: "Modernize finance, supply chain, procurement, and projects.",
    description:
      "From architecture and implementation to testing, integrations, and financial reconciliation across Fusion Cloud.",
    href: "/oracle",
    image: stockImage("whatWeDoModernize", { w: 800, q: 80 }),
    imageAlt: "Modern enterprise operations and financial systems architecture",
    icon: Layers,
  },
  {
    category: "AI & DATA",
    title: "Create trusted data foundations and production AI workflows.",
    description:
      "Enterprise document intelligence, task-oriented agents, governed RAG, and automated operational pipelines.",
    href: "/ai-data",
    image: stockImage("whatWeDoIntelligence", { w: 800, q: 80 }),
    imageAlt: "Data engineering and machine learning analytics team",
    icon: Database,
  },
  {
    category: "APPLICATION ENGINEERING",
    title: "Build focused digital software where packaged systems stop.",
    description:
      "Custom enterprise portals, customer workspaces, talent intelligence platforms, and high-performance APIs.",
    href: "/capabilities/digital-engineering",
    image: stockImage("whatWeDoBuild", { w: 800, q: 80 }),
    imageAlt: "Digital software engineering and modern interface team",
    icon: Code2,
  },
];

export default function WhatWeDo() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      id="what-we-do"
      className="bg-[#FFFFFF] text-[#163536] py-16 sm:py-20 lg:py-24 border-b border-[#DCE4E1]"
    >
      <div className="mx-auto max-w-[1440px] px-6 lg:px-8 xl:px-10">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end pb-10 border-b border-[#DCE4E1]">
          <div>
            <div className="inline-flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#103F3E]" />
              <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#596968]">
                WHAT WE DO
              </span>
            </div>
            <h2 className="mt-3 font-serif text-3xl sm:text-4xl lg:text-[42px] font-semibold tracking-[-0.03em] text-[#163536] leading-tight">
              End-to-end capabilities.
              <br />
              <span className="text-[#103F3E]">Delivered with impact.</span>
            </h2>
          </div>
          <div>
            <Link
              href="/capabilities"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-[#103F3E] hover:text-[#B63A3A] transition-colors"
            >
              <span>Explore all services</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* 4 Image Cards Grid (Section 20 & 21 Specification) */}
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {serviceCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.category}
                initial={shouldReduceMotion ? {} : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className="group flex flex-col rounded-[10px] border border-[#DCE4E1] bg-white overflow-hidden shadow-[0_4px_20px_rgba(11,51,50,0.04)] hover:shadow-[0_12px_32px_rgba(11,51,50,0.08)] hover:-translate-y-1 transition-all duration-300"
              >
                {/* Top Image (180-210px height) */}
                <div className="relative h-[190px] w-full overflow-hidden bg-[#EEF3F1]">
                  <Image
                    src={card.image}
                    alt={card.imageAlt}
                    fill
                    className="object-cover mkt-img-graded transition-transform duration-700 group-hover:scale-[1.025]"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  />
                  <div className="mkt-overlay-soft" />
                </div>

                {/* Body Content with Floating Icon */}
                <div className="relative flex flex-1 flex-col justify-between p-5 pt-6">
                  {/* Floating Icon between image and body */}
                  <div className="absolute -top-5 left-5 flex h-10 w-10 items-center justify-center rounded-[8px] border border-[#DCE4E1] bg-white shadow-[0_4px_12px_rgba(11,51,50,0.08)] text-[#103F3E] group-hover:bg-[#103F3E] group-hover:text-white transition-colors">
                    <Icon className="h-5 w-5" />
                  </div>

                  <div>
                    <span className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-[#596968]">
                      {card.category}
                    </span>
                    <h3 className="mt-2 font-serif text-lg font-bold text-[#163536] leading-snug group-hover:text-[#103F3E] transition-colors">
                      {card.title}
                    </h3>
                    <p className="mt-2.5 text-xs sm:text-[0.84rem] leading-relaxed text-[#596968]">
                      {card.description}
                    </p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-[#EEF3F1]">
                    <Link
                      href={card.href}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#103F3E] group-hover:text-[#B63A3A] transition-colors"
                    >
                      <span>Explore</span>
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
