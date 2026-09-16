"use client";

import { motion } from "framer-motion";

import { useStableReducedMotion } from "@/lib/marketing/use-stable-reduced-motion";

const pillars = [
  { num: "01", title: "Transform", detail: "Modernize platforms and operating models." },
  { num: "02", title: "Connect", detail: "Unify workflows and enterprise systems." },
  { num: "03", title: "Activate", detail: "Put trusted data and AI into daily work." },
  { num: "04", title: "Build", detail: "Engineer digital products where packaged software stops." },
];

const revealEase = [0.2, 0.8, 0.2, 1] as const;

/**
 * Outcomes rail — continuous with the hero, not a separate template block.
 * Shared max-width/gutter; compact vertical rhythm; one teal rule language.
 */
export default function PositioningSection() {
  const shouldReduceMotion = useStableReducedMotion();

  return (
    <section
      aria-label="Outcomes"
      className="ca-home-outcomes relative overflow-x-clip border-b border-[var(--ca-line)] bg-[var(--ca-white)]"
    >
      <div className="relative z-10 mx-auto max-w-[1440px] px-6 py-7 sm:py-8 lg:px-8 lg:py-9 xl:px-10">
        <div className="grid grid-cols-2 gap-x-6 gap-y-7 lg:grid-cols-4 lg:gap-x-10 lg:gap-y-0">
          {pillars.map((pillar, index) => (
            <motion.div
              key={pillar.title}
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: index * 0.03, ease: revealEase }}
              className="ca-home-pillar"
            >
              <p className="ca-home-pillar-num">{pillar.num}</p>
              <h3 className="ca-home-pillar-label mt-1.5 text-[0.7rem] font-bold uppercase tracking-[0.14em] text-[var(--ca-ink)]">
                {pillar.title}
              </h3>
              <p className="mt-1.5 max-w-[18rem] text-sm leading-snug text-[var(--ca-text-secondary)]">
                {pillar.detail}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
