"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useState } from "react";

import PlatformLineSystem from "@/components/marketing/platform-line-system";
import SectionBackdrop from "@/components/marketing/section-backdrop";
import { cn } from "@/lib/utils";

type ProductKey = "data-agent" | "mediguide" | "joblens" | "data-explorer" | "hr-talent";

const products: {
  key: ProductKey;
  name: string;
  tag: string;
  description: string;
  capabilities: string[];
  href: string;
  image?: string;
  diagram?: boolean;
  exploreLabel?: string;
}[] = [
  {
    key: "data-agent",
    name: "Data Agent",
    tag: "FLAGSHIP",
    description: "Contract and document intelligence for extraction, verification, and cross-document analysis.",
    capabilities: ["Extract", "Verify", "Compare", "Explore"],
    href: "/work/innovation/data-agent",
    image: "/innovation/data-agent-hero.png",
  },
  {
    key: "mediguide",
    name: "MediGuide",
    tag: "STRATEGIC",
    description: "Healthcare AI assistant for structured intake, patient-friendly explanations, and responsible boundaries.",
    capabilities: ["Intake", "Explain", "Summarize", "Guide"],
    href: "/work/innovation/mediguide-ai",
    image: "/innovation/mediguide-hero.png",
  },
  {
    key: "joblens",
    name: "JobLens",
    tag: "STRATEGIC",
    description: "Talent intelligence for resume analysis, ATS feedback, job matching, and application tracking.",
    capabilities: ["Analyze", "Match", "Draft", "Track"],
    href: "/work/innovation/joblens",
    image: "/innovation/joblens-hero.png",
  },
  {
    key: "data-explorer",
    name: "Data Explorer",
    tag: "STRATEGIC",
    description: "Repository intelligence for searching, filtering, and comparing documents across the enterprise.",
    capabilities: ["Search", "Filter", "Aggregate", "Export"],
    href: "/ai-data",
    image: "/innovation/data-agent-platform.png",
  },
  {
    key: "hr-talent",
    name: "HR & Talent",
    tag: "STRATEGIC",
    description: "Connected workforce applications for recruiting, self-service, timesheets, and payroll integration.",
    capabilities: ["Recruit", "Onboard", "Manage", "Report"],
    href: "/work/innovation",
    diagram: true,
    exploreLabel: "Explore Applications",
  },
];

function ProductDiagram() {
  return (
    <div className="flex h-full min-h-[280px] flex-col items-center justify-center rounded-lg bg-[#F7FAF9] p-8">
      <div className="grid w-full max-w-sm grid-cols-2 gap-3">
        {["Recruiting", "Candidates", "Timesheets", "Payroll"].map((item) => (
          <div
            key={item}
            className="rounded-[14px] border border-[#DDE6E3] bg-white px-4 py-5 text-center shadow-sm"
          >
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.12em] text-[#176A63]">{item}</p>
          </div>
        ))}
      </div>
      <p className="mt-6 text-xs font-semibold uppercase tracking-[0.14em] text-[#5B6D6B]">
        Workforce Suite
      </p>
    </div>
  );
}

