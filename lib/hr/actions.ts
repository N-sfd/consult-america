"use server";

import { revalidatePath } from "next/cache";

import { seedBusinessUnits, seedDepartments } from "@/data/recruiting/seed";
import { convertAcceptedOfferToEmployee, hrRepository } from "@/lib/hr/index";
import { recruitingRepository } from "@/lib/recruiting";
import { canConvertToEmployee } from "@/lib/recruiting/status-machine";

export type ConvertHireActionResult =
  | { ok: true; employeeId: string; employeeNumber: string }
  | { ok: false; error: string };

/**
 * Server-side hire transaction (idempotent).
 * Calling twice for the same accepted offer returns the same employee.
 */
export async function hireCandidate(
  applicationId: string,
  requisitionId?: string,
): Promise<ConvertHireActionResult> {
  const application = await recruitingRepository.getApplicationById(applicationId);
  if (!application) return { ok: false, error: "Application not found" };

  if (requisitionId && requisitionId !== application.requisitionId) {
    return { ok: false, error: "Requisition does not match the application" };
  }

  const resolvedRequisitionId = application.requisitionId;

  const offer = await recruitingRepository.getOfferByApplicationId(applicationId);
  if (!offer) return { ok: false, error: "No offer found for this application" };

  if (
    !canConvertToEmployee({
      applicationStatus: application.status,
      offerStatus: offer.status,
    })
  ) {
    return {
      ok: false,
      error: "Application must be in OFFER (or HIRED) with an accepted offer",
    };
  }

  // Idempotent short-circuit: employee already linked to this offer.
  const existingEmployees = await hrRepository.listEmployees();
  const existing = existingEmployees.find((e) => e.sourceOfferId === offer.id);
  if (existing) {
    if (application.status !== "HIRED") {
      await recruitingRepository.updateApplicationStage(applicationId, "HIRED");
    }
    revalidatePath(`/app/recruiting/jobs/${resolvedRequisitionId}/pipeline`);
    revalidatePath("/workforce/people");
    return {
      ok: true,
      employeeId: existing.id,
      employeeNumber: existing.employeeNumber,
    };
  }

  const [profile, requisition] = await Promise.all([
    recruitingRepository.getCandidateProfile(application.candidateId),
    recruitingRepository.getRequisitionById(resolvedRequisitionId),
  ]);
  if (!profile) return { ok: false, error: "Candidate not found" };
  if (!requisition) return { ok: false, error: "Requisition not found" };

  const department = seedDepartments.find((d) => d.id === requisition.departmentId);
  const businessUnitId = department?.businessUnitId ?? "bu-corporate";
  const businessUnit = seedBusinessUnits.find((bu) => bu.id === businessUnitId);
  const legalEntityId = businessUnit?.legalEntityId ?? "le-ca-us";

  try {
    const result = await convertAcceptedOfferToEmployee({
      applicationId,
      offerId: offer.id,
      applicationStatus: application.status,
      offerStatus: offer.status,
      candidateId: application.candidateId,
      firstName: profile.candidate.firstName,
      lastName: profile.candidate.lastName,
      personalEmail: profile.candidate.email,
      personalPhone: profile.candidate.phone,
      startDate: offer.startDate,
      legalEntityId,
      businessUnitId,
      departmentId: requisition.departmentId,
      positionId: requisition.positionId,
      locationId: requisition.locationId,
      employmentType: offer.employmentType,
      workplaceType: offer.workplaceType,
      baseSalary: offer.baseSalary,
      hourlyRate: offer.hourlyRate,
      currency: offer.currency,
    });

    // RPC already sets HIRED + history; memory path may not — keep both consistent.
    await recruitingRepository.updateApplicationStage(applicationId, "HIRED");

    revalidatePath(`/app/recruiting/jobs/${resolvedRequisitionId}/pipeline`);
    revalidatePath(`/app/recruiting/jobs/${resolvedRequisitionId}`);
    revalidatePath("/app/recruiting/candidates");
    revalidatePath("/workforce/people");
    revalidatePath(`/app/recruiting/candidates/${application.candidateId}`);

    return {
      ok: true,
      employeeId: result.employeeId,
      employeeNumber: result.employeeNumber,
    };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Conversion failed",
    };
  }
}

/**
 * ATS pipeline "Convert to Employee" action — delegates to hireCandidate.
 */
export async function convertHire(
  applicationId: string,
  requisitionId: string,
): Promise<ConvertHireActionResult> {
  return hireCandidate(applicationId, requisitionId);
}
