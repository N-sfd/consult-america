"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

import SectionLabel from "@/components/marketing/SectionLabel";

const capabilities = [
  "Enterprise Transformation",
  "Program Delivery",
  "Operating Model",
  "Testing & Quality",
  "Change & Adoption",
];

export default function EnterpriseTransformationFeature() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      id="enterprise-transformation"
      className="bg-[#FFFFFF] text-[#102033] py-16 sm:py-20 lg:py-24 border-b border-[#DCE3E5]"
    >
      <div className="mx-auto max-w-[1440px] px-6 lg:px-8 xl:px-10">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center lg:gap-14">
          {/* Image Left */}
          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="lg:col-span-6"
          >
            <div className="relative aspect-[4/3] sm:aspect-[16/11] w-full overflow-hidden rounded-[10px] border border-[#DCE3E5] bg-white shadow-[0_16px_40px_rgba(16,32,51,0.08)]">
              <Image
                src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1200&q=85"
                alt="Executive leadership and program management team aligning enterprise strategy with delivery"
                fill
                className="object-cover mkt-img-graded"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#102033]/40 via-transparent to-transparent pointer-events-none" />
            </div>
          </motion.div>

          {/* Content Right */}
          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.08 }}
            className="lg:col-span-6 space-y-6"
          >
            <div className="inline-flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#0E514E]" />
              <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#5A6770]">
                ENTERPRISE TRANSFORMATION
              </span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-[-0.03em] text-[#102033] leading-[1.08]">
              Transformation that stays connected to delivery.
            </h2>

            <p className="text-base sm:text-lg leading-relaxed text-[#5A6770]">
              Strategy creates value only when it survives architecture, implementation, testing, adoption and production.
            </p>

            {/* Capability List */}
            <div className="pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {capabilities.map((cap) => (
                  <div
                    key={cap}
                    className="flex items-center gap-2.5 text-sm font-semibold text-[#102033]"
                  >
                    <CheckCircle2 className="h-4 w-4 text-[#0E514E] shrink-0" />
                    <span>{cap}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-[#DCE3E5]">
              <Link
                href="/capabilities/enterprise-transformation"
                className="group inline-flex items-center gap-2 text-sm font-bold text-[#0E514E] hover:text-[#BA3535] transition-colors"
              >
                <span>Explore Enterprise Transformation</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1.5 text-[#0E514E] group-hover:text-[#BA3535]" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
