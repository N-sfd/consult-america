"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

export default function CareersFeature() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="careers-preview" className="bg-[#FFFDF8] text-[#261F1B] py-20 sm:py-24 border-b border-[#D8D0C5] relative overflow-hidden">
      <div className="ca-shell">
        {/* 50/50 Composition with Offset Frame & Architectural Radius */}
        <div className="relative">
          {/* Offset Decorative Backing Shape */}
          <div
            className="absolute inset-0 translate-x-3 translate-y-3 sm:translate-x-4 sm:translate-y-4 rounded-[20px] bg-[#D8C5AA]/30 -z-10"
            aria-hidden="true"
          />

          <div className="overflow-hidden rounded-[20px] border border-[#D8D0C5] bg-white shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
              {/* LEFT: Large Team / Collaboration Photography */}
              <motion.div
                initial={shouldReduceMotion ? {} : { opacity: 0, scale: 0.98 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="relative aspect-[4/3] sm:aspect-[16/10] lg:aspect-auto lg:col-span-6 overflow-hidden bg-[#211E1B]"
              >
                <Image
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1600&q=85"
                  alt="Consult America senior engineering and consulting practitioners collaborating"
                  fill
                  className="object-cover mkt-img-graded"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </motion.div>

              {/* RIGHT: #211E1B Dark Panel */}
              <motion.div
                initial={shouldReduceMotion ? {} : { opacity: 0, x: 16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55 }}
                className="p-8 sm:p-12 lg:p-16 lg:col-span-6 bg-[#211E1B] text-white flex flex-col justify-between space-y-6"
              >
                <div>
                  <span className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#B63A3A]">
                    CAREERS AT CONSULT AMERICA
                  </span>

                  <h3 className="mt-4 font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-[-0.03em] text-white leading-[1.08]">
                    Build what&apos;s next.
                  </h3>

                  <p className="mt-5 text-base sm:text-lg leading-relaxed text-[rgba(255,253,248,0.72)]">
                    Work at the intersection of enterprise transformation, AI, data and application engineering.
                  </p>
                </div>

                <div className="pt-6 border-t border-[#3A302B]">
                  <Link
                    href="/careers"
                    className="ca-button-primary inline-flex items-center gap-2 !min-h-[48px] !px-7 text-sm font-semibold rounded-lg cursor-pointer !bg-[#B63A3A] hover:!bg-[#942E31]"
                  >
                    <span>Explore Careers</span>
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
