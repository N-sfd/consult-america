"use client";

import { motion, useReducedMotion } from "framer-motion";

import HomeBackgroundArc from "@/components/marketing/home-background-arc";

const pillars = [
  { num: "01", title: "Transform", detail: "Modernize platforms and operating models." },
  { num: "02", title: "Connect", detail: "Unify workflows and enterprise systems." },
  { num: "03", title: "Activate", detail: "Put trusted data and AI into daily work." },
  { num: "04", title: "Build", detail: "Engineer digital products where packaged software stops." },
];

const revealEase = [0.2, 0.8, 0.2, 1] as const;

export default function PositioningSection() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden border-b border-[#E1ECE8] bg-white py-14 sm:py-16 lg:py-20">
      <div
        aria-hidden="true"
        className="ca-home-ring pointer-events-none absolute -right-[10%] top-[12%] hidden h-[min(650px,52vw)] w-[min(650px,52vw)] opacity-[0.05] lg:block"
      />
      <HomeBackgroundArc className="-right-[22%] top-1/2 hidden -translate-y-1/2 opacity-40 lg:block" moving={false} />

      <div className="relative z-10 mx-auto max-w-[1440px] px-6 lg:px-8 xl:px-10">
        <div className="grid grid-cols-2 gap-6 lg:grid-cols-4 lg:gap-10">
          {pillars.map((pillar, index) => (
            <motion.div
              key={pillar.title}
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.45, delay: index * 0.04, ease: revealEase }}
              className="ca-home-pillar"
            >
              <p className="ca-home-pillar-num">{pillar.num}</p>
              <h3 className="ca-home-pillar-label mt-2 text-xs font-bold uppercase tracking-[0.14em] text-[#073B3A]">
                {pillar.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[#5B6D6B]">{pillar.detail}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
