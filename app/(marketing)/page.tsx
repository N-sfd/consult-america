import type { Metadata } from "next";

import AIDataStory from "@/components/marketing/ai-data-story";
import CareersFeature from "@/components/marketing/careers-feature";
import ClientTrust from "@/components/marketing/client-trust";
import CRMShowcase from "@/components/marketing/crm-showcase";
import DataAgentFlagship from "@/components/marketing/data-agent-flagship";
import GlanceStats from "@/components/marketing/glance-stats";
import Hero from "@/components/marketing/hero";
import IndustriesSection from "@/components/marketing/industries-section";
import InsightsSection from "@/components/marketing/insights-section";
import LabsShowcase from "@/components/marketing/labs-showcase";
import OracleFlagship from "@/components/marketing/oracle-flagship";
import PlatformStrip from "@/components/marketing/platform-strip";
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
      <ClientTrust />
      <PlatformStrip />
      <PositioningSection />
      <GlanceStats />
      <OracleFlagship />
      <CRMShowcase />
      <AIDataStory />
      <LabsShowcase />
      <DataAgentFlagship />
      <WorkforceJourney />
      <SelectedWorkSection />
      <IndustriesSection />
      <InsightsSection />
      <CareersFeature />
      <PreFooterCta />
    </>
  );
}
