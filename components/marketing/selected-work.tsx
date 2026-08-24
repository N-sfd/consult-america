"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

import { selectedProjects } from "@/lib/site-data";

export default function SelectedWork() {
  return (
    <section className="border-t border-white/10 bg-black px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
      <div className="mx-auto max-w-[94.5em]">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-sm tracking-[0.16em] uppercase text-white/55">
            Select Projects
          </h2>
          <Link href="/projects" className="ca-link text-sm">
            View all
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-12 grid gap-px bg-white/10 lg:grid-cols-2">
          {selectedProjects.map((project, index) => (
            <motion.article
              key={project.client}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: index * 0.05 }}
              className="bg-black p-8 lg:p-12"
            >
              <div className="mb-8 aspect-[16/10] bg-white/[0.04]" />
              <p className="text-sm text-white/50">{project.client}</p>
              <h3 className="mt-3 text-2xl lg:text-3xl">{project.title}</h3>
              <p className="ca-body mt-4 max-w-xl">{project.body}</p>
              <Link href={project.href} className="ca-link mt-6 text-sm">
                View Project
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
