"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

import SectionBackdrop from "@/components/marketing/section-backdrop";
import { useContactPanel } from "@/components/providers/contact-provider";
import { stockImage } from "@/lib/marketing/stock-images";

const revealEase = [0.2, 0.8, 0.2, 1] as const;

export default function Hero() {
  const { setOpen } = useContactPanel();
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="ca-grad-hero relative overflow-hidden border-b border-[#E1ECE8] py-[90px] sm:py-[100px] lg:py-[110px]">
      <SectionBackdrop variant="hero" />

      <div className="relative z-10 mx-auto grid w-full max-w-[1440px] grid-cols-1 items-center gap-10 px-6 lg:grid-cols-12 lg:gap-12 lg:px-8 xl:px-10">
        <div className="lg:col-span-5">
          <motion.p
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: revealEase }}
            className="text-[0.75rem] font-bold uppercase tracking-[0.14em] text-[#176A63]"
          >
            Enterprise Technology + AI
          </motion.p>

          <motion.h1
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.58, delay: 0.05, ease: revealEase }}
            className="mt-4 max-w-[45rem] font-serif text-[clamp(2.875rem,5vw,4.25rem)] font-semibold leading-[1.04] tracking-[-0.035em] text-[#073B3A]"
          >
            Transform the core.
            <br />
            Build what&apos;s next.
          </motion.h1>

          <motion.p
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: revealEase }}
            className="mt-5 max-w-[40rem] text-[clamp(1.0625rem,1.1vw,1.1875rem)] leading-[1.62] text-[#5B6D6B]"
          >
            Consult America helps organizations modernize enterprise platforms, activate AI,
            and engineer the applications that move their business forward.
          </motion.p>

          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15, ease: revealEase }}
            className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#B83A3A] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#992F31] cursor-pointer"
            >
              Talk to an Expert
              <ArrowUpRight className="h-4 w-4" />
            </button>
            <Link
              href="/capabilities"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-[#C9DDD7] bg-white px-6 text-sm font-semibold text-[#073B3A] transition-colors hover:border-[#176A63]"
            >
              Explore Our Capabilities
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>

        <motion.div
          initial={shouldReduceMotion ? {} : { opacity: 0, y: 12, scale: 0.985 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.78, delay: 0.12, ease: revealEase }}
          className="relative lg:col-span-7"
        >
          <div className="relative ml-auto w-[92%] max-h-[min(31.25rem,46vh)] overflow-hidden ca-hero-shape-arch shadow-[0_24px_60px_rgba(7,59,58,0.10)] ring-1 ring-[#DDE6E3]">
            <div className="relative aspect-[4/3] w-full">
              <Image
                src={stockImage("hero", { w: 1400, q: 85 })}
                alt="Enterprise technology leaders collaborating"
                fill
                priority
                className="object-cover object-center"
                sizes="(max-width: 1024px) 92vw, 52vw"
              />
            </div>
          </div>
          <div className="ca-product-frame absolute -bottom-4 -left-2 z-10 hidden w-[44%] max-w-[240px] sm:block lg:-left-6">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/innovation/data-agent-hero.png"
              alt="Data Agent enterprise interface"
              width={1440}
              height={900}
              className="ca-product-screenshot !max-h-[160px]"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
