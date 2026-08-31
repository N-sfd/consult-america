"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

import SectionLabel from "@/components/marketing/SectionLabel";

const industries = [
  {
    number: "01",
    title: "Government & Public Sector",
    href: "/industries/government-public-sector",
    image:
      "https://images.unsplash.com/photo-1555848962-6e79363ec58f?auto=format&fit=crop&w=1400&q=80",
    imageAlt: "Government and public sector administration center",
    gridClass: "lg:col-span-7 lg:row-span-2 min-h-[280px] sm:min-h-[320px] lg:min-h-[440px]",
  },
  {
    number: "02",
    title: "Financial Services",
    href: "/industries/financial-services",
    image:
      "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1000&q=80",
    imageAlt: "Financial services and market operations",
    gridClass: "lg:col-span-5 min-h-[220px] sm:min-h-[240px] lg:min-h-[210px]",
  },
  {
    number: "03",
    title: "Healthcare",
    href: "/industries/healthcare",
    image:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1000&q=80",
    imageAlt: "Clinical technology and healthcare operations",
    gridClass: "lg:col-span-5 min-h-[220px] sm:min-h-[240px] lg:min-h-[210px]",
  },
  {
    number: "04",
    title: "Technology",
    href: "/industries/technology",
    image:
      "https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?auto=format&fit=crop&w=1400&q=80",
    imageAlt: "Engineering and technology platform infrastructure",
    gridClass: "lg:col-span-12 min-h-[220px] sm:min-h-[260px] lg:min-h-[260px]",
  },
];

export default function Industries() {
  return (
    <section
      id="industries"
      className="mkt-section bg-[#F4EFE6] text-[#261F1B]"
    >
      <div className="mkt-shell">
        <div className="grid gap-6 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-4">
            <SectionLabel tone="burgundy">INDUSTRIES</SectionLabel>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.55 }}
            className="lg:col-span-8"
          >
            <h2 className="mkt-section-heading text-[#261F1B]">
              Transformation looks different in every industry.
            </h2>
          </motion.div>
        </div>

        {/* Asymmetric Editorial Mosaic */}
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-12 lg:gap-4">
          {industries.map((industry, index) => (
            <motion.article
              key={industry.title}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.45, delay: index * 0.05 }}
              className={industry.gridClass}
            >
              <Link
                href={industry.href}
                className="group relative block h-full w-full overflow-hidden rounded-xl border border-[#D7CCBD]"
              >
                <Image
                  src={industry.image}
                  alt={industry.imageAlt}
                  fill
                  loading="lazy"
                  className="object-cover transition-transform duration-600 group-hover:scale-[1.025]"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 60vw"
                />
                {/* Warm charcoal gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#261F1B]/85 via-[#261F1B]/25 to-transparent" />

                <div className="absolute inset-0 flex flex-col justify-end p-4.5 sm:p-5">
                  <span className="mkt-eyebrow text-[#D8C5AA]">
                    {industry.number}
                  </span>
                  <div className="mt-1 flex items-end justify-between gap-3">
                    <h3 className="text-lg font-medium tracking-[-0.02em] text-[#F7F0E7] sm:text-xl group-hover:text-white">
                      {industry.title}
                    </h3>
                    <ArrowUpRight className="h-4.5 w-4.5 shrink-0 text-[#D8C5AA] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-white" />
                  </div>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>

        <div className="mt-6 flex justify-end">
          <Link href="/industries" className="ca-link text-sm font-semibold text-[#7D2639] hover:text-[#681F30]">
            Explore All Industries
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
