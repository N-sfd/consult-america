"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

export default function EditorialImageBreak() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="relative w-full overflow-hidden border-b border-[#D7CCBD] bg-[#211E1B] py-20 sm:py-28 lg:py-36">
      {/* High-End Modern Enterprise Architecture Environment Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=2400&q=85"
          alt="Modern enterprise architecture and leadership operations environment"
          fill
          className="object-cover object-center opacity-40 filter grayscale contrast-125"
          sizes="100vw"
        />
        {/* Dark Warm Cinematic Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#211E1B]/95 via-[#211E1B]/75 to-[#211E1B]/90" />
      </div>

      <div className="mkt-shell relative z-10">
        <motion.div
          initial={shouldReduceMotion ? {} : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl space-y-4"
        >
          <span className="text-[0.68rem] font-bold uppercase tracking-[0.2em] text-[#D8C5AA] flex items-center gap-2">
            <span className="h-0.5 w-6 bg-[#D8C5AA]" />
            TRANSFORMATION AT ENTERPRISE SCALE
          </span>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-white tracking-tight leading-[1.15]">
            Strategy. Platforms.
            <br />
            Data. Engineering.
          </h2>

          <p className="text-sm sm:text-base text-[#C5BCB3] max-w-xl leading-relaxed pt-2">
            Engineering resilient digital foundations and enterprise operating models designed to sustain long-term business performance.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
