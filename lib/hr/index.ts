import { canConvertToEmployee } from "@/lib/recruiting/status-machine";
import { hrRepository } from "@/lib/hr/memory-repository";
import type { HireConversionResult } from "@/lib/recruiting/repository";
import type { EmploymentType, WorkplaceType } from "@/types/organization";
import type { ApplicationStatus, OfferStatus } from "@/types/recruiting";

export {
  formatEmployeeNumber,
  nextEmployeeNumber,
  parseEmployeeNumber,
} from "@/lib/hr/employee-number";

export { hrRepository } from "@/lib/hr/memory-repository";

export type ConvertHireParams = {
  applicationId: string;
  offerId: string;
  applicationStatus: ApplicationStatus;
  offerStatus: OfferStatus;
  candidateId: string;
  firstName: string;
  lastName: string;
  personalEmail: string;
  personalPhone?: string;
  startDate: string;
  legalEntityId: string;
  businessUnitId: string;
  departmentId: string;
  positionId: string;
  locationId: string;
  managerEmployeeId?: string;
  employmentType: EmploymentType;
  workplaceType: WorkplaceType;
  baseSalary?: number;
  hourlyRate?: number;
  currency?: string;
};

/**
 * Application -> Offer boundary.
 * Creates/reuses employee_profiles linked back to the candidate, never a
 * disconnected employee record.
 */
export async function convertAcceptedOfferToEmployee(
  params: ConvertHireParams,
): Promise<HireConversionResult> {
  if (
    !canConvertToEmployee({
      applicationStatus: params.applicationStatus,
      offerStatus: params.offerStatus,
    })
  ) {
    throw new Error(
      "Hire conversion requires application status OFFER and offer status ACCEPTED",
    );
  }

  const result = await hrRepository.convertAcceptedOffer({
    applicationId: params.applicationId,
    offerId: params.offerId,
    candidateId: params.candidateId,
    firstName: params.firstName,
    lastName: params.lastName,
    personalEmail: params.personalEmail,
    personalPhone: params.personalPhone,
    startDate: params.startDate,
    legalEntityId: params.legalEntityId,
    businessUnitId: params.businessUnitId,
    departmentId: params.departmentId,
    positionId: params.positionId,
    locationId: params.locationId,
    managerEmployeeId: params.managerEmployeeId,
    employmentType: params.employmentType,
    workplaceType: params.workplaceType,
  });

  if (params.baseSalary != null || params.hourlyRate != null) {
    await hrRepository.upsertCompensation({
      employeeId: result.employeeId,
      assignmentId: result.assignmentId,
      compensationType: params.hourlyRate != null ? "HOURLY" : "SALARY",
      annualSalary: params.baseSalary,
      hourlyRate: params.hourlyRate,
      currency: params.currency,
      effectiveStartDate: params.startDate,
      reason: "Hire from accepted offer",
    });
  }

  return result;
}

export async function getEmployeeDirectory() {
  const employees = await hrRepository.listEmployees();

  return Promise.all(
    employees.map(async (employee) => {
      const assignment = await hrRepository.getPrimaryAssignment(employee.id);

      return {
        employee,
        assignment,
      };
    }),
  );
}
