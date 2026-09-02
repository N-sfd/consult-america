"use client";

import Link from "next/link";

import { platformStripLinks } from "@/lib/site-data";

export default function PlatformStrip() {
  return (
    <section className="border-b border-[#E1ECE8] bg-white py-5 sm:py-6" aria-label="Core practices">
      <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-center gap-x-6 gap-y-3 px-6 lg:gap-x-10 lg:px-8 xl:px-10">
        {platformStripLinks.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            className="text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-[#5B6D6B] transition-colors hover:text-[#073B3A] sm:text-xs"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </section>
  );
}
