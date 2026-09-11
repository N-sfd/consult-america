import type { Metadata } from "next";
import Link from "next/link";

import PeopleFiltersBar, {
  type PeopleFilters,
} from "@/components/workforce/people-filters";
import { EmployeeStatusBadge } from "@/components/workforce/status-badges";
import { getEmployeeDocuments } from "@/lib/documents/employee-documents-service";
import { hrRepository } from "@/lib/hr";
import { getEmployeeOnboarding } from "@/lib/self-service";
import { requireHrActor } from "@/lib/self-service/security";
import { employeeStatusLabels, type EmployeeStatus } from "@/types/hr";
import { seedDepartments, seedLocations, seedPositions } from "@/data/recruiting/seed";

export const metadata: Metadata = { title: "People" };
export const dynamic = "force-dynamic";

type SearchParams = Promise<{
  q?: string;
  department?: string;
  location?: string;
  status?: string;
  manager?: string;
  workAuth?: string;
  startFrom?: string;
  startTo?: string;
  sort?: string;
}>;

function formatDate(value?: string) {
  if (!value) return "—";
  const dateOnly = /^\d{4}-\d{2}-\d{2}$/.test(value);
  const date = dateOnly ? new Date(`${value}T00:00:00`) : new Date(value);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function resolvePositionTitle(positionId?: string) {
  return positionId ? seedPositions.find((p) => p.id === positionId)?.title : undefined;
}
function resolveDepartmentName(departmentId?: string) {
  return departmentId ? seedDepartments.find((d) => d.id === departmentId)?.name : undefined;
}
function resolveLocationName(locationId?: string) {
  return locationId ? seedLocations.find((l) => l.id === locationId)?.name : undefined;
}

export default async function Page({ searchParams }: { searchParams: SearchParams }) {
  await requireHrActor();
  const params = await searchParams;
  const filters: PeopleFilters = {
    q: params.q || undefined,
    department: params.department || undefined,
    location: params.location || undefined,
    status: params.status || undefined,
    manager: params.manager || undefined,
    workAuth: params.workAuth || undefined,
    startFrom: params.startFrom || undefined,
    startTo: params.startTo || undefined,
    sort: params.sort || "name",
  };

  const employees = await hrRepository.listEmployees();

  const rows = await Promise.all(
    employees.map(async (employee) => {
      const [assignment, workAuth, documents, onboarding] = await Promise.all([
        hrRepository.getPrimaryAssignment(employee.id),
        hrRepository.getWorkAuthorization(employee.id),
        getEmployeeDocuments(employee.id),
        getEmployeeOnboarding(employee.id),
      ]);

      let managerName: string | undefined;
      if (assignment?.managerEmployeeId) {
        const manager = await hrRepository.getEmployeeById(assignment.managerEmployeeId);
        if (manager) managerName = `${manager.firstName} ${manager.lastName}`;
      }

      const startDate = employee.startDate || assignment?.startDate;
      return {
        employee,
        assignment,
        workAuth,
        documentCount: documents.length,
        managerName,
        startDate,
        departmentName: resolveDepartmentName(assignment?.departmentId) || "—",
        locationName: resolveLocationName(assignment?.locationId) || "—",
        jobTitle: resolvePositionTitle(assignment?.positionId) || "—",
        onboardingLabel: onboarding.record
          ? `${onboarding.record.status.replaceAll("_", " ")} · ${onboarding.percentComplete}%`
          : "—",
      };
    }),
  );

  const departments = [
    ...new Map(
      rows
        .filter((r) => r.assignment?.departmentId)
        .map((r) => [
          r.assignment!.departmentId,
          { id: r.assignment!.departmentId, label: r.departmentName },
        ]),
    ).values(),
  ].sort((a, b) => a.label.localeCompare(b.label));

  const locations = [
    ...new Map(
      rows
        .filter((r) => r.assignment?.locationId)
        .map((r) => [
          r.assignment!.locationId,
          { id: r.assignment!.locationId, label: r.locationName },
        ]),
    ).values(),
  ].sort((a, b) => a.label.localeCompare(b.label));

  const managers = [
    ...new Map(
      rows
        .filter((r) => r.assignment?.managerEmployeeId && r.managerName)
        .map((r) => [
          r.assignment!.managerEmployeeId!,
          { id: r.assignment!.managerEmployeeId!, label: r.managerName! },
        ]),
    ).values(),
  ].sort((a, b) => a.label.localeCompare(b.label));

  const workAuthTypes = [
    ...new Set(rows.map((r) => r.workAuth?.authorizationType).filter(Boolean) as string[]),
  ]
    .sort()
    .map((value) => ({ id: value, label: value }));

  const statuses = (Object.keys(employeeStatusLabels) as EmployeeStatus[]).map((id) => ({
    id,
    label: employeeStatusLabels[id],
  }));

  const q = filters.q?.trim().toLowerCase() ?? "";
  let filtered = rows.filter((row) => {
    if (filters.department && row.assignment?.departmentId !== filters.department) return false;
    if (filters.location && row.assignment?.locationId !== filters.location) return false;
    if (filters.status && row.employee.employmentStatus !== filters.status) return false;
    if (filters.manager && row.assignment?.managerEmployeeId !== filters.manager) return false;
    if (filters.workAuth && row.workAuth?.authorizationType !== filters.workAuth) return false;
    if (filters.startFrom && (row.startDate || "") < filters.startFrom) return false;
    if (filters.startTo && (row.startDate || "") > filters.startTo) return false;
    if (q) {
      const hay = `${row.employee.firstName} ${row.employee.lastName} ${row.employee.preferredName ?? ""} ${row.employee.employeeNumber} ${row.employee.workEmail ?? ""}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });

  filtered = [...filtered].sort((a, b) => {
    switch (filters.sort) {
      case "employeeNumber":
        return a.employee.employeeNumber.localeCompare(b.employee.employeeNumber);
      case "startDate":
        return (a.startDate || "").localeCompare(b.startDate || "");
      case "status":
        return a.employee.employmentStatus.localeCompare(b.employee.employmentStatus);
      case "department":
        return a.departmentName.localeCompare(b.departmentName);
      default:
        return `${a.employee.lastName}${a.employee.firstName}`.localeCompare(
          `${b.employee.lastName}${b.employee.firstName}`,
        );
    }
  });

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-6 lg:px-8 lg:py-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[0.7rem] uppercase tracking-[0.14em] text-black/40">Workforce</p>
          <h1 className="mt-2 font-serif text-2xl font-semibold tracking-[-0.03em]">People</h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-black/55">
            Operational employee directory — search, filter, and open the employee 360 profile.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/workforce/people/new"
            className="rounded-md bg-[var(--ca-navy)] px-3 py-1.5 text-sm font-medium text-white hover:opacity-90"
          >
            + Add Employee
          </Link>
          <a
            href="/api/exports/employee-directory"
            className="rounded-md border border-black/15 px-3 py-1.5 text-sm font-medium text-black/70 hover:bg-black/[0.03]"
          >
            Export CSV
          </a>
        </div>
      </div>

      <div className="mt-6">
        <PeopleFiltersBar
          filters={filters}
          departments={departments}
          locations={locations}
          managers={managers}
          workAuthTypes={workAuthTypes}
          statuses={statuses}
        />
      </div>

      <p className="mt-4 text-sm text-black/45">
        {filtered.length} of {rows.length} employees
      </p>

      {filtered.length === 0 ? (
        <div className="mt-4 rounded-xl border border-dashed border-black/15 bg-white p-8 text-sm text-black/45">
          No data available for this period.
        </div>
      ) : (
        <>
          <div className="mt-3 hidden overflow-x-auto rounded-xl border border-black/10 bg-white shadow-sm lg:block">
            <table className="w-full min-w-[1200px] text-left text-sm">
              <thead className="border-b border-black/10 text-[0.7rem] uppercase tracking-[0.12em] text-black/40">
                <tr>
                  <th className="px-4 py-3 font-medium">Employee #</th>
                  <th className="px-4 py-3 font-medium">Employee</th>
                  <th className="px-4 py-3 font-medium">Job Title</th>
                  <th className="px-4 py-3 font-medium">Department</th>
                  <th className="px-4 py-3 font-medium">Manager</th>
                  <th className="px-4 py-3 font-medium">Location</th>
                  <th className="px-4 py-3 font-medium">Employment Status</th>
                  <th className="px-4 py-3 font-medium">Start Date</th>
                  <th className="px-4 py-3 font-medium">Work Authorization</th>
                  <th className="px-4 py-3 font-medium">Documents</th>
                  <th className="px-4 py-3 font-medium">Onboarding</th>
                  <th className="px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((row) => (
                  <tr key={row.employee.id} className="border-b border-black/5 last:border-b-0">
                    <td className="px-4 py-3 text-black/55">{row.employee.employeeNumber}</td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/workforce/people/${row.employee.id}`}
                        className="font-medium text-[var(--ca-blue)] hover:underline"
                      >
                        {row.employee.preferredName ||
                          `${row.employee.firstName} ${row.employee.lastName}`}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-black/70">{row.jobTitle}</td>
                    <td className="px-4 py-3 text-black/70">{row.departmentName}</td>
                    <td className="px-4 py-3 text-black/70">{row.managerName || "—"}</td>
                    <td className="px-4 py-3 text-black/70">{row.locationName}</td>
                    <td className="px-4 py-3">
                      <EmployeeStatusBadge status={row.employee.employmentStatus} />
                    </td>
                    <td className="px-4 py-3 text-black/70">{formatDate(row.startDate)}</td>
                    <td className="px-4 py-3 text-black/70">
                      {row.workAuth?.authorizationType || "—"}
                    </td>
                    <td className="px-4 py-3 text-black/70">
                      {row.documentCount > 0 ? `${row.documentCount} on file` : "None"}
                    </td>
                    <td className="px-4 py-3 text-xs text-black/60">{row.onboardingLabel}</td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/workforce/people/${row.employee.id}`}
                        className="text-[var(--ca-blue)] hover:underline"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-3 space-y-3 lg:hidden">
            {filtered.map((row) => (
              <Link
                key={row.employee.id}
                href={`/workforce/people/${row.employee.id}`}
                className="block rounded-lg border border-black/10 bg-white p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium">
                      {row.employee.preferredName ||
                        `${row.employee.firstName} ${row.employee.lastName}`}
                    </p>
                    <p className="mt-1 text-xs text-black/45">{row.employee.employeeNumber}</p>
                  </div>
                  <EmployeeStatusBadge status={row.employee.employmentStatus} />
                </div>
                <p className="mt-3 text-sm text-black/70">
                  {row.jobTitle} · {row.departmentName}
                </p>
                <p className="mt-1 text-xs text-black/45">
                  {row.locationName} · Start {formatDate(row.startDate)}
                </p>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
