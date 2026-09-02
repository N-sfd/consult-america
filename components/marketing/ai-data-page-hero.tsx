"use client";

import { PageHero } from "@/components/marketing/inner-page";

export default function AiDataPageHero() {
  return (
    <PageHero
      variant="ai-dark"
      layout="split-left"
      imageShape="rect"
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
      image="/innovation/data-agent-hero.png"
      imageAlt="Data Agent enterprise document intelligence interface"
      primaryCta={{ label: "Explore Data Agent", href: "/work/innovation/data-agent" }}
      secondaryCta={{ label: "Talk to our team", href: "/contact", variant: "secondary" }}
    />
  );
}
