"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

import EditorialHeading from "@/components/marketing/EditorialHeading";
import SectionLabel from "@/components/marketing/SectionLabel";

export default function InnovationHero({
  category,
  tagline,
  headline,
  summary,
  liveUrl,
  heroImage,
  heroImageAlt,
}: {
  category: string;
  tagline: string;
  headline: string;
  summary: string;
  liveUrl: string;
  heroImage: string;
  heroImageAlt: string;
}) {
  return (
    <section className="mkt-section bg-[var(--mkt-cloud)] text-[var(--mkt-navy)]">
      <div className="mkt-shell">
        <SectionLabel tone="blue">
          {category.toUpperCase()} / Product Innovation
        </SectionLabel>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.65 }}
          className="mt-7"
        >
          <EditorialHeading
            as="h1"
            size="hero"
            className="max-w-3xl text-[var(--mkt-navy)]"
          >
            {headline}
          </EditorialHeading>
          <p className="mkt-body-lg mt-7 max-w-2xl">{summary}</p>

          <div className="mt-4">
            <span className="text-sm font-medium text-[var(--mkt-blue)]">
              {tagline}
            </span>
          </div>

          <a
            href={liveUrl}
            target="_blank"
            rel="noreferrer"
            className="ca-button-primary mt-8 inline-flex"
          >
            View Live Product
            <ArrowUpRight className="h-4 w-4" />
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.65, delay: 0.1 }}
          className="relative mt-14 aspect-[16/10] w-full overflow-hidden rounded-2xl border border-[var(--mkt-border)] shadow-[0_30px_70px_rgba(16,42,67,0.12)] md:aspect-[16/9]"
        >
          <Image
            src={heroImage}
            alt={heroImageAlt}
            fill
            priority
            className="object-cover object-top"
            sizes="(max-width: 1024px) 100vw, 1200px"
          />
        </motion.div>
      </div>
    </section>
  );
}
