"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

import SectionLabel from "@/components/marketing/SectionLabel";

const industries = [
  {
    name: "Government & Public Sector",
    description: "Core state and federal systems modernization, grants management, acquisition compliance, and public service portals.",
    href: "/industries/public-sector",
    image: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1000&q=80",
    badge: "FedRAMP & FISMA",
  },
  {
    name: "Healthcare & Life Sciences",
    description: "Clinical documentation intelligence, patient record pipelines, HIPAA data boundaries, and provider workspaces.",
    href: "/industries/healthcare",
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1000&q=80",
    badge: "HIPAA Compliant",
  },
  {
    name: "Financial Services",
    description: "Multi-entity Oracle Fusion ERP ledgers, SOX audit reconciliation, risk telemetry, and unified banking CRM.",
    href: "/industries/financial-services",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1000&q=80",
    badge: "SOX & Period Close",
  },
  {
    name: "Technology & Software",
    description: "High-throughput API ecosystems, cloud platform foundations, event routing, and applied AI infrastructure.",
    href: "/industries/technology",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1000&q=80",
    badge: "Cloud Native & APIs",
  },
];

export default function IndustriesSection() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="industries" className="bg-[#FFFFFF] text-[#102033] py-20 sm:py-24 lg:py-28 border-b border-[#DDE4E8]">
      <div className="ca-shell">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end pb-8 border-b border-[#DDE4E8]">
          <div>
            <SectionLabel tone="burgundy">INDUSTRIES</SectionLabel>
            <h2 className="mt-3 font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-[#102033]">
              Industry Practices
            </h2>
          </div>
          <p className="max-w-md text-sm sm:text-base text-[#526170]">
            Domain depth combining regulatory frameworks, operational nuances, and verified delivery accelerators.
          </p>
        </div>

        {/* 2x2 Photography Grid (Image height: 360–420px, Subtle navy overlay: rgba(12,34,51,.40), Text: white, CTA: Explore →) */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
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
                className="group relative block h-[360px] sm:h-[400px] overflow-hidden rounded-lg border border-[#DDE4E8] bg-[#0C2233] shadow-sm"
              >
                {/* Background Image */}
                <Image
                  src={ind.image}
                  alt={ind.name}
                  fill
                  className="object-cover mkt-img-graded transition-transform duration-700 group-hover:scale-102"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />

                {/* Subtle Navy Overlay rgba(12,34,51,0.40) & gradient */}
                <div className="absolute inset-0 bg-[#0C2233]/40 transition-colors duration-300 group-hover:bg-[#0C2233]/50" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0C2233]/90 via-[#0C2233]/40 to-transparent" />

                {/* Content */}
                <div className="absolute inset-0 p-7 sm:p-8 flex flex-col justify-between text-white">
                  <div className="flex justify-end">
                    <span className="rounded bg-white/15 backdrop-blur-md px-3 py-1 text-[0.65rem] font-bold tracking-wider text-white border border-white/20">
                      {ind.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-serif text-2xl sm:text-3xl font-bold leading-tight group-hover:text-[#F7F9FA] transition-colors">
                      {ind.name}
                    </h3>
                    <p className="mt-2 text-xs sm:text-sm leading-relaxed text-[#DDE4E8] line-clamp-2">
                      {ind.description}
                    </p>

                    <div className="mt-5 pt-3 border-t border-white/20 flex items-center justify-between text-xs font-bold text-white">
                      <span>Explore Practice</span>
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1.5" />
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
