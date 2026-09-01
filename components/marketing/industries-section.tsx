"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

import { ShapedPhoto } from "@/components/marketing/shaped-photo";
import SectionBackdrop from "@/components/marketing/section-backdrop";
import { stockImage } from "@/lib/marketing/stock-images";

const industries = [
  {
    name: "Government & Public Sector",
    description: "Modernizing core public service systems, grants administration, and agency workflows.",
    href: "/industries/public-sector",
    image: stockImage("industriesSectionGovernment", { w: 1000, q: 80 }),
    focus: "Public Sector Modernization",
    shape: "arch" as const,
  },
  {
    name: "Healthcare & Life Sciences",
    description: "Clinical documentation intelligence, patient record connectivity, and care coordination.",
    href: "/industries/healthcare",
    image: stockImage("industriesSectionHealthcare", { w: 1000, q: 80 }),
    focus: "Clinical & Health Tech",
    shape: "asymmetric" as const,
  },
  {
    name: "Financial Services",
    description: "Multi-entity ledgers, financial close governance, and connected customer CRM.",
    href: "/industries/financial-services",
    image: stockImage("industriesSectionFinancial", { w: 1000, q: 80 }),
    focus: "Financial Platforms",
    shape: "asymmetric" as const,
  },
  {
    name: "Technology & Software",
    description: "API ecosystems, cloud foundations, and applied AI infrastructure for scaling products.",
    href: "/industries/technology",
    image: stockImage("industriesSectionTech", { w: 1000, q: 80 }),
    focus: "Cloud & Applied AI",
    shape: "arch" as const,
  },
];

export default function IndustriesSection() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="industries" className="ca-grad-dark relative overflow-hidden border-b border-[#073B3A] py-16 text-white sm:py-20 lg:py-24">
      <SectionBackdrop variant="dark" />

      <div className="relative z-10 mx-auto max-w-[1440px] px-6 lg:px-8 xl:px-10">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end pb-8 border-b border-[#9BC4B8]/25">
          <div>
            <div className="inline-flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#9BC4B8]" />
              <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#9BC4B8]">
                INDUSTRIES
              </span>
            </div>
            <h2 className="mt-3 font-serif text-3xl sm:text-4xl lg:text-[42px] font-semibold tracking-tight text-white">
              Industry Practices
            </h2>
          </div>
          <p className="max-w-md text-sm sm:text-base text-white/80">
            Domain depth combining regulatory context, operational nuances, and proven delivery methods.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {industries.map((ind, idx) => (
            <motion.div
              key={ind.name}
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
            >
              <Link
                href={ind.href}
                className="group relative block overflow-hidden"
              >
                <ShapedPhoto
                  src={ind.image}
                  alt={ind.name}
                  shape={ind.shape}
                  className="h-[360px] sm:h-[400px] border-white/20"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  overlay="none"
                  revealDirection={idx % 2 === 0 ? "left" : "right"}
                />
                <div className="absolute inset-0 bg-[#073B3A]/55 transition-colors duration-300 group-hover:bg-[#073B3A]/65 z-10" />
                <div className="mkt-overlay-caption z-10" />

                <div className="absolute inset-0 p-7 sm:p-8 flex flex-col justify-between text-white z-20">
                  <div className="flex justify-end">
                    <span className="rounded-[8px] bg-white/15 backdrop-blur-md px-3 py-1 text-[0.68rem] font-bold tracking-wider text-white border border-white/25">
                      {ind.focus}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-serif text-2xl sm:text-3xl font-bold leading-tight">
                      {ind.name}
                    </h3>
                    <p className="mt-2 text-xs sm:text-sm leading-relaxed text-white/80 line-clamp-2">
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
