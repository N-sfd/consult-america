import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import ProductCard from "@/components/innovation/ProductCard";
import SectionLabel from "@/components/marketing/SectionLabel";
import { listInnovationProducts } from "@/data/innovation-products";

export default function InnovationPreview() {
  const products = listInnovationProducts();

  if (products.length === 0) return null;

  return (
    <section className="mkt-section-compact bg-gradient-to-b from-[var(--mkt-ice-soft)] to-[var(--mkt-cloud)]">
      <div className="mkt-shell">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <SectionLabel tone="blue">ConsultAmerica Innovation</SectionLabel>
            <h2 className="mkt-section-heading mt-4 max-w-2xl text-[var(--mkt-navy)]">
              We don&apos;t just advise. We build.
            </h2>
          </div>
          <Link href="/work/innovation" className="ca-link shrink-0 text-sm">
            View all products
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product, index) => (
            <div
              key={product.slug}
              className={index === 0 ? "md:col-span-2 lg:col-span-1" : undefined}
            >
              <ProductCard product={product} index={index} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
