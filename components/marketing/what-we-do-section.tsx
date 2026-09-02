"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

import { stockImage } from "@/lib/marketing/stock-images";

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

const revealEase = [0.2, 0.8, 0.2, 1] as const;

export default function WhatWeDoSection() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden border-b border-[#E1ECE8] bg-[#F7FAF9] py-14 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-8 xl:px-10">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 18, scale: 0.985 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.78, ease: revealEase }}
            className="lg:col-span-5"
          >
            <div className="ca-home-compose relative mx-auto max-w-[480px] lg:mx-0">
              <div
                aria-hidden="true"
                className="ca-home-sage-disc ca-home-moving--fast -left-[8%] bottom-[-6%] hidden h-[280px] w-[280px] opacity-60 lg:block"
              />
              <div className="ca-home-frame-offset ca-home-photo-overlay relative z-10 shadow-[0_20px_48px_rgba(7,59,58,0.08)] ring-1 ring-[#DDE6E3]">
                <div className="ca-home-img-major relative aspect-[4/5] w-full max-h-[420px]">
                  <Image
                    src={stockImage("capabilitiesTransform", { w: 1200, q: 85 })}
                    alt="Enterprise transformation team"
                    fill
                    className="ca-home-photo object-cover"
                    sizes="(max-width: 1024px) 100vw, 38vw"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          <div className="lg:col-span-7">
            <motion.div
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: revealEase }}
            >
              <p className="text-[0.72rem] font-bold uppercase tracking-[0.14em] text-[#176A63]">What we do</p>
              <h2 className="mt-3 font-serif text-[clamp(1.75rem,3vw,2.5rem)] font-semibold tracking-[-0.03em] text-[#073B3A]">
                Strategy that reaches production.
              </h2>
            </motion.div>

            <div className="mt-8 space-y-0">
              {capabilities.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={shouldReduceMotion ? {} : { opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.05, ease: revealEase }}
                >
                  <Link
                    href={item.href}
                    className="ca-home-pillar group block border-t border-[#DDE6E3] py-5"
                  >
                    <h3 className="ca-home-pillar-label text-xs font-bold uppercase tracking-[0.14em] text-[#073B3A] group-hover:text-[#176A63]">
                      {item.title}
                    </h3>
                    <p className="mt-2 max-w-lg text-sm leading-relaxed text-[#5B6D6B]">{item.detail}</p>
                    <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-[#176A63] opacity-0 transition-opacity group-hover:opacity-100">
                      Learn more
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
