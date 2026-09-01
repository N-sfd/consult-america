"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

import { ShapedPhoto } from "@/components/marketing/shaped-photo";
import SectionBackdrop from "@/components/marketing/section-backdrop";
import { stockImage } from "@/lib/marketing/stock-images";

export default function CareersFeature() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="careers-preview" className="relative overflow-hidden border-b border-[#9BC4B8]/40 bg-[#F0F6F4] py-16 text-[#073B3A] sm:py-20 lg:py-24">
      <SectionBackdrop variant="soft" />

      <div className="relative z-10 mx-auto max-w-[1440px] px-6 lg:px-8 xl:px-10">
        <div className="overflow-hidden rounded-[16px] border border-[#9BC4B8]/45 bg-[#E1ECE8] ca-shadow-elevated">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
            <motion.div
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="relative lg:col-span-6 overflow-hidden bg-[#073B3A] p-2 sm:p-3"
            >
              <div className="absolute -top-2 -left-2 w-[85%] h-[88%] rounded-[100px_14px_14px_14px] bg-[#0B4A47]/40 -z-0 hidden sm:block" />
              <ShapedPhoto
                src={stockImage("careersHero", { w: 1200, q: 85 })}
                alt="Consult America senior engineering and enterprise consulting team members collaborating"
                shape="arch"
                className="min-h-[340px] h-full border-[#9BC4B8]/30"
                sizes="(max-width: 1024px) 100vw, 50vw"
                revealDirection="left"
              />
            </motion.div>

            <motion.div
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.08 }}
              className="p-8 sm:p-12 lg:p-16 lg:col-span-6 bg-[#E1ECE8] flex flex-col justify-between space-y-6"
            >
              <div>
                <div className="inline-flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#176A63]" />
                  <span className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#176A63]">
                    CAREERS AT CONSULT AMERICA
                  </span>
                </div>

                <h3 className="mt-4 font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-[-0.03em] text-[#073B3A] leading-[1.08]">
                  Senior work, real programs.
                </h3>

                <p className="mt-4 text-base sm:text-lg leading-relaxed text-[#0B4A47]">
                  Join practitioners who stay attached to Oracle transformations, AI &amp; data engineering, and the Consult America Labs products they ship — from architecture through cutover.
                </p>
              </div>

              <div className="pt-6 border-t border-[#9BC4B8]/40">
                <Link
                  href="/careers"
                  className="inline-flex h-[50px] items-center justify-center gap-2 rounded-[8px] bg-[#B83A3A] px-7 text-sm font-semibold text-white shadow-[0_4px_18px_rgba(184,58,58,0.25)] hover:bg-[#992F31] transition-all cursor-pointer"
                >
                  <span>Explore Careers</span>
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
