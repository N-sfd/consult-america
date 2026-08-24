"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { faqs } from "@/lib/site-data";

export default function Faqs() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="border-t border-white/10 bg-black px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
      <div className="mx-auto max-w-[94.5em]">
        <h2 className="text-sm tracking-[0.16em] uppercase text-white/55">
          FAQs
        </h2>
        <div className="mt-10 divide-y divide-white/10 border-y border-white/10">
          {faqs.map((item, index) => {
            const isOpen = open === index;

            return (
              <div key={item.q}>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : index)}
                  className="flex w-full items-start justify-between gap-6 py-6 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="text-lg lg:text-xl">{item.q}</span>
                  <span className="mt-1 text-white/40">{isOpen ? "–" : "+"}</span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.p
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden pb-6 text-white/60 lg:max-w-4xl"
                    >
                      {item.a}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
