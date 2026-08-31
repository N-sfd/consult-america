"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

import SectionLabel from "@/components/marketing/SectionLabel";

const screenshotProducts = [
  {
    category: "TALENT INTELLIGENCE",
    categoryColor: "text-[#365F8D]",
    containerBg: "bg-[#F7F8FA]",
    name: "JOBLENS",
    tagline: "Turn recruiting data into clearer talent decisions.",
    capabilities: [
      "Resume analyzer with ATS scoring",
      "Job matcher with keyword & skills-gap detection",
      "Application tracking by status",
      "Tailored cover letter generation",
    ],
    linkHref: "/work/innovation/joblens",
    image: "/innovation/joblens-hero.png",
    imageAlt: "JobLens candidate matching and resume analysis interface",
  },
  {
    category: "CLINICAL INTELLIGENCE",
    categoryColor: "text-[#5F7D75]",
    containerBg: "bg-[#F4F8F6]",
    name: "MEDIGUIDE AI",
    tagline: "Make complex health information easier to understand and use.",
    capabilities: [
      "Medication label explanation",
      "Lab result review",
      "Evidence citations on every answer",
      "Visit preparation workspace with voice playback",
    ],
    linkHref: "/work/innovation/mediguide-ai",
    image: "/innovation/mediguide-hero.png",
    imageAlt: "MediGuide AI clinical intelligence assistant interface",
  },
];

const capabilityProducts = [
  {
    category: "ENTERPRISE DATA",
    categoryColor: "text-[#365F8D]",
    name: "Data Explorer",
    tagline: "Explore enterprise data without losing business context.",
    capabilities: [
      "Plain-language data queries",
      "Results kept tied to source context",
      "Role-based, governed access",
    ],
    linkHref: "/capabilities/digital-engineering",
    isWorkflow: false,
  },
  {
    category: "INTEGRATION & CONNECTIVITY",
    categoryColor: "text-[#5F7D75]",
    name: "Convera",
    tagline: "Connect applications through a controlled service layer.",
    capabilities: [
      "Standardized data transformations",
      "Managed token authentication",
      "Legacy-to-cloud bridge adapters",
    ],
    linkHref: "/capabilities/digital-engineering",
    isWorkflow: false,
  },
  {
    category: "WORKFORCE OPERATIONS",
    categoryColor: "text-[#B63838]",
    name: "HR & Talent",
    tagline: "Recruiting, onboarding and workforce operations in one connected suite.",
    capabilities: ["RECRUIT", "HIRE", "ONBOARD", "MANAGE", "TIME", "APPROVE"],
    linkHref: "/platforms/ats",
    isWorkflow: true,
  },
];

