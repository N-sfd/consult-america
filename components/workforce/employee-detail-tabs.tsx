"use client";

import { useActionState, useState } from "react";
import Link from "next/link";

import { Tabs, TabsList, TabsPanel, TabsTab } from "@/components/ui/tabs";
import { EmployeeStatusBadge, VerificationStatusBadge } from "@/components/workforce/status-badges";
import {
  archiveEmployeeDocumentAction,
  getEmployeeDocumentUrlAction,
  uploadEmployeeDocumentAction,
} from "@/lib/documents/employee-document-actions";
import {
  documentVisibilityLabels,
  employeeDocumentTypeLabels,
  type EmployeeDocumentRow,
  type EmployeeDocumentType,
  type EmployeeDocumentVisibility,
} from "@/lib/documents/employee-documents-service";
import { changeEmployeeStatusAction, upsertWorkAuthorizationAction } from "@/lib/hr/actions";
import type { EmployeeWorkAuthorization } from "@/lib/hr/repository";
import type { CompensationRecord, EmployeeStatusHistory, EmployeeStatus, HrEvent, JobAssignment, OnboardingRecord, OnboardingTask } from "@/types/hr";
import { employeeStatusLabels } from "@/types/hr";
import type { EmployeeProfileView } from "@/lib/self-service";
import { getLeaveTypeById } from "@/lib/self-service/leave-store";
import type { HrRequest, LeaveBalance, LeaveRequest, Timesheet } from "@/types/self-service";
import { seedDepartments, seedLocations, seedPositions } from "@/data/recruiting/seed";
import { employmentTypeLabels, workplaceTypeLabels } from "@/types/organization";

const WORK_AUTHORIZATION_TYPES = [
  "US Citizen",
  "Permanent Resident",
  "H-1B",
  "H-4 EAD",
  "F-1 OPT",
  "F-1 STEM OPT",
  "L-1",
  "Other",
];

const DOCUMENT_TYPES: { value: EmployeeDocumentType; label: string }[] = (
  Object.entries(employeeDocumentTypeLabels) as [EmployeeDocumentType, string][]
).map(([value, label]) => ({ value, label }));

const DOCUMENT_VISIBILITIES: { value: EmployeeDocumentVisibility; label: string }[] = (
  Object.entries(documentVisibilityLabels) as [EmployeeDocumentVisibility, string][]
).map(([value, label]) => ({ value, label }));

