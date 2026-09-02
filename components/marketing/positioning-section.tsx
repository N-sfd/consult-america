"use client";

import { motion, useReducedMotion } from "framer-motion";

const pillars = [
  { title: "Transform", detail: "Modernize enterprise platforms and operating models." },
  { title: "Connect", detail: "Unify data, workflows, and customer experiences." },
  { title: "Activate", detail: "Put AI into daily operations with governance." },
  { title: "Build", detail: "Engineer applications where packaged software stops." },
];

const revealEase = [0.2, 0.8, 0.2, 1] as const;

export default function PositioningSection() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden border-b border-[#E1ECE8] bg-white py-14 sm:py-16 lg:py-20">
      <div className="relative z-10 mx-auto max-w-[1440px] px-6 lg:px-8 xl:px-10">
        <div className="grid grid-cols-2 gap-6 lg:grid-cols-4 lg:gap-8">
          {pillars.map((pillar, index) => (
            <motion.div
              key={pillar.title}
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: index * 0.04, ease: revealEase }}
              className="border-t border-[#176A63] pt-4"
            >
              <h3 className="text-xs font-bold uppercase tracking-[0.14em] text-[#073B3A]">
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
