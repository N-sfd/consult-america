import type { Metadata } from "next";

import { MarketingPage } from "@/components/marketing-page";

export const metadata: Metadata = {
  title: "Insights | Consult America",
};

export default function InsightsPage() {
  return (
    <MarketingPage
      eyebrow="Insights"
      title="Practical notes from delivery, not thought-leadership filler."
      description="Short briefings on Oracle, data platforms, and how teams actually adopt AI."
      items={[
        {
          title: "What stalls Fusion programs",
          description:
            "The operating-model gaps that show up after design workshops.",
        },
        {
          title: "AI without a data contract",
          description:
            "Why pilots die when nobody owns quality or evaluation.",
        },
        {
          title: "Cutover checklists that work",
          description:
            "The few controls we refuse to skip on go-live weekend.",
        },
        {
          title: "Buying vs. building copilots",
          description:
            "A filter for when a vendor tool is enough—and when it is not.",
        },
      ]}
    />
  );
}
