import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { Grid, Shell } from "@/components/layout/grid";
import { insights } from "@/lib/site-data";

export default function InsightsPreview() {
  return (
    <section
      id="insights"
      className="border-t border-white/10 bg-[#05070d] py-20 lg:py-24"
    >
      <Shell>
        <Grid className="items-end">
          <div className="col-span-12 lg:col-span-8">
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-[#93c5fd]">
              Insights
            </p>
            <h2 className="ca-h2 mt-3">
              Notes from Oracle, AI, and transformation delivery.
            </h2>
          </div>
          <div className="col-span-12 lg:col-span-4 lg:text-right">
            <Link href="/insights" className="ca-link text-sm">
              View all insights
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </Grid>

        <div className="mt-10 divide-y divide-white/10 border-y border-white/10">
          {insights.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="grid gap-3 py-7 transition-opacity hover:opacity-70 md:grid-cols-12 md:items-center"
            >
              <p className="text-sm text-white/45 md:col-span-3">{item.date}</p>
              <p className="text-lg font-medium md:col-span-7 lg:text-xl">
                {item.title}
              </p>
              <span className="inline-flex items-center gap-2 text-sm text-[#93c5fd] md:col-span-2 md:justify-end">
                Read more
                <ArrowUpRight className="h-4 w-4" />
              </span>
            </Link>
          ))}
        </div>
      </Shell>
    </section>
  );
}
