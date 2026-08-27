"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { Grid, Shell } from "@/components/layout/grid";
import { selectedProjects } from "@/lib/site-data";

export default function ClientImpact() {
  return (
    <section
      id="impact"
      className="border-t border-white/10 bg-[#05070d] py-20 lg:py-24"
    >
      <Shell>
        <Grid>
          <div className="col-span-12 lg:col-span-8">
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-[#93c5fd]">
              Client Impact & Case Studies
            </p>
            <h2 className="ca-h2 mt-3">Proof from programs that landed.</h2>
          </div>
        </Grid>

        <Grid className="mt-10">
          <div className="col-span-12 grid gap-4 lg:col-span-12 lg:grid-cols-3">
            {selectedProjects.slice(0, 3).map((project) => (
              <article key={project.client} className="ca-card p-5 sm:p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#93c5fd]">
                  {project.client}
                </p>
                <h3 className="mt-2 text-lg font-semibold leading-snug">
                  {project.title}
                </h3>
                <p className="ca-body mt-2 max-w-2xl">{project.body}</p>
                <Link href={project.href} className="ca-link mt-4 text-sm">
                  View project
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </article>
            ))}
          </div>
        </Grid>
      </Shell>
    </section>
  );
}
