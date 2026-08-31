"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

import SectionLabel from "@/components/marketing/SectionLabel";

const labProducts = [
  {
    name: "DATA AGENT",
    tagline: "Document & Contract Intelligence",
    description:
      "Universal field and clause extraction across contracts and regulatory filings, linking every piece of data directly back to the source page.",
    linkHref: "/work/innovation/data-agent",
    image: "/innovation/data-agent-platform.png",
    imageAlt: "Data Agent contract intelligence extraction workspace",
  },
  {
    name: "MEDIGUIDE AI",
    tagline: "Clinical Intelligence & Patient Assistant",
    description:
      "Evidence-grounded medical document interpretation, lab timelines, and visit preparation workspaces designed with strict privacy boundaries.",
    linkHref: "/work/innovation/mediguide-ai",
    image: "/innovation/mediguide-hero.png",
    imageAlt: "MediGuide AI health document understanding interface",
  },
  {
    name: "CONVERA",
    tagline: "API Management & Integration Core",
    description:
      "Enterprise connector framework that standardizes data pipelines, manages auth tokens, and connects legacy systems to cloud-native platforms.",
    linkHref: "/capabilities/digital-engineering",
    image: "/innovation/data-agent-hero.png",
    imageAlt: "Convera API connectivity and pipeline management framework",
  },
  {
    name: "HR & TALENT PLATFORM",
    tagline: "Recruiting & Candidate Intelligence",
    description:
      "ATS candidate pipeline management, structured interview scorecards, and automated employee onboarding conversion.",
    linkHref: "/platforms/ats",
    image: "/innovation/joblens-hero.png",
    imageAlt: "Talent intelligence and candidate matching dashboard",
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
              className="text-3xl font-bold tracking-[-0.03em] sm:text-4xl lg:text-5xl"
            >
              We don&apos;t only advise. We build.
            </motion.h2>
            <p className="mt-3 max-w-xl text-base text-[#695F57] sm:text-lg">
              Consult America Labs turns operational problems into focused enterprise products.
            </p>
          </div>

          <Link
            href="/work/innovation"
            className="group inline-flex items-center gap-1.5 text-sm font-bold text-[#7D2639] hover:text-[#681F30]"
          >
            <span>Explore All Products</span>
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        {/* Alternating Large Product Modules */}
        <div className="mt-16 space-y-16 lg:space-y-24">
          {labProducts.map((prod, index) => {
            const isReversed = index % 2 === 1;
            return (
              <motion.article
                key={prod.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-14 border-t border-[#D7CCBD] pt-12"
              >
                {/* Copy Column */}
                <div
                  className={`lg:col-span-5 ${
                    isReversed ? "lg:order-2" : "lg:order-1"
                  }`}
                >
                  <span className="text-xs font-bold uppercase tracking-[0.14em] text-[#7D2639]">
                    {prod.tagline}
                  </span>
                  <h3 className="mt-2 text-2xl font-bold tracking-[-0.02em] text-[#261F1B] sm:text-3xl">
                    {prod.name}
                  </h3>
                  <p className="mt-4 text-base leading-relaxed text-[#695F57]">
                    {prod.description}
                  </p>
                  <div className="mt-6">
                    <Link
                      href={prod.linkHref}
                      className="group inline-flex items-center gap-1.5 text-sm font-bold text-[#7D2639] hover:text-[#681F30]"
                    >
                      <span>Explore {prod.name}</span>
                      <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </Link>
                  </div>
                </div>

                {/* Screenshot Column */}
                <div
                  className={`lg:col-span-7 ${
                    isReversed ? "lg:order-1" : "lg:order-2"
                  }`}
                >
                  <div className="overflow-hidden rounded-2xl border border-[#D7CCBD] bg-[#FFFDF8] p-2.5 shadow-[0_16px_40px_rgba(38,31,27,0.06)]">
                    <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-[#F4EFE6]">
                      <Image
                        src={prod.image}
                        alt={prod.imageAlt}
                        fill
                        className="object-cover object-top transition-transform duration-700 hover:scale-[1.02]"
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
