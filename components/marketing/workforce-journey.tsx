"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

import SectionBackdrop from "@/components/marketing/section-backdrop";

const journey = ["Discover", "Apply", "Interview", "Hire", "Onboard", "Work"];

const experiences = [
  "Careers",
  "Job Portal",
  "Candidate Experience",
  "Recruiting",
  "HR",
  "Employee Portal",
];

export default function WorkforceJourney() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden border-t border-[#E1ECE8] bg-[#F7FAF9] py-20 sm:py-24 lg:py-28">
      <SectionBackdrop variant="workforce" />

      <div className="relative z-10 mx-auto max-w-[1440px] px-6 lg:px-8 xl:px-10">
        <div className="max-w-2xl">
          <p className="text-[0.68rem] font-bold uppercase tracking-[0.16em] text-[#176A63]">
            Talent &amp; Workforce
          </p>
          <h2 className="mt-3 font-serif text-3xl font-semibold tracking-[-0.03em] text-[#073B3A] sm:text-4xl">
            Connect talent from application to employee experience.
          </h2>
        </div>

        <motion.div
          initial={shouldReduceMotion ? {} : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 flex flex-wrap items-center gap-3 sm:gap-4"
        >
          {journey.map((step, index) => (
            <div key={step} className="flex items-center gap-3 sm:gap-4">
              <span className="rounded-full border border-[#C9DDD7] bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-[#073B3A]">
                {step}
              </span>
              {index < journey.length - 1 ? (
                <span className="text-[#9BC4B8]" aria-hidden="true">
                  ↓
                </span>
              ) : null}
            </div>
          ))}
        </motion.div>

        <div className="mt-10 flex flex-wrap gap-3">
          {experiences.map((item) => (
            <span
              key={item}
              className="rounded-md border border-[#DCE4E1] bg-white px-3 py-2 text-xs font-medium text-[#5B6D6B]"
            >
              {item}
            </span>
          ))}
        </div>

        <Link
          href="/careers"
          className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-[#B83A3A]"
        >
          Explore Careers <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
