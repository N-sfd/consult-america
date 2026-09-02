import type { Metadata } from "next";

import ContactCTA from "@/components/detail-pages/ContactCTA";
import OutcomeGrid from "@/components/detail-pages/OutcomeGrid";
import RelatedInsights from "@/components/detail-pages/RelatedInsights";
import AiDataPageHero from "@/components/marketing/ai-data-page-hero";

export const metadata: Metadata = {
  title: "AI & Data | Consult America",
  description:
    "Move from AI experiments to enterprise intelligence — data platforms, applied AI, governance, and enablement.",
};

const outcomes = [
  {
    title: "Answers, not dashboards",
    description:
      "Agents and copilots that retrieve context and act on it, instead of one more report someone has to interpret.",
  },
  {
    title: "Governed by default",
    description:
      "Access controls, lineage, and human review are part of the platform from day one, not bolted on after an audit.",
  },
  {
    title: "Owned by your team",
    description:
      "Training and operating rhythms so the platform stays owned internally once the delivery team steps back.",
  },
];

export default function AiDataPage() {
  return (
    <>
      <AiDataPageHero />
      <OutcomeGrid heading="What good looks like" items={outcomes} />
      <RelatedInsights category="ai-data" />
      <ContactCTA headline="Ready to put AI to work on your data?" />
    </>
  );
}
