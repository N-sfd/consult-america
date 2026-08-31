"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

import { stockImage } from "@/lib/marketing/stock-images";

export default function CareersFeature() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="careers-preview" className="bg-[#FFFFFF] text-[#122D2E] py-16 sm:py-20 lg:py-24 border-b border-[#C9DDD7]">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-8 xl:px-10">
        <div className="overflow-hidden rounded-[16px] border border-[#C9DDD7] bg-[#E1ECE8] ca-shadow-elevated">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
            {/* LEFT: Large Team Photograph with Custom Architectural Shape */}
            <motion.div
              initial={shouldReduceMotion ? {} : { opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative aspect-[4/3] sm:aspect-[16/10] lg:aspect-auto lg:col-span-6 overflow-hidden bg-[#073B3A] p-2 sm:p-3"
            >
              <div className="relative w-full h-full min-h-[340px] overflow-hidden rounded-[12px] lg:rounded-[120px_12px_12px_12px]">
                <Image
                  src={stockImage("careersHero", { w: 1200, q: 85 })}
                  alt="Consult America senior engineering and enterprise consulting team members collaborating"
                  fill
                  className="object-cover mkt-img-graded"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="mkt-overlay-soft" />
              </div>
            </motion.div>

            {/* RIGHT: Content on Soft Green-Gray Surface */}
            <motion.div
              initial={shouldReduceMotion ? {} : { opacity: 0, x: 16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55 }}
              className="p-8 sm:p-12 lg:p-16 lg:col-span-6 bg-[#E1ECE8] text-[#122D2E] flex flex-col justify-between space-y-6"
            >
              <div>
                <div className="inline-flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#176A63]" />
                  <span className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#0B4A47]">
                    CAREERS AT CONSULT AMERICA
                  </span>
                </div>

                <h3 className="mt-4 font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-[-0.03em] text-[#122D2E] leading-[1.08]">
                  Senior work, real programs.
                </h3>

                <p className="mt-4 text-base sm:text-lg leading-relaxed text-[#5B6D6B]">
                  Join practitioners who stay attached to Oracle transformations, AI &amp; data engineering, and the Consult America Labs products they ship — from architecture through cutover, not just the slide deck.
                </p>
              </div>

              <div className="pt-6 border-t border-[#C9DDD7]">
                <Link
                  href="/careers"
                  className="inline-flex h-[50px] items-center justify-center gap-2 rounded-[8px] bg-[#B83A3A] px-7 text-sm font-semibold text-white shadow-[0_4px_18px_rgba(184,58,58,0.25)] hover:bg-[#992F31] hover:shadow-[0_6px_22px_rgba(184,58,58,0.32)] transition-all cursor-pointer"
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
