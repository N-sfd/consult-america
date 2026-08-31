"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

import type { InnovationProduct } from "@/data/innovation-products";
import { stockImage } from "@/lib/marketing/stock-images";

const FALLBACK_IMAGES: Record<string, string> = {
  "data-agent": stockImage("productCard1", { w: 1200, q: 80 }),
  "mediguide-ai": stockImage("productCard2", { w: 1200, q: 80 }),
  joblens: stockImage("productCard3", { w: 1200, q: 80 }),
};

export default function ProductCard({
  product,
  index = 0,
  featured = false,
}: {
  product: InnovationProduct;
  index?: number;
  featured?: boolean;
}) {
  const [imageSrc, setImageSrc] = useState(product.heroImage);

  return (
    <motion.article
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: index * 0.05 }}
      className="h-full"
    >
      <Link
        href={`/work/innovation/${product.slug}`}
        className={`group flex h-full flex-col justify-between overflow-hidden rounded-xl border bg-white transition-all duration-300 hover:shadow-[0_12px_32px_rgba(16,42,67,0.06)] ${
          featured
            ? "border-[var(--mkt-blue)]/40 hover:border-[var(--mkt-blue)]"
            : "border-[var(--mkt-border)] hover:border-[var(--mkt-blue)]/40"
        }`}
      >
        <div className="relative aspect-[16/10] overflow-hidden bg-[var(--mkt-ice)]">
          <Image
            src={imageSrc}
            alt={product.heroImageAlt}
            fill
            className="object-cover object-top transition-transform duration-600 group-hover:scale-[1.025]"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onError={() =>
              setImageSrc(
                FALLBACK_IMAGES[product.slug] ?? FALLBACK_IMAGES["data-agent"],
              )
            }
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--mkt-navy)]/80 via-[var(--mkt-navy)]/15 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
            <span className="inline-flex rounded-full bg-white/20 px-2.5 py-0.5 text-[0.65rem] font-medium uppercase tracking-[0.1em] text-white backdrop-blur-md">
              {product.innovationType}
            </span>
            <h3 className="mt-2 text-lg font-medium tracking-[-0.02em] text-white sm:text-xl">
              {product.name}
            </h3>
            <p className="mt-0.5 text-xs text-white/80">{product.tagline}</p>
          </div>
        </div>

        <div className="flex items-center justify-between px-5 py-3.5 border-t border-[var(--mkt-border)]">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.1em] text-[var(--mkt-dim)]">
            {product.category}
          </p>
          <span className="ca-link text-xs font-semibold sm:text-sm">
            Explore Product
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>
      </Link>
    </motion.article>
  );
}
