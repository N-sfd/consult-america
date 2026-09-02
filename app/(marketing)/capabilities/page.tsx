import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import ContactCTA from "@/components/detail-pages/ContactCTA";
import { PageHero } from "@/components/marketing/inner-page";
import PageSection from "@/components/marketing/inner-page/page-section";
import Reveal from "@/components/marketing/inner-page/reveal";
import FeatureCard from "@/components/marketing/inner-page/feature-card";
import { capabilityPages } from "@/lib/marketing/capability-pages";
import { stockImage } from "@/lib/marketing/stock-images";

export const metadata: Metadata = {
  title: "Capabilities | Consult America",
  description:
    "Strategy, Oracle, AI and data, digital engineering, and managed delivery — together.",
};

const editorialRows = [
  {
    eyebrow: "Transformation",
    title: capabilityPages["enterprise-transformation"].title,
    description: capabilityPages["enterprise-transformation"].description,
    href: "/capabilities/enterprise-transformation",
    image: stockImage("capabilitiesTransform", { w: 1200, q: 80 }),
  },
  {
    eyebrow: "CRM",
    title: "CRM & Customer Experience",
    description:
      "Connect sales, service, and customer data across the enterprise with platforms teams actually adopt.",
    href: "/platforms/crm",
    image: stockImage("crmShowcase", { w: 1200, q: 80 }),
  },
  {
    eyebrow: "Cloud & Integration",
    title: capabilityPages["digital-engineering"].title,
    description: capabilityPages["digital-engineering"].description,
    href: "/capabilities/digital-engineering",
    image: stockImage("capabilitiesBuild", { w: 1200, q: 80 }),
  },
  {
    eyebrow: "Managed Delivery",
    title: capabilityPages["managed-delivery"].title,
    description: capabilityPages["managed-delivery"].description,
    href: "/capabilities/managed-delivery",
    image: stockImage("capabilitiesOperate", { w: 1200, q: 80 }),
  },
];

export default function CapabilitiesPage() {
  return (
    <>
      <PageHero
        variant="solutions"
        layout="split-left"
        imageShape="wide"
        eyebrow="Solutions"
        title="Move strategy into execution."
        description="Connect enterprise platforms, workflows, data and engineering around measurable operational outcomes."
        image={stockImage("capabilityPageEnterpriseTransformation", { w: 1400, q: 80 })}
        imageAlt="Enterprise transformation team collaborating"
        primaryCta={{ label: "Explore capabilities", href: "/capabilities/enterprise-transformation" }}
        secondaryCta={{ label: "Talk to an expert", href: "/contact", variant: "secondary" }}
      />

      <PageSection tone="soft" eyebrow="Solutions" title="Strategic capabilities, editorial depth.">
        <div className="space-y-0">
          {editorialRows.map((row, index) => (
            <Reveal key={row.href} delay={index * 0.06}>
              <Link
                href={row.href}
                className="ca-editorial-row group grid items-center gap-8 border-b border-[#E1ECE8] py-10 first:border-t lg:grid-cols-12 lg:gap-12 lg:py-12"
              >
                <div className={index % 2 === 1 ? "lg:col-span-5 lg:col-start-8" : "lg:col-span-5"}>
                  <p className="mkt-eyebrow text-[#176A63]">{row.eyebrow}</p>
                  <h2 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-[#122D2E] group-hover:text-[#B83A3A] md:text-3xl">
                    {row.title}
                  </h2>
                  <p className="mt-3 max-w-md text-base leading-relaxed text-[#5B6D6B]">
                    {row.description}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-[#B83A3A]">
                    Learn more <ArrowUpRight className="h-4 w-4" />
                  </span>
                </div>
                <div
                  className={
                    index % 2 === 1
                      ? "lg:col-span-6 lg:col-start-1 lg:row-start-1"
                      : "lg:col-span-6"
                  }
                >
                  <div className="ca-editorial-row-image ca-hero-img-frame relative aspect-[16/10] max-h-[420px]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={row.image}
                      alt=""
                      className="mkt-img-graded mkt-img-hoverable h-full w-full object-cover"
                    />
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </PageSection>

      <ContactCTA />
    </>
  );
}
