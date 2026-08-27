import { Check } from "lucide-react";

export default function InnovationFeatureList({
  items,
}: {
  items: string[];
}) {
  return (
    <section className="mkt-section-compact bg-white">
      <div className="mkt-shell">
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <span className="mkt-eyebrow text-[var(--mkt-muted)]">
              The Product
            </span>
          </div>
          <div className="grid gap-x-8 gap-y-4 sm:grid-cols-2 lg:col-span-8">
            {items.map((item) => (
              <div key={item} className="flex items-start gap-3">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--mkt-blue)]" />
                <span className="text-[var(--mkt-navy)]">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
