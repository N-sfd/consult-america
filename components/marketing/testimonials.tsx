"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { testimonials } from "@/lib/site-data";

export default function Testimonials() {
  const [index, setIndex] = useState(0);
  const current = testimonials[index];

  function prev() {
    setIndex((value) => (value === 0 ? testimonials.length - 1 : value - 1));
  }

  function next() {
    setIndex((value) => (value === testimonials.length - 1 ? 0 : value + 1));
  }

  return (
    <section className="border-t border-white/10 bg-black px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
      <div className="mx-auto max-w-[94.5em]">
        <div className="flex items-center justify-between">
          <h2 className="text-sm tracking-[0.16em] uppercase text-white/55">
            Testimonials
          </h2>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={prev}
              className="flex h-11 w-11 items-center justify-center border border-white/20"
              aria-label="Previous testimonial"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={next}
              className="flex h-11 w-11 items-center justify-center border border-white/20"
              aria-label="Next testimonial"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="text-lg">{current.name}</p>
            <p className="mt-2 text-sm text-white/50">{current.org}</p>
          </div>
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              <motion.blockquote
                key={current.quote}
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.55 }}
                className="ca-h3 max-w-4xl text-white"
              >
                “{current.quote}”
              </motion.blockquote>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
