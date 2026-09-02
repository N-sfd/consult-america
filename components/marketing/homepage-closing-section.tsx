"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

const principles = [
  "Business context first",
  "Technology depth",
  "Production discipline",
  "Product mindset",
];

const industries = [
  { name: "Government & Public Sector", href: "/industries/government-public-sector" },
  { name: "Financial Services", href: "/industries/financial-services" },
  { name: "Healthcare & Life Sciences", href: "/industries/healthcare" },
  { name: "Technology & Software", href: "/industries/technology" },
];

const featuredInsight = {
  title: "Operationalizing Enterprise AI: From Experimentation to Production",
  href: "/insights/ai-without-a-data-contract",
};

const supportingInsights = [
  { title: "What Oracle Cloud Modernization Requires Beyond Technology", href: "/insights/what-stalls-fusion-programs" },
  { title: "Building Trustworthy Document Intelligence with Source Verification", href: "/insights/cutover-checklists-that-work" },
];

export default function HomepageClosingSection() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <>
      <section className="border-b border-[#E1ECE8] bg-white py-10 sm:py-12">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-8 xl:px-10">
          <p className="text-[0.75rem] font-bold uppercase tracking-[0.14em] text-[#176A63]">
            Why Consult America
          </p>
          <h2 className="mt-2 font-serif text-[clamp(1.5rem,2.5vw,2rem)] font-semibold text-[#073B3A]">
            Built for execution, not just advice.
          </h2>
          <ul className="mt-5 flex flex-wrap gap-x-8 gap-y-2">
            {principles.map((item) => (
              <li key={item} className="text-sm text-[#5B6D6B]">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="industries" className="border-b border-[#E1ECE8] bg-[#F7FAF9] py-10 sm:py-12">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-8 xl:px-10">
          <p className="text-[0.75rem] font-bold uppercase tracking-[0.14em] text-[#176A63]">Industries</p>
          <h2 className="mt-2 font-serif text-[clamp(1.5rem,2.5vw,2rem)] font-semibold text-[#073B3A]">
            Industry practices.
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#5B6D6B]">
            Domain knowledge for complex, regulated, and technology-intensive operations.
          </p>
          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {industries.map((ind) => (
              <Link
                key={ind.name}
                href={ind.href}
                className="rounded-[10px] border border-[#DDE6E3] bg-white px-4 py-3 text-sm font-medium text-[#073B3A] transition-colors hover:border-[#176A63] hover:text-[#176A63]"
              >
                {ind.name}
              </Link>
            ))}
          </div>
          <Link
            href="/industries"
            className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-[#176A63] hover:text-[#073B3A]"
          >
            View all industries
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <section className="border-b border-[#E1ECE8] bg-white py-12 sm:py-14">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-8 xl:px-10">
          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl"
          >
            <p className="text-[0.75rem] font-bold uppercase tracking-[0.14em] text-[#176A63]">Insights</p>
            <h2 className="mt-2 font-serif text-[clamp(1.5rem,2.5vw,2rem)] font-semibold text-[#073B3A]">
              Ideas for modern enterprise technology.
            </h2>
            <Link
              href={featuredInsight.href}
              className="mt-5 block rounded-[12px] border border-[#DDE6E3] bg-[#F8FAF9] p-5 transition-colors hover:border-[#176A63]"
            >
              <p className="font-medium text-[#073B3A]">{featuredInsight.title}</p>
              <span className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-[#176A63]">
                Read article
                <ArrowUpRight className="h-3.5 w-3.5" />
              </span>
            </Link>
            <ul className="mt-4 space-y-2">
              {supportingInsights.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sm text-[#5B6D6B] hover:text-[#176A63]">
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              href="/insights"
              className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-[#176A63] hover:text-[#073B3A]"
            >
              Browse all insights
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
}
