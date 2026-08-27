import {
  applicationStatusLabels,
  requisitionStatusLabels,
  type ApplicationStatus,
  type RequisitionStatus,
} from "@/types/recruiting";
import { cn } from "@/lib/utils";

const STAGE_TONES: Record<ApplicationStatus, string> = {
  APPLIED: "bg-black/[0.06] text-black/60",
  REVIEW: "bg-[var(--ca-blue)]/10 text-[var(--ca-blue)]",
  RECRUITER_SCREEN: "bg-[var(--ca-blue)]/10 text-[var(--ca-blue)]",
  HIRING_MANAGER_REVIEW: "bg-[var(--ca-blue)]/10 text-[var(--ca-blue)]",
  INTERVIEW: "bg-[var(--ca-amber)]/15 text-[var(--ca-amber)]",
  FINAL_INTERVIEW: "bg-[var(--ca-amber)]/15 text-[var(--ca-amber)]",
  OFFER: "bg-[var(--ca-green)]/15 text-[var(--ca-green)]",
  HIRED: "bg-[var(--ca-green)]/20 text-[var(--ca-green)]",
  REJECTED: "bg-[var(--ca-error)]/10 text-[var(--ca-error)]",
  WITHDRAWN: "bg-black/[0.06] text-black/45",
  CLOSED: "bg-black/[0.06] text-black/45",
};

export default function StageBadge({
  stage,
  className,
}: {
  stage?: ApplicationStatus;
  className?: string;
}) {
  if (!stage) {
    return <span className={cn("text-xs text-black/40", className)}>—</span>;
  }

  return (
    <span
      className={cn(
        "inline-flex w-fit items-center rounded-sm px-2 py-0.5 text-xs font-medium whitespace-nowrap",
        STAGE_TONES[stage],
        className,
      )}
    >
      {applicationStatusLabels[stage]}
    </span>
  );
}

const REQUISITION_STATUS_TONES: Record<RequisitionStatus, string> = {
  DRAFT: "bg-black/[0.06] text-black/55",
  PENDING_APPROVAL: "bg-[var(--ca-amber)]/15 text-[var(--ca-amber)]",
  APPROVED: "bg-[var(--ca-blue)]/10 text-[var(--ca-blue)]",
  REJECTED: "bg-[var(--ca-error)]/10 text-[var(--ca-error)]",
  PUBLISHED: "bg-[var(--ca-green)]/15 text-[var(--ca-green)]",
  ON_HOLD: "bg-[var(--ca-amber)]/15 text-[var(--ca-amber)]",
  FILLED: "bg-black/[0.06] text-black/55",
  CANCELLED: "bg-black/[0.06] text-black/40",
};

export function RequisitionStatusBadge({
  status,
  className,
}: {
  status: RequisitionStatus;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center rounded-sm px-2 py-0.5 text-xs font-medium whitespace-nowrap",
        REQUISITION_STATUS_TONES[status],
        className,
      )}
    >
      {requisitionStatusLabels[status]}
    </span>
  );
}

export function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function CandidateAvatar({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--ca-navy)] text-[0.65rem] font-semibold text-white",
        className,
      )}
    >
      {initialsOf(name)}
    </span>
  );
}
