"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

export default function EditorialImageBreak() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="relative w-full overflow-hidden border-b border-[#D7CCBD] bg-[#211E1B] py-28 sm:py-36 lg:py-44 min-h-[500px] lg:min-h-[580px] flex items-center">
      {/* High-End Modern Enterprise Architecture Environment Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=2400&q=85"
          alt="Modern enterprise architecture and leadership operations environment"
          fill
          className="object-cover object-center opacity-45 filter grayscale contrast-125"
          sizes="100vw"
        />
        {/* Dark Warm Cinematic Scrim Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#211E1B]/95 via-[#211E1B]/80 to-[#211E1B]/90" />
      </div>

      <div className="mkt-shell relative z-10 w-full">
        <motion.div
          initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65 }}
          className="max-w-4xl space-y-6"
        >
          <div className="flex items-center gap-3">
            <span className="h-0.5 w-8 bg-[#D8C5AA]" />
            <span className="text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-[#D8C5AA]">
              TRANSFORMATION AT ENTERPRISE SCALE
            </span>
          </div>

          <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl xl:text-[68px] font-semibold text-white tracking-[-0.035em] leading-[1.04]">
            Strategy. Platforms.
            <br />
            Data. Engineering.
          </h2>

          <p className="text-base sm:text-lg text-[#C5BCB3] max-w-2xl leading-relaxed pt-2">
            Engineering resilient digital foundations and unified enterprise operating models designed to sustain long-term business performance.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
