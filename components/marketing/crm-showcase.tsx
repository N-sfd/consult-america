"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

import { stockImage } from "@/lib/marketing/stock-images";
import Image from "next/image";

const journeySteps = ["DISCOVER", "ENGAGE", "SELL", "SERVE", "EXPAND"];

export default function CRMShowcase() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="crm-cx" className="border-b border-[#E1ECE8] bg-white py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-8 xl:px-10">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center lg:gap-12">
          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-6"
          >
            <p className="text-[0.75rem] font-bold uppercase tracking-[0.14em] text-[#176A63]">
              CRM &amp; Customer Experience
            </p>
            <h2 className="mt-4 max-w-xl font-serif text-[clamp(1.75rem,3vw,2.5rem)] font-semibold tracking-[-0.03em] text-[#073B3A]">
              Connect every customer moment to the enterprise behind it.
            </h2>

            <div className="mt-8 flex flex-wrap gap-2 border-t border-[#DDE6E3] pt-6">
              {journeySteps.map((step, idx) => (
                <div
                  key={step}
                  className={`rounded-full px-4 py-2 text-[0.68rem] font-bold tracking-[0.1em] ${
                    idx === 2
                      ? "bg-[#073B3A] text-white"
                      : "border border-[#DDE6E3] bg-[#F7FAF9] text-[#073B3A]"
                  }`}
                >
                  {step}
                </div>
              ))}
            </div>

            <Link
              href="/platforms/crm"
              className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-[#176A63] hover:text-[#073B3A]"
            >
              Explore CRM
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </motion.div>

          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.06 }}
            className="lg:col-span-6"
          >
            <div className="relative ml-auto max-h-[420px] w-full max-w-[560px] overflow-hidden rounded-[14px] border border-[#DDE6E3]">
              <div className="relative aspect-[16/10] max-h-[420px] w-full">
                <Image
                  src={stockImage("crmShowcase", { w: 1200, q: 85 })}
                  alt="Enterprise customer relationship operations"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 42vw"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
