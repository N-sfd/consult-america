import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import EditorialHeading from "@/components/marketing/EditorialHeading";
import SectionLabel from "@/components/marketing/SectionLabel";
import { listCaseStudies } from "@/data/case-studies";
import { listInnovationProducts } from "@/data/innovation-products";

export const metadata: Metadata = {
  title: "Work | ConsultAmerica",
  description:
    "Client case studies and Innovation Lab products from ConsultAmerica.",
};

export default function WorkPage() {
  const caseStudies = listCaseStudies();
  const products = listInnovationProducts();

  return (
    <>
      <section className="mkt-section bg-[var(--mkt-cloud)] text-[var(--mkt-navy)]">
        <div className="mkt-shell">
          <SectionLabel tone="blue">Work</SectionLabel>
          <EditorialHeading
            as="h1"
            size="hero"
            className="mt-7 max-w-2xl text-[var(--mkt-navy)]"
          >
            Outcomes you can see. Technology we've built.
          </EditorialHeading>
          <p className="mkt-body-lg mt-7 max-w-lg">
            Two kinds of proof: client engagements delivered end to end, and
            products our Innovation Lab has built and shipped.
          </p>
        </div>
      </section>

      <section className="mkt-section bg-white">
        <div className="mkt-shell">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-10">
            <Link
              href="/work/case-studies"
              className="group block overflow-hidden rounded-2xl border border-[var(--mkt-border)] transition-colors hover:border-[var(--mkt-blue)]/40"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={caseStudies[0].image}
                  alt=""
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
              <div className="p-8">
                <p className="mkt-eyebrow text-[var(--mkt-blue)]">
                  Client Work
                </p>
                <h2 className="mt-3 text-2xl font-medium tracking-[-0.03em] text-[var(--mkt-navy)]">
                  Case Studies
                </h2>
                <p className="mt-3 max-w-md text-sm leading-6 text-[var(--mkt-muted)]">
                  Enterprise transformation, Oracle, and AI &amp; data
                  engagements delivered for clients — from strategy through
                  production.
                </p>
                <span className="ca-link mt-6 w-fit text-sm">
                  View case studies
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </div>
            </Link>

            <Link
              href="/work/innovation"
              className="group block overflow-hidden rounded-2xl border border-[var(--mkt-border)] transition-colors hover:border-[var(--mkt-blue)]/40"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={products[0].heroImage}
                  alt=""
                  fill
                  className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
              <div className="p-8">
                <p className="mkt-eyebrow text-[var(--mkt-blue)]">
                  Innovation Lab
                </p>
                <h2 className="mt-3 text-2xl font-medium tracking-[-0.03em] text-[var(--mkt-navy)]">
                  Innovation &amp; Products
                </h2>
                <p className="mt-3 max-w-md text-sm leading-6 text-[var(--mkt-muted)]">
                  AI platforms and digital products we've built ourselves —
                  working technology, not just consulting claims.
                </p>
                <span className="ca-link mt-6 w-fit text-sm">
                  Explore innovation
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
