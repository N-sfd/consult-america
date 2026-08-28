"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

const industries = [
  {
    number: "01",
    title: "Government & Public Sector",
    href: "/industries/government-public-sector",
    image:
      "https://images.unsplash.com/photo-1555848962-6e79363ec58f?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Legislative chamber interior",
  },
  {
    number: "02",
    title: "Financial Services",
    href: "/industries/financial-services",
    image:
      "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1000&q=80",
    imageAlt: "Financial operations and market data environment",
  },
  {
    number: "03",
    title: "Healthcare",
    href: "/industries/healthcare",
    image:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1000&q=80",
    imageAlt: "Clinical technology and healthcare systems",
  },
  {
    number: "04",
    title: "Technology",
    href: "/industries/technology",
    image:
      "https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?auto=format&fit=crop&w=1000&q=80",
    imageAlt: "Engineering and data technology environment",
  },
];

export default function Industries() {
  return (
    <section
      id="industries"
      className="mkt-section bg-[var(--mkt-warm)] text-[var(--mkt-navy)]"
    >
      <div className="mkt-shell">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-4">
            <span className="mkt-eyebrow text-[var(--mkt-muted)]">
              INDUSTRIES
            </span>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-8"
          >
            <h2 className="mkt-section-heading text-[var(--mkt-navy)]">
              Transformation looks different in every industry.
            </h2>
          </motion.div>
        </div>

        {/* Single grid: 1-col mobile, 2x2 tablet, 3+2 / 2+3 mosaic at xl+
            (5-unit column grid so a 3/2 span pair fills each row exactly). */}
        <div className="mt-10 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-5">
          {industries.map((industry, index) => (
            <IndustryTile
              key={industry.title}
              industry={industry}
              tall={index < 2}
              spanClassName={
                index === 0 || index === 3 ? "xl:col-span-3" : "xl:col-span-2"
              }
            />
          ))}
        </div>

        <div className="mt-8 flex justify-end">
          <Link href="/industries" className="ca-link">
            Explore All Industries
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function IndustryTile({
  industry,
  tall = false,
  spanClassName,
}: {
  industry: (typeof industries)[number];
  tall?: boolean;
  spanClassName?: string;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.45 }}
      className={spanClassName}
    >
      <Link
        href={industry.href}
        className={`group relative block overflow-hidden ${
          tall
            ? "aspect-[4/3] xl:aspect-auto xl:min-h-[420px]"
            : "aspect-[4/3] xl:aspect-auto xl:min-h-[280px]"
        }`}
      >
        <Image
          src={industry.image}
          alt={industry.imageAlt}
          fill
          loading="lazy"
          className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--mkt-navy)]/90 via-[var(--mkt-navy)]/30 to-[var(--mkt-navy)]/5" />

        <div className="absolute inset-0 flex flex-col justify-end p-5 md:p-6">
          <span className="mkt-eyebrow text-white/45">{industry.number}</span>
          <h3 className="mt-2 mkt-h3 text-white">{industry.title}</h3>
          <ArrowUpRight className="mt-3 h-5 w-5 text-white transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-1" />
        </div>
      </Link>
    </motion.article>
  );
}
