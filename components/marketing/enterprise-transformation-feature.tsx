"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

import { stockImage } from "@/lib/marketing/stock-images";

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
      className="bg-[#E1ECE8] text-[#122D2E] py-16 sm:py-20 lg:py-24 border-b border-[#C9DDD7] relative overflow-hidden"
    >
      {/* Decorative ambient backdrop light */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          background: "radial-gradient(circle at 20% 40%, rgba(75,148,136,0.15) 0%, transparent 60%)",
        }}
      />

      <div className="mx-auto max-w-[1440px] px-6 lg:px-8 xl:px-10 relative z-10">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center lg:gap-14">
          {/* Layered Two-Image Composition on Left (Section 15 Specification) */}
          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6 relative flex flex-col items-center sm:items-start"
          >
            <div className="relative w-full max-w-[560px]">
              {/* Pale green structural backdrop block */}
              <div className="absolute -top-4 -left-4 w-[92%] h-[94%] rounded-[16px_120px_16px_16px] bg-white/70 border border-[#C9DDD7] -z-0 hidden sm:block" />

              {/* Dominant Collaboration Photograph with Custom Corner Radius (12px 120px 12px 12px) */}
              <div className="relative z-10 w-full h-[320px] sm:h-[390px] overflow-hidden border border-[#C9DDD7] bg-white ca-shadow-elevated rounded-[12px_120px_12px_12px]">
                <Image
                  src={stockImage("enterpriseTransformationFeature", { w: 1200, q: 85 })}
                  alt="Executive leadership and program management team aligning enterprise strategy with delivery"
                  fill
                  className="object-cover mkt-img-graded"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="mkt-overlay-soft" />
              </div>

              {/* Secondary Overlapping Operations Detail Image (Bottom Right Depth) */}
              <div className="absolute -bottom-6 right-2 sm:-right-4 z-20 w-[140px] sm:w-[190px] h-[130px] sm:h-[160px] rounded-[100px_12px_12px_12px] overflow-hidden border-2 border-white bg-white ca-shadow-overlap hidden xs:block">
                <Image
                  src={stockImage("heroArchitectural", { w: 600, q: 80 })}
                  alt="Enterprise architectural blueprint and operations detail"
                  fill
                  className="object-cover mkt-img-graded"
                  sizes="190px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#073B3A]/50 to-transparent" />
              </div>
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
              <span className="h-2 w-2 rounded-full bg-[#176A63]" />
              <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#5B6D6B]">
                ENTERPRISE TRANSFORMATION
              </span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-[-0.03em] text-[#122D2E] leading-[1.08]">
              Transformation that stays connected to delivery.
            </h2>

            <p className="text-base sm:text-lg leading-relaxed text-[#5B6D6B]">
              Strategy creates value only when it survives architecture, implementation, testing, adoption and production.
            </p>

            {/* Capability List */}
            <div className="pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {capabilities.map((cap) => (
                  <div
                    key={cap}
                    className="flex items-center gap-2.5 text-sm font-semibold text-[#122D2E]"
                  >
                    <CheckCircle2 className="h-4 w-4 text-[#0B4A47] shrink-0" />
                    <span>{cap}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-[#C9DDD7]">
              <Link
                href="/capabilities/enterprise-transformation"
                className="group inline-flex items-center gap-2 text-sm font-bold text-[#0B4A47] hover:text-[#B83A3A] transition-colors"
              >
                <span>Explore Enterprise Transformation</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1.5 text-[#0B4A47] group-hover:text-[#B83A3A]" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
