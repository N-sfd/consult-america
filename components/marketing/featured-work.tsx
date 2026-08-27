"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

import SectionLabel from "@/components/marketing/SectionLabel";

const flagship = {
  number: "01",
  category: "Oracle",
  title: "Oracle Cloud Transformation",
  description:
    "Modernizing finance and procurement for complex multi-entity operations.",
  href: "/projects/oracle-cloud-transformation",
  image:
    "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1600&q=80",
};

const supportingProjects = [
  {
    number: "02",
    category: "AI + Data",
    title: "AI Document Intelligence",
    description:
      "Turning complex contracts into structured, searchable enterprise intelligence.",
    href: "/projects/ai-document-intelligence",
    image:
      "https://images.unsplash.com/photo-1568992687947-868a62a9f521?auto=format&fit=crop&w=1000&q=80",
  },
  {
    number: "03",
    category: "Public Sector",
    title: "Public Sector Data Platform",
    description:
      "Shared analytics with role-based access, controls, and audit trails.",
    href: "/projects/public-sector-finance-procurement",
    image:
      "https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1000&q=80",
  },
];

export default function FeaturedWork() {
  return (
    <section id="work" className="mkt-section bg-[var(--mkt-white)]">
      <div className="mkt-shell">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <SectionLabel tone="dark">Selected Work</SectionLabel>
            <h2 className="mkt-section-heading mt-4 text-[var(--mkt-navy)]">
              Outcomes you can see.
            </h2>
          </div>
          <Link href="/projects" className="ca-link">
            View all projects
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-10">
          <motion.article
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Link
              href={flagship.href}
              className="group grid overflow-hidden border border-[var(--mkt-border)] lg:grid-cols-12"
            >
              <div className="flex flex-col justify-between p-6 md:p-10 lg:col-span-5">
                <div>
                  <p className="mkt-eyebrow text-[var(--mkt-blue)]">
                    {flagship.number} / {flagship.category}
                  </p>
                  <h3 className="mt-4 text-3xl font-medium tracking-[-0.03em] text-[var(--mkt-navy)] md:text-4xl">
                    {flagship.title}
                  </h3>
                  <p className="mt-4 max-w-xl text-base leading-7 text-[var(--mkt-muted)]">
                    {flagship.description}
                  </p>
                </div>
                <span className="ca-link mt-8 w-fit">
                  Explore the work
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </div>
              <div className="relative aspect-[4/3] lg:col-span-7 lg:aspect-[16/9]">
                <Image
                  src={flagship.image}
                  alt=""
                  fill
                  loading="lazy"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  sizes="(max-width: 1024px) 100vw, 55vw"
                />
              </div>
            </Link>
          </motion.article>

          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            {supportingProjects.map((project, index) => (
              <motion.article
                key={project.number}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.06 + index * 0.04 }}
              >
                <Link
                  href={project.href}
                  className="group block overflow-hidden border border-[var(--mkt-border)]"
                >
                  <div className="relative aspect-[4/3] lg:aspect-[16/9]">
                    <Image
                      src={project.image}
                      alt=""
                      fill
                      loading="lazy"
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                  </div>
                  <div className="p-6">
                    <p className="mkt-eyebrow text-[var(--mkt-blue)]">
                      {project.number} / {project.category}
                    </p>
                    <h3 className="mt-3 text-xl font-medium tracking-[-0.03em] text-[var(--mkt-navy)]">
                      {project.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-[var(--mkt-muted)]">
                      {project.description}
                    </p>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
