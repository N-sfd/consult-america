"use server";

import { revalidatePath } from "next/cache";

import { writeAuditLog } from "@/lib/self-service/audit-store";
import {
  cancelElection,
  submitElection,
} from "@/lib/self-service/benefits-store";
import {
  requireEmployeeActor,
  requirePermission,
  toActionErrorMessage,
} from "@/lib/self-service/security";
import type { BenefitsCoverageTier } from "@/types/self-service";

export type BenefitsActionResult = {
  ok: boolean;
  message: string;
};

function revalidateBenefitsPaths() {
  revalidatePath("/employee/benefits");
  revalidatePath("/employee");
}

export async function submitElectionAction(input: {
  planId: string;
  coverageTier: BenefitsCoverageTier;
  dependentCount: number;
  effectiveDate: string;
}): Promise<BenefitsActionResult> {
  try {
    const actor = await requireEmployeeActor();
    requirePermission(actor, "self.benefits.submit");

    const election = submitElection({
      employeeId: actor.session.employeeId,
      planId: input.planId,
      coverageTier: input.coverageTier,
      dependentCount: input.dependentCount,
      effectiveDate: input.effectiveDate,
    });

    writeAuditLog({
      eventType: "BENEFITS_ELECTION_SUBMITTED",
      actorEmployeeId: actor.session.employeeId,
      actorRole: "EMPLOYEE",
      targetEmployeeId: actor.session.employeeId,
      resourceType: "BENEFITS_ELECTION",
      resourceId: election.id,
      summary: `Elected benefits plan ${election.planId}`,
    });

    revalidateBenefitsPaths();
    return { ok: true, message: "Benefits election saved." };
  } catch (error) {
    return {
      ok: false,
      message: toActionErrorMessage(error, "Unable to save benefits election."),
    };
  }
}

export async function cancelElectionAction(input: {
  electionId: string;
}): Promise<BenefitsActionResult> {
  try {
    const actor = await requireEmployeeActor();
    requirePermission(actor, "self.benefits.submit");

    const election = cancelElection({
      electionId: input.electionId,
      employeeId: actor.session.employeeId,
    });

    writeAuditLog({
      eventType: "BENEFITS_ELECTION_CANCELLED",
      actorEmployeeId: actor.session.employeeId,
      actorRole: "EMPLOYEE",
      targetEmployeeId: actor.session.employeeId,
      resourceType: "BENEFITS_ELECTION",
      resourceId: election.id,
      summary: `Cancelled benefits plan ${election.planId}`,
    });

    revalidateBenefitsPaths();
    return { ok: true, message: "Election cancelled." };
  } catch (error) {
    return {
      ok: false,
      message: toActionErrorMessage(error, "Unable to cancel election."),
    };
  }
}
