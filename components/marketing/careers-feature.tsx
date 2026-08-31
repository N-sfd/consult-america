"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

export default function CareersFeature() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="careers-preview" className="bg-[#FFFFFF] text-[#163536] py-16 sm:py-20 lg:py-24 border-b border-[#DCE4E1]">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-8 xl:px-10">
        <div className="overflow-hidden rounded-[10px] border border-[#DCE4E1] bg-[#EEF3F1] shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
            {/* LEFT: Large Photograph */}
            <motion.div
              initial={shouldReduceMotion ? {} : { opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative aspect-[4/3] sm:aspect-[16/10] lg:aspect-auto lg:col-span-6 overflow-hidden bg-[#0B3332]"
            >
              <Image
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=85"
                alt="Consult America senior engineering and enterprise consulting team members collaborating"
                fill
                className="object-cover mkt-img-graded"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </motion.div>

            {/* RIGHT: Content on Soft Green-Gray Surface */}
            <motion.div
              initial={shouldReduceMotion ? {} : { opacity: 0, x: 16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55 }}
              className="p-8 sm:p-12 lg:p-16 lg:col-span-6 bg-[#EEF3F1] text-[#163536] flex flex-col justify-between space-y-6"
            >
              <div>
                <div className="inline-flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#103F3E]" />
                  <span className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#103F3E]">
                    CAREERS AT CONSULT AMERICA
                  </span>
                </div>

                <h3 className="mt-4 font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-[-0.03em] text-[#163536] leading-[1.08]">
                  Build what&apos;s next.
                </h3>

                <p className="mt-4 text-base sm:text-lg leading-relaxed text-[#596968]">
                  Work at the intersection of enterprise transformation, AI, data and application engineering.
                </p>
              </div>

              <div className="pt-6 border-t border-[#DCE4E1]">
                <Link
                  href="/careers"
                  className="inline-flex h-[48px] items-center justify-center gap-2 rounded-[6px] bg-[#B63A3A] px-7 text-sm font-semibold text-white shadow-[0_4px_16px_rgba(182,58,58,0.22)] hover:bg-[#992F31] transition-all cursor-pointer"
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
