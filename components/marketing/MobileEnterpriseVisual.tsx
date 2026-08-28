import { ArrowDown } from "lucide-react";

const STEPS = [
  { label: "Oracle Cloud", detail: "Fusion · Finance · SCM" },
  { label: "AI & Data", detail: "Agents · Intelligence" },
  { label: "Enterprise Ops", detail: "Strategy · Delivery" },
];

export default function MobileEnterpriseVisual({ className }: { className?: string }) {
  return (
    <div
      className={`relative overflow-hidden bg-gradient-to-br from-[#0a1c32] via-[var(--mkt-navy)] to-[#081628] ${className ?? ""}`}
    >
      <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-[var(--mkt-bright)]/20 blur-[70px]" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.55) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      />

      <div className="relative flex flex-col gap-1.5 px-4 py-3.5 sm:gap-2 sm:px-5 sm:py-4">
        <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-white/45 sm:text-[12px]">
          Enterprise Transformation
        </p>

        {STEPS.map((step, index) => (
          <div key={step.label} className="contents">
            {index > 0 && (
              <ArrowDown
                aria-hidden="true"
                className="mx-auto h-3 w-3 text-white/30"
              />
            )}
            <div className="rounded-xl border border-white/12 bg-white/[0.07] px-4 py-2 backdrop-blur-md sm:py-2.5">
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--mkt-bright)]" />
                <p className="text-[15px] font-medium text-white sm:text-[16px]">
                  {step.label}
                </p>
              </div>
              <p className="mt-0.5 text-[13px] text-white/55 sm:text-[14px]">
                {step.detail}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
