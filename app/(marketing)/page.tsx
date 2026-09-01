import type { Metadata } from "next";

import AIDataStory from "@/components/marketing/ai-data-story";
import ApplicationPlatform from "@/components/marketing/application-platform";
import CareersFeature from "@/components/marketing/careers-feature";
import CRMShowcase from "@/components/marketing/crm-showcase";
import Hero from "@/components/marketing/hero";
import IndustriesSection from "@/components/marketing/industries-section";
import InsightsSection from "@/components/marketing/insights-section";
import LabsShowcase from "@/components/marketing/labs-showcase";
import OracleFlagship from "@/components/marketing/oracle-flagship";
import PositioningSection from "@/components/marketing/positioning-section";
import PreFooterCta from "@/components/marketing/pre-footer-cta";
import SelectedWorkSection from "@/components/marketing/selected-work-section";
import WorkforceJourney from "@/components/marketing/workforce-journey";

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
      <PositioningSection />
      <OracleFlagship />
      <AIDataStory />
      <ApplicationPlatform />
      <LabsShowcase />
      <CRMShowcase />
      <SelectedWorkSection />
      <IndustriesSection />
      <InsightsSection />
      <WorkforceJourney />
      <CareersFeature />
      <PreFooterCta />
    </>
  );
}
