"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

import type { InnovationProduct } from "@/data/innovation-products";

const FALLBACK_IMAGES: Record<string, string> = {
  "data-agent":
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
  "mediguide-ai":
    "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80",
  joblens:
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
};

export default function ProductCard({
  product,
  index = 0,
}: {
  product: InnovationProduct;
  index?: number;
}) {
  const [imageSrc, setImageSrc] = useState(product.heroImage);

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
        <div className="relative aspect-[16/10] overflow-hidden">
          <Image
            src={imageSrc}
            alt={product.heroImageAlt}
            fill
            className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onError={() =>
              setImageSrc(
                FALLBACK_IMAGES[product.slug] ?? FALLBACK_IMAGES["data-agent"],
              )
            }
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--mkt-navy)]/80 via-[var(--mkt-navy)]/10 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-5">
            <span className="rounded-full bg-white/15 px-2.5 py-1 text-[0.65rem] font-medium uppercase tracking-[0.08em] text-white backdrop-blur-sm">
              Innovation · {product.innovationType}
            </span>
            <h3 className="mt-3 text-xl font-medium tracking-[-0.03em] text-white">
              {product.name}
            </h3>
            <p className="mt-1 text-sm text-white/75">{product.tagline}</p>
          </div>
        </div>
        <div className="flex items-center justify-between px-5 py-4">
          <p className="text-xs uppercase tracking-[0.1em] text-[var(--mkt-muted)]">
            {product.category}
          </p>
          <span className="ca-link text-sm">
            Explore
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>
      </Link>
    </motion.article>
  );
}
