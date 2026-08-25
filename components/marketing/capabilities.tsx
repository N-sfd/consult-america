"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

import Container from "@/components/layout/container";
import Section from "@/components/layout/section";
import SectionLabel from "@/components/shared/section-label";

const capabilities = [
  {
    number: "01",
    title: "Enterprise Transformation",
    description:
      "Align strategy, processes, operating models, and technology to modernize the enterprise and create measurable business value.",
    href: "/capabilities/enterprise-transformation",
  },
  {
    number: "02",
    title: "Oracle & Enterprise Platforms",
    description:
      "Modernize finance, supply chain, HR, projects, planning, integration, and analytics across Oracle Cloud and enterprise applications.",
    href: "/oracle",
  },
  {
    number: "03",
    title: "AI & Data",
    description:
      "Turn enterprise data into intelligent workflows, AI agents, automation, analytics, and decision support that can operate in production.",
    href: "/ai-data",
  },
  {
    number: "04",
    title: "Digital Engineering",
    description:
      "Design and build modern digital products, applications, APIs, integrations, and experiences that connect people, processes, and platforms.",
    href: "/capabilities/digital-engineering",
  },
  {
    number: "05",
    title: "Managed Delivery",
    description:
      "Provide the program leadership, functional expertise, technical delivery, testing, and operational support needed to keep transformation moving.",
    href: "/capabilities/managed-delivery",
  },
];

export default function Capabilities() {
  return (
    <Section id="capabilities" className="bg-[#05070d]">
      <Container>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <SectionLabel light>CAPABILITIES</SectionLabel>
          </div>

          <div className="lg:col-span-8">
            <motion.h2
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.7 }}
              className="ca-h2 max-w-5xl"
            >
              From strategy to execution, we help organizations transform what
              matters most.
            </motion.h2>

            <p className="ca-body-lg mt-8 max-w-3xl">
              Our capabilities span enterprise strategy, Oracle platforms, AI
              and data, digital engineering, and managed delivery—bringing
              together the expertise needed to move complex programs forward.
            </p>
          </div>
        </div>

        <div className="mt-20 border-t border-[var(--ca-border-light)]">
          {capabilities.map((capability, index) => (
            <motion.article
              key={capability.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.6,
                delay: index * 0.05,
              }}
              className="group relative border-b border-[var(--ca-border-light)]"
            >
              <Link
                href={capability.href}
                className="grid gap-4 py-10 transition-colors duration-300 hover:bg-white/[0.03] md:grid-cols-12 md:items-start md:gap-6 md:px-6 lg:py-14"
              >
                <div className="md:col-span-2">
                  <span className="ca-eyebrow text-[var(--ca-muted)]">
                    {capability.number}
                  </span>
                </div>

                <div className="md:col-span-4">
                  <h3 className="text-2xl font-medium tracking-[-0.035em] md:text-3xl">
                    {capability.title}
                  </h3>
                </div>

                <div className="md:col-span-5">
                  <p className="max-w-xl text-base leading-7 text-[var(--ca-muted)]">
                    {capability.description}
                  </p>
                </div>

                <div className="flex md:col-span-1 md:justify-end">
                  <ArrowUpRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-1" />
                </div>
              </Link>

              <div className="absolute bottom-0 left-0 h-px w-0 bg-[var(--ca-blue)] transition-all duration-500 group-hover:w-full" />
            </motion.article>
          ))}
        </div>

        <div className="mt-10 flex justify-end">
          <Link href="/capabilities" className="ca-link">
            Explore All Capabilities
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </Container>
    </Section>
  );
}
