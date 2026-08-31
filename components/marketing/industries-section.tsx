"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

import SectionLabel from "@/components/marketing/SectionLabel";

const industries = [
  {
    name: "Government & Public Sector",
    description: "Modernizing core state and federal systems, grant disbursement, and public sector workflows.",
    href: "/industries/public-sector",
    image: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1000&q=85",
    badge: "Public Sector",
  },
  {
    name: "Financial Services",
    description: "Multi-entity Fusion ERP accounting, automated reconciliation, and unified banking CRM.",
    href: "/industries/financial-services",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1000&q=85",
    badge: "Financial Core",
  },
  {
    name: "Healthcare & Life Sciences",
    description: "Clinical documentation intelligence, secure patient record pipelines, and healthcare data governance.",
    href: "/industries/healthcare",
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1000&q=85",
    badge: "Clinical Intelligence",
  },
  {
    name: "Technology & Software",
    description: "Full-stack digital engineering, API platform ecosystems, modern data architecture, and AI scale.",
    href: "/industries/technology",
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1000&q=85",
    badge: "Cloud & APIs",
  },
  {
    name: "Retail & Commerce",
    description: "Omnichannel inventory synchronization, supplier procurement portals, and customer lifetime value.",
    href: "/platforms/crm",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1000&q=85",
    badge: "Supply Chain",
  },
  {
    name: "Professional Services",
    description: "Project costing and billing, utilization analytics, and automated workforce platforms.",
    href: "/platforms/ats",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1000&q=85",
    badge: "Workforce",
  },
];

export default function IndustriesSection() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="industries" className="bg-[#F7F3EC] text-[#261F1B] py-24 sm:py-28 lg:py-32 border-b border-[#D7CCBD]">
      <div className="mkt-shell">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end pb-10 border-b border-[#D7CCBD]">
          <div>
            <SectionLabel tone="burgundy">INDUSTRIES</SectionLabel>
            <h2 className="mt-3 font-serif text-3xl font-semibold tracking-tight text-[#261F1B] sm:text-4xl lg:text-5xl">
              Domain depth where operations matter most.
            </h2>
          </div>
          <p className="max-w-md text-sm sm:text-base text-[#695F57]">
            Vertical expertise combining complex regulatory requirements, enterprise standards, and production execution.
          </p>
        </div>

        {/* 6 Standardized 4:5 Industry Photographic Panels (Requirement 10 & 19) */}
        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {industries.map((ind, idx) => (
            <motion.div
              key={ind.name}
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.06 }}
            >
              <Link
                href={ind.href}
                className="group relative block w-full aspect-[4/5] overflow-hidden rounded-[14px] border border-[#D7CCBD] bg-[#211E1B] shadow-[0_12px_36px_rgba(38,31,27,0.08)]"
              >
                <Image
                  src={ind.image}
                  alt={ind.name}
                  fill
                  className="object-cover mkt-img-graded"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                
                {/* Subtle dark bottom gradient for text contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#211E1B]/90 via-[#211E1B]/40 to-transparent pointer-events-none" />

                <div className="absolute inset-0 p-6 sm:p-7 flex flex-col justify-between text-white">
                  <div className="flex justify-end">
                    <span className="rounded-full bg-white/15 backdrop-blur-md px-2.5 py-1 text-[0.62rem] font-bold tracking-wider text-[#D8C5AA] border border-white/20">
                      {ind.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-serif text-xl sm:text-2xl font-bold leading-tight group-hover:text-[#D8C5AA] transition-colors">
                      {ind.name}
                    </h3>
                    <p className="mt-2 text-xs sm:text-sm leading-relaxed text-[#C5BCB3] line-clamp-2">
                      {ind.description}
                    </p>

                    <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-[#D8C5AA] group-hover:text-white transition-colors">
                      <span>Explore Industry</span>
                      <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
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
