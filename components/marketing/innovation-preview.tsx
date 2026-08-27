import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import ProductCard from "@/components/innovation/ProductCard";
import SectionLabel from "@/components/marketing/SectionLabel";
import { listInnovationProducts } from "@/data/innovation-products";

export default function InnovationPreview() {
  const products = listInnovationProducts();
  const [featured, ...rest] = products;

  if (!featured) return null;

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

        <div className="mt-8 space-y-6 md:hidden">
          {products.map((product, index) => (
            <ProductCard key={product.slug} product={product} index={index} />
          ))}
        </div>

        <div className="mt-8 hidden md:block lg:hidden">
          <ProductCard product={featured} index={0} />
          <div className="mt-6 grid grid-cols-2 gap-6">
            {rest.map((product, index) => (
              <ProductCard
                key={product.slug}
                product={product}
                index={index + 1}
              />
            ))}
          </div>
        </div>

        <div className="mt-8 hidden gap-6 lg:grid lg:grid-cols-3">
          {products.map((product, index) => (
            <ProductCard key={product.slug} product={product} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
