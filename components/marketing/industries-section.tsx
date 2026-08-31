"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

import SectionLabel from "@/components/marketing/SectionLabel";

const industries = [
  {
    name: "Government & Public Sector",
    description: "Modernizing core systems, grant administration, procurement, and civilian services.",
    href: "/industries/public-sector",
    image: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Financial Services",
    description: "Fusion ERP accounting, automated compliance, risk telemetry, and unified banking CRM.",
    href: "/industries/financial-services",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Healthcare & Life Sciences",
    description: "Clinical documentation intelligence, patient record pipelines, and secure provider portals.",
    href: "/industries/healthcare",
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Technology & Software",
    description: "Digital engineering, API platform ecosystems, modern data architecture, and AI scale.",
    href: "/industries/technology",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
  },
];

export default function IndustriesSection() {
  return (
    <section id="industries" className="mkt-section bg-[#F7F8FA] text-[#101828]">
      <div className="mkt-shell">
        <SectionLabel tone="burgundy">Industries</SectionLabel>

        <div className="mt-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="font-serif text-3xl font-semibold tracking-[-0.03em] sm:text-4xl lg:text-5xl"
          >
            Domain depth where regulations and operations matter most.
          </motion.h2>
          <p className="max-w-md text-sm text-[#475467] sm:text-base">
            Deep vertical experience combining regulatory compliance, industry standards, and production execution.
          </p>
        </div>

        {/* 2x2 Photographic Tiles with Clean Neutral Overlays */}
        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {industries.map((ind, idx) => (
            <motion.div
              key={ind.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
            >
              <Link
                href={ind.href}
                className="group relative block aspect-[16/10] sm:aspect-[4/3] lg:aspect-[16/10] overflow-hidden rounded-xl border border-[#E2E7EC] bg-[#101828]"
              >
                <Image
                  src={ind.image}
                  alt={ind.name}
                  fill
                  className="object-cover mkt-img-graded transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, 50vw"
                />
                {/* Neutral Dark Overlay (no brown) */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#101828]/90 via-[#101828]/45 to-transparent transition-opacity duration-300 group-hover:from-[#101828]/95" />

                <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif text-xl font-semibold text-[#FFFFFF] sm:text-2xl group-hover:text-[#F5DEDE] transition-colors">
                      {ind.name}
                    </h3>
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FFFFFF]/10 backdrop-blur-xs text-[#FFFFFF] group-hover:bg-[#B63838] transition-colors">
                      <ArrowUpRight className="h-4 w-4" />
                    </div>
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-[#A4B1BE] sm:text-sm">
                    {ind.description}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
