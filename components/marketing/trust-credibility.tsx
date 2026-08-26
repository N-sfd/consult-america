"use client";

import { motion } from "framer-motion";

import EditorialHeading from "@/components/marketing/EditorialHeading";
import MediaPanel from "@/components/marketing/MediaPanel";
import SectionLabel from "@/components/marketing/SectionLabel";
import { trustMarks } from "@/lib/site-data";

const TRUST_IMAGE =
  "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=80";

const stats = [
  {
    value: "17+",
    label: "Years",
    detail: "Enterprise delivery experience",
  },
  {
    value: "E2E",
    label: "Strategy → Production",
    detail: "From roadmap through go-live",
  },
  {
    value: "5",
    label: "Core practices",
    detail: "Enterprise delivery focus",
  },
];

export default function TrustCredibility() {
  return (
    <section
      id="trust"
      className="mkt-section border-y border-[var(--mkt-border)] bg-[var(--mkt-white)]"
    >
      <div className="mkt-shell">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-5">
            <SectionLabel tone="dark">Trust & Credibility</SectionLabel>

            <div className="mt-8">
              <EditorialHeading className="max-w-md text-[var(--mkt-navy)]">
                Trusted where transformation gets complicated.
              </EditorialHeading>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6 }}
              className="mt-14 space-y-10 border-t border-[var(--mkt-border)] pt-10"
            >
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="grid grid-cols-[auto_1fr] items-start gap-6"
                >
                  <p className="min-w-[4.5rem] text-4xl font-medium tracking-[-0.04em] text-[var(--mkt-navy)] md:text-5xl">
                    {stat.value}
                  </p>
                  <div>
                    <p className="text-base font-medium tracking-[-0.02em] text-[var(--mkt-text)]">
                      {stat.label}
                    </p>
                    <p className="mkt-body mt-1">{stat.detail}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-7"
          >
            <MediaPanel
              src={TRUST_IMAGE}
              alt="Delivery team collaborating in an enterprise workplace"
              className="min-h-[360px] w-full lg:min-h-[560px]"
              sizes="(max-width: 1024px) 100vw, 58vw"
              overlay="none"
            />
          </motion.div>
        </div>

        <div className="mt-16 border-t border-[var(--mkt-border)] pt-8">
          <p className="mkt-eyebrow text-[var(--mkt-muted)]">
            Platforms & sectors we deliver in
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-x-10 gap-y-4">
            {trustMarks.map((mark) => (
              <span
                key={mark}
                className="text-sm font-medium tracking-[0.04em] text-[var(--mkt-muted)]"
              >
                {mark}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
