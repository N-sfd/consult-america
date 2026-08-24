import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { insights } from "@/lib/site-data";

export default function InsightsPreview() {
  return (
    <section className="border-t border-white/10 bg-black px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
      <div className="mx-auto max-w-[94.5em]">
        <h2 className="text-sm tracking-[0.16em] uppercase text-white/55">
          Insights
        </h2>
        <div className="mt-10 divide-y divide-white/10 border-y border-white/10">
          {insights.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="grid gap-3 py-8 transition-opacity hover:opacity-70 md:grid-cols-12 md:items-center"
            >
              <p className="text-sm text-white/45 md:col-span-3">{item.date}</p>
              <p className="text-xl md:col-span-7 lg:text-2xl">{item.title}</p>
              <span className="inline-flex items-center gap-2 text-sm md:col-span-2 md:justify-end">
                Read more
                <ArrowUpRight className="h-4 w-4" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
