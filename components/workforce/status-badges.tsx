import { employeeStatusLabels, type EmployeeStatus } from "@/types/hr";
import type { WorkAuthorizationVerificationStatus } from "@/lib/hr/repository";
import { cn } from "@/lib/utils";

const EMPLOYEE_STATUS_TONES: Record<EmployeeStatus, string> = {
  PRE_HIRE: "bg-black/[0.06] text-black/55",
  ACTIVE: "bg-[var(--ca-green)]/15 text-[var(--ca-green)]",
  ON_LEAVE: "bg-[var(--ca-amber)]/15 text-[var(--ca-amber)]",
  SUSPENDED: "bg-[var(--ca-error)]/10 text-[var(--ca-error)]",
  TERMINATED: "bg-black/[0.06] text-black/40",
};

export function EmployeeStatusBadge({
  status,
  className,
}: {
  status: EmployeeStatus;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center rounded-sm px-2 py-0.5 text-xs font-medium whitespace-nowrap",
        EMPLOYEE_STATUS_TONES[status],
        className,
      )}
    >
      {employeeStatusLabels[status]}
    </span>
  );
}

const VERIFICATION_LABELS: Record<WorkAuthorizationVerificationStatus, string> = {
  UNVERIFIED: "Unverified",
  PENDING: "Pending",
  VERIFIED: "Verified",
  EXPIRED: "Expired",
};

const VERIFICATION_TONES: Record<WorkAuthorizationVerificationStatus, string> = {
  UNVERIFIED: "bg-black/[0.06] text-black/55",
  PENDING: "bg-[var(--ca-amber)]/15 text-[var(--ca-amber)]",
  VERIFIED: "bg-[var(--ca-green)]/15 text-[var(--ca-green)]",
  EXPIRED: "bg-[var(--ca-error)]/10 text-[var(--ca-error)]",
};

export function VerificationStatusBadge({
  status,
  className,
}: {
  status: WorkAuthorizationVerificationStatus;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center rounded-sm px-2 py-0.5 text-xs font-medium whitespace-nowrap",
        VERIFICATION_TONES[status],
        className,
      )}
    >
      {VERIFICATION_LABELS[status]}
    </span>
  );
}
