import { CheckCircle2 } from "lucide-react";

import type { DetailPageOutcome } from "@/lib/marketing/detail-page-types";

export default function OutcomeGrid({
  heading = "What good looks like",
  items,
}: {
  heading?: string;
  items: DetailPageOutcome[];
}) {
  return (
    <section className="mkt-section bg-white">
      <div className="mkt-shell">
        <h2 className="mkt-section-heading text-[var(--mkt-navy)]">{heading}</h2>

        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10">
          {items.map((item) => (
            <div key={item.title} className="border-t border-[var(--mkt-border)] pt-6">
              <CheckCircle2 className="h-5 w-5 text-[var(--mkt-blue)]" />
              <h3 className="mt-4 text-lg font-medium tracking-[-0.02em] text-[var(--mkt-navy)]">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-[var(--mkt-muted)]">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
