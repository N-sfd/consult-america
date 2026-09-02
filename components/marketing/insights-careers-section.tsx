"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

import { stockImage } from "@/lib/marketing/stock-images";

const featuredInsight = {
  category: "AI & Data",
  title: "Operationalizing Enterprise AI: Moving from Experimentation to Production Delivery",
  href: "/insights/ai-without-a-data-contract",
  image: stockImage("insightsHero", { w: 1200, q: 85 }),
};

const supportingInsights = [
  {
    title: "What Oracle Cloud Modernization Requires Beyond Technology",
    href: "/insights/what-stalls-fusion-programs",
  },
  {
    title: "Building Trustworthy Document Intelligence with Source Verification",
    href: "/insights/cutover-checklists-that-work",
  },
];

export default function InsightsCareersSection() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="border-b border-[#E1ECE8] bg-[#F7FAF9] py-14 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-8 xl:px-10">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-14">
          {/* Insights */}
          <div className="lg:col-span-7">
            <p className="text-[0.72rem] font-bold uppercase tracking-[0.14em] text-[#176A63]">Insights</p>
            <h2 className="mt-3 font-serif text-[clamp(1.75rem,3vw,2.5rem)] font-semibold tracking-[-0.03em] text-[#073B3A]">
              Ideas for modern enterprise technology.
            </h2>

            <motion.article
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-8 overflow-hidden rounded-[14px] border border-[#DDE6E3] bg-white"
            >
              <div className="relative h-[280px] max-h-[380px] w-full sm:h-[340px]">
                <Image
                  src={featuredInsight.image}
                  alt={featuredInsight.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 45vw"
                />
              </div>
              <div className="p-6">
                <p className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#176A63]">
                  {featuredInsight.category}
                </p>
                <h3 className="mt-2 font-serif text-xl font-semibold text-[#073B3A]">{featuredInsight.title}</h3>
                <Link
                  href={featuredInsight.href}
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[#176A63] hover:text-[#073B3A]"
                >
                  Read article
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </motion.article>

            <ul className="mt-6 space-y-3">
              {supportingInsights.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm font-medium text-[#073B3A] hover:text-[#176A63]"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Careers */}
          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.06 }}
            className="lg:col-span-5"
          >
            <p className="text-[0.72rem] font-bold uppercase tracking-[0.14em] text-[#176A63]">Careers</p>
            <h2 className="mt-3 font-serif text-[clamp(1.75rem,3vw,2.25rem)] font-semibold tracking-[-0.03em] text-[#073B3A]">
              Senior work, real programs.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-[#5B6D6B]">
              Join practitioners who stay attached to Oracle transformations, AI and data engineering,
              and the applications they ship from architecture through cutover.
            </p>

            <div className="relative mt-8 h-[280px] max-h-[420px] overflow-hidden rounded-[14px] border border-[#DDE6E3]">
              <Image
                src={stockImage("careersHero", { w: 1200, q: 85 })}
                alt="Consult America senior practitioners collaborating"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
            </div>

            <Link
              href="/careers"
              className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-[8px] bg-[#B83A3A] px-6 text-sm font-semibold text-white hover:bg-[#992F31]"
            >
              Explore Careers
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
