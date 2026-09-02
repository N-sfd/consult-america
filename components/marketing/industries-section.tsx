"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

import { stockImage } from "@/lib/marketing/stock-images";

const industries = [
  {
    name: "Government & Public Sector",
    href: "/industries/government-public-sector",
    image: stockImage("industriesSectionGovernment", { w: 1000, q: 80 }),
  },
  {
    name: "Financial Services",
    href: "/industries/financial-services",
    image: stockImage("industriesSectionFinancial", { w: 1000, q: 80 }),
  },
  {
    name: "Healthcare & Life Sciences",
    href: "/industries/healthcare",
    image: stockImage("industriesSectionHealthcare", { w: 1000, q: 80 }),
  },
  {
    name: "Technology & Software",
    href: "/industries/technology",
    image: stockImage("industriesSectionTech", { w: 1000, q: 80 }),
  },
  {
    name: "Retail & Commerce",
    href: "/industries/retail-consumer",
    image: stockImage("industriesSectionGovernment", { w: 1000, q: 80 }),
  },
  {
    name: "Professional Services",
    href: "/capabilities/enterprise-transformation",
    image: stockImage("industriesSectionFinancial", { w: 1000, q: 80 }),
  },
];

export default function IndustriesSection() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="industries" className="border-b border-[#E1ECE8] bg-white py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-8 xl:px-10">
        <div className="max-w-2xl">
          <p className="text-[0.75rem] font-bold uppercase tracking-[0.14em] text-[#176A63]">Industries</p>
          <h2 className="mt-3 font-serif text-[clamp(2rem,3.2vw,2.75rem)] font-semibold tracking-[-0.03em] text-[#073B3A]">
            Industry practices.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-[#5B6D6B]">
            Domain knowledge for complex, regulated, and technology-intensive operations.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {industries.map((ind, idx) => (
            <motion.div
              key={ind.name}
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.04 }}
            >
              <Link
                href={ind.href}
                className="group block overflow-hidden rounded-[14px] border border-[#DDE6E3] bg-[#F7FAF9]"
              >
                <div className="relative h-[220px] sm:h-[240px]">
                  <Image
                    src={ind.image}
                    alt={ind.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#073B3A]/70 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 flex items-center justify-between p-5 text-white">
                    <h3 className="text-base font-semibold sm:text-lg">{ind.name}</h3>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
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
