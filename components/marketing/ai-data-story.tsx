"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

import PlatformLineSystem from "@/components/marketing/platform-line-system";
import SectionBackdrop from "@/components/marketing/section-backdrop";

const capabilities = [
  "Enterprise Agents",
  "Document Intelligence",
  "Data Engineering",
  "Governed AI",
];

const callouts = [
  { label: "VERIFY", detail: "Source-linked evidence" },
  { label: "EXTRACT", detail: "Dynamic field intelligence" },
];

export default function AIDataStory() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      id="ai-data-story"
      className="relative overflow-hidden border-b border-[#073B3A] py-24 text-white sm:py-28 lg:py-32 xl:py-36"
      style={{
        background: "linear-gradient(135deg, #073B3A 0%, #0B4A47 52%, #176A63 100%)",
      }}
    >
      <SectionBackdrop variant="ai" />
      <PlatformLineSystem className="opacity-[0.07]" />

      <div className="relative z-10 mx-auto max-w-[1440px] px-6 lg:px-8 xl:px-10">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center lg:gap-14 xl:gap-16">
          {/* Left: copy + capabilities */}
          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-4 space-y-6"
          >
            <div className="inline-flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#9BC4B8]" />
              <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#9BC4B8]">
                AI &amp; DATA
              </span>
            </div>

            <h2 className="font-serif text-3xl font-semibold tracking-[-0.03em] text-white sm:text-4xl lg:text-5xl lg:leading-[1.08]">
              Put intelligence into the work.
            </h2>

            <p className="max-w-md text-base leading-relaxed text-white/80 sm:text-lg">
              AI creates value when trusted data, useful models, business context, and real
              workflows come together.
            </p>

            <ul className="space-y-2 pt-2">
              {capabilities.map((cap) => (
                <li
                  key={cap}
                  className="text-xs font-bold uppercase tracking-[0.12em] text-[#9BC4B8]"
                >
                  {cap}
                </li>
              ))}
            </ul>

            <div className="pt-4">
              <Link
                href="/ai-data"
                className="inline-flex h-[48px] items-center justify-center gap-2 rounded-[8px] bg-[#B83A3A] px-6 text-sm font-semibold text-white shadow-[0_4px_16px_rgba(184,58,58,0.22)] transition-all hover:bg-[#992F31]"
              >
                Explore AI &amp; Data
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>

          {/* Right: large Data Agent screenshot */}
          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.08 }}
            className="relative lg:col-span-8"
          >
            <div className="relative">
              <div className="ca-product-frame ml-auto w-full overflow-hidden rounded-[16px] border border-[rgba(7,59,58,0.12)] bg-white p-2 shadow-[0_28px_70px_rgba(7,59,58,0.12)] sm:w-[92%] lg:w-[88%] xl:w-[85%]">
                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-md">
                  <Image
                    src="/innovation/data-agent-hero.png"
                    alt="Data Agent document intelligence interface"
                    fill
                    className="object-cover object-top"
                    sizes="(max-width: 1024px) 100vw, 58vw"
                  />
                </div>
              </div>

              {/* Callouts */}
              {callouts.map((callout, i) => (
                <div
                  key={callout.label}
                  className={`ca-ui-callout absolute hidden rounded-[14px] border border-[#DDE6E3] bg-white px-4 py-3 shadow-[0_16px_40px_rgba(7,59,58,0.08)] sm:block ${
                    i === 0 ? "left-0 top-[18%]" : "bottom-[12%] right-[4%]"
                  }`}
                >
                  <p className="text-[0.62rem] font-bold uppercase tracking-[0.14em] text-[#176A63]">
                    {callout.label}
                  </p>
                  <p className="mt-1 text-xs text-[#5B6D6B]">{callout.detail}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
