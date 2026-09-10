import { Check, X } from "lucide-react";

import { formatDate } from "@/lib/recruiting/format";

export type TimelineStep = {
  label: string;
  reached: boolean;
  current: boolean;
  date?: string;
  /** Only meaningful on a reached, non-current-in-progress step — colors the
   * marker by outcome instead of the default "in progress" teal. */
  tone?: "positive" | "negative" | "neutral";
};

const TONE_MARKER: Record<"positive" | "negative" | "neutral", string> = {
  positive: "bg-emerald-600 border-emerald-600",
  negative: "bg-red-700 border-red-700",
  neutral: "bg-black/30 border-black/30",
};

export default function ApplicationTimeline({ steps }: { steps: TimelineStep[] }) {
  return (
    <div className="mt-4 overflow-x-auto">
      <div className="flex min-w-[560px] items-start">
        {steps.map((step, i) => {
          const isLast = i === steps.length - 1;
          const nextReached = !isLast && steps[i + 1].reached;
          const markerTone = step.tone && step.reached ? TONE_MARKER[step.tone] : null;

          return (
            <div key={step.label} className="flex flex-1 items-start last:flex-none">
              <div className="flex flex-col items-center" style={{ width: 112 }}>
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full border-2 text-white transition-colors ${
                    markerTone
                      ? markerTone
                      : step.reached
                        ? "border-[var(--ca-platform-deep)] bg-[var(--ca-platform-deep)]"
                        : "border-black/15 bg-white"
                  } ${step.current ? "ring-4 ring-[rgba(23,106,99,0.18)]" : ""}`}
                >
                  {step.tone === "negative" && step.reached ? (
                    <X className="h-4 w-4" />
                  ) : step.reached ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <span className="h-2 w-2 rounded-full bg-black/15" />
                  )}
                </div>
                <p
                  className={`mt-2 text-center text-xs ${
                    step.reached ? "font-semibold text-black" : "text-black/40"
                  }`}
                >
                  {step.label}
                </p>
                {step.reached && step.date ? (
                  <p className="text-center text-[11px] text-black/45">
                    {formatDate(step.date)}
                  </p>
                ) : null}
              </div>
              {!isLast ? (
                <div
                  className={`mt-4 h-0.5 flex-1 ${
                    step.reached && nextReached ? "bg-[var(--ca-platform-deep)]" : "bg-black/10"
                  }`}
                />
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
