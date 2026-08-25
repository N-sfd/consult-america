"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

import Container from "@/components/layout/container";
import Section from "@/components/layout/section";

const industries = [
  {
    number: "01",
    title: "Government & Public Sector",
    description:
      "Modernize public-sector finance, procurement, grants, workforce, data, and service delivery while supporting transparency, control, and accountability.",
    href: "/industries/government-public-sector",
  },
  {
    number: "02",
    title: "Financial Services",
    description:
      "Connect finance, data, automation, reporting, and enterprise platforms to improve control, visibility, and operational efficiency.",
    href: "/industries/financial-services",
  },
  {
    number: "03",
    title: "Healthcare",
    description:
      "Modernize enterprise operations, workforce processes, financial systems, data flows, and digital experiences across complex healthcare environments.",
    href: "/industries/healthcare",
  },
  {
    number: "04",
    title: "Retail & Consumer",
    description:
      "Connect finance, supply chain, planning, customer operations, analytics, and digital platforms to support faster and more responsive decisions.",
    href: "/industries/retail-consumer",
  },
  {
    number: "05",
    title: "Transportation",
    description:
      "Improve asset, project, procurement, workforce, financial, and operational processes across transportation and infrastructure organizations.",
    href: "/industries/transportation",
  },
  {
    number: "06",
    title: "Technology",
    description:
      "Help technology organizations scale enterprise platforms, automate operations, integrate systems, and turn data into better products and decisions.",
    href: "/industries/technology",
  },
];

export default function Industries() {
  return (
    <Section id="industries" className="bg-white text-[#05070d]">
      <Container>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <span className="ca-eyebrow text-black/45">INDUSTRIES</span>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-8"
          >
            <h2 className="ca-h2 max-w-5xl text-[#05070d]">
              Transformation looks different
              <br />
              in every industry.
            </h2>

            <p className="mt-8 max-w-3xl text-lg leading-8 text-black/65">
              Our work combines industry context with enterprise technology,
              data, and delivery expertise to solve the problems that matter
              most.
            </p>
          </motion.div>
        </div>

        <div className="mt-20 border-t border-black/10">
          {industries.map((industry, index) => (
            <motion.article
              key={industry.title}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.55,
                delay: index * 0.04,
              }}
              className="group border-b border-black/10"
            >
              <Link
                href={industry.href}
                className="grid gap-4 py-10 transition-colors duration-300 hover:bg-[var(--ca-off-white)] md:grid-cols-12 md:items-start md:gap-6 md:px-6 lg:py-14"
              >
                <div className="md:col-span-2">
                  <span className="ca-eyebrow text-black/40">
                    {industry.number}
                  </span>
                </div>

                <div className="md:col-span-4">
                  <h3 className="text-2xl font-medium tracking-[-0.035em] text-[#05070d] transition-colors duration-200 group-hover:text-[var(--ca-blue)] md:text-3xl">
                    {industry.title}
                  </h3>
                </div>

                <div className="md:col-span-5">
                  <p className="max-w-xl text-base leading-7 text-black/55">
                    {industry.description}
                  </p>
                </div>

                <div className="flex md:col-span-1 md:justify-end">
                  <ArrowUpRight className="h-5 w-5 text-[#05070d] transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-1" />
                </div>
              </Link>
            </motion.article>
          ))}
        </div>

        <div className="mt-10 flex justify-end">
          <Link href="/industries" className="ca-link">
            Explore All Industries
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </Container>
    </Section>
  );
}
