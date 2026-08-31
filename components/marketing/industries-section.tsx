"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

import SectionLabel from "@/components/marketing/SectionLabel";

const industries = [
  {
    name: "Government & Public Sector",
    href: "/industries/government-public-sector",
    tagline: "Statutory compliance, appropriations controls, and mission delivery.",
    image:
      "https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Financial Services",
    href: "/industries/financial-services",
    tagline: "Regulated platform modernization, risk controls, and automated reporting.",
    image:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Healthcare & Life Sciences",
    href: "/industries/healthcare",
    tagline: "Patient intelligence, HIPAA-compliant AI, and clinical workflows.",
    image:
      "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Technology & Software",
    href: "/industries/technology",
    tagline: "Cloud infrastructure, scalable APIs, and modern digital engineering.",
    image:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80",
  },
];

export default function IndustriesSection() {
  return (
    <section id="industries" className="mkt-section bg-[#F4EFE6] text-[#261F1B]">
      <div className="mkt-shell">
        <SectionLabel tone="burgundy">Industry Practices</SectionLabel>

        <div className="mt-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="text-3xl font-bold tracking-[-0.03em] sm:text-4xl lg:text-5xl"
          >
            Built for specialized operating environments.
          </motion.h2>
          <p className="max-w-md text-sm text-[#695F57] sm:text-base">
            Deep domain expertise across regulated sectors where compliance,
            security, and reliability are non-negotiable.
          </p>
        </div>

        {/* 4 Large Industry Modules */}
        <div className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:gap-10">
          {industries.map((ind, idx) => (
            <motion.div
              key={ind.name}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: idx * 0.08 }}
            >
              <Link
                href={ind.href}
                className="group relative block overflow-hidden rounded-2xl border border-[#D7CCBD] bg-[#FFFDF8] shadow-[0_12px_36px_rgba(38,31,27,0.06)] transition-all hover:border-[#7D2639]/50 hover:shadow-xl"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={ind.image}
                    alt={ind.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#261F1B]/85 via-[#261F1B]/30 to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6 text-white">
                    <h3 className="text-xl font-bold text-[#FFFDF8] sm:text-2xl group-hover:text-[#D8C5AA] transition-colors">
                      {ind.name}
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-[#DFE4DA] sm:text-sm">
                      {ind.tagline}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-white group-hover:text-[#D8C5AA] transition-colors">
                      <span>Explore Industry Practice</span>
                      <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
