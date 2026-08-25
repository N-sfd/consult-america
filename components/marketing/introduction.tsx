"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

import Container from "@/components/layout/container";
import Section from "@/components/layout/section";
import SectionLabel from "@/components/shared/section-label";

const pillars = [
  {
    number: "01",
    title: "Strategy",
    description:
      "Align technology investments with business priorities and transformation goals.",
  },
  {
    number: "02",
    title: "Technology",
    description:
      "Design and modernize enterprise platforms across Oracle, cloud, data and AI.",
  },
  {
    number: "03",
    title: "Execution",
    description:
      "Move programs from roadmap through implementation, adoption and production.",
  },
];

export default function Introduction() {
  return (
    <Section id="who-we-are" className="bg-[#0a0c12]">
      <Container>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <SectionLabel light>WHO WE ARE</SectionLabel>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-8"
          >
            <h2 className="ca-h2 max-w-5xl">
              We work where business, technology and transformation come
              together.
            </h2>

            <div className="mt-10 grid gap-8 md:grid-cols-2">
              <p className="ca-body-lg">
                ConsultAmerica helps organizations modernize enterprise
                platforms, transform business processes, and build intelligent
                digital capabilities.
              </p>

              <div>
                <p className="ca-body">
                  We bring together strategy, Oracle expertise, cloud, data, AI,
                  digital engineering, and execution-focused delivery to move
                  complex initiatives from planning into production.
                </p>

                <Link href="/about" className="ca-link mt-8">
                  About ConsultAmerica
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="mt-20 grid border-t border-[var(--ca-border-light)] md:grid-cols-3">
          {pillars.map((pillar, index) => (
            <div
              key={pillar.title}
              className={`py-8 md:px-8 ${
                index < pillars.length - 1
                  ? "md:border-r md:border-[var(--ca-border-light)]"
                  : ""
              } ${index === 0 ? "md:pl-0" : ""}`}
            >
              <p className="ca-eyebrow text-[var(--ca-muted)]">{pillar.number}</p>

              <h3 className="mt-5 text-2xl font-medium tracking-[-0.03em]">
                {pillar.title}
              </h3>

              <p className="mt-4 max-w-sm text-sm leading-6 text-[var(--ca-muted)]">
                {pillar.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
