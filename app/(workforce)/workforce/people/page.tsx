import type { Metadata } from "next";
import Link from "next/link";

import { hrRepository } from "@/lib/hr";
import { getEmployeeDocuments } from "@/lib/documents/employee-documents-service";
import { requireHrActor } from "@/lib/self-service/security";
import { EmployeeStatusBadge } from "@/components/workforce/status-badges";
// Org reference data is static seed data shared with recruiting (no live
// department/position/location tables exist yet) — see lib/self-service/index.ts.
import { seedDepartments, seedLocations, seedPositions } from "@/data/recruiting/seed";

export const metadata: Metadata = { title: "People" };

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

export default async function Page() {
  await requireHrActor();

  const employees = await hrRepository.listEmployees();

  const rows = (
    await Promise.all(
      employees.map(async (employee) => {
        const [assignment, workAuth, documents] = await Promise.all([
          hrRepository.getPrimaryAssignment(employee.id),
          hrRepository.getWorkAuthorization(employee.id),
          getEmployeeDocuments(employee.id),
        ]);

        let managerName: string | undefined;
        if (assignment?.managerEmployeeId) {
          const manager = await hrRepository.getEmployeeById(assignment.managerEmployeeId);
          if (manager) managerName = `${manager.firstName} ${manager.lastName}`;
        }

        return { employee, assignment, workAuth, documentCount: documents.length, managerName };
      }),
    )
  ).sort((a, b) =>
    `${a.employee.lastName}${a.employee.firstName}`.localeCompare(
      `${b.employee.lastName}${b.employee.firstName}`,
    ),
  );

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-6 lg:px-8 lg:py-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[0.7rem] uppercase tracking-[0.14em] text-black/40">
            Workforce
          </p>
          <h1 className="mt-2 font-serif text-2xl font-semibold tracking-[-0.03em]">
            People
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-black/55">
            Manage employees, employment details, assignments and workforce records.
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

      {rows.length === 0 ? (
        <div className="mt-8 rounded-xl border border-dashed border-black/15 bg-white p-8 text-sm text-black/45">
          No employee records yet. Add an employee, or hire a candidate through
          the recruiting pipeline.
        </div>
      ) : (
        <div className="mt-8 overflow-x-auto rounded-xl border border-black/10 bg-white shadow-sm">
          <table className="w-full min-w-[1100px] text-left text-sm">
            <thead className="border-b border-black/10 text-[0.7rem] uppercase tracking-[0.12em] text-black/40">
              <tr>
                <th className="px-4 py-3 font-medium">Employee #</th>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Job Title</th>
                <th className="px-4 py-3 font-medium">Department</th>
                <th className="px-4 py-3 font-medium">Manager</th>
                <th className="px-4 py-3 font-medium">Location</th>
                <th className="px-4 py-3 font-medium">Employment Status</th>
                <th className="px-4 py-3 font-medium">Start Date</th>
                <th className="px-4 py-3 font-medium">Work Authorization</th>
                <th className="px-4 py-3 font-medium">Documents</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(({ employee, assignment, workAuth, documentCount, managerName }) => (
                <tr key={employee.id} className="border-b border-black/5 last:border-b-0">
                  <td className="px-4 py-3 text-black/55">{employee.employeeNumber}</td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/workforce/people/${employee.id}`}
                      className="font-medium text-[var(--ca-blue)] hover:underline"
                    >
                      {employee.preferredName || `${employee.firstName} ${employee.lastName}`}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-black/70">
                    {resolvePositionTitle(assignment?.positionId) || "—"}
                  </td>
                  <td className="px-4 py-3 text-black/70">
                    {resolveDepartmentName(assignment?.departmentId) || "—"}
                  </td>
                  <td className="px-4 py-3 text-black/70">{managerName || "—"}</td>
                  <td className="px-4 py-3 text-black/70">
                    {resolveLocationName(assignment?.locationId) || "—"}
                  </td>
                  <td className="px-4 py-3">
                    <EmployeeStatusBadge status={employee.employmentStatus} />
                  </td>
                  <td className="px-4 py-3 text-black/70">
                    {formatDate(employee.startDate || assignment?.startDate)}
                  </td>
                  <td className="px-4 py-3 text-black/70">
                    {workAuth?.authorizationType || "—"}
                  </td>
                  <td className="px-4 py-3 text-black/70">
                    {documentCount > 0 ? `${documentCount} on file` : "None"}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/workforce/people/${employee.id}`}
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
      )}

      <Link
        href="/workforce"
        className="mt-6 inline-block text-sm text-[var(--ca-blue)] hover:underline"
      >
        ← Back to overview
      </Link>
    </div>
  );
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
