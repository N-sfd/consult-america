"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

import JourneyConnector from "@/components/marketing/journey-connector";
import { stockImage } from "@/lib/marketing/stock-images";
import { useStableReducedMotion } from "@/lib/marketing/use-stable-reduced-motion";

const journeySteps = ["Discover", "Engage", "Sell", "Serve", "Expand"];
const revealEase = [0.2, 0.8, 0.2, 1] as const;

const suiteFlow = ["ATS", "HR", "Employee", "Payroll"];

export default function CRMShowcase() {
  const shouldReduceMotion = useStableReducedMotion();

  return (
    <section
      id="crm-cx"
      className="ca-home-crm-strip relative border-b border-[#E1ECE8] bg-[#F8FAF9] py-10 sm:py-12 lg:py-14"
    >
      <JourneyConnector />
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
              03 / 05 · CRM &amp; Customer Experience
            </p>
            <h2 className="mt-3 max-w-lg font-serif text-[clamp(1.75rem,3vw,2.5rem)] font-semibold tracking-[-0.03em] text-[#073B3A]">
              Connect every customer moment to the enterprise behind it.
            </h2>
            <div className="mt-6 flex flex-wrap items-center gap-2">
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
            <Link
              href="/platforms/crm"
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#176A63] hover:text-[#073B3A]"
            >
              Explore CRM
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </motion.div>

          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 14, scale: 0.985 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.06, ease: revealEase }}
            className="lg:col-span-7"
          >
            <div className="ca-home-compose relative mx-auto max-w-[560px] lg:ml-auto lg:mr-0">
              <div
                aria-hidden="true"
                className="ca-home-sage-panel -right-4 top-4 hidden h-[220px] w-[130px] opacity-25 lg:block"
              />
              <div
                aria-hidden="true"
                className="ca-home-ring pointer-events-none absolute -left-[6%] bottom-[-10%] hidden h-[160px] w-[160px] opacity-40 lg:block"
              />
              <div className="ca-home-frame-offset ca-home-photo-overlay relative z-10 shadow-[0_18px_44px_rgba(7,59,58,0.08)] ring-1 ring-[#DDE6E3]">
                <div className="relative aspect-[16/9] w-full max-h-[220px]">
                  <Image
                    src={stockImage("industriesSectionFinancial", { w: 1200, q: 85 })}
                    alt="Sales and customer experience team reviewing pipeline"
                    fill
                    className="ca-home-photo object-cover"
                    sizes="(max-width: 1024px) 100vw, 46vw"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={shouldReduceMotion ? {} : { opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1, ease: revealEase }}
          className="mt-8 border-t border-[#DDE6E3] pt-6"
        >
          <p className="text-[0.65rem] font-bold uppercase tracking-[0.14em] text-[#8A9A97]">
            One platform, not six products
          </p>
          <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-6 sm:gap-y-3">
            <div className="flex flex-wrap items-center gap-2">
              {suiteFlow.map((step, idx) => (
                <div key={step} className="flex items-center gap-2">
                  <span className="rounded-md border border-[#DDE6E3] bg-white px-2.5 py-1.5 text-[0.68rem] font-bold tracking-[0.08em] text-[#073B3A]">
                    {step.toUpperCase()}
                  </span>
                  {idx < suiteFlow.length - 1 ? (
                    <span className="text-[#C9DDD7]" aria-hidden="true">
                      →
                    </span>
                  ) : null}
                </div>
              ))}
              <span className="mx-1 hidden text-[#C9DDD7] sm:inline" aria-hidden="true">
                ·
              </span>
              <span className="rounded-md border border-[#DDE6E3] bg-white px-2.5 py-1.5 text-[0.68rem] font-bold tracking-[0.08em] text-[#073B3A]">
                CRM
              </span>
              <span className="text-[#C9DDD7]" aria-hidden="true">
                →
              </span>
              <span className="rounded-md bg-[var(--ca-lime)]/20 px-2.5 py-1.5 text-[0.68rem] font-bold tracking-[0.08em] text-[#073B3A]">
                CLIENTFLOW
              </span>
            </div>
            <p className="text-xs text-[#8A9A97]">
              Admin governs users, roles, and audit across the whole suite.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
