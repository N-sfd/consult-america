import type { Metadata } from "next";

import AIDataStory from "@/components/marketing/ai-data-story";
import ApplicationEngineeringSection from "@/components/marketing/application-engineering-section";
import CapabilityEcosystem from "@/components/marketing/capability-ecosystem";
import CRMShowcase from "@/components/marketing/crm-showcase";
import EnterpriseTransformSection from "@/components/marketing/enterprise-transform-section";
import Hero from "@/components/marketing/hero";
import HomepageCareersSection from "@/components/marketing/homepage-careers-section";
import HomepageClosingSection from "@/components/marketing/homepage-closing-section";
import HomepageContactSection from "@/components/marketing/homepage-contact-section";
import OracleFlagship from "@/components/marketing/oracle-flagship";
import PositioningSection from "@/components/marketing/positioning-section";
import PreFooterCta from "@/components/marketing/pre-footer-cta";
import SelectedWorkSection from "@/components/marketing/selected-work-section";

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
      <CapabilityEcosystem />
      <EnterpriseTransformSection />
      <OracleFlagship />
      <CRMShowcase />
      <AIDataStory />
      <ApplicationEngineeringSection />
      <SelectedWorkSection />
      <HomepageClosingSection />
      <HomepageCareersSection />
      <HomepageContactSection />
      <PreFooterCta />
    </>
  );
}
