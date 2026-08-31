"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

import SectionLabel from "@/components/marketing/SectionLabel";

const capabilities: {
  number: string;
  category: string;
  title: string;
  description: string;
  tags?: string[];
  linkHref: string;
  linkLabel: string;
  image: string;
  imageAlt: string;
}[] = [
  {
    number: "01",
    category: "ENTERPRISE TRANSFORMATION",
    title: "Transformation that stays connected to delivery.",
    description:
      "Strategy creates value only when it survives architecture, implementation, testing, adoption and production. Consult America brings business and technology teams together across the transformation lifecycle.",
    tags: [
      "Enterprise Transformation",
      "Process & Operating Model",
      "Program Delivery",
      "Testing & Quality",
      "Change & Adoption",
      "Technology Strategy",
    ],
    linkHref: "/capabilities/enterprise-transformation",
    linkLabel: "Explore Consulting",
    image:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Enterprise transformation strategy workshop with leadership team",
  },
  {
    number: "02",
    category: "ORACLE TRANSFORMATION",
    title: "Modernize finance, procurement, supply chain and project operations.",
    description:
      "Modernize finance, procurement, supply chain and project operations through an Oracle transformation designed around how the business actually works.",
    linkHref: "/oracle",
    linkLabel: "Explore Oracle",
    image:
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Enterprise operations and finance technology infrastructure",
  },
  {
    number: "03",
    category: "AI + DATA",
    title: "Create trusted data foundations and production-ready AI workflows.",
    description:
      "Turn trusted enterprise data into decisions, automation and AI-enabled workflows teams can use every day.",
    linkHref: "/ai-data",
    linkLabel: "Explore AI & Data",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Data analytics, machine learning, and enterprise intelligence dashboard",
  },
  {
    number: "04",
    category: "APPLICATION ENGINEERING",
    title: "Build enterprise applications and integrations around critical workflow gaps.",
    description:
      "Build focused applications and digital experiences where packaged software no longer fits the workflow.",
    linkHref: "/capabilities/digital-engineering",
    linkLabel: "Explore Engineering",
    image:
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Software engineers designing scalable cloud architecture",
  },
];

export default function WhatWeDo() {
  return (
    <section id="what-we-do" className="mkt-section bg-[#F7F8FA] text-[#101828]">
      <div className="mkt-shell">
        <SectionLabel tone="burgundy">What We Do</SectionLabel>

        <div className="mt-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="font-serif text-3xl font-semibold tracking-[-0.03em] text-[#101828] sm:text-4xl lg:text-5xl"
          >
            From operating model to production.
          </motion.h2>
          <p className="max-w-md text-sm text-[#475467] sm:text-base">
            Four interconnected practices designed to turn strategic vision into
            reliable day-to-day operations.
          </p>
        </div>

        {/* 4 Large Alternating Editorial Blocks */}
        <div className="mt-20 space-y-20 lg:space-y-28">
          {capabilities.map((cap, index) => {
            const isReversed = index % 2 === 1;
            return (
              <motion.article
                key={cap.category}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-16 border-t border-[#E2E7EC] pt-14"
              >
                {/* Text Content (55% width) */}
                <div
                  className={`lg:col-span-7 ${
                    isReversed ? "lg:order-2" : "lg:order-1"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-serif text-lg font-normal text-[#B63838]">
                      {cap.number}
                    </span>
                    <span className="text-[0.72rem] font-bold uppercase tracking-[0.14em] text-[#B63838]">
                      {cap.category}
                    </span>
                  </div>
                  <h3 className="mt-3 font-serif text-2xl font-semibold tracking-[-0.02em] text-[#101828] sm:text-3xl lg:text-4xl lg:leading-[1.15]">
                    {cap.title}
                  </h3>
                  <p className="mt-4 max-w-xl text-base leading-relaxed text-[#475467]">
                    {cap.description}
                  </p>
                  {cap.tags && cap.tags.length > 0 && (
                    <div className="mt-5 flex flex-wrap gap-x-4 gap-y-1.5">
                      {cap.tags.map((tag) => (
                        <span key={tag} className="text-xs font-semibold text-[#344054]">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="mt-8">
                    <Link
                      href={cap.linkHref}
                      className="group inline-flex items-center gap-2 text-sm font-semibold text-[#B63838] transition-colors hover:text-[#8F292D]"
                    >
                      <span>{cap.linkLabel}</span>
                      <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </Link>
                  </div>
                </div>

                {/* Photography Module (45% width) */}
                <div
                  className={`lg:col-span-5 ${
                    isReversed ? "lg:order-1" : "lg:order-2"
                  }`}
                >
                  <div className="relative aspect-[3/2] lg:h-[380px] w-full overflow-hidden rounded-lg border border-[#E2E7EC] bg-[#FFFFFF] shadow-[0_12px_36px_rgba(20,30,45,0.06)]">
                    <Image
                      src={cap.image}
                      alt={cap.imageAlt}
                      fill
                      className="object-cover mkt-img-graded"
                      sizes="(max-width: 1024px) 100vw, 45vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#101828]/30 via-transparent to-transparent" />
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
