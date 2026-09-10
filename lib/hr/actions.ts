"use server";

import { revalidatePath } from "next/cache";

import { seedBusinessUnits, seedDepartments } from "@/data/recruiting/seed";
import { convertAcceptedOfferToEmployee, hrRepository } from "@/lib/hr";
import { recruitingRepository } from "@/lib/recruiting";
import { canConvertToEmployee } from "@/lib/recruiting/status-machine";
import { requireHrActor, toActionErrorMessage } from "@/lib/self-service/security";
import { writeAuditEvent } from "@/lib/audit/audit-log";
import type { EmployeeProfile } from "@/types/hr";
import type { EmploymentType, WorkplaceType } from "@/types/organization";

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

  // Always call the hire transaction. The database reuses the employee and
  // onboarding record, and never trusts a manager id from the browser.
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

export type CreateEmployeeDirectInput = {
  firstName: string;
  lastName: string;
  preferredName?: string;
  personalEmail?: string;
  phone?: string;
  workEmail?: string;
  workPhone?: string;
  departmentId: string;
  positionId: string;
  locationId: string;
  managerEmployeeId?: string;
  employmentType: EmploymentType;
  workplaceType: WorkplaceType;
  startDate: string;
  employmentStatus?: EmployeeProfile["employmentStatus"];
  authorizationType?: string;
  authorizationExpirationDate?: string;
};

export type CreateEmployeeDirectResult =
  | { ok: true; employeeId: string; employeeNumber: string }
  | { ok: false; error: string };

/**
 * "+ Add Employee" — a direct administrative hire with no prior recruiting
 * record (contractor conversion, acquisition, legacy backfill). Distinct
 * from hireCandidate() above (the ATS accepted-offer path); does not create
 * or touch any candidate/application/offer record. EmployeeProfile already
 * treats candidateId/sourceApplicationId/sourceOfferId as optional for
 * exactly this case.
 */
export async function createEmployeeDirect(
  input: CreateEmployeeDirectInput,
): Promise<CreateEmployeeDirectResult> {
  try {
    const actor = await requireHrActor();

    // Same derivation as hireCandidate() above: legal entity/business unit
    // follow from the selected department rather than being chosen directly.
    const department = seedDepartments.find((d) => d.id === input.departmentId);
    const businessUnitId = department?.businessUnitId ?? "bu-corporate";
    const businessUnit = seedBusinessUnits.find((bu) => bu.id === businessUnitId);
    const legalEntityId = businessUnit?.legalEntityId ?? "le-ca-us";

    const employee = await hrRepository.createEmployee({
      firstName: input.firstName,
      lastName: input.lastName,
      personalEmail: input.personalEmail,
      phone: input.phone,
      hireDate: input.startDate,
      employmentStatus: input.employmentStatus ?? "ACTIVE",
      workEmail: input.workEmail,
      workPhone: input.workPhone,
    });

    if (input.preferredName) {
      await hrRepository.updateEmployeeContact(employee.id, {
        preferredName: input.preferredName,
      });
    }

    await hrRepository.createAssignment({
      employeeId: employee.id,
      legalEntityId,
      businessUnitId,
      departmentId: input.departmentId,
      positionId: input.positionId,
      locationId: input.locationId,
      managerEmployeeId: input.managerEmployeeId,
      employmentType: input.employmentType,
      workplaceType: input.workplaceType,
      startDate: input.startDate,
      changeReason: "Added directly by HR",
      primaryAssignment: true,
    });

    if (input.authorizationType || input.authorizationExpirationDate) {
      await hrRepository.upsertWorkAuthorization({
        employeeId: employee.id,
        authorizationType: input.authorizationType,
        authorizationExpirationDate: input.authorizationExpirationDate,
        updatedByUserId: actor.session.employeeId,
      });
    }

    await writeAuditEvent({
      eventType: "EMPLOYEE_CREATED",
      actorEmployeeId: actor.session.employeeId,
      actorRole: actor.role,
      targetEmployeeId: employee.id,
      resourceType: "employee_profile",
      resourceId: employee.id,
      summary: `Created employee ${employee.employeeNumber} (${employee.firstName} ${employee.lastName})`,
    });

    revalidatePath("/workforce/people");

    return { ok: true, employeeId: employee.id, employeeNumber: employee.employeeNumber };
  } catch (error) {
    return { ok: false, error: toActionErrorMessage(error, "Unable to add employee.") };
  }
}

export type ChangeEmployeeStatusResult = { ok: true } | { ok: false; error: string };

