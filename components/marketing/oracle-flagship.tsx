"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

import { stockImage } from "@/lib/marketing/stock-images";

const capabilities = [
  "Financials",
  "Procurement",
  "Supply Chain",
  "Projects",
  "HCM",
  "Integration & Data",
];

export default function OracleFlagship() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      id="oracle-practice"
      className="border-b border-[#E1ECE8] bg-[#F7FAF9] py-14 sm:py-16 lg:py-20"
    >
      <div className="mx-auto max-w-[1440px] px-6 lg:px-8 xl:px-10">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center lg:gap-12">
          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            className="lg:col-span-5"
          >
            <p className="text-[0.75rem] font-bold uppercase tracking-[0.14em] text-[#176A63]">
              Oracle Flagship Practice
            </p>
            <h2 className="mt-3 font-serif text-[clamp(1.75rem,3vw,2.5rem)] font-semibold tracking-[-0.03em] text-[#073B3A]">
              Modernize the digital core.
            </h2>
            <p className="mt-4 max-w-md text-[1.0625rem] leading-relaxed text-[#5B6D6B]">
              Modernize finance, procurement, supply chain, projects, and workforce operations
              with connected Oracle Cloud transformation.
            </p>

            <ul className="mt-6 grid grid-cols-2 gap-x-6 gap-y-2">
              {capabilities.map((name) => (
                <li key={name} className="text-sm font-medium text-[#073B3A]">
                  {name}
                </li>
              ))}
            </ul>

            <Link
              href="/oracle"
              className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-[#176A63] hover:text-[#073B3A]"
            >
              Explore Oracle
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </motion.div>

          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.06 }}
            className="lg:col-span-7"
          >
            <div className="relative ml-auto max-h-[420px] w-full max-w-[600px] overflow-hidden ca-hero-shape-arch ring-1 ring-[#DDE6E3]">
              <div className="relative aspect-[4/3] w-full max-h-[420px]">
                <Image
                  src={stockImage("oracleFlagship", { w: 1400, q: 85 })}
                  alt="Oracle Cloud enterprise transformation"
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
