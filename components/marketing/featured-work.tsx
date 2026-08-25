"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

import { Grid, Shell } from "@/components/layout/grid";
import { selectedProjects } from "@/lib/site-data";

export default function FeaturedWork() {
  return (
    <section
      id="work"
      className="border-t border-white/10 bg-[#05070d] py-20 lg:py-24"
    >
      <Shell>
        <Grid className="items-end">
          <div className="col-span-12 lg:col-span-8">
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-[#93c5fd]">
              Featured Work
            </p>
            <h2 className="ca-h2 mt-3">Programs that reached production.</h2>
          </div>
          <div className="col-span-12 lg:col-span-4 lg:text-right">
            <Link href="/projects" className="ca-link text-sm">
              View all projects
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </Grid>

        <Grid className="mt-12">
          {selectedProjects.map((project, index) => (
            <motion.article
              key={project.client}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: index * 0.05 }}
              className="ca-card group col-span-12 overflow-hidden p-0 md:col-span-6"
            >
              <div className="relative aspect-[16/10] overflow-hidden border-b border-white/10 bg-[#0a0a0a]">
                <div
                  className="absolute inset-0 opacity-20 transition-transform duration-500 group-hover:scale-[1.03]"
                  style={{
                    backgroundImage:
                      "linear-gradient(to right, rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.5) 1px, transparent 1px)",
                    backgroundSize: "32px 32px",
                  }}
                />
                <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full border border-white/15" />
                <div className="absolute bottom-6 left-6 h-px w-1/2 bg-white/20" />
                <div className="absolute right-8 top-1/2 h-24 w-24 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.28),transparent_70%)]" />
              </div>
              <div className="p-6 lg:p-7">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#93c5fd]">
                  {project.client}
                </p>
                <h3 className="mt-2 text-xl font-semibold leading-snug">
                  {project.title}
                </h3>
                <p className="ca-body mt-3 max-w-xl">{project.body}</p>
                <Link href={project.href} className="ca-link mt-5 text-sm">
                  View project
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </motion.article>
          ))}
        </Grid>
      </Shell>
    </section>
  );
}
