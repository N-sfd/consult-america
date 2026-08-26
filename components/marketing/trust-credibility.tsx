"use client";

import Image from "next/image";
import { motion } from "framer-motion";

import { Grid, Shell } from "@/components/layout/grid";
import { trustMarks } from "@/lib/site-data";

const TRUST_IMAGE =
  "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=1600&q=75";

const deliveryStats = [
  { value: "17", suffix: "+", label: "Years", tag: "Strategy" },
  { value: "E2E", suffix: "", label: "Delivery", tag: "Technology" },
  { value: "5", suffix: "", label: "Practices", tag: "Execution" },
];

export default function TrustCredibility() {
  return (
    <section
      id="trust"
      className="border-y border-white/10 bg-[#05070d] py-16 lg:py-20"
    >
      <Shell>
        <Grid>
          <div className="col-span-12 lg:col-span-4">
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-[#93c5fd]">
              Trusted Delivery
            </p>
          </div>
          <div className="col-span-12 lg:col-span-8">
            <h2 className="ca-h2 max-w-3xl">
              Enterprise transformation requires more than technology.
            </h2>
            <p className="ca-body mt-4 max-w-2xl">
              ConsultAmerica combines enterprise experience, technology depth,
              and execution-focused delivery—so initiatives move from plan to
              production.
            </p>
          </div>
        </Grid>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7 }}
          className="relative mt-12 aspect-[16/8] w-full overflow-hidden rounded-lg border border-white/10 lg:aspect-[21/8]"
        >
          <Image
            src={TRUST_IMAGE}
            alt=""
            fill
            sizes="(min-width: 1024px) 1200px, 100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#05070d]/60 via-transparent to-transparent" />
        </motion.div>

        <div className="mt-4 grid grid-cols-3 gap-px overflow-hidden rounded-lg border border-white/10 bg-white/10">
          {deliveryStats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: index * 0.06 }}
              className="bg-[#05070d] p-5 lg:p-7"
            >
              <p className="text-3xl font-semibold tracking-tight text-white lg:text-4xl">
                {stat.value}
                <span className="text-[0.55em] text-[#3b82f6]">
                  {stat.suffix}
                </span>
              </p>
              <p className="mt-1 text-xs text-white/45">{stat.label}</p>
              <p className="mt-4 border-t border-white/10 pt-3 text-[0.7rem] font-medium uppercase tracking-[0.12em] text-white/55">
                {stat.tag}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="mt-14">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-white/40">
            Platforms & sectors we deliver in
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-x-10 gap-y-4 border-t border-white/10 pt-6">
            {trustMarks.map((mark) => (
              <span
                key={mark}
                className="text-lg font-medium tracking-[-0.02em] text-white/35 grayscale transition-colors duration-200 hover:text-white/70"
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
