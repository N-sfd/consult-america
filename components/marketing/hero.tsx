"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

import EditorialHeading from "@/components/marketing/EditorialHeading";
import MediaPanel from "@/components/marketing/MediaPanel";
import MetricStrip from "@/components/marketing/MetricStrip";
import SectionLabel from "@/components/marketing/SectionLabel";
import { useContactPanel } from "@/components/providers/contact-provider";
import { heroStats } from "@/lib/site-data";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1800&q=80";

export default function Hero() {
  const { setOpen } = useContactPanel();

  return (
    <section className="mkt-hero-bg relative overflow-hidden pb-14 pt-10 lg:min-h-[min(92vh,48rem)] lg:pb-16 lg:pt-14">
      <div className="mkt-shell relative z-10">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-10 xl:gap-14">
          <div className="lg:col-span-6 xl:col-span-5">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
            >
              <SectionLabel tone="blue">
                The Enterprise Transformation Partner
              </SectionLabel>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="mt-7"
            >
              <EditorialHeading
                as="h1"
                size="hero"
                reveal={false}
                className="max-w-[12ch] text-[var(--mkt-navy)]"
              >
                Technology that moves business forward.
              </EditorialHeading>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.22 }}
              className="mkt-body-lg mt-8 max-w-md"
            >
              Enterprise cloud, Oracle, AI and transformation—from roadmap to
              production.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.32 }}
              className="mt-10 flex flex-wrap items-center gap-5"
            >
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="group/cta ca-button-primary"
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
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.18 }}
            className="lg:col-span-6 xl:col-span-7"
          >
            <MediaPanel
              src={HERO_IMAGE}
              alt="Enterprise technology and consulting environment"
              priority
              sizes="(max-width: 1024px) 100vw, 55vw"
              className="aspect-[4/3] w-full shadow-[0_24px_80px_rgba(16,42,67,0.12)] lg:aspect-[5/4] xl:min-h-[30rem]"
              overlay="none"
            />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="mt-14 lg:mt-16"
        >
          <MetricStrip
            tone="dark"
            items={heroStats.map((stat) => ({
              value: stat.value,
              label: stat.label,
            }))}
          />
        </motion.div>
      </div>
    </section>
  );
}
