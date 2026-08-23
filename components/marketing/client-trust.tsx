"use client";

import { motion } from "framer-motion";

import Container from "@/components/layout/container";
import Section from "@/components/layout/section";
import SectionLabel from "@/components/shared/section-label";

const credibilityItems = [
  "Oracle",
  "Enterprise Transformation",
  "Cloud",
  "AI & Data",
  "Digital Engineering",
  "Program Delivery",
];

const proofPoints = [
  {
    value: "17+",
    label: "Years of enterprise experience",
  },
  {
    value: "End-to-End",
    label: "Strategy through implementation and support",
  },
  {
    value: "Oracle",
    label: "Enterprise transformation expertise",
  },
];

export default function ClientTrust() {
  return (
    <Section className="bg-white">
      <Container>
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-4">
            <SectionLabel>TRUST & CREDIBILITY</SectionLabel>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-8"
          >
            <h2 className="ca-h3 max-w-3xl">
              Trusted to deliver complex enterprise transformation.
            </h2>

            <p className="ca-body mt-6 max-w-2xl">
              ConsultAmerica combines enterprise experience, technology depth,
              and execution-focused delivery to help organizations move
              transformation initiatives forward.
            </p>
          </motion.div>
        </div>

        <div className="mt-16 border-y border-[var(--ca-border-light)]">
          <div className="grid grid-cols-2 md:grid-cols-3">
            {credibilityItems.map((item, index) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.45,
                  delay: index * 0.05,
                }}
                className="flex min-h-28 items-center px-5 py-7 md:min-h-32 md:px-8"
              >
                <p className="text-sm font-medium uppercase tracking-[0.12em] text-[var(--ca-ink)]">
                  {item}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="mt-14 grid border-t border-[var(--ca-border-light)] md:grid-cols-3">
          {proofPoints.map((item, index) => (
            <div
              key={item.label}
              className={`py-8 md:px-8 ${
                index !== proofPoints.length - 1
                  ? "md:border-r md:border-[var(--ca-border-light)]"
                  : ""
              } ${index === 0 ? "md:pl-0" : ""}`}
            >
              <p className="text-3xl font-medium tracking-[-0.04em]">
                {item.value}
              </p>

              <p className="mt-3 max-w-xs text-sm leading-6 text-[var(--ca-muted)]">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
