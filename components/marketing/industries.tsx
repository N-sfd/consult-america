"use client";

import Image from "next/image";
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
      "Modernize public-sector finance, procurement, grants, workforce, data, and service delivery.",
    href: "/industries/government-public-sector",
    image:
      "https://images.unsplash.com/photo-1555848962-6e79363ec58f?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Legislative chamber interior",
  },
  {
    number: "02",
    title: "Financial Services",
    description:
      "Connect finance, data, automation, reporting, and enterprise platforms for operational control.",
    href: "/industries/financial-services",
    image:
      "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1000&q=80",
    imageAlt: "Financial operations and market data environment",
  },
  {
    number: "03",
    title: "Healthcare",
    description:
      "Modernize enterprise operations, workforce, financial systems, and clinical technology environments.",
    href: "/industries/healthcare",
    image:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1000&q=80",
    imageAlt: "Clinical technology and healthcare systems",
  },
  {
    number: "04",
    title: "Retail & Consumer",
    description:
      "Connect finance, supply chain, planning, analytics, and digital platforms for faster decisions.",
    href: "/industries/retail-consumer",
    image:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1000&q=80",
    imageAlt: "Retail operations and fulfillment environment",
  },
  {
    number: "05",
    title: "Transportation",
    description:
      "Improve asset, project, procurement, workforce, and operational processes across infrastructure.",
    href: "/industries/transportation",
    image:
      "https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=1000&q=80",
    imageAlt: "Transportation infrastructure and operations",
  },
  {
    number: "06",
    title: "Technology",
    description:
      "Scale enterprise platforms, automate operations, integrate systems, and turn data into decisions.",
    href: "/industries/technology",
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1000&q=80",
    imageAlt: "Engineering and data technology environment",
  },
];

export default function Industries() {
  return (
    <Section id="industries" className="bg-[var(--mkt-warm)] text-[var(--mkt-navy)]">
      <Container>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <span className="mkt-eyebrow text-[var(--mkt-muted)]">INDUSTRIES</span>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-8"
          >
            <h2 className="mkt-section-heading max-w-5xl text-[var(--mkt-navy)]">
              Transformation looks different
              <br />
              in every industry.
            </h2>

            <p className="mkt-body-lg mt-8 max-w-3xl">
              Industry context paired with enterprise technology, data, and
              delivery expertise—focused on the problems that matter most.
            </p>
          </motion.div>
        </div>

        <div className="mt-16 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {industries.map((industry, index) => (
            <motion.article
              key={industry.title}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.55, delay: index * 0.04 }}
            >
              <Link
                href={industry.href}
                className="group relative block min-h-[280px] overflow-hidden md:min-h-[320px]"
              >
                <Image
                  src={industry.image}
                  alt={industry.imageAlt}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--mkt-navy)]/90 via-[var(--mkt-navy)]/35 to-[var(--mkt-navy)]/10" />

                <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-7">
                  <span className="ca-eyebrow text-white/45">
                    {industry.number}
                  </span>
                  <h3 className="mt-3 text-xl font-medium tracking-[-0.03em] text-white md:text-2xl">
                    {industry.title}
                  </h3>
                  <p className="mt-3 max-w-sm text-sm leading-6 text-white/65 opacity-0 transition-opacity duration-300 group-hover:opacity-100 md:text-white/70 md:opacity-100">
                    {industry.description}
                  </p>
                  <ArrowUpRight className="mt-4 h-5 w-5 text-white transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-1" />
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
