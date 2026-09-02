"use client";

import { PageHero } from "@/components/marketing/inner-page";

export default function InnovationHero({
  category,
  tagline,
  headline,
  summary,
  liveUrl,
  heroImage,
  heroImageAlt,
}: {
  category: string;
  tagline: string;
  headline: string;
  summary: string;
  liveUrl: string;
  heroImage: string;
  heroImageAlt: string;
}) {
  return (
    <PageHero
      variant="applications"
      layout="split-left"
      imageShape="rect"
      eyebrow={`${category} / Product Innovation`}
      title={headline}
      description={summary}
      image={heroImage}
      imageAlt={heroImageAlt}
      primaryCta={{ label: "View Live Product", href: liveUrl }}
      secondaryCta={{ label: tagline, href: "/work/innovation", variant: "secondary" }}
    />
  );
}
