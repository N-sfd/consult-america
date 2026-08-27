import { seedCompensationRecords } from "@/data/hr/seed";
import type { CompensationRecord } from "@/types/hr";

const compensationRecords: CompensationRecord[] = structuredClone(
  seedCompensationRecords,
);

function nowIso() {
  return new Date().toISOString();
}

function createId(prefix: string) {
  return `${prefix}-${crypto.randomUUID()}`;
}

export function listCompensationRecords() {
  return compensationRecords;
}

/** Active record as of `asOf` (defaults to today) — no end date, or end date in the future. */
export function getActiveCompensation(employeeId: string, asOf?: string) {
  const cutoff = asOf ?? new Date().toISOString().slice(0, 10);
  return compensationRecords
    .filter(
      (record) =>
        record.employeeId === employeeId &&
        record.effectiveStartDate <= cutoff &&
        (!record.effectiveEndDate || record.effectiveEndDate >= cutoff),
    )
    .sort((a, b) => b.effectiveStartDate.localeCompare(a.effectiveStartDate))[0];
}

export function upsertCompensation(input: {
  employeeId: string;
  assignmentId: string;
  compensationType: CompensationRecord["compensationType"];
  annualSalary?: number;
  hourlyRate?: number;
  currency?: string;
  effectiveStartDate: string;
  reason?: string;
}) {
  const previous = getActiveCompensation(input.employeeId);
  if (previous) previous.effectiveEndDate = input.effectiveStartDate;

  const record: CompensationRecord = {
    id: createId("comp"),
    employeeId: input.employeeId,
    assignmentId: input.assignmentId,
    compensationType: input.compensationType,
    annualSalary: input.annualSalary,
    hourlyRate: input.hourlyRate,
    currency: input.currency ?? "USD",
    effectiveStartDate: input.effectiveStartDate,
    reason: input.reason,
    createdAt: nowIso(),
    updatedAt: nowIso(),
  };
  compensationRecords.push(record);
  return record;
}

/** Test-only: restore compensation store to seed state. */
export function resetCompensationStoreForTests() {
  compensationRecords.splice(
    0,
    compensationRecords.length,
    ...structuredClone(seedCompensationRecords),
  );
}
