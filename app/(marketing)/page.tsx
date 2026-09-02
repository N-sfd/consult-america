import type { Metadata } from "next";

import AIDataStory from "@/components/marketing/ai-data-story";
import CRMShowcase from "@/components/marketing/crm-showcase";
import Hero from "@/components/marketing/hero";
import HomepageClosingSection from "@/components/marketing/homepage-closing-section";
import OracleFlagship from "@/components/marketing/oracle-flagship";
import PlatformStrip from "@/components/marketing/platform-strip";
import PortfolioSection from "@/components/marketing/portfolio-section";
import PositioningSection from "@/components/marketing/positioning-section";
import PreFooterCta from "@/components/marketing/pre-footer-cta";
import SelectedWorkSection from "@/components/marketing/selected-work-section";
import WhatWeDoSection from "@/components/marketing/what-we-do-section";

export const metadata: Metadata = {
  title: "Consult America | Enterprise Transformation, Oracle, AI & Application Engineering",
  description:
    "Consult America helps organizations modernize enterprise platforms, connect data and workflows, operationalize AI, and engineer digital products from strategy through production.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Consult America | Enterprise Transformation, Oracle, AI & Application Engineering",
    description:
      "Consult America helps organizations modernize enterprise platforms, connect data and workflows, operationalize AI, and engineer digital products from strategy through production.",
    type: "website",
    url: "https://consultamerica.net",
  },
};

export default function Home() {
  return (
    <>
      <Hero />
      <PlatformStrip />
      <PositioningSection />
      <WhatWeDoSection />
      <OracleFlagship />
      <CRMShowcase />
      <AIDataStory />
      <PortfolioSection />
      <SelectedWorkSection />
      <HomepageClosingSection />
      <PreFooterCta />
    </>
  );
}
