import type { Metadata } from "next";

import AIEngineeringSignature from "@/components/marketing/ai-engineering-signature";
import ApplicationShowcase from "@/components/marketing/application-showcase";
import CapabilityEcosystem from "@/components/marketing/capability-ecosystem";
import Hero from "@/components/marketing/hero";
import HomepageClosingSection from "@/components/marketing/homepage-closing-section";
import HomepageDiscoverySection from "@/components/marketing/homepage-discovery-section";
import HomepageFinalCta from "@/components/marketing/homepage-final-cta";
import HomepagePlatformBand from "@/components/marketing/homepage-platform-band";
import OracleFlagship from "@/components/marketing/oracle-flagship";
import ProofSection from "@/components/marketing/proof-section";
import SelectedWorkSection from "@/components/marketing/selected-work-section";

export const metadata: Metadata = {
  title: "Enterprise Transformation, Oracle, AI & Application Engineering",
  description:
    "Consult America helps organizations modernize enterprise platforms, connect data and workflows, operationalize AI, and engineer digital products from strategy through production.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title:
      "Enterprise Transformation, Oracle, AI & Application Engineering | Consult America",
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
      <ProofSection />
      <CapabilityEcosystem />
      <OracleFlagship />
      <AIEngineeringSignature />
      <ApplicationShowcase />
      <HomepagePlatformBand />
      <SelectedWorkSection />
      <HomepageClosingSection />
      <HomepageDiscoverySection />
      <HomepageFinalCta />
    </>
  );
}
