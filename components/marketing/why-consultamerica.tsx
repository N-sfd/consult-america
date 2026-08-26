"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

import Container from "@/components/layout/container";
import Section from "@/components/layout/section";

const metrics = [
  { value: "120+", label: "Enterprise programs delivered" },
  { value: "40+", label: "Oracle Cloud engagements" },
  { value: "15+", label: "Years of delivery depth" },
  { value: "98%", label: "Programs reaching production" },
];

const differentiators = [
  {
    number: "01",
    title: "Enterprise Depth",
    description:
      "Experience across complex enterprise platforms, business processes, integrations, data, testing, and transformation programs.",
  },
  {
    number: "02",
    title: "Business + Technology",
    description:
      "We connect business objectives with technology decisions so transformation improves how the organization actually operates.",
  },
  {
    number: "03",
    title: "Execution Focus",
    description:
      "Strategy matters when it becomes operational. We stay focused on implementation, adoption, measurable outcomes, and getting solutions live.",
  },
  {
    number: "04",
    title: "Senior Expertise",
    description:
      "Experienced practitioners stay close to the work, bringing practical judgment to complex decisions throughout the engagement.",
  },
  {
    number: "05",
    title: "Flexible Delivery",
    description:
      "Engagement models can adapt to the need—from targeted expertise and project leadership to integrated teams and managed delivery.",
  },
  {
    number: "06",
    title: "Long-Term Partnership",
    description:
      "We build relationships beyond individual milestones, helping clients evolve platforms, processes, data, and capabilities over time.",
  },
];

export default function WhyConsultAmerica() {
  return (
    <Section id="why-consultamerica" className="bg-[#05070d] text-white">
      <Container>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <span className="ca-eyebrow text-white/45">WHY CONSULTAMERICA</span>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-8"
          >
            <h2 className="ca-h2 max-w-5xl text-white">
              Enterprise transformation
              <br />
              without the unnecessary layers.
            </h2>

            <p className="mt-8 max-w-3xl text-lg leading-8 text-white/65">
              Enterprise-scale expertise with senior involvement, practical
              execution, and flexible delivery—depth for complex work without
              unnecessary layers.
            </p>
          </motion.div>
        </div>

        <div className="mt-16 grid grid-cols-2 gap-px overflow-hidden border border-white/10 bg-white/10 lg:grid-cols-4">
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="bg-[#05070d] p-6 md:p-8"
            >
              <p className="text-4xl font-medium tracking-[-0.04em] text-white md:text-5xl">
                {metric.value}
              </p>
              <p className="mt-3 max-w-[12rem] text-sm leading-6 text-white/50">
                {metric.label}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 grid border-t border-white/10 md:grid-cols-2 lg:grid-cols-3">
          {differentiators.map((item, index) => (
            <motion.article
              key={item.title}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.55,
                delay: index * 0.05,
              }}
              className="group relative border-b border-white/10 p-8 md:min-h-[280px] md:border-r md:p-10 md:[&:nth-child(2n)]:border-r-0 lg:min-h-[300px] lg:[&:nth-child(2n)]:border-r lg:[&:nth-child(3n)]:border-r-0"
            >
              <div
                aria-hidden="true"
                className="absolute left-0 top-0 h-px w-0 bg-[var(--ca-blue)] transition-all duration-500 group-hover:w-full"
              />

              <span className="ca-eyebrow text-white/35">{item.number}</span>

              <h3 className="mt-10 text-2xl font-medium tracking-[-0.035em] text-white transition-colors duration-300 group-hover:text-[#93c5fd]">
                {item.title}
              </h3>

              <p className="mt-5 max-w-sm text-base leading-7 text-white/55">
                {item.description}
              </p>
            </motion.article>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.7 }}
          className="mt-24 border-t border-white/10 pt-16"
        >
          <p className="max-w-5xl text-4xl font-medium leading-[1.08] tracking-[-0.045em] text-white md:text-6xl">
            Deep enough for the enterprise.
            <br />
            Focused enough to stay close.
          </p>
        </motion.div>

        <div className="mt-12 flex justify-end">
          <Link href="/about" className="ca-link">
            About ConsultAmerica
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </Container>
    </Section>
  );
}
