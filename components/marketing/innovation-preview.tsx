import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import EditorialHeading from "@/components/marketing/EditorialHeading";
import SectionLabel from "@/components/marketing/SectionLabel";
import ProductCard from "@/components/innovation/ProductCard";
import { listInnovationProducts } from "@/data/innovation-products";

export default function InnovationPreview() {
  const products = listInnovationProducts();

  return (
    <section className="mkt-section bg-[var(--mkt-ice-soft)]">
      <div className="mkt-shell">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <SectionLabel tone="blue">Innovation</SectionLabel>
            <EditorialHeading className="mt-5 max-w-2xl text-[var(--mkt-navy)]">
              We don&apos;t just advise. We build.
            </EditorialHeading>
            <p className="mkt-body mt-5 max-w-xl">
              Explore AI platforms and digital products developed to turn
              emerging technologies into working business experiences.
            </p>
          </div>
          <Link href="/work/innovation" className="ca-link shrink-0">
            View all products
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {products.map((product, index) => (
            <ProductCard key={product.slug} product={product} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
