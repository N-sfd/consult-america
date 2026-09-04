import { seedBenefitsElections, seedBenefitsPlans } from "@/data/self-service/seed";
import type { BenefitsCoverageTier, BenefitsElection, BenefitsPlan } from "@/types/self-service";

const benefitsPlans: BenefitsPlan[] = structuredClone(seedBenefitsPlans);
const benefitsElections: BenefitsElection[] = structuredClone(seedBenefitsElections);

function createId(prefix: string) {
  return `${prefix}-${crypto.randomUUID()}`;
}

function nowIso() {
  return new Date().toISOString();
}

export function listAvailablePlans() {
  return benefitsPlans.filter((plan) => plan.status === "ACTIVE");
}

export function getPlanById(planId: string) {
  return benefitsPlans.find((plan) => plan.id === planId);
}

export function listElections(employeeId: string) {
  return benefitsElections
    .filter((election) => election.employeeId === employeeId)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function listActiveElections(employeeId: string) {
  return listElections(employeeId).filter(
    (election) => election.status === "ACTIVE",
  );
}

export function submitElection(input: {
  employeeId: string;
  planId: string;
  coverageTier: BenefitsCoverageTier;
  dependentCount: number;
  effectiveDate: string;
}) {
  const plan = getPlanById(input.planId);
  if (!plan || plan.status !== "ACTIVE") {
    throw new Error("Benefits plan is not available");
  }
  if (input.dependentCount < 0) {
    throw new Error("Dependent count cannot be negative");
  }

  const now = nowIso();

  const existing = benefitsElections.find(
    (election) =>
      election.employeeId === input.employeeId &&
      election.status === "ACTIVE" &&
      getPlanById(election.planId)?.category === plan.category,
  );
  if (existing) {
    existing.status = "CANCELLED";
    existing.updatedAt = now;
  }

  const election: BenefitsElection = {
    id: createId("be"),
    employeeId: input.employeeId,
    planId: input.planId,
    coverageTier: input.coverageTier,
    dependentCount: input.dependentCount,
    effectiveDate: input.effectiveDate,
    status: "ACTIVE",
    createdAt: now,
    updatedAt: now,
  };
  benefitsElections.push(election);

  return election;
}

export function cancelElection(input: { electionId: string; employeeId: string }) {
  const election = benefitsElections.find((item) => item.id === input.electionId);
  if (!election) throw new Error("Election not found");
  if (election.employeeId !== input.employeeId) {
    throw new Error("Forbidden: cannot cancel another employee's election");
  }
  if (election.status !== "ACTIVE") {
    throw new Error("Only active elections can be cancelled");
  }

  election.status = "CANCELLED";
  election.updatedAt = nowIso();
  return election;
}

export function getBenefitsStoreSnapshot() {
  return { benefitsPlans, benefitsElections };
}

/** Test-only: restore benefits store to seed state. */
export function resetBenefitsStoreForTests() {
  benefitsPlans.splice(0, benefitsPlans.length, ...structuredClone(seedBenefitsPlans));
  benefitsElections.splice(
    0,
    benefitsElections.length,
    ...structuredClone(seedBenefitsElections),
  );
}
