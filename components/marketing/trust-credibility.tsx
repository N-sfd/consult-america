"use client";

import { motion } from "framer-motion";

import { Grid, Shell } from "@/components/layout/grid";
import { glanceStats, testimonials, trustMarks } from "@/lib/site-data";

export default function TrustCredibility() {
  const featured = testimonials[0];

  return (
    <section
      id="trust"
      className="border-y border-white/10 bg-[#05070d] py-16 lg:py-20"
    >
      <Shell>
        <Grid>
          <div className="col-span-12 lg:col-span-4">
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-[#93c5fd]">
              Trust & Credibility
            </p>
          </div>
          <div className="col-span-12 lg:col-span-8">
            <h2 className="ca-h2 max-w-3xl">
              Trusted to deliver complex enterprise transformation.
            </h2>
            <p className="ca-body mt-4 max-w-2xl">
              ConsultAmerica combines enterprise experience, technology depth,
              and execution-focused delivery—so initiatives move from plan to
              production.
            </p>
          </div>
        </Grid>

        <Grid className="mt-12 items-stretch">
          <div className="col-span-12 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-white/10 bg-white/10 lg:col-span-7 sm:grid-cols-4">
            {glanceStats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: index * 0.05 }}
                className="bg-[#05070d] p-5 lg:p-6"
              >
                <p className="text-3xl font-semibold tracking-tight text-white lg:text-4xl">
                  {stat.value}
                  <span className="text-[0.55em] text-[#3b82f6]">
                    {stat.suffix}
                  </span>
                </p>
                <p className="mt-2 max-w-[11rem] text-xs leading-5 text-white/55">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>

          <blockquote className="col-span-12 flex flex-col justify-between rounded-lg border border-white/10 bg-white/[0.04] p-6 lg:col-span-5 lg:p-8">
            <p className="text-lg font-medium leading-[1.5] text-white lg:text-xl">
              “{featured.quote}”
            </p>
            <footer className="mt-8 border-t border-white/10 pt-5 text-sm text-white/55">
              <p className="font-semibold text-white/85">{featured.name}</p>
              <p>{featured.org}</p>
            </footer>
          </blockquote>
        </Grid>

        <div className="mt-10">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-white/45">
            Delivery across
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {trustMarks.map((mark) => (
              <span
                key={mark}
                className="rounded-md border border-white/12 bg-white/5 px-3 py-1.5 text-sm text-white/75"
              >
                {mark}
              </span>
            ))}
          </div>
        </div>
      </Shell>
    </section>
  );
}
