import { CheckCircle2 } from "lucide-react";

import FeatureCard from "@/components/marketing/inner-page/feature-card";
import PageSection from "@/components/marketing/inner-page/page-section";
import type { DetailPageOutcome } from "@/lib/marketing/detail-page-types";

export default function OutcomeGrid({
  heading = "What good looks like",
  items,
}: {
  heading?: string;
  items: DetailPageOutcome[];
}) {
  return (
    <PageSection tone="white" eyebrow="Outcomes" title={heading}>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, index) => (
          <FeatureCard key={item.title} delay={index * 0.08}>
            <CheckCircle2 className="h-5 w-5 text-[#176A63]" />
            <h3 className="mt-4 text-lg font-semibold tracking-[-0.02em] text-[#122D2E]">
              {item.title}
            </h3>
            <p className="mt-2 text-sm leading-6 text-[#5B6D6B]">{item.description}</p>
          </FeatureCard>
        ))}
      </div>
    </PageSection>
  );
}
