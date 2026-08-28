"use server";

import { revalidatePath } from "next/cache";

import { seedBusinessUnits, seedDepartments } from "@/data/recruiting/seed";
import { convertAcceptedOfferToEmployee } from "@/lib/hr/index";
import { recruitingRepository } from "@/lib/recruiting";
import { canConvertToEmployee } from "@/lib/recruiting/status-machine";

export type ConvertHireActionResult =
  | { ok: true; employeeNumber: string }
  | { ok: false; error: string };

/**
 * ATS pipeline "Convert to Employee" action. Resolves the legal entity /
 * business unit from the requisition's department (single-legal-entity
 * reference data, same seed used elsewhere in the ATS UI) so the recruiter
 * doesn't have to re-enter org placement that's already implied by the job.
 */
export async function convertHire(
  applicationId: string,
  requisitionId: string,
): Promise<ConvertHireActionResult> {
  const application = await recruitingRepository.getApplicationById(applicationId);
  if (!application) return { ok: false, error: "Application not found" };

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
      error: "Application must be in OFFER stage with an accepted offer",
    };
  }

  const [profile, requisition] = await Promise.all([
    recruitingRepository.getCandidateProfile(application.candidateId),
    recruitingRepository.getRequisitionById(requisitionId),
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

    // Set explicitly for both backends — the Supabase RPC sets HIRED
    // internally, but the in-memory repository never does, so this can't
    // be left as a side effect of one mode only.
    await recruitingRepository.updateApplicationStage(applicationId, "HIRED");

    revalidatePath(`/app/recruiting/jobs/${requisitionId}/pipeline`);
    revalidatePath(`/app/recruiting/jobs/${requisitionId}`);
    revalidatePath("/app/recruiting/candidates");

    return { ok: true, employeeNumber: result.employeeNumber };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Conversion failed",
    };
  }
}
