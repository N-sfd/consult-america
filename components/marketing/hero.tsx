"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

import EditorialHeading from "@/components/marketing/EditorialHeading";
import HeroVisual from "@/components/marketing/HeroVisual";
import SectionLabel from "@/components/marketing/SectionLabel";
import { useContactPanel } from "@/components/providers/contact-provider";

export default function Hero() {
  const { setOpen } = useContactPanel();

  return (
    <section className="mkt-hero-bg relative overflow-hidden pt-[76px] pb-12 sm:pt-[88px] sm:pb-16 lg:pt-[104px] lg:pb-20">
      <div className="mkt-shell relative z-10">
        <div className="flex flex-col lg:grid lg:grid-cols-12 lg:items-center lg:gap-10 xl:gap-12">
          {/* Content: 54% width on desktop */}
          <div className="order-1 lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <SectionLabel tone="blue">
                The Enterprise Transformation Partner
              </SectionLabel>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.08 }}
              className="mt-4 md:mt-5"
            >
              <EditorialHeading
                as="h1"
                size="hero"
                reveal={false}
                className="mkt-hero-heading--home text-[var(--mkt-navy)]"
              >
                Technology that moves business forward.
              </EditorialHeading>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.16 }}
              className="mt-4 max-w-xl text-[17px] leading-relaxed text-[var(--mkt-muted)] sm:text-lg lg:text-[20px]"
            >
              Oracle, AI, data, and enterprise transformation from strategy
              through production.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.24 }}
              className="mt-6 flex flex-col items-stretch gap-4 sm:flex-row sm:items-center"
            >
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="group/cta ca-button-primary ca-button-primary--hero w-full sm:w-auto"
              >
                Start a conversation
                <ArrowUpRight className="mkt-cta-arrow h-4 w-4" />
              </button>
              <Link
                href="/capabilities"
                className="ca-link justify-center text-sm sm:justify-start"
              >
                Explore capabilities
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </motion.div>
          </div>

          {/* Diagram: 46% width on desktop */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.12 }}
            className="order-2 mt-8 w-full md:mt-10 lg:col-span-5 lg:mt-0"
          >
            <HeroVisual className="aspect-[5/4] w-full max-w-[540px] rounded-2xl mx-auto lg:max-w-none lg:max-h-[340px]" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
