export default function ProjectCapabilities({
  items,
}: {
  items: string[];
}) {
  return (
    <section className="mkt-section-compact bg-[var(--mkt-ice-soft)]">
      <div className="mkt-shell">
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <span className="mkt-eyebrow text-[var(--mkt-muted)]">
              Technology &amp; capabilities
            </span>
          </div>
          <div className="flex flex-wrap gap-3 lg:col-span-8">
            {items.map((item) => (
              <span
                key={item}
                className="rounded-full border border-[var(--mkt-border)] bg-white px-4 py-2 text-sm font-medium text-[var(--mkt-navy)]"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
