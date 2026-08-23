"use client";

import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

import Container from "@/components/layout/container";

export default function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-[var(--ca-off-white)]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      <Container className="relative z-10 flex min-h-screen items-center pt-24">
        <div className="grid w-full gap-12 py-20 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="ca-eyebrow text-[var(--ca-muted)]"
            >
              ENTERPRISE TRANSFORMATION · ORACLE · AI
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                delay: 0.1,
              }}
              className="ca-display mt-8 max-w-6xl"
            >
              Technology that
              <br />
              moves business
              <br />
              forward.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.7,
                delay: 0.25,
              }}
              className="ca-body-lg mt-8 max-w-2xl"
            >
              We help enterprises transform operations, modernize platforms,
              and unlock intelligent growth through Oracle, cloud, data and AI.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.7,
                delay: 0.35,
              }}
              className="mt-10 flex flex-col gap-4 sm:flex-row sm:flex-wrap"
            >
              <Link
                href="/capabilities"
                className="ca-button-primary w-full sm:w-auto"
              >
                Explore Our Capabilities
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>

              <Link
                href="/contact"
                className="ca-link min-h-[52px] justify-center px-2 sm:justify-start"
              >
                Let&apos;s Work Together
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </motion.div>
          </div>

          <div className="lg:col-span-4 lg:pb-4">
            <HeroVisual />
          </div>
        </div>
      </Container>

      <div className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 lg:block">
        <div className="flex flex-col items-center gap-2 text-[var(--ca-muted)]">
          <span className="text-[10px] font-medium uppercase tracking-[0.16em]">
            Scroll
          </span>

          <div className="h-10 w-px bg-[var(--ca-border)]" />
        </div>
      </div>
    </section>
  );
}

function HeroVisual() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 1.03 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 1,
        delay: 0.3,
      }}
      className="relative aspect-[4/3] overflow-hidden rounded-[var(--ca-radius-md)] bg-[var(--ca-navy)] sm:aspect-[16/10] lg:aspect-[4/5]"
    >
      <div className="absolute -right-24 top-10 h-72 w-72 rounded-full border border-white/10" />
      <div className="absolute -right-8 top-28 h-56 w-56 rounded-full border border-white/10" />
      <div className="absolute right-10 top-44 h-40 w-40 rounded-full border border-white/10" />

      <div className="absolute left-8 top-8">
        <p className="ca-eyebrow text-white/50">CONSULTAMERICA</p>
      </div>

      <div className="absolute left-8 top-1/2 h-px w-[calc(100%-4rem)] bg-white/10" />

      <div className="absolute bottom-8 left-8 right-8">
        <p className="text-sm uppercase tracking-[0.14em] text-white/40">
          Strategy · Technology · Execution
        </p>

        <p className="mt-4 max-w-xs text-3xl font-medium leading-[1.05] tracking-[-0.03em] text-white">
          Turning enterprise complexity into forward motion.
        </p>
      </div>
    </motion.div>
  );
}
