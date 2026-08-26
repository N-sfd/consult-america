"use client";

import Image from "next/image";
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
        <div className="grid items-stretch gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="flex flex-col lg:col-span-5">
            <SectionLabel light>WHO WE ARE</SectionLabel>

            <motion.div
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.7 }}
              className="mt-8 flex flex-1 flex-col"
            >
              <h2 className="ca-h2 max-w-xl">
                We work where business, technology and transformation come
                together.
              </h2>

              <p className="ca-body-lg mt-8 max-w-md">
                ConsultAmerica helps organizations modernize enterprise
                platforms, transform business processes, and build intelligent
                digital capabilities.
              </p>

              <p className="ca-body mt-5 max-w-md">
                We bring together strategy, Oracle expertise, cloud, data, AI,
                digital engineering, and execution-focused delivery to move
                complex initiatives from planning into production.
              </p>

              <Link href="/about" className="ca-link mt-10 w-fit">
                About ConsultAmerica
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="relative min-h-[420px] overflow-hidden lg:col-span-7 lg:min-h-[560px]"
          >
            <Image
              src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1400&q=80"
              alt="Teams collaborating in a modern technology environment"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 58vw"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-[#0a0c12]/70 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 grid border-t border-white/15 bg-black/50 backdrop-blur-sm md:grid-cols-3">
              {pillars.map((pillar) => (
                <div
                  key={pillar.title}
                  className="border-b border-white/10 p-5 last:border-b-0 md:border-b-0 md:border-r md:border-white/10 md:last:border-r-0"
                >
                  <p className="ca-eyebrow text-white/40">{pillar.number}</p>
                  <h3 className="mt-3 text-lg font-medium tracking-[-0.02em]">
                    {pillar.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-white/55">
                    {pillar.description}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </Container>
    </Section>
  );
}
