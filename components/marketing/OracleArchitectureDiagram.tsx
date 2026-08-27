const MODULES = [
  "Financials",
  "Procurement",
  "Projects",
  "HCM",
  "SCM",
];

const FLOW_STEPS = [
  "Strategy",
  "Design",
  "Configure",
  "Integrate",
  "Test",
  "Deploy",
];

export default function OracleArchitectureDiagram({
  compact = false,
}: {
  compact?: boolean;
}) {
  return (
    <div className="overflow-hidden border border-[var(--mkt-border)] bg-white">
      <div className="flex items-center justify-between border-b border-[var(--mkt-border)] px-4 py-3">
        <span className="text-[0.65rem] font-semibold tracking-[0.12em] text-[var(--mkt-navy)]">
          ORACLE CLOUD
        </span>
      </div>

      <div
        className={`grid grid-cols-[1fr_auto_1fr] items-center gap-3 ${compact ? "p-4" : "p-5"}`}
      >
        <div className="space-y-1.5">
          {MODULES.map((item) => (
            <div
              key={item}
              className="border border-[var(--mkt-border)] bg-[var(--mkt-ice)] px-3 py-2 text-right text-xs font-medium text-[var(--mkt-navy)]"
            >
              {item}
            </div>
          ))}
        </div>

        <svg
          width="40"
          height="168"
          viewBox="0 0 40 168"
          className="hidden shrink-0 sm:block"
          aria-hidden="true"
        >
          {MODULES.map((_, index) => {
            const y = 14 + index * 32;
            return (
              <line
                key={index}
                x1="0"
                y1={y}
                x2="40"
                y2="84"
                stroke="var(--mkt-border)"
                strokeWidth="1"
              />
            );
          })}
        </svg>

        <div className="space-y-1.5">
          <div className="border border-[var(--mkt-blue)]/30 bg-[var(--mkt-cloud)] px-3 py-2 text-center text-xs font-semibold text-[var(--mkt-blue)]">
            Integration
          </div>
          <div className="border border-[var(--mkt-border)] bg-[var(--mkt-ice)] px-3 py-2 text-center text-xs font-medium text-[var(--mkt-navy)]">
            Data &amp; Analytics
          </div>
        </div>
      </div>

      <div className="border-t border-[var(--mkt-border)] px-4 py-3">
        <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1.5">
          {FLOW_STEPS.map((step, index) => (
            <span key={step} className="flex items-center gap-1.5">
              <span className="text-[0.7rem] font-medium text-[var(--mkt-muted)]">
                {step}
              </span>
              {index < FLOW_STEPS.length - 1 && (
                <span className="text-[0.65rem] text-[var(--mkt-border)]">
                  →
                </span>
              )}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
