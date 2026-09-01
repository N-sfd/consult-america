"use client";

import { motion } from "framer-motion";

const credibilityItems = [
  "Oracle",
  "Enterprise Transformation",
  "Cloud",
  "AI & Data",
  "Digital Engineering",
  "Program Delivery",
];

export default function ClientTrust() {
  return (
    <section className="border-y border-[#E1ECE8] bg-[#F8FBFA] py-6">
      <div className="mx-auto flex max-w-[1440px] flex-col items-center gap-4 px-6 sm:flex-row sm:justify-between lg:px-8 xl:px-10">
        <p className="shrink-0 text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#5B6D6B]">
          Depth across
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 sm:justify-end">
          {credibilityItems.map((item, index) => (
            <motion.span
              key={item}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.04 }}
              className="text-sm font-medium text-[#122D2E]"
            >
              {item}
            </motion.span>
          ))}
        </div>
      </div>
    </section>
  );
}
