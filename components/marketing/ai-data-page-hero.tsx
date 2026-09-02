"use client";

import { PageHero } from "@/components/marketing/inner-page";

export default function AiDataPageHero() {
  return (
    <PageHero
      variant="ai"
      layout="product"
      eyebrow="AI & Data"
      title={
        <>
          Move from AI experiments
          <br />
          to enterprise intelligence.
        </>
      }
      description="Connect enterprise data, AI models, automation, and business workflows into intelligent systems that operate securely in production."
      productScreens={[
        {
          src: "/innovation/data-agent-hero.png",
          alt: "Data Agent enterprise document intelligence interface",
        },
        {
          src: "/innovation/mediguide-hero.png",
          alt: "MediGuide AI interface",
        },
        {
          src: "/innovation/joblens-hero.png",
          alt: "JobLens interface",
        },
      ]}
      primaryCta={{ label: "Explore Data Agent", href: "/work/innovation/data-agent" }}
      secondaryCta={{ label: "Talk to our team", href: "/contact", variant: "secondary" }}
      focusAreas={[
        "Enterprise AI",
        "AI Agents",
        "Document Intelligence",
        "Enterprise Search",
      ]}
    />
  );
}
