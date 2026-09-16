"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

import { stockImage } from "@/lib/marketing/stock-images";
import { useStableReducedMotion } from "@/lib/marketing/use-stable-reduced-motion";

const journey = ["Discover", "Apply", "Interview", "Hire", "Onboard", "Work"];
const revealEase = [0.2, 0.8, 0.2, 1] as const;

export default function HomepageCareersSection() {
  const shouldReduceMotion = useStableReducedMotion();

  return (
    <section
      id="careers"
      className="relative overflow-x-clip border-b border-[var(--ca-line)] bg-[var(--ca-mist)] py-12 sm:py-14 lg:py-16"
    >
      <div className="relative z-10 mx-auto max-w-[1440px] px-6 lg:px-8 xl:px-10">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-6">
            <motion.div
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: revealEase }}
            >
              <p className="text-[0.75rem] font-bold uppercase tracking-[0.14em] text-[var(--ca-teal)]">Careers</p>
              <h2 className="mt-3 font-serif text-[clamp(1.75rem,3vw,2.5rem)] font-semibold tracking-[-0.03em] text-[var(--ca-ink)]">
                Build what&apos;s next.
              </h2>
              <p className="mt-4 max-w-lg text-sm leading-relaxed text-[var(--ca-text-secondary)]">
                Join teams working across enterprise transformation, Oracle, AI, data and application
                engineering.
              </p>
            </motion.div>

            <motion.div
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.08, ease: revealEase }}
              className="mt-8 flex flex-wrap gap-2"
            >
              {journey.map((step, index) => (
                <span key={step} className="ca-step-pill text-xs sm:text-sm">
                  <span className="text-[#176A63]">{String(index + 1).padStart(2, "0")}</span>
                  {step}
                </span>
              ))}
            </motion.div>

            <motion.div
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.14, ease: revealEase }}
              className="mt-8 flex flex-wrap gap-3"
            >
              <Link
                href="/careers"
                className="inline-flex h-11 items-center gap-2 rounded-lg bg-[var(--ca-lime)] px-6 text-sm font-semibold text-[var(--ca-ink)] hover:bg-[var(--ca-accent-hover)]"
              >
                Explore Careers
                <ArrowUpRight className="h-4 w-4" />
              </Link>
              <Link
                href="/jobs"
                className="inline-flex h-11 items-center gap-2 rounded-full border border-[#C9DDD7] bg-white px-6 text-sm font-semibold text-[#073B3A] hover:border-[#176A63]"
              >
                Search Jobs
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </motion.div>
          </div>

          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 18, scale: 0.985 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.78, ease: revealEase }}
            className="lg:col-span-6"
          >
            <div className="ca-home-compose relative mx-auto max-w-[520px] lg:ml-auto">
              <div
                aria-hidden="true"
                className="ca-home-sage-disc ca-home-moving--slow -left-[6%] top-[10%] hidden h-[220px] w-[220px] opacity-20 lg:block"
              />
              <div className="ca-home-frame-careers ca-home-photo-overlay relative z-10 shadow-[0_20px_50px_rgba(7,59,58,0.12)] ring-1 ring-[#C9DDD7]/60">
                <div className="ca-home-img-careers relative aspect-[4/3] w-full max-h-[420px]">
                  <Image
                    src={stockImage("careersPageHero", { w: 1200, q: 85 })}
                    alt="Consult America team collaborating"
                    fill
                    className="ca-home-photo object-cover"
                    sizes="(max-width: 1024px) 100vw, 42vw"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
