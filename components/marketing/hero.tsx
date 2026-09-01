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
        <div className="lg:col-span-5 xl:col-span-5">
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
          className="relative lg:col-span-7 xl:col-span-7"
        >
          <div className="ca-hero-visual relative min-h-[360px] sm:min-h-[440px] lg:min-h-[560px]">
            {/* Background: enterprise team image */}
            <div className="ca-hero-main-photo relative ml-auto w-[88%] overflow-hidden rounded-[22px] border border-[#DCE4E1] bg-white shadow-[0_28px_70px_rgba(7,59,58,0.10)]">
              <div className="relative aspect-[4/3] w-full">
                <Image
                  src={stockImage("hero", { w: 1200, q: 85 })}
                  alt="Enterprise technology leaders collaborating"
                  fill
                  priority
                  className="object-cover object-center"
                  sizes="(max-width: 1024px) 88vw, 48vw"
                />
              </div>
            </div>

            {/* Foreground: Data Agent UI */}
            <div className="ca-hero-product-ui absolute bottom-6 left-0 w-[56%] max-w-[420px] overflow-hidden rounded-[14px] border border-[rgba(7,59,58,0.12)] bg-white p-1.5 shadow-[0_28px_70px_rgba(7,59,58,0.12)] sm:bottom-8">
              <Image
                src="/innovation/data-agent-hero.png"
                alt="Data Agent product interface"
                width={640}
                height={400}
                className="h-auto w-full rounded-[10px] object-cover object-top"
              />
            </div>

            {/* Secondary: architecture status panel */}
            <div className="ca-hero-status-panel absolute right-2 top-4 hidden w-[38%] max-w-[200px] rounded-[16px] border border-[#DDE6E3] bg-white/95 p-4 shadow-[0_16px_40px_rgba(7,59,58,0.08)] backdrop-blur-sm sm:block lg:right-0 lg:top-8">
              <p className="text-[0.62rem] font-bold uppercase tracking-[0.14em] text-[#176A63]">
                Connected Platform
              </p>
              <ul className="mt-3 space-y-2">
                {["Oracle Cloud", "Data Agent", "CRM"].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-xs font-medium text-[#073B3A]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#9BC4B8]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
