"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

import EditorialHeading from "@/components/marketing/EditorialHeading";
import SectionLabel from "@/components/marketing/SectionLabel";
import { useContactPanel } from "@/components/providers/contact-provider";

export default function DetailHero({
  kicker,
  title,
  description,
  focusAreas,
  image,
  imageAlt,
}: {
  kicker: string;
  title: string;
  description: string;
  focusAreas: string[];
  image: string;
  imageAlt: string;
}) {
  const { setOpen } = useContactPanel();

  return (
    <section className="mkt-section bg-[var(--mkt-navy)] text-white">
      <div className="mkt-shell">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-7">
            <SectionLabel tone="light">{kicker}</SectionLabel>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.65 }}
              className="mt-7"
            >
              <EditorialHeading as="h1" size="hero" className="max-w-2xl !text-white">
                {title}
              </EditorialHeading>

              <p className="mkt-body-lg mt-7 max-w-xl text-white/65">
                {description}
              </p>

              <button
                type="button"
                onClick={() => setOpen(true)}
                className="ca-button-primary mt-9"
              >
                Talk to us
                <ArrowUpRight className="h-4 w-4" />
              </button>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.65, delay: 0.1 }}
            className="relative min-h-[240px] overflow-hidden lg:col-span-5 lg:min-h-[380px]"
          >
            <Image
              src={image}
              alt={imageAlt}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 40vw"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--mkt-navy)]/70 via-transparent to-transparent" />
          </motion.div>
        </div>

        {focusAreas.length > 0 && (
          <div className="mt-14 flex flex-wrap gap-x-8 gap-y-3 border-t border-white/12 pt-8">
            {focusAreas.map((area) => (
              <span key={area} className="text-sm font-medium text-white/70">
                {area}
              </span>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