export default function ApplicationPlatform() {
  const [active, setActive] = useState<ProductKey>("data-agent");
  const shouldReduceMotion = useReducedMotion();
  const product = products.find((p) => p.key === active)!;

  return (
    <section
      id="application-platform"
      className="relative overflow-hidden border-b border-[#DDE6E3] bg-white py-24 sm:py-28 lg:py-32 xl:py-36"
    >
      <SectionBackdrop variant="applications" />
      <PlatformLineSystem className="opacity-[0.06]" />

      <div className="relative z-10 mx-auto max-w-[1440px] px-6 lg:px-8 xl:px-10">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#176A63]" />
            <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#176A63]">
              APPLICATION ENGINEERING
            </span>
          </div>
          <h2 className="mt-5 font-serif text-3xl font-semibold tracking-[-0.03em] text-[#073B3A] sm:text-4xl lg:text-5xl lg:leading-[1.08]">
            Applications engineered around the work.
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-[#5B6D6B] sm:text-lg">
            We build focused products where packaged software stops — from document intelligence to
            workforce platforms.
          </p>
        </div>

        {/* Mobile tabs */}
        <div className="mt-10 flex gap-2 overflow-x-auto pb-2 lg:hidden">
          {products.map((p) => (
            <button
              key={p.key}
              type="button"
              onClick={() => setActive(p.key)}
              className={cn(
                "shrink-0 rounded-full border px-4 py-2 text-xs font-semibold transition-all duration-300",
                active === p.key
                  ? "border-[#176A63] bg-[#176A63] text-white"
                  : "border-[#DDE6E3] bg-white text-[#073B3A]",
              )}
            >
              {p.name}
            </button>
          ))}
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 lg:mt-16 lg:grid-cols-12 lg:gap-10 xl:gap-12">
          {/* Left: product list */}
          <div className="order-3 flex flex-col gap-2 lg:order-1 lg:col-span-3">
            {products.map((p) => (
              <button
                key={p.key}
                type="button"
                onClick={() => setActive(p.key)}
                className={cn(
                  "ca-side-panel hidden text-left transition-all duration-[400ms] lg:flex lg:flex-col",
                  active === p.key
                    ? "border-[#176A63] bg-white shadow-[0_16px_40px_rgba(7,59,58,0.08)]"
                    : "border-[#DDE6E3] bg-[#F7FAF9] hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(7,59,58,0.08)]",
                )}
              >
                <span className="text-[0.62rem] font-bold uppercase tracking-[0.14em] text-[#176A63]">
                  {p.tag}
                </span>
                <span className="mt-1 text-sm font-semibold text-[#073B3A]">{p.name}</span>
              </button>
            ))}
          </div>

          {/* Center: screenshot */}
          <div className="order-1 lg:order-2 lg:col-span-6">
            <div className="ca-product-frame overflow-hidden rounded-[16px] border border-[rgba(7,59,58,0.12)] bg-white p-2 shadow-[0_28px_70px_rgba(7,59,58,0.12)] sm:p-2.5">
              <AnimatePresence mode="wait">
                <motion.div
                  key={product.key}
                  initial={shouldReduceMotion ? {} : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={shouldReduceMotion ? {} : { opacity: 0, y: 8 }}
                  transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
                >
                  {product.diagram ? (
                    <ProductDiagram />
                  ) : (
                    <div className="relative aspect-[16/10] w-full overflow-hidden rounded-md">
                      <Image
                        src={product.image!}
                        alt={`${product.name} product interface`}
                        fill
                        className="object-cover object-top"
                        sizes="(max-width: 1024px) 100vw, 50vw"
                      />
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Right: capabilities */}
          <motion.div
            key={product.key}
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="order-2 lg:order-3 lg:col-span-3"
          >
            <div className="ca-side-panel flex h-full flex-col border-[#DDE6E3] bg-[#F7FAF9]">
              <span className="text-[0.62rem] font-bold uppercase tracking-[0.14em] text-[#176A63]">
                {product.tag}
              </span>
              <h3 className="mt-2 font-serif text-2xl font-semibold text-[#073B3A]">{product.name}</h3>
              <p className="mt-3 text-sm leading-relaxed text-[#5B6D6B]">{product.description}</p>
              <ul className="mt-6 space-y-2">
                {product.capabilities.map((cap) => (
                  <li
                    key={cap}
                    className="text-xs font-bold uppercase tracking-[0.12em] text-[#073B3A]"
                  >
                    {cap}
                  </li>
                ))}
              </ul>
              <div className="mt-auto pt-8">
                <Link
                  href={product.href}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-[#176A63] transition-colors hover:text-[#073B3A]"
                >
                  Explore {product.exploreLabel ?? product.name}
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