/** "Deactivate / Change Status" action on the People list and Employee Detail. */
export async function changeEmployeeStatusAction(
  employeeId: string,
  status: EmployeeProfile["employmentStatus"],
  effectiveDate: string,
  note?: string,
): Promise<ChangeEmployeeStatusResult> {
  try {
    const actor = await requireHrActor();

    await hrRepository.updateEmployeeStatus(employeeId, status, effectiveDate, note);

    await writeAuditEvent({
      eventType: "EMPLOYEE_STATUS_CHANGED",
      actorEmployeeId: actor.session.employeeId,
      actorRole: actor.role,
      targetEmployeeId: employeeId,
      resourceType: "employee_profile",
      resourceId: employeeId,
      summary: `Changed employment status to ${status}`,
      metadata: { status, effectiveDate, note },
    });

    revalidatePath("/workforce/people");
    revalidatePath(`/workforce/people/${employeeId}`);

    return { ok: true };
  } catch (error) {
    return { ok: false, error: toActionErrorMessage(error, "Unable to update status.") };
  }
}

export type UpdateEmployeeAssignmentInput = {
  employeeId: string;
  departmentId: string;
  positionId: string;
  locationId: string;
  managerEmployeeId?: string;
  employmentType: EmploymentType;
  workplaceType: WorkplaceType;
  startDate: string;
  changeReason?: string;
};

export type UpdateEmployeeAssignmentResult = { ok: true } | { ok: false; error: string };

/**
 * "Edit Employment" — creates a new, time-bounded assignment rather than
 * mutating the prior one in place, so promotion/transfer history is kept
 * (see types/hr.ts JobAssignment comment).
 */
export async function updateEmployeeAssignment(
  input: UpdateEmployeeAssignmentInput,
): Promise<UpdateEmployeeAssignmentResult> {
  try {
    const actor = await requireHrActor();

    const department = seedDepartments.find((d) => d.id === input.departmentId);
    const businessUnitId = department?.businessUnitId ?? "bu-corporate";
    const businessUnit = seedBusinessUnits.find((bu) => bu.id === businessUnitId);
    const legalEntityId = businessUnit?.legalEntityId ?? "le-ca-us";

    await hrRepository.createAssignment({
      employeeId: input.employeeId,
      legalEntityId,
      businessUnitId,
      departmentId: input.departmentId,
      positionId: input.positionId,
      locationId: input.locationId,
      managerEmployeeId: input.managerEmployeeId,
      employmentType: input.employmentType,
      workplaceType: input.workplaceType,
      startDate: input.startDate,
      changeReason: input.changeReason ?? "Employment details updated",
      primaryAssignment: true,
    });

    await writeAuditEvent({
      eventType: "EMPLOYEE_UPDATED",
      actorEmployeeId: actor.session.employeeId,
      actorRole: actor.role,
      targetEmployeeId: input.employeeId,
      resourceType: "employee_profile",
      resourceId: input.employeeId,
      summary: "Updated employment assignment",
    });

    revalidatePath(`/workforce/people/${input.employeeId}`);

    return { ok: true };
  } catch (error) {
    return { ok: false, error: toActionErrorMessage(error, "Unable to update employment.") };
  }
}

export type UpsertWorkAuthorizationActionInput = {
  employeeId: string;
  authorizationType?: string;
  authorizationExpirationDate?: string;
  verificationStatus?: "UNVERIFIED" | "PENDING" | "VERIFIED" | "EXPIRED";
  hrNotes?: string;
};

export type UpsertWorkAuthorizationActionResult = { ok: true } | { ok: false; error: string };

export async function upsertWorkAuthorizationAction(
  input: UpsertWorkAuthorizationActionInput,
): Promise<UpsertWorkAuthorizationActionResult> {
  try {
    const actor = await requireHrActor();

    await hrRepository.upsertWorkAuthorization({
      employeeId: input.employeeId,
      authorizationType: input.authorizationType,
      authorizationExpirationDate: input.authorizationExpirationDate,
      verificationStatus: input.verificationStatus,
      hrNotes: input.hrNotes,
      updatedByUserId: actor.session.employeeId,
    });

    await writeAuditEvent({
      eventType: "EMPLOYEE_UPDATED",
      actorEmployeeId: actor.session.employeeId,
      actorRole: actor.role,
      targetEmployeeId: input.employeeId,
      resourceType: "employee_work_authorization",
      resourceId: input.employeeId,
      summary: "Updated work authorization record",
    });

    revalidatePath(`/workforce/people/${input.employeeId}`);

    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      error: toActionErrorMessage(error, "Unable to update work authorization."),
    };
  }
}
