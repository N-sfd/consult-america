import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { PageHero } from "@/components/marketing/inner-page";
import PageSection from "@/components/marketing/inner-page/page-section";
import Reveal from "@/components/marketing/inner-page/reveal";
import { listCaseStudies } from "@/data/case-studies";
import { listInnovationProducts } from "@/data/innovation-products";
import { stockImage } from "@/lib/marketing/stock-images";

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
      <PageHero
        variant="default"
        layout="editorial-wide"
        imageShape="offset"
        photoScale="editorial"
        eyebrow="Featured Work"
        title={
          <>
            Solving complex challenges.
            <br />
            Creating lasting value.
          </>
        }
        description="Selected examples of strategy, platforms, data, and engineering in delivery."
        image={stockImage("selectedWorkHero", { w: 1100, q: 82 })}
        imageAlt="Consult America client delivery"
        primaryCta={{ label: "View case studies", href: "/work/case-studies" }}
        secondaryCta={{ label: "Explore applications", href: "/work/innovation", variant: "secondary" }}
      />

      <PageSection tone="soft" eyebrow="Work" title="Case studies and innovation.">
        <div className="grid gap-8 lg:grid-cols-2">
          <Reveal>
            <Link
              href="/work/case-studies"
              className="ca-feature-card ca-feature-card--hover group block overflow-hidden rounded-2xl border border-[#C9DDD7] bg-white"
            >
              <div className="ca-editorial-row-image relative aspect-[16/10] overflow-hidden">
                <Image
                  src={caseStudies[0].image}
                  alt=""
                  fill
                  className="mkt-img-hoverable object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
              <div className="p-8">
                <p className="mkt-eyebrow text-[#176A63]">Client Work</p>
                <h2 className="mt-3 text-2xl font-bold tracking-[-0.03em] text-[#122D2E] group-hover:text-[#B83A3A]">
                  Case Studies
                </h2>
                <p className="mt-3 text-sm leading-6 text-[#5B6D6B]">
                  Enterprise transformation, Oracle, and AI engagements delivered
                  from strategy through production.
                </p>
                <span className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-[#B83A3A]">
                  View case studies <ArrowUpRight className="h-4 w-4" />
                </span>
              </div>
            </Link>
          </Reveal>

          <Reveal delay={0.1}>
            <Link
              href="/work/innovation"
              className="ca-feature-card ca-feature-card--hover group block overflow-hidden rounded-2xl border border-[#C9DDD7] bg-white"
            >
              <div className="ca-editorial-row-image relative aspect-[16/10] overflow-hidden">
                <Image
                  src={products[0].heroImage}
                  alt=""
                  fill
                  className="mkt-img-hoverable object-cover object-top"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
              <div className="p-8">
                <p className="mkt-eyebrow text-[#176A63]">Innovation Lab</p>
                <h2 className="mt-3 text-2xl font-bold tracking-[-0.03em] text-[#122D2E] group-hover:text-[#B83A3A]">
                  Innovation &amp; Products
                </h2>
                <p className="mt-3 text-sm leading-6 text-[#5B6D6B]">
                  AI platforms and digital products we&apos;ve built — working
                  technology, not just consulting claims.
                </p>
                <span className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-[#B83A3A]">
                  Explore innovation <ArrowUpRight className="h-4 w-4" />
                </span>
              </div>
            </Link>
          </Reveal>
        </div>
      </PageSection>
    </>
  );
}
