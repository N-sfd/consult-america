"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

const stages = ["Connect", "Understand", "Verify", "Act"];
const revealEase = [0.2, 0.8, 0.2, 1] as const;

export default function AIDataStory() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      id="ai-data-story"
      className="relative overflow-hidden border-b border-[#073B3A] py-14 text-white sm:py-16 lg:py-20"
      style={{
        background: "linear-gradient(135deg, #073B3A 0%, #0B4A47 50%, #176A63 100%)",
      }}
    >
      <div aria-hidden="true" className="ca-home-ai-paths ca-home-moving--slow" />
      <div
        aria-hidden="true"
        className="ca-home-ring ca-home-orbit right-[-8%] top-[15%] hidden h-[min(420px,40vw)] w-[min(420px,40vw)] border-white/10 lg:block"
      />

      <div className="relative z-10 mx-auto max-w-[1440px] px-6 lg:px-8 xl:px-10">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center lg:gap-12">
          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: revealEase }}
            className="lg:col-span-5"
          >
            <p className="text-[0.75rem] font-bold uppercase tracking-[0.14em] text-[#9BC4B8]">
              Governed AI &amp; Data
            </p>
            <h2 className="mt-3 font-serif text-[clamp(1.75rem,3vw,2.5rem)] font-semibold tracking-[-0.03em] text-white">
              Put intelligence into the work.
            </h2>
            <p className="mt-4 max-w-md text-[1.0625rem] leading-relaxed text-white/80">
              Move beyond AI experiments with document intelligence, enterprise agents, and
              governed workflows connected to real operational data.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-[#9BC4B8]">
              {stages.map((stage, index) => (
                <span key={stage} className="inline-flex items-center gap-2">
                  {index > 0 && <span className="text-white/30">→</span>}
                  <span>{stage}</span>
                </span>
              ))}
            </div>

            <Link
              href="/ai-data"
              className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-[#9BC4B8] hover:text-white"
            >
              Explore AI &amp; Data
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </motion.div>

          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1, ease: revealEase }}
            className="lg:col-span-7"
          >
            <div className="ca-home-compose relative mx-auto max-w-[680px] lg:ml-auto lg:mr-0">
              <div
                aria-hidden="true"
                className="absolute right-[4%] top-[8%] z-0 hidden h-[min(320px,32vw)] w-[min(320px,32vw)] rounded-full bg-[#4B9488]/20 lg:block"
              />
              <div className="ca-home-product-ui relative z-10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/innovation/data-agent-hero.png"
                  alt="Data Agent document intelligence interface"
                  width={1440}
                  height={900}
                  loading="lazy"
                  decoding="async"
                  className="max-h-[440px] w-full"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
