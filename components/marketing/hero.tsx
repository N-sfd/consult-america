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
    <section className="ca-grad-hero relative overflow-hidden border-b border-[#E1ECE8] py-20 sm:py-24 lg:py-28 xl:py-[7.5rem]">
      <SectionBackdrop variant="hero" />

      <div className="relative z-10 mx-auto grid w-full max-w-[1440px] grid-cols-1 items-center gap-12 px-6 lg:grid-cols-12 lg:gap-14 lg:px-8 xl:px-10">
        <div className="lg:col-span-6 xl:col-span-7">
          <motion.p
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: revealEase }}
            className="text-[0.72rem] font-bold uppercase tracking-[0.16em] text-[#176A63]"
          >
            Enterprise Technology + AI
          </motion.p>

          <motion.h1
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.52, delay: 0.05, ease: revealEase }}
            className="mt-4 max-w-[760px] font-serif text-[clamp(2.75rem,4.8vw,4.75rem)] font-semibold leading-[1.02] tracking-[-0.035em] text-[#073B3A]"
          >
            Transform the core.
            <br />
            Build what&apos;s next.
          </motion.h1>

          <motion.p
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: revealEase }}
            className="mt-5 max-w-[34rem] text-[1.0625rem] leading-relaxed text-[#5B6D6B]"
          >
            Consult America helps organizations modernize enterprise platforms, activate AI,
            and engineer the applications that move their business forward.
          </motion.p>

          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 18 }}
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
          initial={shouldReduceMotion ? {} : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.12, ease: revealEase }}
          className="relative lg:col-span-6 xl:col-span-5"
        >
          <div className="ca-photo-hover relative aspect-[4/3] overflow-hidden rounded-[22px] border border-[#DCE4E1] bg-white shadow-[0_28px_70px_rgba(7,59,58,0.10)]">
            <Image
              src={stockImage("hero", { w: 1200, q: 85 })}
              alt="Enterprise technology leaders collaborating"
              fill
              priority
              className="object-cover object-center"
              sizes="(max-width: 1024px) 100vw, 42vw"
            />
          </div>

          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 14, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.75, delay: 0.22, ease: revealEase }}
            className="ca-product-hover ca-photo-float absolute -bottom-8 left-0 w-[54%] max-w-[300px] overflow-hidden rounded-lg border border-[rgba(7,59,58,0.12)] bg-white p-1.5 shadow-[0_20px_50px_rgba(7,59,58,0.12)] sm:-bottom-6 sm:left-2"
          >
            <Image
              src="/innovation/data-agent-hero.png"
              alt="Data Agent product interface"
              width={640}
              height={400}
              className="h-auto w-full rounded-md object-cover object-top"
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
