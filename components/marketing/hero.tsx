"use client";

import { motion } from "framer-motion";

import { heroTags } from "@/lib/site-data";

export default function Hero() {
  return (
    <section className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden bg-black px-5 pb-10 pt-[8.5rem] sm:px-8 lg:px-12 lg:pb-16">
      <div className="flex flex-wrap gap-2">
        {heroTags.map((tag, index) => (
          <motion.span
            key={tag}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08 * index }}
            className="ca-tag text-white/80"
          >
            {tag}
          </motion.span>
        ))}
      </div>

      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.25 }}
        className="mt-10 max-w-3xl text-xl text-white/75 sm:text-2xl lg:text-3xl"
      >
        The Enterprise Transformation Partner.
      </motion.p>

      <h1 className="mt-6 font-normal">
        {["We", "are", "ConsultAmerica."].map((word, index) => (
          <motion.span
            key={word}
            initial={{ opacity: 0, y: "0.4em" }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.85,
              delay: 0.35 + index * 0.12,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            className="ca-display block"
          >
            {word}
          </motion.span>
        ))}
      </h1>

      <div className="mt-12 flex items-center gap-3 text-[0.7rem] uppercase tracking-[0.18em] text-white/45">
        <span>Scroll down</span>
        <span className="h-8 w-px bg-white/25" />
      </div>
    </section>
  );
}
