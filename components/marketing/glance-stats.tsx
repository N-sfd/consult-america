"use client";

import { motion } from "framer-motion";

import Atmosphere from "@/components/layout/atmosphere";
import { glanceStats } from "@/lib/site-data";

export default function GlanceStats() {
  return (
    <section className="ca-grad-dark relative overflow-hidden ca-gutter py-20 lg:py-28">
      <Atmosphere variant="section" />
      <div className="relative z-10 mx-auto max-w-[94.5em]">
        <p className="text-sm tracking-[0.16em] uppercase text-white/55">
          ConsultAmerica at a Glance
        </p>
        <h2 className="ca-h2 mt-6 max-w-3xl text-white">
          Mission of delivering impactful work for partners.
        </h2>

        <div className="mt-16 grid gap-12 sm:grid-cols-2 xl:grid-cols-4">
          {glanceStats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.6, delay: index * 0.08 }}
            >
              <p className="font-serif text-[clamp(3.5rem,8vw,7rem)] leading-none tracking-[-0.05em] tabular-nums text-white">
                {stat.value}
                <span className="text-[0.45em] text-[#9BC4B8]">{stat.suffix}</span>
              </p>
              <p className="mt-4 max-w-[14rem] text-sm text-white/55">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
