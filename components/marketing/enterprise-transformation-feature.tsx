"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

import { LayeredPhoto } from "@/components/marketing/shaped-photo";
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
      className="bg-[#E1ECE8] text-[#073B3A] py-16 sm:py-20 lg:py-24 border-b border-[#9BC4B8]/40 relative overflow-hidden"
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(circle at 18% 42%, rgba(75,148,136,0.22) 0%, transparent 58%)",
        }}
      />

      <div className="mx-auto max-w-[1440px] px-6 lg:px-8 xl:px-10 relative z-10">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center lg:gap-14">
          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-6 relative flex flex-col items-center sm:items-start"
          >
            <LayeredPhoto
              className="max-w-[560px]"
              backdropClassName="rounded-[16px_120px_16px_16px] bg-[#F0F6F4]/80 border border-[#9BC4B8]/45"
              main={{
                src: stockImage("enterpriseTransformationFeature", { w: 1200, q: 85 }),
                alt: "Executive leadership and program management team aligning enterprise strategy with delivery",
                shape: "asymmetric",
                className: "h-[320px] sm:h-[390px]",
                sizes: "(max-width: 1024px) 100vw, 50vw",
              }}
              secondary={{
                src: stockImage("heroArchitectural", { w: 600, q: 80 }),
                alt: "Enterprise architectural blueprint and operations detail",
              }}
              floatSecondary
            />
          </motion.div>

          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="lg:col-span-6 space-y-6"
          >
            <div className="inline-flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#176A63]" />
              <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#176A63]">
                ENTERPRISE TRANSFORMATION
              </span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-[-0.03em] text-[#073B3A] leading-[1.08]">
              Transformation that stays connected to delivery.
            </h2>

            <p className="text-base sm:text-lg leading-relaxed text-[#0B4A47]">
              Strategy creates value only when it survives architecture, implementation, testing, adoption and production.
            </p>

            <div className="pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {capabilities.map((cap) => (
                  <div
                    key={cap}
                    className="flex items-center gap-2.5 text-sm font-semibold text-[#073B3A]"
                  >
                    <CheckCircle2 className="h-4 w-4 text-[#176A63] shrink-0" />
                    <span>{cap}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-[#9BC4B8]/40">
              <Link
                href="/capabilities/enterprise-transformation"
                className="group inline-flex items-center gap-2 text-sm font-bold text-[#0B4A47] hover:text-[#B83A3A] transition-colors"
              >
                <span>Explore Enterprise Transformation</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1.5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