export default function LabsShowcase() {
  return (
    <section id="labs" className="mkt-section bg-[#FCFCFD] text-[#101828]">
      <div className="mkt-shell">
        <SectionLabel tone="burgundy">Consult America Labs</SectionLabel>

        <div className="mt-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55 }}
              className="font-serif text-3xl font-semibold tracking-[-0.03em] sm:text-4xl lg:text-5xl"
            >
              We don&apos;t only advise. We build.
            </motion.h2>
            <p className="mt-3 max-w-xl text-base text-[#475467] sm:text-lg">
              Consult America Labs turns operational challenges into focused AI and
              enterprise applications — connecting consulting expertise with product
              engineering.
            </p>
          </div>

          <Link
            href="/work/innovation"
            className="group inline-flex items-center gap-1.5 text-sm font-semibold text-[#B63838] hover:text-[#8F292D]"
          >
            <span>Explore All Products</span>
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        {/* Screenshot Flagship Modules: JobLens, MediGuide AI (real product assets) */}
        <div className="mt-20 space-y-20 lg:space-y-28">
          {screenshotProducts.map((prod, index) => {
            const isReversed = index % 2 === 1;
            return (
              <motion.article
                key={prod.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className={`grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-16 rounded-xl border border-[#E2E7EC] ${prod.containerBg} p-8 lg:p-12 shadow-xs`}
              >
                {/* Copy Column (~45%) */}
                <div
                  className={`lg:col-span-5 ${
                    isReversed ? "lg:order-2" : "lg:order-1"
                  }`}
                >
                  <span className={`text-[0.68rem] font-bold uppercase tracking-[0.14em] ${prod.categoryColor}`}>
                    {prod.category}
                  </span>
                  <h3 className="mt-2 font-serif text-2xl font-semibold tracking-[-0.02em] text-[#101828] sm:text-3xl">
                    {prod.name}
                  </h3>
                  <p className="mt-3 text-base leading-relaxed text-[#475467]">
                    {prod.tagline}
                  </p>

                  <ul className="mt-5 space-y-2 text-xs text-[#101828]">
                    {prod.capabilities.map((cap) => (
                      <li key={cap} className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#B63838]" />
                        <span>{cap}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-8">
                    <Link
                      href={prod.linkHref}
                      className="group inline-flex items-center gap-2 text-sm font-semibold text-[#B63838] hover:text-[#8F292D]"
                    >
                      <span>Explore {prod.name}</span>
                      <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </Link>
                  </div>
                </div>

                {/* Neutral Screenshot Container (~55%) */}
                <div
                  className={`lg:col-span-7 ${
                    isReversed ? "lg:order-1" : "lg:order-2"
                  }`}
                >
                  <div className="overflow-hidden rounded-xl border border-[#E2E7EC] bg-[#FFFFFF] p-2.5 shadow-[0_18px_55px_rgba(20,30,45,0.08)]">
                    <div className="flex items-center justify-between border-b border-[#E2E7EC]/80 bg-[#F4F6F8] px-3 py-1.5 -mx-2.5 -mt-2.5 mb-2.5">
                      <div className="flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-[#E2E7EC]" />
                        <span className="h-2 w-2 rounded-full bg-[#E2E7EC]" />
                        <span className="h-2 w-2 rounded-full bg-[#E2E7EC]" />
                      </div>
                      <span className="text-[0.62rem] font-mono tracking-wider text-[#475467]">
                        {prod.name.toLowerCase().replace(/\s+/g, "-")}.consultamerica.internal
                      </span>
                      <div className="w-6" />
                    </div>
                    <div className="relative aspect-[16/10] overflow-hidden rounded-md bg-[#FFFFFF]">
                      <Image
                        src={prod.image}
                        alt={prod.imageAlt}
                        fill
                        className="object-cover object-top"
                        sizes="(max-width: 1024px) 100vw, 55vw"
                      />
                    </div>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>

        {/* More from Consult America Labs: capability-led entries without fabricated screenshots */}
        <div className="mt-20 border-t border-[#E2E7EC] pt-14">
          <p className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#475467]">
            More From Consult America Labs
          </p>

          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
            {capabilityProducts.map((prod, idx) => (
              <motion.div
                key={prod.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.06 }}
                className="flex flex-col rounded-xl border border-[#E2E7EC] bg-[#FFFFFF] p-6 lg:p-7 shadow-xs"
              >
                <span className={`text-[0.65rem] font-bold uppercase tracking-[0.14em] ${prod.categoryColor}`}>
                  {prod.category}
                </span>
                <h3 className="mt-2 font-serif text-xl font-semibold tracking-[-0.02em] text-[#101828]">
                  {prod.name}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-[#475467]">
                  {prod.tagline}
                </p>

                {prod.isWorkflow ? (
                  <div className="mt-5 flex flex-wrap items-center gap-x-2 gap-y-2">
                    {prod.capabilities.map((step, stepIdx) => (
                      <div key={step} className="flex items-center gap-2">
                        <span className="rounded border border-[#E2E7EC] bg-[#F7F8FA] px-2 py-1 text-[0.62rem] font-bold tracking-wider text-[#101828]">
                          {step}
                        </span>
                        {stepIdx < prod.capabilities.length - 1 && (
                          <ArrowUpRight className="h-3 w-3 rotate-45 text-[#E2E7EC]" />
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <ul className="mt-5 space-y-2 text-xs text-[#101828]">
                    {prod.capabilities.map((cap) => (
                      <li key={cap} className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#B63838]" />
                        <span>{cap}</span>
                      </li>
                    ))}
                  </ul>
                )}

                <div className="mt-6 pt-2">
                  <Link
                    href={prod.linkHref}
                    className="group inline-flex items-center gap-2 text-sm font-semibold text-[#B63838] hover:text-[#8F292D]"
                  >
                    <span>Learn more</span>
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