function formatDate(value?: string) {
  if (!value) return "—";
  const dateOnly = /^\d{4}-\d{2}-\d{2}$/.test(value);
  const date = dateOnly ? new Date(`${value}T00:00:00`) : new Date(value);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

const cardClass = "rounded-xl border border-black/10 bg-white p-6 shadow-sm";
const labelClass = "text-[0.7rem] uppercase tracking-[0.12em] text-black/40";
const fieldClass =
  "mt-1.5 h-9 w-full rounded-md border border-black/10 bg-white px-3 text-sm outline-none focus:border-[var(--ca-blue)]";

function resolveAssignmentLabels(assignment: JobAssignment) {
  return {
    positionTitle: seedPositions.find((p) => p.id === assignment.positionId)?.title ?? "—",
    departmentName: seedDepartments.find((d) => d.id === assignment.departmentId)?.name ?? "—",
    locationName: seedLocations.find((l) => l.id === assignment.locationId)?.name ?? "—",
  };
}

export default function EmployeeDetailTabs({
  profile,
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
}: {
  profile: EmployeeProfileView;
  onboarding: { record?: OnboardingRecord; tasks: OnboardingTask[]; percentComplete: number };
  assignments: JobAssignment[];
  statusHistory: EmployeeStatusHistory[];
  hrEvents: HrEvent[];
  workAuthorization: EmployeeWorkAuthorization | null;
  compensation: CompensationRecord | null;
  documents: EmployeeDocumentRow[];
  timesheets: Timesheet[];
  leaveRequests: LeaveRequest[];
  leaveBalances: LeaveBalance[];
  hrRequests: HrRequest[];
}) {
  const { employee, person } = profile;

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-6 lg:px-8 lg:py-8">
      <p className={labelClass}>People</p>
      <div className="mt-2 flex flex-wrap items-center gap-3">
        <h1 className="font-serif text-2xl font-semibold tracking-[-0.03em]">
          {person.firstName} {person.lastName}
        </h1>
        <EmployeeStatusBadge status={employee.employmentStatus} />
      </div>
      <p className="mt-1 text-sm text-black/50">
        {employee.employeeNumber} · {profile.positionTitle || "No title assigned"}
      </p>

      <Tabs defaultValue="overview" className="mt-8">
        <TabsList className="flex-wrap">
          <TabsTab value="overview">Overview</TabsTab>
          <TabsTab value="employment">Employment</TabsTab>
          <TabsTab value="assignments">Assignments</TabsTab>
          <TabsTab value="documents">Documents</TabsTab>
          <TabsTab value="onboarding">Onboarding</TabsTab>
          <TabsTab value="time-leave">Time &amp; Leave</TabsTab>
          <TabsTab value="hr-requests">HR Requests</TabsTab>
          <TabsTab value="compensation">Compensation</TabsTab>
          <TabsTab value="activity">Activity</TabsTab>
        </TabsList>

        <TabsPanel value="overview">
          <OverviewPanel
            profile={profile}
            workAuthorization={workAuthorization}
            onboarding={onboarding}
            documents={documents}
            hrRequests={hrRequests}
          />
        </TabsPanel>

        <TabsPanel value="employment">
          <EmploymentPanel
            profile={profile}
            workAuthorization={workAuthorization}
            employeeId={employee.id}
          />
        </TabsPanel>

        <TabsPanel value="assignments">
          <AssignmentsPanel assignments={assignments} />
        </TabsPanel>

        <TabsPanel value="documents">
          <DocumentsPanel employeeId={employee.id} documents={documents} />
        </TabsPanel>

        <TabsPanel value="onboarding">
          <OnboardingPanel onboarding={onboarding} />
        </TabsPanel>

        <TabsPanel value="time-leave">
          <TimeLeavePanel timesheets={timesheets} leaveRequests={leaveRequests} leaveBalances={leaveBalances} />
        </TabsPanel>

        <TabsPanel value="hr-requests">
          <HrRequestsPanel requests={hrRequests} />
        </TabsPanel>

        <TabsPanel value="compensation">
          <CompensationPanel compensation={compensation} />
        </TabsPanel>

        <TabsPanel value="activity">
          <ActivityPanel hrEvents={hrEvents} statusHistory={statusHistory} />
        </TabsPanel>
      </Tabs>

      <div className="mt-8 flex items-center justify-between">
        <Link href="/workforce/people" className="text-sm text-[var(--ca-blue)] hover:underline">
          ← Back to People
        </Link>
        <DeactivateAction employeeId={employee.id} currentStatus={employee.employmentStatus} />
      </div>
    </div>
  );
}

