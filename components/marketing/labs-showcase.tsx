"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

import SectionLabel from "@/components/marketing/SectionLabel";

const labProducts = [
  {
    category: "DOCUMENT & CONTRACT INTELLIGENCE",
    name: "DATA AGENT",
    tagline: "Turn complex documents into structured enterprise data.",
    capabilities: [
      "Dynamic field and table extraction",
      "Source verification on every extracted cell",
      "FAR / DFARS compliance clause scanning",
      "Human-in-the-loop review queue",
    ],
    linkHref: "/work/innovation/data-agent",
    image: "/innovation/data-agent-platform.png",
    imageAlt: "Data Agent contract intelligence platform interface",
  },
  {
    category: "CLINICAL INTELLIGENCE",
    name: "MEDIGUIDE AI",
    tagline: "Evidence-supported patient information assistant and lab timeline.",
    capabilities: [
      "Evidence citations on every answer",
      "Lab result timeline analysis",
      "Visit preparation workspace",
      "Privacy-first, local execution boundaries",
    ],
    linkHref: "/work/innovation/mediguide-ai",
    image: "/innovation/mediguide-hero.png",
    imageAlt: "MediGuide AI clinical intelligence assistant interface",
  },
  {
    category: "INTEGRATION & CONNECTIVITY",
    name: "CONVERA",
    tagline: "Enterprise connector framework for API management and data pipelines.",
    capabilities: [
      "Standardized data transformations",
      "Managed token authentication",
      "Legacy-to-cloud bridge adapters",
      "Real-time pipeline monitoring",
    ],
    linkHref: "/capabilities/digital-engineering",
    image: "/innovation/data-agent-hero.png",
    imageAlt: "Convera API connectivity and integration interface",
  },
  {
    category: "TALENT & WORKFORCE INTELLIGENCE",
    name: "HR & TALENT PLATFORM",
    tagline: "Applicant tracking, candidate matching, and automated hire conversion.",
    capabilities: [
      "ATS candidate pipeline tracking",
      "Structured interview scorecards",
      "Automated employee onboarding records",
      "SOC2-compliant document vault",
    ],
    linkHref: "/platforms/ats",
    image: "/innovation/joblens-hero.png",
    imageAlt: "Talent intelligence and candidate matching interface",
  },
];

export default function LabsShowcase() {
  return (
    <section id="labs" className="mkt-section bg-[#FFFAF2] text-[#261F1B]">
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
            <p className="mt-3 max-w-xl text-base text-[#695F57] sm:text-lg">
              Consult America Labs turns operational problems into focused enterprise products.
            </p>
          </div>

          <Link
            href="/work/innovation"
            className="group inline-flex items-center gap-1.5 text-sm font-semibold text-[#7D2639] hover:text-[#681F30]"
          >
            <span>Explore All Products</span>
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        {/* Alternating Large Product Stories */}
        <div className="mt-20 space-y-24 lg:space-y-32">
          {labProducts.map((prod, index) => {
            const isReversed = index % 2 === 1;
            return (
              <motion.article
                key={prod.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-16 border-t border-[#D7CCBD] pt-16"
              >
                {/* Copy Column (~45%) */}
                <div
                  className={`lg:col-span-5 ${
                    isReversed ? "lg:order-2" : "lg:order-1"
                  }`}
                >
                  <span className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#7D2639]">
                    {prod.category}
                  </span>
                  <h3 className="mt-2 font-serif text-2xl font-semibold tracking-[-0.02em] text-[#261F1B] sm:text-3xl">
                    {prod.name}
                  </h3>
                  <p className="mt-3 text-base leading-relaxed text-[#695F57]">
                    {prod.tagline}
                  </p>

                  <ul className="mt-5 space-y-2 text-xs text-[#261F1B]">
                    {prod.capabilities.map((cap) => (
                      <li key={cap} className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#7D2639]" />
                        <span>{cap}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-8">
                    <Link
                      href={prod.linkHref}
                      className="group inline-flex items-center gap-2 text-sm font-semibold text-[#7D2639] hover:text-[#681F30]"
                    >
                      <span>Explore {prod.name}</span>
                      <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </Link>
                  </div>
                </div>

                {/* Screenshot Column (~55%) */}
                <div
                  className={`lg:col-span-7 ${
                    isReversed ? "lg:order-1" : "lg:order-2"
                  }`}
                >
                  <div className="overflow-hidden rounded-lg border border-[#D7CCBD] bg-[#FFFDF8] p-2.5 shadow-[0_16px_40px_rgba(38,31,27,0.06)]">
                    <div className="relative aspect-[16/10] overflow-hidden rounded-sm bg-[#F4EFE6]">
                      <Image
                        src={prod.image}
                        alt={prod.imageAlt}
                        fill
                        className="object-cover object-top mkt-img-graded"
                        sizes="(max-width: 1024px) 100vw, 55vw"
                      />
                    </div>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
