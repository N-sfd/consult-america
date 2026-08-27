"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

import type { InnovationProduct } from "@/data/innovation-products";

export default function ProductCard({
  product,
  index = 0,
}: {
  product: InnovationProduct;
  index?: number;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.06 }}
    >
      <Link
        href={`/work/innovation/${product.slug}`}
        className="group block overflow-hidden rounded-2xl border border-[var(--mkt-border)] bg-white transition-colors hover:border-[var(--mkt-blue)]/40"
      >
        <div className="relative aspect-[4/3] overflow-hidden border-b border-[var(--mkt-border)]">
          <Image
            src={product.heroImage}
            alt={product.heroImageAlt}
            fill
            className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between gap-3">
            <p className="mkt-eyebrow text-[var(--mkt-blue)]">
              {product.category}
            </p>
            <span className="rounded-full bg-[var(--mkt-ice)] px-2.5 py-1 text-[0.65rem] font-medium uppercase tracking-[0.08em] text-[var(--mkt-muted)]">
              ConsultAmerica Innovation · {product.innovationType}
            </span>
          </div>
          <h3 className="mt-3 text-xl font-medium tracking-[-0.03em] text-[var(--mkt-navy)]">
            {product.name}
          </h3>
          <p className="mt-2 text-sm leading-6 text-[var(--mkt-muted)]">
            {product.tagline}
          </p>
          <span className="ca-link mt-5 w-fit text-sm">
            Explore
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>
      </Link>
    </motion.article>
  );
}