function OverviewPanel({
  profile,
  workAuthorization,
  onboarding,
  documents,
  hrRequests,
}: {
  profile: EmployeeProfileView;
  workAuthorization: EmployeeWorkAuthorization | null;
  onboarding: { percentComplete: number; record?: OnboardingRecord };
  documents: EmployeeDocumentRow[];
  hrRequests: HrRequest[];
}) {
  const { employee, person } = profile;
  const pendingAcks = documents.filter(
    (doc) => doc.requiresAcknowledgement && !doc.acknowledgedAt,
  ).length;
  const openHr = hrRequests.filter(
    (req) =>
      req.status === "OPEN" ||
      req.status === "IN_PROGRESS" ||
      req.status === "WAITING_FOR_EMPLOYEE",
  ).length;

  const fields: [string, string][] = [
    ["Email", person.personalEmail || employee.workEmail || "—"],
    ["Phone", person.personalPhone || "—"],
    ["Current role", profile.positionTitle || "—"],
    ["Department", profile.departmentName || "—"],
    ["Manager", profile.managerName || "Pending"],
    ["Location", profile.locationName || "—"],
    ["Employment type", profile.employmentTypeLabel || "—"],
    ["Start Date", formatDate(employee.startDate || profile.assignment?.startDate)],
    ["Employment Status", profile.statusLabel],
    ["Work Authorization", workAuthorization?.authorizationType || "Not specified"],
    [
      "Onboarding",
      onboarding.record
        ? `${onboarding.record.status.replaceAll("_", " ").toLowerCase()} · ${onboarding.percentComplete}%`
        : "—",
    ],
    ["Pending document acknowledgments", String(pendingAcks)],
    ["Open HR requests", String(openHr)],
  ];

  return (
    <div className="space-y-4">
      <dl className={`${cardClass} grid gap-4 sm:grid-cols-2`}>
        {fields.map(([label, value]) => (
          <div key={label}>
            <dt className={labelClass}>{label}</dt>
            <dd className="mt-1 text-sm text-black/80">{value}</dd>
          </div>
        ))}
      </dl>
      <div className={`${cardClass} flex flex-wrap gap-2`}>
        <Link
          href={`?tab=documents`}
          className="rounded-md border border-black/15 px-3 py-1.5 text-sm font-medium text-black/70"
        >
          Documents
        </Link>
        <Link
          href={`?tab=onboarding`}
          className="rounded-md border border-black/15 px-3 py-1.5 text-sm font-medium text-black/70"
        >
          Onboarding
        </Link>
        <Link
          href={`?tab=hr-requests`}
          className="rounded-md border border-black/15 px-3 py-1.5 text-sm font-medium text-black/70"
        >
          HR Requests
        </Link>
        <Link
          href={`?tab=time-leave`}
          className="rounded-md border border-black/15 px-3 py-1.5 text-sm font-medium text-black/70"
        >
          Time &amp; Leave
        </Link>
      </div>
    </div>
  );
}

function EmploymentPanel({
  profile,
  workAuthorization,
  employeeId,
}: {
  profile: EmployeeProfileView;
  workAuthorization: EmployeeWorkAuthorization | null;
  employeeId: string;
}) {
  const assignment = profile.assignment;
  return (
    <div className="space-y-6">
      <div className={cardClass}>
        <h2 className="font-serif text-lg font-semibold">Current Assignment</h2>
        <dl className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <dt className={labelClass}>Job Title</dt>
            <dd className="mt-1 text-sm text-black/80">{profile.positionTitle || "—"}</dd>
          </div>
          <div>
            <dt className={labelClass}>Department</dt>
            <dd className="mt-1 text-sm text-black/80">{profile.departmentName || "—"}</dd>
          </div>
          <div>
            <dt className={labelClass}>Location</dt>
            <dd className="mt-1 text-sm text-black/80">{profile.locationName || "—"}</dd>
          </div>
          <div>
            <dt className={labelClass}>Manager</dt>
            <dd className="mt-1 text-sm text-black/80">{profile.managerName || "Pending"}</dd>
          </div>
          <div>
            <dt className={labelClass}>Employment Type</dt>
            <dd className="mt-1 text-sm text-black/80">{profile.employmentTypeLabel || "—"}</dd>
          </div>
          <div>
            <dt className={labelClass}>Workplace</dt>
            <dd className="mt-1 text-sm text-black/80">{profile.workplaceTypeLabel || "—"}</dd>
          </div>
          <div>
            <dt className={labelClass}>Effective Since</dt>
            <dd className="mt-1 text-sm text-black/80">{formatDate(assignment?.startDate)}</dd>
          </div>
        </dl>
      </div>

      <WorkAuthorizationCard employeeId={employeeId} workAuthorization={workAuthorization} />
    </div>
  );
}

