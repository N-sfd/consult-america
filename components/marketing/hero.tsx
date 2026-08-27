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
    <section className="mkt-hero-bg relative overflow-hidden py-8 md:py-10 lg:py-12">
      <div className="mkt-shell relative z-10">
        <div className="flex flex-col gap-10 lg:grid lg:grid-cols-2 lg:items-center lg:gap-12 xl:gap-16">
          <div className="order-1">
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
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.08 }}
              className="mt-4 md:mt-5"
            >
              <EditorialHeading
                as="h1"
                size="hero"
                reveal={false}
                className="text-[var(--mkt-navy)]"
              >
                Technology that moves business forward.
              </EditorialHeading>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.18 }}
              className="mkt-body-lg mt-4 md:mt-5"
            >
              Oracle, AI, data, and enterprise transformation from strategy
              through production.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.26 }}
              className="mt-6 flex flex-col items-stretch gap-4 sm:flex-row sm:items-center"
            >
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="group/cta ca-button-primary w-full sm:w-auto"
              >
                Start a conversation
                <ArrowUpRight className="mkt-cta-arrow h-4 w-4" />
              </button>
              <Link href="/capabilities" className="ca-link justify-center text-sm sm:justify-start">
                Explore capabilities
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.12 }}
            className="order-2 w-full"
          >
            <HeroVisual className="aspect-[16/10] w-full rounded-2xl lg:aspect-[5/4] lg:max-h-[380px]" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
