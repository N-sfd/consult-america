"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

import HomeBackgroundArc from "@/components/marketing/home-background-arc";
import { useContactPanel } from "@/components/providers/contact-provider";
import { stockImage } from "@/lib/marketing/stock-images";

const focusAreas = ["Oracle Cloud", "AI & Data", "Application Engineering", "Managed Delivery"];
const revealEase = [0.2, 0.8, 0.2, 1] as const;

export default function Hero() {
  const { setOpen } = useContactPanel();
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="ca-grad-hero ca-home-hero-grid relative overflow-hidden border-b border-[#E1ECE8] py-[90px] sm:py-[100px] lg:py-[110px]">
      <HomeBackgroundArc className="-right-[12%] top-[8%] opacity-90" />

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
            className="mt-4 max-w-[42.5rem] font-serif text-[clamp(3.125rem,4.7vw,4.25rem)] font-semibold leading-[1.0] tracking-[-0.035em] text-[#073B3A]"
          >
            Transform the core.
            <br />
            Build what&apos;s next.
          </motion.h1>

          <motion.p
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: revealEase }}
            className="mt-5 max-w-[36rem] text-[clamp(1.0625rem,1.1vw,1.1875rem)] leading-[1.62] text-[#5B6D6B]"
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
              className="inline-flex h-12 cursor-pointer items-center justify-center gap-2 rounded-full bg-[#B83A3A] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#992F31]"
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

          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.22, ease: revealEase }}
            className="mt-10 flex flex-wrap gap-x-6 gap-y-3 border-t border-[#DDE6E3] pt-6"
          >
            {focusAreas.map((area) => (
              <span key={area} className="text-sm font-medium text-[#5B6D6B]">
                {area}
              </span>
            ))}
          </motion.div>
        </div>

        <div className="relative lg:col-span-7">
          <div className="ca-home-compose relative mx-auto w-full max-w-[700px] lg:ml-auto lg:mr-0">
            {/* Layer 1 — pale sage disc + ring */}
            <div
              aria-hidden="true"
              className="ca-home-sage-disc ca-home-moving--slow right-[-6%] top-[-8%] hidden h-[min(480px,48vw)] w-[min(480px,48vw)] opacity-70 lg:block"
            />
            <div
              aria-hidden="true"
              className="ca-home-ring right-[2%] top-[2%] hidden h-[min(360px,38vw)] w-[min(360px,38vw)] lg:block"
            />

            {/* Layer 2 — primary photo */}
            <motion.div
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 18, scale: 0.985 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.12, ease: revealEase }}
              className="ca-home-frame-offset ca-home-photo-overlay relative z-10 mx-auto w-[92%] max-w-[680px] shadow-[0_24px_60px_rgba(7,59,58,0.10)] ring-1 ring-[#DDE6E3] sm:w-[88%] lg:ml-auto lg:mr-[4%]"
            >
              <div className="ca-home-img-hero relative aspect-[3/2] w-full">
                <Image
                  src={stockImage("hero", { w: 1400, q: 85 })}
                  alt="Enterprise technology leaders collaborating"
                  fill
                  priority
                  className="ca-home-photo object-cover object-center"
                  sizes="(max-width: 1024px) 92vw, 46vw"
                />
              </div>
            </motion.div>

            {/* Layer 3 — product UI + connector */}
            <div aria-hidden="true" className="ca-home-connector bottom-[22%] left-[28%] z-20 hidden lg:block" />
            <motion.div
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.24, ease: revealEase }}
              className="ca-home-product-ui absolute -bottom-3 left-0 z-30 w-[min(340px,58%)] max-w-[340px] sm:-bottom-4 sm:left-2 lg:-left-2"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/innovation/data-agent-hero.png"
                alt="Data Agent enterprise interface"
                width={1440}
                height={900}
                className="max-h-[170px] w-full object-cover object-top"
              />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
