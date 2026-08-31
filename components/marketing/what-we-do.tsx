"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Layers, Database, Sparkles, Cpu } from "lucide-react";
import { motion } from "framer-motion";

import SectionLabel from "@/components/marketing/SectionLabel";

const modules = [
  {
    category: "ENTERPRISE TRANSFORMATION",
    title: "Operating models, delivery governance, and process architecture.",
    description: "Align business operations with modern digital workflows designed to survive cutover and drive adoption.",
    href: "/capabilities/enterprise-transformation",
    icon: Layers,
    iconColor: "text-[#B63A3A] bg-[#B63A3A]/10",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80",
    imageAlt: "Executive strategy workshop with senior enterprise transformation team",
  },
  {
    category: "ORACLE TRANSFORMATION",
    title: "Modernize finance, supply chain, procurement, and projects.",
    description: "From architecture and implementation to testing, OIC integrations, and subledger reconciliation across Fusion Cloud.",
    href: "/oracle",
    icon: Database,
    iconColor: "text-[#47739B] bg-[#47739B]/10",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80",
    imageAlt: "Modern enterprise operations and financial systems architecture",
  },
  {
    category: "AI & DATA",
    title: "Create trusted data foundations and production AI workflows.",
    description: "Enterprise document intelligence, task-oriented agents, governed RAG, and automated operational pipelines.",
    href: "/ai-data",
    icon: Sparkles,
    iconColor: "text-[#357C78] bg-[#357C78]/10",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
    imageAlt: "Data engineering and machine learning analytics team",
  },
  {
    category: "APPLICATION ENGINEERING",
    title: "Build focused digital software where packaged systems stop.",
    description: "Custom enterprise portals, Customer 360 workspaces, talent intelligence platforms, and high-performance APIs.",
    href: "/capabilities/digital-engineering",
    icon: Cpu,
    iconColor: "text-[#102033] bg-[#102033]/10",
    image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80",
    imageAlt: "Digital software engineering and modern interface team",
  },
];

export default function WhatWeDo() {
  return (
    <section className="bg-[#FFFFFF] text-[#102033] py-20 sm:py-24 lg:py-28 border-b border-[#DDE4E8]">
      <div className="ca-shell">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-14">
          {/* Left Intro Column (Section 14 Specification) */}
          <div className="lg:col-span-4 space-y-6">
            <SectionLabel tone="burgundy">FROM STRATEGY TO PRODUCTION</SectionLabel>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-[-0.03em] text-[#102033] leading-[1.08]">
              What We Do
            </h2>

            <p className="text-base leading-relaxed text-[#526170]">
              We work across business transformation, enterprise applications, AI, data, and digital engineering — connecting strategy with the systems and workflows organizations depend on.
            </p>

            <div className="pt-4 border-t border-[#E9EEF1]">
              <Link
                href="/capabilities"
                className="ca-link text-xs sm:text-sm font-semibold text-[#B63A3A]"
              >
                View all practice areas <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Right 4 Visual Modules (2x2 Grid) */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-8">
            {modules.map((mod, idx) => {
              const Icon = mod.icon;
              return (
                <motion.article
                  key={mod.category}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.08 }}
                  className="group flex flex-col justify-between rounded-lg border border-[#DDE4E8] bg-white overflow-hidden shadow-2xs hover:border-[#B63A3A]/40 hover:shadow-md transition-all duration-300"
                >
                  {/* Photograph */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#F7F9FA]">
                    <Image
                      src={mod.image}
                      alt={mod.imageAlt}
                      fill
                      className="object-cover mkt-img-graded transition-transform duration-600 group-hover:scale-102"
                      sizes="(max-width: 640px) 100vw, 40vw"
                    />
                  </div>

                  {/* Content Block */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-center gap-2.5">
                        <div className={`flex h-7 w-7 items-center justify-center rounded ${mod.iconColor}`}>
                          <Icon className="h-3.5 w-3.5" />
                        </div>
                        <span className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#526170]">
                          {mod.category}
                        </span>
                      </div>

                      <h3 className="mt-3 font-serif text-lg sm:text-xl font-bold text-[#102033] leading-snug group-hover:text-[#B63A3A] transition-colors">
                        {mod.title}
                      </h3>

                      <p className="mt-2 text-xs sm:text-sm leading-relaxed text-[#526170]">
                        {mod.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[#E9EEF1]">
                      <Link
                        href={mod.href}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#B63A3A] group-hover:gap-2.5 transition-all"
                      >
                        <span>Learn More</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
