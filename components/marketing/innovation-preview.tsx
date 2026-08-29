import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import ProductCard from "@/components/innovation/ProductCard";
import SectionLabel from "@/components/marketing/SectionLabel";
import { listInnovationProducts } from "@/data/innovation-products";

export default function InnovationPreview() {
  const products = listInnovationProducts();
  if (products.length === 0) return null;

  const featured = products.find((p) => p.slug === "data-agent") ?? products[0];
  const others = products.filter((p) => p.slug !== featured.slug);

  return (
    <section className="mkt-section-compact bg-gradient-to-b from-[var(--mkt-ice-soft)] to-[var(--mkt-cloud)]">
      <div className="mkt-shell">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <SectionLabel tone="blue">ConsultAmerica Innovation</SectionLabel>
            <h2 className="mkt-section-heading mt-3 max-w-2xl text-[var(--mkt-navy)]">
              We don&apos;t just advise. We build.
            </h2>
          </div>
          <Link href="/work/innovation" className="ca-link shrink-0 text-sm">
            View all products
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Screenshot-driven grid with Data Agent as featured */}
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Featured Product: Data Agent */}
          <div className="md:col-span-2 lg:col-span-1">
            <ProductCard product={featured} index={0} featured />
          </div>

          {/* Supporting Prototypes/Platforms */}
          {others.map((product, index) => (
            <div key={product.slug} className="col-span-1">
              <ProductCard product={product} index={index + 1} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
