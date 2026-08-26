"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

import Atmosphere from "@/components/layout/atmosphere";
import { Shell } from "@/components/layout/grid";
import { useContactPanel } from "@/components/providers/contact-provider";
import { heroStats } from "@/lib/site-data";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1600&q=75";

export default function Hero() {
  const { setOpen } = useContactPanel();

  return (
    <section className="relative overflow-hidden bg-[#05070d] pt-[8.5rem] pb-12 lg:min-h-[44rem] lg:pb-16">
      <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[45%] lg:block">
        <Image
          src={HERO_IMAGE}
          alt=""
          fill
          priority
          sizes="45vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#05070d] via-[#05070d]/55 to-[#05070d]/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#05070d] via-transparent to-[#05070d]/40" />
        <Atmosphere variant="hero" />
      </div>

      <div className="pointer-events-none absolute inset-0 lg:hidden">
        <Atmosphere variant="hero" />
      </div>

      <Shell className="relative z-10 flex h-full flex-col lg:min-h-[calc(44rem-8.5rem-4rem)] lg:justify-between">
        <div className="max-w-xl xl:max-w-2xl">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-sm font-medium tracking-[0.04em] text-white/70"
          >
            We are ConsultAmerica
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.08 }}
            className="mt-5 text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-[#93c5fd]"
          >
            The Enterprise Transformation Partner
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.14 }}
            className="ca-display mt-4"
          >
            Technology that moves business forward.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.24 }}
            className="ca-body-lg mt-6 max-w-lg"
          >
            End-to-end enterprise cloud, Oracle, and AI integration for
            scalable growth—from roadmap to production.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.32 }}
            className="mt-8 flex flex-wrap items-center gap-4"
          >
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="ca-button-primary"
            >
              Start a conversation
              <ArrowUpRight className="h-4 w-4" />
            </button>
            <Link href="/capabilities" className="ca-link text-sm">
              Explore our Capabilities
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>

        <div className="relative mt-10 aspect-[16/10] w-full overflow-hidden rounded-lg lg:hidden">
          <Image
            src={HERO_IMAGE}
            alt=""
            fill
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#05070d] via-transparent to-transparent" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-10 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-white/10 pt-6 sm:flex sm:flex-wrap sm:items-center sm:gap-x-10 lg:mt-0"
        >
          {heroStats.map((stat) => (
            <div key={stat.label}>
              <p className="text-lg font-semibold tracking-[-0.01em] text-white">
                {stat.value}
              </p>
              <p className="mt-1 text-[0.7rem] font-medium uppercase tracking-[0.1em] text-white/45">
                {stat.label}
              </p>
            </div>
          ))}
        </motion.div>
      </Shell>
    </section>
  );
}
