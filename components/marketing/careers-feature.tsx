"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

export default function CareersFeature() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="careers-preview" className="bg-[#FFFFFF] text-[#102033] py-20 sm:py-24 border-b border-[#DDE4E8]">
      <div className="ca-shell">
        <div className="overflow-hidden rounded-xl border border-[#DDE4E8] bg-white shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
            {/* LEFT: Large Photograph */}
            <motion.div
              initial={shouldReduceMotion ? {} : { opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative aspect-[4/3] sm:aspect-[16/10] lg:aspect-auto lg:col-span-6 overflow-hidden bg-[#0C2233]"
            >
              <Image
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=85"
                alt="Consult America senior engineering and enterprise consulting team members collaborating"
                fill
                className="object-cover mkt-img-graded"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </motion.div>

            {/* RIGHT: Content */}
            <motion.div
              initial={shouldReduceMotion ? {} : { opacity: 0, x: 16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55 }}
              className="p-8 sm:p-12 lg:p-16 lg:col-span-6 bg-[#102033] text-white flex flex-col justify-between space-y-6"
            >
              <div>
                <span className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#B63A3A]">
                  CAREERS AT CONSULT AMERICA
                </span>

                <h3 className="mt-4 font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-[-0.03em] text-white leading-[1.08]">
                  Build what&apos;s next.
                </h3>

                <p className="mt-5 text-base sm:text-lg leading-relaxed text-[#97A8B7]">
                  Work at the intersection of enterprise transformation, AI, data and application engineering.
                </p>
              </div>

              <div className="pt-6 border-t border-[#1E3752]">
                <Link
                  href="/careers"
                  className="ca-button-primary inline-flex items-center gap-2 !min-h-[48px] !px-7 text-sm font-semibold rounded-lg cursor-pointer"
                >
                  <span>Explore Open Opportunities</span>
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
