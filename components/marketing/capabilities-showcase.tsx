"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import Atmosphere from "@/components/layout/atmosphere";
import { Grid, Shell } from "@/components/layout/grid";
import { capabilityGroups } from "@/lib/site-data";

export default function CapabilitiesShowcase() {
  return (
    <section
      id="capabilities"
      className="relative overflow-hidden bg-[#05070d] py-20 lg:py-24"
    >
      <Atmosphere variant="section" />
      <Shell className="relative z-10">
        <Grid>
          <div className="col-span-12 lg:col-span-8">
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-[#93c5fd]">
              Core Capabilities & Services
            </p>
            <h2 className="ca-h2 mt-3">
              What we deliver, from roadmap to production.
            </h2>
          </div>
        </Grid>

        <Grid className="mt-12">
          {capabilityGroups.map((group) => (
            <article
              key={group.title}
              className="ca-card col-span-12 p-6 md:col-span-6 xl:col-span-4 lg:p-7"
            >
              <h3 className="ca-h3">{group.title}</h3>
              <p className="ca-body mt-3 max-w-md">{group.description}</p>
              <ul className="mt-5 space-y-2">
                {group.services.map((service) => (
                  <li key={service.label} className="flex gap-2 text-sm text-white/70">
                    <span className="mt-[0.45em] h-1.5 w-1.5 shrink-0 rounded-full bg-[#3b82f6]" />
                    <Link href={service.href} className="hover:text-white">
                      {service.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <Link href={group.href} className="ca-link mt-6 text-sm">
                Explore services
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </article>
          ))}
        </Grid>
      </Shell>
    </section>
  );
}
