"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

import EditorialHeading from "@/components/marketing/EditorialHeading";
import MediaPanel from "@/components/marketing/MediaPanel";
import SectionLabel from "@/components/marketing/SectionLabel";

const PRIMARY_IMAGE =
  "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1400&q=80";

const pillars = [
  {
    title: "Strategy",
    description:
      "Align technology investments with business priorities and transformation goals.",
  },
  {
    title: "Technology",
    description:
      "Design and modernize enterprise platforms across Oracle, cloud, data and AI.",
  },
  {
    title: "Execution",
    description:
      "Move programs from roadmap through implementation, adoption and production.",
  },
];

export default function Introduction() {
  return (
    <section
      id="who-we-are"
      className="mkt-section bg-[var(--mkt-warm)] text-[var(--mkt-text)]"
    >
      <div className="mkt-shell">
        <div className="grid items-start gap-12 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-6">
            <SectionLabel tone="dark">Who We Are</SectionLabel>

            <div className="mt-8">
              <EditorialHeading className="max-w-xl text-[var(--mkt-navy)]">
                We work where business, technology and transformation come
                together.
              </EditorialHeading>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.65 }}
              className="mkt-body-lg mt-8 max-w-xl"
            >
              ConsultAmerica helps organizations modernize enterprise platforms,
              transform business processes, and build intelligent digital
              capabilities.
            </motion.p>

            <p className="mkt-body mt-5 max-w-lg">
              We combine strategy, Oracle expertise, cloud, data, AI, digital
              engineering, and execution-focused delivery to move complex
              initiatives from planning into production.
            </p>

            <Link href="/about" className="ca-link mt-8 w-fit">
              About ConsultAmerica
              <ArrowUpRight className="h-4 w-4" />
            </Link>

            <div className="mt-14 grid gap-8 border-t border-[var(--mkt-border)] pt-10 sm:grid-cols-3">
              {pillars.map((pillar) => (
                <div key={pillar.title}>
                  <h3 className="text-lg font-medium tracking-[-0.02em] text-[var(--mkt-navy)]">
                    {pillar.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-[var(--mkt-muted)]">
                    {pillar.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-6"
          >
            <MediaPanel
              src={PRIMARY_IMAGE}
              alt="Consulting team collaborating on enterprise delivery"
              className="aspect-[4/5] w-full lg:min-h-[560px]"
              sizes="(max-width: 1024px) 100vw, 48vw"
              overlay="none"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
