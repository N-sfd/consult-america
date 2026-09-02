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

const revealEase = [0.2, 0.8, 0.2, 1] as const;

export default function OracleFlagship() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      id="oracle-practice"
      className="relative overflow-hidden border-b border-[#E1ECE8] bg-white py-14 sm:py-16 lg:py-20"
    >
      <div className="mx-auto max-w-[1440px] px-6 lg:px-8 xl:px-10">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center lg:gap-14">
          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 18, scale: 0.985 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.78, ease: revealEase }}
            className="lg:col-span-5 lg:order-1"
          >
            <div className="ca-home-compose relative mx-auto max-w-[480px] lg:mx-0">
              <div
                aria-hidden="true"
                className="ca-home-sage-panel ca-home-moving--slow -right-6 top-8 hidden h-[420px] w-[200px] opacity-80 lg:block"
              />
              <div
                aria-hidden="true"
                className="ca-home-ring ca-home-orbit left-[-12%] top-[10%] hidden h-[min(380px,36vw)] w-[min(380px,36vw)] lg:block"
              />
              <div className="ca-home-frame-tall ca-home-photo-overlay relative z-10 shadow-[0_24px_56px_rgba(7,59,58,0.10)] ring-1 ring-[#DDE6E3]">
                <div className="ca-home-img-oracle relative aspect-[4/5] w-full max-h-[560px]">
                  <Image
                    src={stockImage("oracleFlagship", { w: 1200, q: 85 })}
                    alt="Oracle Cloud enterprise transformation"
                    fill
                    className="ca-home-photo object-cover object-center"
                    sizes="(max-width: 1024px) 100vw, 38vw"
                  />
                </div>
              </div>
              <div className="ca-home-frame-offset absolute -bottom-4 -right-2 z-20 hidden h-[210px] w-[170px] overflow-hidden shadow-lg ring-1 ring-[#DDE6E3] max-[1179px]:hidden xl:block">
                <div className="relative h-full w-full">
                  <Image
                    src={stockImage("capabilitiesModernize", { w: 600, q: 85 })}
                    alt="Enterprise operations detail"
                    fill
                    className="ca-home-photo object-cover"
                    sizes="170px"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: revealEase }}
            className="lg:col-span-7 lg:order-2"
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
        </div>
      </div>
    </section>
  );
}
