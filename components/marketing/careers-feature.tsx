"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

import Container from "@/components/layout/container";
import Section from "@/components/layout/section";
import { careerPaths } from "@/data/careers";

export default function CareersFeature() {
  return (
    <Section
      id="careers"
      className="relative overflow-hidden bg-[#071A2F] text-white"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-48 top-20 h-[520px] w-[520px] rounded-full bg-[var(--ca-blue)]/10 blur-3xl"
      />

      <Container className="relative z-10">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <span className="ca-eyebrow text-white/60">CAREERS</span>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-8"
          >
            <h2 className="ca-h2 max-w-5xl text-white">Build what&apos;s next.</h2>

            <p className="mt-8 max-w-3xl text-lg leading-8 text-white/65">
              Work alongside experienced professionals solving complex business
              and technology challenges across enterprise platforms, AI, data, and
              digital transformation.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link href="/jobs" className="ca-button-light">
                Explore Open Roles
                <ArrowUpRight className="h-4 w-4" />
              </Link>

              <Link
                href="/careers"
                className="inline-flex items-center gap-2 px-1 py-3 text-sm font-medium text-white transition-opacity hover:opacity-70"
              >
                Life at ConsultAmerica
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>
        </div>

        <div className="mt-20 border-t border-white/10">
          {careerPaths.map((path, index) => (
            <motion.article
              key={path.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.5,
                delay: index * 0.04,
              }}
              className="group border-b border-white/10"
            >
              <Link
                href={path.href}
                className="grid gap-5 py-8 transition-colors duration-300 hover:bg-white/[0.03] md:grid-cols-12 md:items-center md:px-6 lg:py-10"
              >
                <div className="md:col-span-2">
                  <span className="ca-eyebrow text-white/35">{path.number}</span>
                </div>

                <div className="md:col-span-4">
                  <h3 className="text-xl font-medium tracking-[-0.03em] text-white md:text-2xl">
                    {path.title}
                  </h3>
                </div>

                <div className="md:col-span-5">
                  <p className="max-w-xl text-sm leading-6 text-white/55">
                    {path.description}
                  </p>
                </div>

                <div className="flex md:col-span-1 md:justify-end">
                  <ArrowUpRight className="h-5 w-5 text-white transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-1" />
                </div>
              </Link>
            </motion.article>
          ))}
        </div>
      </Container>
    </Section>
  );
}
