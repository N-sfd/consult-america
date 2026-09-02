"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

import { stockImage } from "@/lib/marketing/stock-images";

const journeySteps = ["DISCOVER", "ENGAGE", "SELL", "SERVE", "EXPAND"];
const revealEase = [0.2, 0.8, 0.2, 1] as const;

export default function CRMShowcase() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="crm-cx" className="border-b border-[#E1ECE8] bg-white py-14 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-8 xl:px-10">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center lg:gap-14">
          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 18, scale: 0.985 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.78, ease: revealEase }}
            className="lg:col-span-6 lg:order-1"
          >
            <div className="ca-home-compose relative mx-auto max-w-[520px] lg:mx-0">
              <div
                aria-hidden="true"
                className="ca-home-ring ca-home-orbit -left-[8%] top-[20%] hidden h-[280px] w-[280px] opacity-40 lg:block"
              />
              <div className="ca-home-frame-wide ca-home-photo-overlay relative z-10 shadow-[0_20px_48px_rgba(7,59,58,0.08)] ring-1 ring-[#DDE6E3]">
                <div className="ca-home-img-major relative aspect-[16/10] w-full max-h-[400px]">
                  <Image
                    src={stockImage("crmShowcase", { w: 1200, q: 85 })}
                    alt="Enterprise customer relationship operations"
                    fill
                    className="ca-home-photo object-cover"
                    sizes="(max-width: 1024px) 100vw, 42vw"
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
            className="lg:col-span-6 lg:order-2"
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
        </div>
      </div>
    </section>
  );
}
