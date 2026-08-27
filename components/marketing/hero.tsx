"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

import EditorialHeading from "@/components/marketing/EditorialHeading";
import MediaPanel from "@/components/marketing/MediaPanel";
import SectionLabel from "@/components/marketing/SectionLabel";
import { useContactPanel } from "@/components/providers/contact-provider";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80";

export default function Hero() {
  const { setOpen } = useContactPanel();

  return (
    <section className="mkt-hero-bg relative overflow-hidden py-10 lg:min-h-[680px] lg:py-12 xl:min-h-[760px] xl:py-14">
      <div className="mkt-shell relative z-10 flex h-full flex-col justify-center">
        <div className="grid items-center gap-10 lg:grid-cols-[1.08fr_.92fr] xl:gap-20">
          <div>
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
              className="mt-5"
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
              className="mkt-body-lg mt-6"
            >
              Oracle, AI, data, and enterprise transformation from strategy
              through production.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.26 }}
              className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center"
            >
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="group/cta ca-button-primary w-full sm:w-auto"
              >
                Start a conversation
                <ArrowUpRight className="mkt-cta-arrow h-4 w-4" />
              </button>
              <Link href="/capabilities" className="ca-link text-sm">
                Explore capabilities
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.12 }}
          >
            <MediaPanel
              src={HERO_IMAGE}
              alt="Enterprise technology environment"
              priority
              sizes="(max-width: 1024px) 100vw, 55vw"
              className="aspect-[16/11] w-full shadow-[0_20px_60px_rgba(16,42,67,0.1)] lg:aspect-[5/4] lg:max-h-[480px]"
              overlay="none"
            >
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-4 border border-white/15 bg-[var(--mkt-navy)]/70 px-4 py-3 backdrop-blur-md sm:right-auto sm:min-w-[15rem]">
                <div>
                  <p className="text-[0.65rem] uppercase tracking-[0.14em] text-white/50">
                    Delivery status
                  </p>
                  <p className="mt-1 text-sm font-medium text-white">
                    Oracle + AI · Enterprise scale
                  </p>
                </div>
                <span className="h-2 w-2 shrink-0 rounded-full bg-[var(--mkt-bright)]" />
              </div>
            </MediaPanel>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
