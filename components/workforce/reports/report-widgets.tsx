import type { NamedCount, LinkedCountRow } from "@/lib/reports/types";

export function ReportEmpty({ label = "No data available for this period." }: { label?: string }) {
  return (
    <p className="rounded-lg border border-dashed border-black/15 bg-white px-4 py-8 text-center text-sm text-black/50">
      {label}
    </p>
  );
}

export function MetricCard({
  label,
  value,
  hint,
  tone = "default",
}: {
  label: string;
  value: string | number;
  hint?: string;
  tone?: "default" | "danger" | "success";
}) {
  const valueClass =
    tone === "danger"
      ? "text-red-700"
      : tone === "success"
        ? "text-emerald-800"
        : "text-[var(--ca-app-ink)]";
  return (
    <div className="rounded-lg border border-black/10 bg-white p-4 shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
      <p className="text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-black/40">
        {label}
      </p>
      <p className={`mt-2 text-2xl font-semibold tracking-[-0.03em] ${valueClass}`}>
        {value}
      </p>
      {hint ? <p className="mt-1 text-xs text-black/45">{hint}</p> : null}
    </div>
  );
}

export function CountBars({
  title,
  rows,
  emptyLabel,
}: {
  title: string;
  rows: NamedCount[];
  emptyLabel?: string;
}) {
  const max = Math.max(1, ...rows.map((row) => row.count));
  return (
    <section className="rounded-lg border border-black/10 bg-white p-5 shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
      <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-black/40">
        {title}
      </h3>
      {rows.length === 0 ? (
        <div className="mt-4">
          <ReportEmpty label={emptyLabel} />
        </div>
      ) : (
        <ul className="mt-4 space-y-3">
          {rows.map((row) => (
            <li key={row.key}>
              <div className="flex items-baseline justify-between gap-3 text-sm">
                <span className="font-medium text-[var(--ca-app-ink)]">{row.label}</span>
                <span className="text-black/50">{row.count}</span>
              </div>
              <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-black/[0.06]">
                <div
                  className="h-full rounded-full bg-[var(--ca-platform-deep)]/80"
                  style={{ width: `${Math.max(4, (row.count / max) * 100)}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export function LinkedRows({
  title,
  rows,
  emptyLabel,
}: {
  title: string;
  rows: LinkedCountRow[];
  emptyLabel?: string;
}) {
  return (
    <section className="rounded-lg border border-black/10 bg-white p-5 shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
      <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-black/40">
        {title}
      </h3>
      {rows.length === 0 ? (
        <div className="mt-4">
          <ReportEmpty label={emptyLabel} />
        </div>
      ) : (
        <ul className="mt-4 divide-y divide-black/5">
          {rows.map((row) => (
            <li key={row.id} className="flex items-center justify-between gap-3 py-3 text-sm">
              <div>
                {row.href ? (
                  <a
                    href={row.href}
                    className="font-medium text-[var(--ca-platform-mid)] hover:underline"
                  >
                    {row.label}
                  </a>
                ) : (
                  <p className="font-medium">{row.label}</p>
                )}
                {row.sublabel ? (
                  <p className="mt-0.5 text-xs text-black/45">{row.sublabel}</p>
                ) : null}
              </div>
              <div className="text-right text-xs text-black/50">
                {row.percent != null ? <p>{row.percent}% complete</p> : null}
                {row.status ? (
                  <p className="mt-0.5 rounded-md bg-black/5 px-2 py-0.5 font-medium">
                    {row.status.replaceAll("_", " ")}
                  </p>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
