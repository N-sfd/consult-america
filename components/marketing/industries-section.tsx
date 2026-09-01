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
    aspect: "aspect-[4/5]",
    shapeClass: "ca-shape-arch",
  },
  {
    name: "Financial Services",
    description: "Multi-entity Fusion ERP accounting, automated reconciliation, and unified banking CRM.",
    href: "/industries/financial-services",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1000&q=85",
    badge: "Financial Core",
    aspect: "aspect-[16/10]",
    shapeClass: "ca-corner-tr-accent",
  },
  {
    name: "Healthcare & Life Sciences",
    description: "Clinical documentation intelligence, secure patient record pipelines, and healthcare data governance.",
    href: "/industries/healthcare",
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1000&q=85",
    badge: "Clinical Intelligence",
    aspect: "aspect-[3/4]",
    shapeClass: "rounded-2xl",
  },
  {
    name: "Technology & Software",
    description: "Full-stack digital engineering, API platform ecosystems, modern data architecture, and AI scale.",
    href: "/industries/technology",
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1000&q=85",
    badge: "Cloud & APIs",
    aspect: "aspect-[16/10]",
    shapeClass: "rounded-2xl",
  },
  {
    name: "Retail & Commerce",
    description: "Omnichannel inventory synchronization, supplier procurement portals, and customer lifetime value.",
    href: "/platforms/crm",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1000&q=85",
    badge: "Supply Chain",
    aspect: "aspect-[3/4]",
    shapeClass: "rounded-2xl",
  },
  {
    name: "Professional Services",
    description: "Project costing and billing, utilization analytics, and automated workforce platforms.",
    href: "/platforms/ats",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1000&q=85",
    badge: "Workforce",
    aspect: "aspect-[16/10]",
    shapeClass: "rounded-2xl",
  },
];

export default function IndustriesSection() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="industries" className="relative mkt-section-clip bg-[#F7F3EC] text-[#261F1B] py-24 sm:py-28 lg:py-32 border-b border-[#D8D0C5] overflow-hidden">
      {/* Slow architectural background behind industries introduction */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[420px] overflow-hidden" aria-hidden="true">
        <motion.div
          animate={
            shouldReduceMotion
              ? {}
              : {
                  y: [10, -10, 10],
                  scale: [1.02, 1.035, 1.02],
                }
          }
          transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-[-6%] opacity-[0.10]"
        >
          <Image
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2000&q=80"
            alt=""
            fill
            className="object-cover object-center mkt-img-graded"
            sizes="100%"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#F7F3EC]/40 via-[#F7F3EC]/85 to-[#F7F3EC]" />
      </div>

      <div className="mkt-shell relative z-10">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end pb-10 border-b border-[#D8D0C5]">
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

        {/* Varied Industry Shapes: Arch, Landscape, Portrait (Requirements 20 & 21) */}
        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-end">
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
                className={`group relative block w-full ${ind.aspect} ${ind.shapeClass} overflow-hidden border border-[#D8D0C5] bg-[#211E1B] shadow-[0_12px_36px_rgba(38,31,27,0.08)]`}
              >
                <Image
                  src={ind.image}
                  alt={ind.name}
                  fill
                  className="object-cover mkt-img-graded group-hover:scale-[1.025] transition-transform duration-[650ms] ease-[cubic-bezier(0.2,0.8,0.2,1)]"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                
                {/* Dark overlay: opacity + 0.05 on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#211E1B]/95 via-[#211E1B]/50 to-transparent group-hover:from-[#211E1B] group-hover:via-[#211E1B]/60 transition-all duration-500 pointer-events-none" />

                <div className="absolute inset-0 p-6 sm:p-7 flex flex-col justify-between text-white">
                  <div className="flex justify-end">
                    <span className="rounded-full bg-white/15 backdrop-blur-md px-2.5 py-1 text-[0.62rem] font-bold tracking-wider text-[#D8C5AA] border border-white/20">
                      {ind.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-serif text-xl sm:text-2xl font-bold leading-tight group-hover:text-[#D8C5AA] group-hover:-translate-y-1 transition-all duration-300">
                      {ind.name}
                    </h3>
                    
                    {/* Small burgundy line 0 -> 32px on hover */}
                    <div className="h-0.5 w-0 bg-[#B63A3A] group-hover:w-8 transition-all duration-500 mt-2 mb-2" />
                    
                    <p className="text-xs text-[rgba(255,253,248,0.78)] line-clamp-2 leading-relaxed">
                      {ind.description}
                    </p>
                    
                    <div className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-[#D8C5AA] group-hover:text-white transition-colors">
                      <span>Explore Sector</span>
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
