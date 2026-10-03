"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { stockImage } from "@/lib/marketing/stock-images";

const industries = [
  {
    name: "Public Sector",
    href: "/industries/government-public-sector",
    image: stockImage("industriesGovernment", { w: 900, q: 80 }),
  },
  {
    name: "Healthcare & Life Sciences",
    href: "/industries/healthcare",
    image: stockImage("healthcareClinical", { w: 900, q: 80 }),
  },
  {
    name: "Financial Services",
    href: "/industries/financial-services",
    image: "/company/source/finance-workplace.jpg",
  },
  {
    name: "Technology & Software",
    href: "/industries/technology",
    image: stockImage("technologyEngineering", { w: 900, q: 80 }),
  },
];

export default function HomepageClosingSection() {
  return (
    <section id="industries" className="border-b border-[var(--ca-line)] bg-[var(--ca-canvas)] py-12 sm:py-14">
      <div className="mkt-shell">
        <div className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
          <div>
            <p className="text-[0.75rem] font-bold uppercase tracking-[0.14em] text-[var(--ca-teal)]">
              Industries
            </p>
            <h2 className="mt-2 font-serif text-[clamp(1.75rem,3vw,2.5rem)] font-semibold tracking-[-0.03em] text-[var(--ca-ink)]">
              Where the experience applies.
            </h2>
          </div>
          <Link
            href="/industries"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--ca-teal)] hover:text-[var(--ca-ink)]"
          >
            All industries
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {industries.map((industry) => (
            <li key={industry.name}>
              <Link href={industry.href} className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ca-lime)]">
                <div className="relative aspect-[4/3] overflow-hidden rounded-md ring-1 ring-[var(--ca-line)]">
                  <Image
                    src={industry.image}
                    alt=""
                    fill
                    unoptimized={industry.image.endsWith(".jpg")}
                    className="ca-home-photo object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                    sizes="(max-width: 640px) 100vw, 25vw"
                  />
                </div>
                <p className="mt-3 text-sm font-semibold text-[var(--ca-ink)] group-hover:text-[var(--ca-teal)]">
                  {industry.name}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
