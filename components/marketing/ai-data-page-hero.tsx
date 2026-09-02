"use client";

import { PageHero } from "@/components/marketing/inner-page";

export default function AiDataPageHero() {
  return (
    <PageHero
      variant="ai-dark"
      layout="split-left"
      imageMode="product"
      eyebrow="AI & Data"
      eyebrowTone="light"
      title={
        <>
          Move from AI experiments
          <br />
          to enterprise intelligence.
        </>
      }
      description="Bring governed AI, trusted data and enterprise workflows together in practical operational experiences."
      productScreens={[
        {
          src: "/innovation/data-agent-hero.png",
          alt: "Data Agent enterprise document intelligence interface",
        },
        {
          src: "/innovation/data-agent-platform.png",
          alt: "Data Agent source verification view",
        },
      ]}
      primaryCta={{ label: "Explore Data Agent", href: "/work/innovation/data-agent" }}
      secondaryCta={{ label: "Talk to our team", href: "/contact", variant: "secondary" }}
    />
  );
}
