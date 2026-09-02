"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

const journeySteps = ["Discover", "Engage", "Sell", "Serve", "Expand"];
const revealEase = [0.2, 0.8, 0.2, 1] as const;

export default function CRMShowcase() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      id="crm-cx"
      className="ca-home-crm-strip relative border-b border-[#E1ECE8] bg-[#F8FAF9] py-10 sm:py-12 lg:max-h-[420px] lg:py-14"
    >
      <div className="mx-auto max-w-[1440px] px-6 lg:px-8 xl:px-10">
        <div className="grid items-center gap-8 lg:grid-cols-12 lg:gap-10">
          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: revealEase }}
            className="lg:col-span-5"
          >
            <p className="text-[0.75rem] font-bold uppercase tracking-[0.14em] text-[#176A63]">
              CRM &amp; Customer Experience
            </p>
            <h2 className="mt-3 max-w-lg font-serif text-[clamp(1.35rem,2.5vw,2rem)] font-semibold tracking-[-0.03em] text-[#073B3A]">
              Connect every customer moment to the enterprise behind it.
            </h2>
            <Link
              href="/platforms/crm"
              className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#176A63] hover:text-[#073B3A]"
            >
              Explore CRM
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </motion.div>

          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.06, ease: revealEase }}
            className="lg:col-span-7"
          >
            <div
              aria-hidden="true"
              className="ca-home-ring pointer-events-none absolute right-[6%] hidden h-[200px] w-[200px] opacity-[0.06] lg:block"
            />
            <div className="flex flex-wrap items-center gap-2 border-t border-[#DDE6E3] pt-6 lg:justify-end lg:border-t-0 lg:pt-0">
              {journeySteps.map((step, idx) => (
                <div key={step} className="flex items-center gap-2">
                  <span
                    className={`rounded-lg px-3 py-2 text-[0.68rem] font-bold tracking-[0.1em] ${
                      idx === 2
                        ? "bg-[#073B3A] text-white"
                        : "border border-[#DDE6E3] bg-white text-[#073B3A]"
                    }`}
                  >
                    {step.toUpperCase()}
                  </span>
                  {idx < journeySteps.length - 1 ? (
                    <span className="hidden text-[#C9DDD7] sm:inline" aria-hidden="true">
                      →
                    </span>
                  ) : null}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
