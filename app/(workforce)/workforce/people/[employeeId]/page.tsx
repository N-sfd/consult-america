import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { hrRepository } from "@/lib/hr";
import { getEmployeeOnboarding, getEmployeeProfile } from "@/lib/self-service";
import { requireHrActor } from "@/lib/self-service/security";
import { listHrRequestsForEmployee } from "@/lib/self-service/hr-request-store";
import { listLeaveBalances, listLeaveRequests } from "@/lib/self-service/leave-store";
import { listTimesheets } from "@/lib/self-service/time-store";
import { getEmployeeDocuments } from "@/lib/documents/employee-documents-service";
import EmployeeDetailTabs from "@/components/workforce/employee-detail-tabs";

export const metadata: Metadata = { title: "Employee" };

export default async function Page({
  params,
}: {
  params: Promise<{ employeeId: string }>;
}) {
  await requireHrActor();
  const { employeeId } = await params;

  const profile = await getEmployeeProfile(employeeId);
  if (!profile) notFound();

  const [
    onboarding,
    assignments,
    statusHistory,
    hrEvents,
    workAuthorization,
    compensation,
    documents,
    timesheets,
    leaveRequests,
    leaveBalances,
    hrRequests,
  ] = await Promise.all([
    getEmployeeOnboarding(employeeId),
    hrRepository.listAssignments(employeeId),
    hrRepository.listStatusHistory(employeeId),
    hrRepository.listHrEvents(employeeId),
    hrRepository.getWorkAuthorization(employeeId),
    hrRepository.getActiveCompensation(employeeId),
    getEmployeeDocuments(employeeId, { includeArchived: true }),
    listTimesheets(employeeId),
    listLeaveRequests(employeeId),
    listLeaveBalances(employeeId),
    listHrRequestsForEmployee(employeeId),
  ]);

  return (
    <EmployeeDetailTabs
      profile={profile}
      onboarding={onboarding}
      assignments={assignments}
      statusHistory={statusHistory}
      hrEvents={hrEvents}
      workAuthorization={workAuthorization ?? null}
      compensation={compensation ?? null}
      documents={documents}
      timesheets={timesheets}
      leaveRequests={leaveRequests}
      leaveBalances={leaveBalances}
      hrRequests={hrRequests}
    />
  );
}
