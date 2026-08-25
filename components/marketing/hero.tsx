"use client";

import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

import Atmosphere from "@/components/layout/atmosphere";
import { Grid, Shell } from "@/components/layout/grid";
import { useContactPanel } from "@/components/providers/contact-provider";
import { heroTags } from "@/lib/site-data";

export default function Hero() {
  const { setOpen } = useContactPanel();

  return (
    <section className="relative overflow-hidden bg-[#05070d] pt-[8.5rem] pb-12 lg:pb-16">
      <Atmosphere variant="hero" />

      <Shell className="relative z-10">
        <Grid>
          <div className="col-span-12 lg:col-span-10 xl:col-span-9">
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
              className="ca-display mt-4 max-w-4xl"
            >
              Technology that moves business forward.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.24 }}
              className="ca-body-lg mt-6 max-w-2xl"
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
                Contact Us
                <ArrowUpRight className="h-4 w-4" />
              </button>
              <Link href="/capabilities" className="ca-link text-sm">
                Explore our Capabilities
                <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
          </div>
        </Grid>

        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3" aria-label="Practice filters">
          {heroTags.map((tag) => (
            <Link key={tag.label} href={tag.href} className="ca-tag">
              {tag.label}
            </Link>
          ))}
        </div>
      </Shell>
    </section>
  );
}
