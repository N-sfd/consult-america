import { candidateApplicationStatusLabels, type ApplicationStatus } from "@/types/recruiting";

const TONE_CLASSES: Record<"progress" | "positive" | "negative" | "neutral", string> = {
  progress: "bg-[rgba(23,106,99,0.12)] text-[var(--ca-platform-deep)]",
  positive: "bg-emerald-50 text-emerald-700",
  negative: "bg-red-50 text-red-700",
  neutral: "bg-black/[0.05] text-black/50",
};

const STATUS_TONE: Record<ApplicationStatus, keyof typeof TONE_CLASSES> = {
  APPLIED: "progress",
  REVIEW: "progress",
  RECRUITER_SCREEN: "progress",
  HIRING_MANAGER_REVIEW: "progress",
  INTERVIEW: "progress",
  FINAL_INTERVIEW: "progress",
  OFFER: "progress",
  HIRED: "positive",
  REJECTED: "negative",
  WITHDRAWN: "neutral",
  CLOSED: "neutral",
};

export default function ApplicationStatusPill({ status }: { status: ApplicationStatus }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${TONE_CLASSES[STATUS_TONE[status]]}`}
    >
      {candidateApplicationStatusLabels[status]}
    </span>
  );
}
