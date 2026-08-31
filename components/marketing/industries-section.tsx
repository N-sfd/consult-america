"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

import SectionLabel from "@/components/marketing/SectionLabel";

const industries = [
  {
    name: "Government & Public Sector",
    description: "Modernizing core state and federal systems, grant administration, procurement, and civilian services.",
    href: "/industries/public-sector",
    image: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1000&q=80",
    badge: "FedRAMP & FISMA",
  },
  {
    name: "Financial Services",
    description: "Multi-entity Fusion ERP accounting, automated compliance, risk telemetry, and unified banking CRM.",
    href: "/industries/financial-services",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1000&q=80",
    badge: "SOX & Period Close",
  },
  {
    name: "Healthcare & Life Sciences",
    description: "Clinical documentation intelligence, patient record pipelines, and secure provider collaboration workspaces.",
    href: "/industries/healthcare",
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1000&q=80",
    badge: "HIPAA Compliant AI",
  },
  {
    name: "Technology & Software",
    description: "Full-stack digital engineering, API platform ecosystems, modern data architecture, and AI scale.",
    href: "/industries/technology",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1000&q=80",
    badge: "Cloud Native & APIs",
  },
];

export default function IndustriesSection() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="industries" className="bg-[#F4EFE6] text-[#261F1B] py-20 sm:py-24 lg:py-28 border-b border-[#D7CCBD]">
      <div className="mkt-shell">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end pb-10 border-b border-[#D7CCBD]">
          <div>
            <SectionLabel tone="burgundy">INDUSTRIES</SectionLabel>
            <h2 className="mt-3 font-serif text-3xl font-semibold tracking-tight text-[#261F1B] sm:text-4xl lg:text-5xl">
              Domain depth where operations matter most.
            </h2>
          </div>
          <p className="max-w-md text-sm sm:text-base text-[#695F57]">
            Deep vertical experience combining regulatory compliance, industry standards, and production execution.
          </p>
        </div>

        {/* 4 Large Full-Bleed Photographic Editorial Panels */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {industries.map((ind, idx) => (
            <motion.div
              key={ind.name}
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
            >
              <Link
                href={ind.href}
                className="group relative block aspect-[3/4] sm:aspect-[4/5] overflow-hidden rounded-2xl border border-[#D7CCBD] bg-[#211E1B] shadow-[0_12px_36px_rgba(38,31,27,0.08)]"
              >
                {/* Background Image */}
                <Image
                  src={ind.image}
                  alt={ind.name}
                  fill
                  className="object-cover mkt-img-graded transition-transform duration-700 group-hover:scale-103"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />

                {/* Dark Translucent Editorial Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#211E1B]/95 via-[#211E1B]/55 to-transparent transition-opacity duration-300 group-hover:from-[#211E1B]/98" />

                {/* Card Content */}
                <div className="absolute inset-0 p-6 flex flex-col justify-between text-white">
                  <div className="flex justify-end">
                    <span className="rounded-full bg-white/10 backdrop-blur-md px-2.5 py-1 text-[0.62rem] font-bold tracking-wider text-[#D8C5AA] border border-white/15">
                      {ind.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-serif text-xl sm:text-2xl font-bold leading-tight group-hover:text-[#D8C5AA] transition-colors">
                      {ind.name}
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-[#C5BCB3] line-clamp-3">
                      {ind.description}
                    </p>

                    <div className="mt-4 pt-3 border-t border-white/15 flex items-center justify-between text-xs font-bold text-[#D8C5AA]">
                      <span>Explore Practice</span>
                      <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
