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
  "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1800&q=80";

export default function Hero() {
  const { setOpen } = useContactPanel();

  return (
    <section className="relative overflow-hidden bg-[var(--mkt-ink)] pt-[8.5rem] pb-16 lg:min-h-[min(100vh,52rem)] lg:pb-20">
      <div
        aria-hidden="true"
        className="mkt-grid-drift pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.75) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.75) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

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
                className="max-w-[11ch] text-white"
              >
                Technology that moves business forward.
              </EditorialHeading>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.22 }}
              className="mkt-body-lg mt-8 max-w-md text-white/70"
            >
              Strategy. Technology. Execution.
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
              alt="Enterprise technology and modern workplace environment"
              priority
              sizes="(max-width: 1024px) 100vw, 55vw"
              className="aspect-[4/3] w-full lg:aspect-[5/4] xl:min-h-[32rem]"
              overlay="navy"
            >
              <div
                aria-hidden="true"
                className="mkt-grid-drift absolute inset-0 opacity-[0.12]"
                style={{
                  backgroundImage:
                    "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
                  backgroundSize: "48px 48px",
                }}
              />
              <div className="absolute inset-x-0 bottom-0 p-5 md:p-7">
                <div className="mkt-accent-bar mb-0" />
                <div className="border border-white/15 border-t-0 bg-[var(--mkt-ink)]/55 p-4 backdrop-blur-md md:p-5">
                  <p className="mkt-eyebrow text-[var(--mkt-blue-soft)]">
                    Live overlay
                  </p>
                  <div className="mt-4 grid grid-cols-3 gap-3">
                    {[
                      { label: "Enterprise", value: "Ops", tone: "blue" },
                      { label: "People", value: "Teams", tone: "green" },
                      { label: "Technology", value: "Cloud", tone: "amber" },
                    ].map((cell) => (
                      <div key={cell.label}>
                        <p className="text-[0.65rem] uppercase tracking-[0.12em] text-white/40">
                          {cell.label}
                        </p>
                        <p
                          className={
                            cell.tone === "green"
                              ? "mt-1 text-sm font-medium text-[var(--mkt-green)]"
                              : cell.tone === "amber"
                                ? "mt-1 text-sm font-medium text-[var(--mkt-gold)]"
                                : "mt-1 text-sm font-medium text-[var(--mkt-blue-soft)]"
                          }
                        >
                          {cell.value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </MediaPanel>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="mt-14 lg:mt-16"
        >
          <MetricStrip
            tone="light"
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
