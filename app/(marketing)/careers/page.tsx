import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import Container from "@/components/layout/container";
import { PageHero } from "@/components/marketing/inner-page";
import PageSection from "@/components/marketing/inner-page/page-section";
import FeatureCard from "@/components/marketing/inner-page/feature-card";
import Reveal from "@/components/marketing/inner-page/reveal";
import {
  careerPaths,
  howWeWork,
  whyWorkHere,
} from "@/data/careers";
import { stockImage } from "@/lib/marketing/stock-images";

const CAREERS_HERO_IMAGE = stockImage("careersPageHero", { w: 1200, q: 80 });

export const metadata: Metadata = {
  title: "Careers | ConsultAmerica",
  description:
    "Build what's next at ConsultAmerica — enterprise transformation, Oracle, AI, data, and digital engineering careers.",
};

export default function CareersPage() {
  return (
    <>
      <PageHero
        variant="careers"
        layout="split-left"
        imageShape="careers"
        eyebrow="Careers"
        title="Build what's next."
        description="Join ConsultAmerica and work on complex enterprise transformation, Oracle, AI, data, and digital engineering initiatives that move organizations forward."
        image={CAREERS_HERO_IMAGE}
        imageAlt="ConsultAmerica team collaborating"
        primaryCta={{ label: "Explore Open Roles", href: "/jobs" }}
      />

      <PageSection tone="white" eyebrow="Why work here" title="Meaningful work with experienced teams.">
        <div className="grid gap-6 md:grid-cols-2">
          {whyWorkHere.map((item, index) => (
            <FeatureCard key={item.title} delay={index * 0.08}>
              <h2 className="text-xl font-semibold tracking-[-0.03em] text-[#122D2E]">
                {item.title}
              </h2>
              <p className="mt-4 text-sm leading-7 text-[#5B6D6B]">{item.description}</p>
            </FeatureCard>
          ))}
        </div>
      </PageSection>

      <PageSection tone="soft" eyebrow="How we work" title="Principles that shape delivery.">
        <div className="grid gap-4 md:grid-cols-2">
          {howWeWork.map((item, index) => (
            <Reveal key={item} delay={index * 0.06}>
              <p className="ca-step-pill w-full justify-start text-left leading-relaxed">
                {item}
              </p>
            </Reveal>
          ))}
        </div>
      </PageSection>

      <PageSection tone="sage" eyebrow="Career paths" title="Find your path at ConsultAmerica.">
        <div className="grid gap-6 md:grid-cols-2">
          {careerPaths.map((path, index) => (
            <Reveal key={path.title} delay={index * 0.08}>
              <Link
                href={path.href}
                className="ca-feature-card ca-feature-card--hover group block rounded-2xl border border-[#C9DDD7]/80 bg-white p-6"
              >
                <span className="text-sm font-bold text-[#176A63]">{path.number}</span>
                <h2 className="mt-3 text-xl font-semibold text-[#122D2E] group-hover:text-[#B83A3A]">
                  {path.title}
                </h2>
                <p className="mt-2 text-sm leading-7 text-[#5B6D6B]">{path.description}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[#B83A3A]">
                  Learn more <ArrowUpRight className="h-4 w-4" />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </PageSection>
    </>
  );
}
