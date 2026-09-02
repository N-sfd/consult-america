"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

const capabilities = [
  {
    title: "Transformation",
    detail: "Align strategy, operating models, and delivery to modernize how the enterprise runs.",
    href: "/capabilities/enterprise-transformation",
  },
  {
    title: "Oracle",
    detail: "Modernize finance, procurement, supply chain, projects, and workforce on Oracle Cloud.",
    href: "/oracle",
  },
  {
    title: "AI & Data",
    detail: "Put governed intelligence into operational workflows with trusted data foundations.",
    href: "/ai-data",
  },
  {
    title: "Application Engineering",
    detail: "Engineer focused products and platforms where packaged software stops.",
    href: "/capabilities/digital-engineering",
  },
];

export default function WhatWeDoSection() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="border-b border-[#E1ECE8] bg-[#F7FAF9] py-14 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-8 xl:px-10">
        <div className="max-w-2xl">
          <p className="text-[0.72rem] font-bold uppercase tracking-[0.14em] text-[#176A63]">What we do</p>
          <h2 className="mt-3 font-serif text-[clamp(1.75rem,3vw,2.5rem)] font-semibold tracking-[-0.03em] text-[#073B3A]">
            Strategy that reaches production.
          </h2>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10">
          {capabilities.map((item, index) => (
            <motion.div
              key={item.title}
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.04 }}
            >
              <Link href={item.href} className="group block border-t border-[#DDE6E3] pt-4">
                <h3 className="text-xs font-bold uppercase tracking-[0.14em] text-[#073B3A] group-hover:text-[#176A63]">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[#5B6D6B]">{item.detail}</p>
                <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-[#176A63] opacity-0 transition-opacity group-hover:opacity-100">
                  Learn more
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
