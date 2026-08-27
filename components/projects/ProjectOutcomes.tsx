import { CheckCircle2 } from "lucide-react";

import type { CaseStudyOutcome } from "@/data/case-studies";

export default function ProjectOutcomes({
  items,
}: {
  items: CaseStudyOutcome[];
}) {
  return (
    <section className="mkt-section bg-[var(--mkt-navy)] text-white">
      <div className="mkt-shell">
        <span className="mkt-eyebrow text-white/45">Business Outcomes</span>
        <h2 className="mkt-section-heading mt-5 max-w-2xl !text-white">
          Results and delivery model.
        </h2>

        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10">
          {items.map((item) => (
            <div key={item.title} className="border-t border-white/15 pt-6">
              <CheckCircle2 className="h-5 w-5 text-[var(--mkt-bright)]" />
              <h3 className="mt-4 text-lg font-medium tracking-[-0.02em]">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-white/60">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
