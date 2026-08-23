import type { Metadata } from "next";

import { MarketingPage } from "@/components/marketing-page";

export const metadata: Metadata = {
  title: "AI & Data | Consult America",
};

export default function AiDataPage() {
  return (
    <MarketingPage
      eyebrow="AI & Data"
      title="Data foundations first. Models second."
      description="We build the pipelines, quality, and governance that make AI useful in operations—not just in a demo."
      items={[
        {
          title: "Data platforms",
          description:
            "Warehouses, lakes, and semantic layers designed for reuse.",
        },
        {
          title: "Applied AI",
          description:
            "Workflow copilots, document intelligence, and decision support.",
        },
        {
          title: "Governance",
          description:
            "Access, lineage, evaluation, and human review where it matters.",
        },
        {
          title: "Enablement",
          description:
            "Team training and operating rhythms so the platform stays owned.",
        },
      ]}
    />
  );
}
