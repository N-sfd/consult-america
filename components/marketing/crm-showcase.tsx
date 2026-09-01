"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

import { ShapedPhoto } from "@/components/marketing/shaped-photo";
import { stockImage } from "@/lib/marketing/stock-images";

const journeySteps = [
  { step: "01", name: "DISCOVER", detail: "Account intelligence" },
  { step: "02", name: "ENGAGE", detail: "Multi-channel outreach" },
  { step: "03", name: "SELL", detail: "Pipeline governance" },
  { step: "04", name: "SERVE", detail: "Omni-channel resolution" },
  { step: "05", name: "EXPAND", detail: "Lifecycle retention" },
];

export default function CRMShowcase() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="crm-cx" className="bg-[#F0F6F4] text-[#073B3A] py-16 sm:py-20 lg:py-24 border-b border-[#9BC4B8]/40 relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none opacity-70"
        style={{
          background: "radial-gradient(circle at 88% 20%, rgba(155,196,184,0.28) 0%, transparent 50%)",
        }}
      />

      <div className="mx-auto max-w-[1440px] px-6 lg:px-8 xl:px-10 relative z-10">
        <div className="inline-flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[#176A63]" />
          <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#176A63]">
            CRM &amp; CUSTOMER EXPERIENCE
          </span>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center lg:gap-14">
          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-6 space-y-6"
          >
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-[-0.03em] text-[#073B3A] leading-[1.08]">
              Connect every customer moment to the enterprise behind it.
            </h2>

            <p className="text-base sm:text-lg leading-relaxed text-[#0B4A47]">
              CRM delivers value when customer data, sales, service, and backend ERP operations move together without friction.
            </p>

            <div className="pt-2">
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {journeySteps.map((item, idx) => (
                  <div
                    key={item.name}
                    className={`border-t-2 pt-3 ${
                      idx === 2 ? "border-[#B83A3A]" : "border-[#9BC4B8]"
                    }`}
                  >
                    <span className={`font-mono text-xs font-bold ${
                      idx === 2 ? "text-[#B83A3A]" : "text-[#176A63]"
                    }`}>
                      {item.step}
                    </span>
                    <h3 className="mt-1 text-xs font-bold uppercase tracking-wider text-[#073B3A]">
                      {item.name}
                    </h3>
                    <p className="mt-1 text-xs text-[#176A63] leading-tight">
                      {item.detail}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/platforms/crm"
                className="inline-flex h-[48px] items-center justify-center gap-2 rounded-[8px] bg-[#B83A3A] px-6 text-xs sm:text-sm font-semibold text-white shadow-[0_4px_16px_rgba(184,58,58,0.22)] hover:bg-[#992F31] transition-all cursor-pointer"
              >
                <span>Explore CRM Solutions</span>
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>

          <div className="lg:col-span-6 relative flex flex-col items-center">
            <div className="relative w-full max-w-[560px]">
              <div className="absolute -top-3 -right-3 w-[88%] h-[90%] rounded-[12px_100px_12px_12px] bg-[#E1ECE8] border border-[#9BC4B8]/45 -z-0 hidden sm:block" />
              <ShapedPhoto
                src={stockImage("crmShowcase", { w: 1200, q: 85 })}
                alt="Executive enterprise customer relationship and sales operations review"
                shape="asymmetric"
                className="h-[320px] sm:h-[400px]"
                sizes="(max-width: 1024px) 100vw, 50vw"
                revealDirection="right"
              />
              <div className="absolute bottom-4 left-4 right-4 z-10 rounded-[8px] border border-white/60 bg-white/95 p-3.5 backdrop-blur-md shadow-sm">
                <div className="flex items-center justify-between text-[11px] font-bold text-[#0B4A47] uppercase tracking-wider">
                  <span className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#176A63]" />
                    360° Account View
                  </span>
                  <span className="text-[#176A63]">Unified Architecture</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