function WorkAuthorizationCard({
  employeeId,
  workAuthorization,
}: {
  employeeId: string;
  workAuthorization: EmployeeWorkAuthorization | null;
}) {
  const [state, formAction, pending] = useActionState(
    async (_prev: { ok: boolean; error?: string } | null, formData: FormData) => {
      const result = await upsertWorkAuthorizationAction({
        employeeId,
        authorizationType: (formData.get("authorizationType") as string) || undefined,
        authorizationExpirationDate: (formData.get("authorizationExpirationDate") as string) || undefined,
        verificationStatus: formData.get("verificationStatus") as EmployeeWorkAuthorization["verificationStatus"],
        hrNotes: (formData.get("hrNotes") as string) || undefined,
      });
      return result.ok ? { ok: true } : { ok: false, error: result.error };
    },
    null,
  );

  return (
    <div className={cardClass}>
      <h2 className="font-serif text-lg font-semibold">Work Authorization</h2>
      <p className="mt-1 text-sm text-black/50">
        Operational tracking only — visible to HR and System Administration.
      </p>
      {state?.error ? (
        <p className="mt-3 text-sm text-[var(--ca-error)]">{state.error}</p>
      ) : null}
      <form action={formAction} className="mt-4 grid gap-4 sm:grid-cols-2">
        <label>
          <span className={labelClass}>Authorization Type</span>
          <select
            name="authorizationType"
            defaultValue={workAuthorization?.authorizationType ?? ""}
            className={fieldClass}
          >
            <option value="">Not specified</option>
            {WORK_AUTHORIZATION_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span className={labelClass}>Expiration Date</span>
          <input
            name="authorizationExpirationDate"
            type="date"
            defaultValue={workAuthorization?.authorizationExpirationDate ?? ""}
            className={fieldClass}
          />
        </label>
        <label>
          <span className={labelClass}>Verification Status</span>
          <select
            name="verificationStatus"
            defaultValue={workAuthorization?.verificationStatus ?? "UNVERIFIED"}
            className={fieldClass}
          >
            <option value="UNVERIFIED">Unverified</option>
            <option value="PENDING">Pending</option>
            <option value="VERIFIED">Verified</option>
            <option value="EXPIRED">Expired</option>
          </select>
        </label>
        <div>
          <span className={labelClass}>Current Status</span>
          <div className="mt-1.5">
            <VerificationStatusBadge status={workAuthorization?.verificationStatus ?? "UNVERIFIED"} />
          </div>
        </div>
        <label className="sm:col-span-2">
          <span className={labelClass}>HR Notes (HR-only)</span>
          <textarea
            name="hrNotes"
            defaultValue={workAuthorization?.hrNotes ?? ""}
            rows={3}
            className="mt-1.5 w-full rounded-md border border-black/10 bg-white px-3 py-2 text-sm outline-none focus:border-[var(--ca-blue)]"
          />
        </label>
        <div className="sm:col-span-2">
          <button
            type="submit"
            disabled={pending}
            className="rounded-md bg-[var(--ca-navy)] px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
          >
            {pending ? "Saving…" : "Save Work Authorization"}
          </button>
        </div>
      </form>
    </div>
  );
}

function AssignmentsPanel({ assignments }: { assignments: JobAssignment[] }) {
  if (assignments.length === 0) {
    return <div className={`${cardClass} text-sm text-black/45`}>No assignment history yet.</div>;
  }
  return (
    <div className={`${cardClass} overflow-x-auto`}>
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead className="border-b border-black/10 text-[0.7rem] uppercase tracking-[0.1em] text-black/40">
          <tr>
            <th className="py-2 pr-4 font-medium">Job Title</th>
            <th className="py-2 pr-4 font-medium">Department</th>
            <th className="py-2 pr-4 font-medium">Location</th>
            <th className="py-2 pr-4 font-medium">Type</th>
            <th className="py-2 pr-4 font-medium">Start</th>
            <th className="py-2 pr-4 font-medium">End</th>
            <th className="py-2 font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          {assignments.map((assignment) => {
            const labels = resolveAssignmentLabels(assignment);
            return (
              <tr key={assignment.id} className="border-b border-black/5 last:border-b-0">
                <td className="py-2 pr-4">{labels.positionTitle}</td>
                <td className="py-2 pr-4 text-black/70">{labels.departmentName}</td>
                <td className="py-2 pr-4 text-black/70">{labels.locationName}</td>
                <td className="py-2 pr-4 text-black/70">
                  {employmentTypeLabels[assignment.employmentType]} · {workplaceTypeLabels[assignment.workplaceType]}
                </td>
                <td className="py-2 pr-4 text-black/70">{formatDate(assignment.startDate)}</td>
                <td className="py-2 pr-4 text-black/70">{formatDate(assignment.endDate)}</td>
                <td className="py-2 text-black/70">{assignment.assignmentStatus}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function DocumentsPanel({
  employeeId,
  documents,
}: {
  employeeId: string;
  documents: EmployeeDocumentRow[];
}) {
  const [uploadState, uploadFormAction, uploadPending] = useActionState(
    async (_prev: { ok: boolean; error?: string } | null, formData: FormData) => {
      formData.set("employeeId", employeeId);
      const result = await uploadEmployeeDocumentAction(formData);
      return result.ok ? { ok: true } : { ok: false, error: result.error };
    },
    null,
  );

  async function handleView(documentId: string) {
    const result = await getEmployeeDocumentUrlAction(documentId);
    if (result.ok) window.open(result.signedUrl, "_blank", "noopener,noreferrer");
  }

  async function handleArchive(documentId: string) {
    await archiveEmployeeDocumentAction(employeeId, documentId);
  }

  return (
    <div className="space-y-6">
      <div className={cardClass}>
        <h2 className="font-serif text-lg font-semibold">Upload Document</h2>
        {uploadState?.error ? (
          <p className="mt-2 text-sm text-[var(--ca-error)]">{uploadState.error}</p>
        ) : null}
        <form action={uploadFormAction} className="mt-4 flex flex-wrap items-end gap-3">
          <label>
            <span className={labelClass}>Document Type</span>
            <select name="documentType" className={fieldClass} defaultValue="OTHER">
              {DOCUMENT_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span className={labelClass}>Visibility</span>
            <select name="visibility" className={fieldClass} defaultValue="HR_ONLY">
              {DOCUMENT_VISIBILITIES.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span className={labelClass}>File</span>
            <input name="file" type="file" required className="mt-1.5 block text-sm" />
          </label>
          <label className="flex items-center gap-2 pb-2 text-sm">
            <input name="requiresAcknowledgement" type="checkbox" />
            Requires acknowledgement
          </label>
          <button
            type="submit"
            disabled={uploadPending}
            className="h-9 rounded-md bg-[var(--ca-navy)] px-4 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
          >
            {uploadPending ? "Uploading…" : "Upload"}
          </button>
        </form>
      </div>

      <div className={cardClass}>
        <h2 className="font-serif text-lg font-semibold">Documents on File</h2>
        {documents.length === 0 ? (
          <p className="mt-3 text-sm text-black/45">No documents on file.</p>
        ) : (
          <table className="mt-4 w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-black/10 text-[0.7rem] uppercase tracking-[0.1em] text-black/40">
              <tr>
                <th className="py-2 pr-4 font-medium">Document Type</th>
                <th className="py-2 pr-4 font-medium">File Name</th>
                <th className="py-2 pr-4 font-medium">Uploaded</th>
                <th className="py-2 pr-4 font-medium">Expiration</th>
                <th className="py-2 pr-4 font-medium">Status</th>
                <th className="py-2 pr-4 font-medium">Visibility</th>
                <th className="py-2 pr-4 font-medium">Acknowledgment</th>
                <th className="py-2 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {documents.map((doc) => (
                <tr key={doc.id} className="border-b border-black/5 last:border-b-0">
                  <td className="py-2 pr-4">{doc.documentType.replaceAll("_", " ")}</td>
                  <td className="py-2 pr-4 text-black/70">{doc.fileName}</td>
                  <td className="py-2 pr-4 text-black/70">{formatDate(doc.uploadedAt)}</td>
                  <td className="py-2 pr-4 text-black/70">{formatDate(doc.expirationDate)}</td>
                  <td className="py-2 pr-4 text-black/70">{doc.status}</td>
                  <td className="py-2 pr-4 text-black/70">{documentVisibilityLabels[doc.visibility]}</td>
                  <td className="py-2 pr-4 text-black/70">
                    {doc.requiresAcknowledgement
                      ? doc.acknowledgedAt
                        ? `Acknowledged ${formatDate(doc.acknowledgedAt)}`
                        : "Required"
                      : "—"}
                  </td>
                  <td className="py-2">
                    <button
                      type="button"
                      onClick={() => handleView(doc.id)}
                      className="mr-3 text-[var(--ca-blue)] hover:underline"
                    >
                      View
                    </button>
                    {doc.status === "ACTIVE" ? (
                      <button
                        type="button"
                        onClick={() => handleArchive(doc.id)}
                        className="text-black/50 hover:underline"
                      >
                        Archive
                      </button>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function OnboardingPanel({
  onboarding,
}: {
  onboarding: { record?: OnboardingRecord; tasks: OnboardingTask[]; percentComplete: number };
}) {
  if (!onboarding.record) {
    return <div className={`${cardClass} text-sm text-black/45`}>No onboarding record.</div>;
  }
  return (
    <div className={cardClass}>
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-lg font-semibold">Onboarding</h2>
        <span className="text-sm text-black/55">{onboarding.percentComplete}% complete</span>
      </div>
      <ul className="mt-4 divide-y divide-black/5">
        {onboarding.tasks.map((task) => (
          <li key={task.id} className="flex items-center justify-between py-2 text-sm">
            <span className="text-black/80">{task.title}</span>
            <span className="text-black/50">{task.status.replaceAll("_", " ").toLowerCase()}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function TimeLeavePanel({
  timesheets,
  leaveRequests,
  leaveBalances,
}: {
  timesheets: Timesheet[];
  leaveRequests: LeaveRequest[];
  leaveBalances: LeaveBalance[];
}) {
  return (
    <div className="space-y-6">
      <div className={cardClass}>
        <h2 className="font-serif text-lg font-semibold">Recent Timesheets</h2>
        {timesheets.length === 0 ? (
          <p className="mt-3 text-sm text-black/45">No timesheets on file.</p>
        ) : (
          <ul className="mt-4 divide-y divide-black/5">
            {timesheets.slice(0, 8).map((sheet) => (
              <li key={sheet.id} className="flex items-center justify-between py-2 text-sm">
                <span className="text-black/80">
                  {formatDate(sheet.periodStart)} – {formatDate(sheet.periodEnd)}
                </span>
                <span className="text-black/50">
                  {sheet.totalHours}h · {sheet.status.toLowerCase()}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className={cardClass}>
        <h2 className="font-serif text-lg font-semibold">Leave Balances</h2>
        {leaveBalances.length === 0 ? (
          <p className="mt-3 text-sm text-black/45">No leave balances on file.</p>
        ) : (
          <dl className="mt-4 grid gap-4 sm:grid-cols-3">
            {leaveBalances.map((balance) => (
              <div key={balance.id}>
                <dt className={labelClass}>{getLeaveTypeById(balance.leaveTypeId)?.name ?? "Leave"}</dt>
                <dd className="mt-1 text-sm text-black/80">{balance.available}h available</dd>
              </div>
            ))}
          </dl>
        )}
      </div>

      <div className={cardClass}>
        <h2 className="font-serif text-lg font-semibold">Leave Requests</h2>
        {leaveRequests.length === 0 ? (
          <p className="mt-3 text-sm text-black/45">No leave requests on file.</p>
        ) : (
          <ul className="mt-4 divide-y divide-black/5">
            {leaveRequests.slice(0, 8).map((request) => (
              <li key={request.id} className="flex items-center justify-between py-2 text-sm">
                <span className="text-black/80">
                  {formatDate(request.startDate)} – {formatDate(request.endDate)}
                </span>
                <span className="text-black/50">{request.status.toLowerCase()}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function HrRequestsPanel({ requests }: { requests: HrRequest[] }) {
  if (requests.length === 0) {
    return <div className={`${cardClass} text-sm text-black/45`}>No HR requests on file.</div>;
  }
  return (
    <div className={cardClass}>
      <ul className="divide-y divide-black/5">
        {requests.map((request) => (
          <li key={request.id} className="flex items-center justify-between py-3 text-sm">
            <div>
              <p className="font-medium text-black/80">{request.subject}</p>
              <p className="text-black/45">{request.requestNumber} · {request.category.replaceAll("_", " ").toLowerCase()}</p>
            </div>
            <span className="text-black/50">{request.status.toLowerCase()}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function CompensationPanel({ compensation }: { compensation: CompensationRecord | null }) {
  if (!compensation) {
    return <div className={`${cardClass} text-sm text-black/45`}>No active compensation record.</div>;
  }
  return (
    <dl className={`${cardClass} grid gap-4 sm:grid-cols-2`}>
      <div>
        <dt className={labelClass}>Type</dt>
        <dd className="mt-1 text-sm text-black/80">{compensation.compensationType}</dd>
      </div>
      <div>
        <dt className={labelClass}>
          {compensation.compensationType === "HOURLY" ? "Hourly Rate" : "Annual Salary"}
        </dt>
        <dd className="mt-1 text-sm text-black/80">
          {compensation.currency}{" "}
          {(compensation.compensationType === "HOURLY"
            ? compensation.hourlyRate
            : compensation.annualSalary
          )?.toLocaleString() ?? "—"}
        </dd>
      </div>
      <div>
        <dt className={labelClass}>Effective Since</dt>
        <dd className="mt-1 text-sm text-black/80">{formatDate(compensation.effectiveStartDate)}</dd>
      </div>
      <div>
        <dt className={labelClass}>Reason</dt>
        <dd className="mt-1 text-sm text-black/80">{compensation.reason || "—"}</dd>
      </div>
    </dl>
  );
}

function ActivityPanel({
  hrEvents,
  statusHistory,
}: {
  hrEvents: HrEvent[];
  statusHistory: EmployeeStatusHistory[];
}) {
  const items = [
    ...hrEvents.map((event) => ({
      id: event.id,
      date: event.effectiveDate,
      summary: event.summary,
      detail: event.eventType.replaceAll("_", " ").toLowerCase(),
    })),
    ...statusHistory.map((history) => ({
      id: history.id,
      date: history.effectiveDate,
      summary: `Status changed to ${employeeStatusLabels[history.toStatus]}`,
      detail: history.note || "",
    })),
  ].sort((a, b) => b.date.localeCompare(a.date));

  if (items.length === 0) {
    return <div className={`${cardClass} text-sm text-black/45`}>No activity recorded yet.</div>;
  }

  return (
    <div className={cardClass}>
      <ul className="divide-y divide-black/5">
        {items.map((item) => (
          <li key={item.id} className="py-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="font-medium text-black/80">{item.summary}</span>
              <span className="text-black/45">{formatDate(item.date)}</span>
            </div>
            {item.detail ? <p className="mt-1 text-black/50">{item.detail}</p> : null}
          </li>
        ))}
      </ul>
    </div>
  );
}

function DeactivateAction({
  employeeId,
  currentStatus,
}: {
  employeeId: string;
  currentStatus: EmployeeStatus;
}) {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(
    async (_prev: { ok: boolean; error?: string } | null, formData: FormData) => {
      const result = await changeEmployeeStatusAction(
        employeeId,
        formData.get("status") as EmployeeStatus,
        String(formData.get("effectiveDate") ?? new Date().toISOString().slice(0, 10)),
        (formData.get("note") as string) || undefined,
      );
      if (result.ok) setOpen(false);
      return result.ok ? { ok: true } : { ok: false, error: result.error };
    },
    null,
  );

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-md border border-black/15 px-3 py-1.5 text-sm font-medium text-black/70 hover:bg-black/[0.03]"
      >
        Deactivate / Change Status
      </button>
    );
  }

  return (
    <form action={formAction} className="flex flex-wrap items-end gap-3">
      {state?.error ? <p className="w-full text-sm text-[var(--ca-error)]">{state.error}</p> : null}
      <label>
        <span className={labelClass}>New Status</span>
        <select name="status" defaultValue={currentStatus} className={fieldClass}>
          {Object.entries(employeeStatusLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </label>
      <label>
        <span className={labelClass}>Effective Date</span>
        <input
          name="effectiveDate"
          type="date"
          defaultValue={new Date().toISOString().slice(0, 10)}
          className={fieldClass}
        />
      </label>
      <label>
        <span className={labelClass}>Note</span>
        <input name="note" className={fieldClass} />
      </label>
      <button
        type="submit"
        disabled={pending}
        className="h-9 rounded-md bg-[var(--ca-navy)] px-4 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
      >
        {pending ? "Saving…" : "Save"}
      </button>
      <button
        type="button"
        onClick={() => setOpen(false)}
        className="h-9 rounded-md px-3 text-sm text-black/50 hover:underline"
      >
        Cancel
      </button>
    </form>
  );
}
