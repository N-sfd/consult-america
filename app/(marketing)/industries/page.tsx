import type { Metadata } from "next";

import { MarketingPage } from "@/components/marketing-page";

export const metadata: Metadata = {
  title: "Industries | Consult America",
};

export default function IndustriesPage() {
  return (
    <MarketingPage
      eyebrow="Industries"
      title="Sector context, not generic playbooks."
      description="We work with public sector, regulated enterprise, and high-growth operators who need systems that hold up under scrutiny."
      items={[
        {
          title: "Public sector",
          description:
            "Mission systems, modernization, and compliant delivery models.",
        },
        {
          title: "Financial services",
          description:
            "Core process change with controls, auditability, and resilience.",
        },
        {
          title: "Healthcare and life sciences",
          description:
            "Data, operations, and platforms that respect privacy and scale.",
        },
        {
          title: "Industrial and energy",
          description:
            "Asset-heavy operations, supply chains, and field-to-finance flows.",
        },
      ]}
    />
  );
}
