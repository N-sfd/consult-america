"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

import SectionLabel from "@/components/marketing/SectionLabel";

const industries = [
  {
    name: "Government & Public Sector",
    description: "Modernizing core public service systems, grants administration, financial management, and agency workflows.",
    href: "/industries/public-sector",
    image: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1000&q=80",
    focus: "Public Sector Modernization",
  },
  {
    name: "Healthcare & Life Sciences",
    description: "Clinical documentation intelligence, patient record connectivity, intake workflows, and care coordination.",
    href: "/industries/healthcare",
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1000&q=80",
    focus: "Clinical & Health Tech",
  },
  {
    name: "Financial Services",
    description: "Multi-entity enterprise ledgers, financial close governance, operational risk oversight, and connected customer CRM.",
    href: "/industries/financial-services",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1000&q=80",
    focus: "Financial Platforms",
  },
  {
    name: "Technology & Software",
    description: "API ecosystems, cloud platform foundations, event routing, and applied AI infrastructure for scaling digital products.",
    href: "/industries/technology",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1000&q=80",
    focus: "Cloud & Applied AI",
  },
];

export default function IndustriesSection() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="industries" className="bg-[#F8FAFA] text-[#102033] py-16 sm:py-20 lg:py-24 border-b border-[#DCE3E5]">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-8 xl:px-10">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end pb-8 border-b border-[#DCE3E5]">
          <div>
            <div className="inline-flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#0E514E]" />
              <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#5A6770]">
                INDUSTRIES
              </span>
            </div>
            <h2 className="mt-3 font-serif text-3xl sm:text-4xl lg:text-[42px] font-semibold tracking-tight text-[#102033]">
              Industry Practices
            </h2>
          </div>
          <p className="max-w-md text-sm sm:text-base text-[#5A6770]">
            Domain depth combining regulatory context, operational nuances, and proven delivery methods.
          </p>
        </div>

        {/* 2x2 Photography Grid with Dark Teal / Navy Overlays */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
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
                className="group relative block h-[360px] sm:h-[390px] overflow-hidden rounded-[10px] border border-[#DCE3E5] bg-[#0B1F2D] shadow-sm"
              >
                {/* Background Image */}
                <Image
                  src={ind.image}
                  alt={ind.name}
                  fill
                  className="object-cover mkt-img-graded transition-transform duration-700 group-hover:scale-102"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />

                {/* Subtle Navy / Dark Teal Overlay & Gradient */}
                <div className="absolute inset-0 bg-[#0B1F2D]/45 transition-colors duration-300 group-hover:bg-[#0B1F2D]/55" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F2D]/95 via-[#0E514E]/30 to-transparent" />

                {/* Content */}
                <div className="absolute inset-0 p-7 sm:p-8 flex flex-col justify-between text-white">
                  <div className="flex justify-end">
                    <span className="rounded-[6px] bg-white/15 backdrop-blur-md px-3 py-1 text-[0.68rem] font-bold tracking-wider text-white border border-white/20">
                      {ind.focus}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-serif text-2xl sm:text-3xl font-bold leading-tight group-hover:text-white transition-colors">
                      {ind.name}
                    </h3>
                    <p className="mt-2 text-xs sm:text-sm leading-relaxed text-[#DCE3E5] line-clamp-2">
                      {ind.description}
                    </p>

                    <div className="mt-5 pt-3 border-t border-white/20 flex items-center justify-between text-xs font-bold text-white">
                      <span>Explore Practice</span>
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1.5 text-white" />
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
