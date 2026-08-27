import { ArrowDown } from "lucide-react";

const CONNECTED_PROCESSES = [
  "Finance",
  "Procurement",
  "Projects",
  "Approvals",
  "Reporting",
];

export default function TransformationDiagram() {
  return (
    <div className="rounded-2xl border border-[var(--mkt-border)] bg-white p-6 shadow-[0_20px_50px_rgba(16,42,67,0.08)] md:p-8">
      <div className="rounded-lg border border-dashed border-[var(--mkt-border)] bg-[var(--mkt-ice)] px-4 py-3 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--mkt-muted)]">
          Legacy Processes
        </p>
      </div>

      <ArrowDown className="mx-auto mt-3 h-4 w-4 text-[var(--mkt-muted)]" />

      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
        {CONNECTED_PROCESSES.map((item) => (
          <div
            key={item}
            className="rounded-md border border-[var(--mkt-border)] bg-white px-3 py-2.5 text-center"
          >
            <p className="text-xs font-medium text-[var(--mkt-navy)]">{item}</p>
          </div>
        ))}
      </div>

      <ArrowDown className="mx-auto mt-3 h-4 w-4 text-[var(--mkt-blue)]" />

      <div className="mt-3 rounded-lg bg-[var(--mkt-blue)] px-4 py-3.5 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white">
          Oracle Cloud
        </p>
      </div>

      <ArrowDown className="mx-auto mt-3 h-4 w-4 text-[var(--mkt-navy)]" />

      <div className="mt-3 rounded-lg bg-[var(--mkt-navy)] px-4 py-3.5 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white">
          Connected Operations
        </p>
      </div>
    </div>
  );
}
