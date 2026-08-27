import type { Metadata } from "next";

import EditorialHeading from "@/components/marketing/EditorialHeading";
import SectionLabel from "@/components/marketing/SectionLabel";
import ProductCard from "@/components/innovation/ProductCard";
import { listInnovationProducts } from "@/data/innovation-products";

export const metadata: Metadata = {
  title: "Innovation & Products | ConsultAmerica",
  description:
    "AI platforms and digital products built by ConsultAmerica's Innovation Lab — working technology, not just consulting claims.",
};

export default function InnovationPage() {
  const products = listInnovationProducts();

  return (
    <>
      <section className="mkt-section bg-[var(--mkt-cloud)] text-[var(--mkt-navy)]">
        <div className="mkt-shell">
          <SectionLabel tone="blue">Innovation &amp; Products</SectionLabel>
          <EditorialHeading
            as="h1"
            size="hero"
            className="mt-7 max-w-2xl text-[var(--mkt-navy)]"
          >
            We don&apos;t just advise. We build.
          </EditorialHeading>
          <p className="mkt-body-lg mt-7 max-w-lg">
            AI platforms and digital products developed to turn emerging
            technologies into working business experiences — built by
            ConsultAmerica&apos;s Innovation Lab, not slideware.
          </p>
        </div>
      </section>

      <section className="mkt-section bg-white">
        <div className="mkt-shell">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 lg:gap-10">
            {products.map((product, index) => (
              <ProductCard key={product.slug} product={product} index={index} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
