import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { PageHero } from "@/components/marketing/inner-page";
import PageSection from "@/components/marketing/inner-page/page-section";
import FeatureCard from "@/components/marketing/inner-page/feature-card";
import Reveal from "@/components/marketing/inner-page/reveal";
import { deliveryPhases, capabilityGroups, offices } from "@/lib/site-data";
import { stockImage } from "@/lib/marketing/stock-images";

export const metadata: Metadata = {
  title: "Company & Leadership | ConsultAmerica",
  description:
    "ConsultAmerica connects business strategy, Oracle transformation, AI intelligence, and application engineering from early architecture through production delivery.",
};

const leadershipPrinciples = [
  {
    num: "01",
    title: "Senior Practitioners Attached to Delivery",
    desc: "We do not sell with senior partners and deliver with junior substitutes. Experienced practitioners stay directly attached to code, configurations, and cutover decisions.",
  },
  {
    num: "02",
    title: "Accountability Measured by Production",
    desc: "Transformation is not complete when slide decks are delivered. We measure success by what reaches production, passes compliance scrutiny, and operates cleanly.",
  },
  {
    num: "03",
    title: "Consulting + Product Engineering",
    desc: "Alongside client delivery, Consult America Labs engineers focused enterprise software (Data Agent, MediGuide AI, Convera) to solve recurring operational gaps.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        variant="company"
        layout="split-left"
        imageShape="arch"
        photoScale="editorial"
        eyebrow="Company"
        title="Built to move from strategy to production."
        description="We connect Oracle Cloud, data intelligence, and application engineering so transformation reaches production with measurable business return."
        image={stockImage("introduction", { w: 1200, q: 82 })}
        imageAlt="Consult America team and delivery environment"
        primaryCta={{ label: "Start a conversation", href: "/contact" }}
        secondaryCta={{ label: "Explore careers", href: "/careers", variant: "secondary" }}
      />

      <PageSection tone="soft" eyebrow="Delivery Philosophy" title="Strategy that stays connected to the code.">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {leadershipPrinciples.map((item, index) => (
            <FeatureCard key={item.num} delay={index * 0.08}>
              <span className="font-serif text-2xl font-normal text-[#B83A3A]">{item.num}</span>
              <h3 className="mt-3 text-lg font-semibold text-[#122D2E]">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#5B6D6B]">{item.desc}</p>
            </FeatureCard>
          ))}
        </div>
      </PageSection>

      <PageSection
        id="how-we-work"
        tone="white"
        eyebrow="How We Work"
        title="One delivery motion, five practices."
        lead="Every engagement moves through the same disciplined phases — strategy through deployment."
      >
        <div className="flex flex-wrap items-center gap-3">
          {deliveryPhases.map((phase, index) => (
            <Reveal key={phase} delay={index * 0.04}>
              <span className="ca-step-pill">{phase}</span>
            </Reveal>
          ))}
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {capabilityGroups.map((group, index) => (
            <Reveal key={group.title} delay={index * 0.05}>
              <Link
                href={group.href}
                className="ca-feature-card ca-feature-card--hover group block rounded-xl border border-[#E1ECE8] bg-[#F8FAF9] p-5"
              >
                <p className="text-sm font-bold text-[#122D2E] group-hover:text-[#B83A3A]">
                  {group.title}
                </p>
                <p className="mt-2 text-xs leading-relaxed text-[#5B6D6B]">
                  {group.description}
                </p>
              </Link>
            </Reveal>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-4 border-t border-[#C9DDD7] pt-8 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-semibold text-[#122D2E]">National delivery centers</p>
            <p className="mt-2 text-sm text-[#5B6D6B]">
              {offices.map((office) => office.city).join(" · ")}
            </p>
          </div>
          <Link href="/contact" className="ca-button-primary inline-flex items-center gap-2">
            Start a conversation
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </PageSection>
    </>
  );
}
