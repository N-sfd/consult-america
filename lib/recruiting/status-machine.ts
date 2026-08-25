import {
  APPLICATION_TERMINAL_STATUSES,
  type ApplicationStatus,
  type OfferStatus,
  type RequisitionStatus,
} from "@/types/recruiting";

const REQUISITION_TRANSITIONS: Record<RequisitionStatus, RequisitionStatus[]> = {
  DRAFT: ["PENDING_APPROVAL", "CANCELLED"],
  PENDING_APPROVAL: ["APPROVED", "REJECTED", "DRAFT", "CANCELLED"],
  APPROVED: ["PUBLISHED", "ON_HOLD", "CANCELLED"],
  REJECTED: ["DRAFT", "CANCELLED"],
  PUBLISHED: ["ON_HOLD", "FILLED", "CANCELLED"],
  ON_HOLD: ["APPROVED", "PUBLISHED", "CANCELLED"],
  FILLED: [],
  CANCELLED: [],
};

const APPLICATION_TRANSITIONS: Record<ApplicationStatus, ApplicationStatus[]> = {
  APPLIED: ["REVIEW", "REJECTED", "WITHDRAWN", "CLOSED"],
  REVIEW: ["RECRUITER_SCREEN", "REJECTED", "WITHDRAWN", "CLOSED"],
  RECRUITER_SCREEN: [
    "HIRING_MANAGER_REVIEW",
    "REJECTED",
    "WITHDRAWN",
    "CLOSED",
  ],
  HIRING_MANAGER_REVIEW: ["INTERVIEW", "REJECTED", "WITHDRAWN", "CLOSED"],
  INTERVIEW: ["FINAL_INTERVIEW", "OFFER", "REJECTED", "WITHDRAWN", "CLOSED"],
  FINAL_INTERVIEW: ["OFFER", "REJECTED", "WITHDRAWN", "CLOSED"],
  OFFER: ["HIRED", "REJECTED", "WITHDRAWN", "CLOSED"],
  HIRED: [],
  REJECTED: [],
  WITHDRAWN: [],
  CLOSED: [],
};

const OFFER_TRANSITIONS: Record<OfferStatus, OfferStatus[]> = {
  DRAFT: ["PENDING_APPROVAL", "WITHDRAWN"],
  PENDING_APPROVAL: ["EXTENDED", "DRAFT", "WITHDRAWN"],
  EXTENDED: ["ACCEPTED", "DECLINED", "EXPIRED", "WITHDRAWN"],
  ACCEPTED: [],
  DECLINED: [],
  WITHDRAWN: [],
  EXPIRED: [],
};

export function canTransitionRequisition(
  from: RequisitionStatus,
  to: RequisitionStatus,
): boolean {
  return REQUISITION_TRANSITIONS[from].includes(to);
}

export function canTransitionApplication(
  from: ApplicationStatus,
  to: ApplicationStatus,
): boolean {
  return APPLICATION_TRANSITIONS[from].includes(to);
}

export function canTransitionOffer(from: OfferStatus, to: OfferStatus): boolean {
  return OFFER_TRANSITIONS[from].includes(to);
}

export function isTerminalApplicationStatus(status: ApplicationStatus): boolean {
  return APPLICATION_TERMINAL_STATUSES.includes(status);
}

/**
 * Hire conversion is only allowed when:
 * - Application is in OFFER (or already HIRED for idempotency checks)
 * - Related offer status is ACCEPTED
 */
export function canConvertToEmployee(input: {
  applicationStatus: ApplicationStatus;
  offerStatus?: OfferStatus;
}): boolean {
  if (input.applicationStatus === "HIRED") return false;
  return (
    input.applicationStatus === "OFFER" && input.offerStatus === "ACCEPTED"
  );
}

export function assertApplicationTransition(
  from: ApplicationStatus,
  to: ApplicationStatus,
): void {
  if (!canTransitionApplication(from, to)) {
    throw new Error(`Invalid application transition: ${from} → ${to}`);
  }
}

export function assertRequisitionTransition(
  from: RequisitionStatus,
  to: RequisitionStatus,
): void {
  if (!canTransitionRequisition(from, to)) {
    throw new Error(`Invalid requisition transition: ${from} → ${to}`);
  }
}
