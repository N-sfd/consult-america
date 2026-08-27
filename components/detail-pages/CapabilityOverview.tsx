import type { DetailPageOverviewItem } from "@/lib/marketing/detail-page-types";

export default function CapabilityOverview({
  heading = "Where we focus",
  items,
}: {
  heading?: string;
  items: DetailPageOverviewItem[];
}) {
  return (
    <section className="mkt-section bg-[var(--mkt-ice-soft)]">
      <div className="mkt-shell">
        <h2 className="mkt-section-heading text-[var(--mkt-navy)]">{heading}</h2>

        <div className="mt-12 border-t border-[var(--mkt-border)]">
          <div className="grid md:grid-cols-2 lg:grid-cols-4">
            {items.map((item, index) => (
              <div
                key={item.title}
                className="border-b border-[var(--mkt-border)] py-7 md:border-r md:px-6 md:[&:nth-child(2n)]:border-r-0 lg:[&:nth-child(2n)]:border-r lg:[&:nth-child(4n)]:border-r-0"
              >
                <p className="mkt-eyebrow text-[var(--mkt-muted)]">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-3 text-lg font-medium tracking-[-0.02em] text-[var(--mkt-navy)]">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-[var(--mkt-muted)]">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
