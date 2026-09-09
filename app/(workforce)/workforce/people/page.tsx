import type { Metadata } from "next";
import Link from "next/link";

import { hrRepository } from "@/lib/hr";
import { getEmployeeOnboarding, getEmployeeProfile } from "@/lib/self-service";
import { employeeStatusLabels } from "@/types/hr";

export const metadata: Metadata = { title: "Employees" };

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
  const employees = await hrRepository.listEmployees();
  const rows = (
    await Promise.all(
      employees.map(async (employee) => {
        const [profile, onboarding] = await Promise.all([
          getEmployeeProfile(employee.id),
          getEmployeeOnboarding(employee.id),
        ]);
        return { profile, onboarding };
      }),
    )
  )
    .filter((row) => row.profile)
    .sort((a, b) =>
      `${a.profile!.person.lastName}${a.profile!.person.firstName}`.localeCompare(
        `${b.profile!.person.lastName}${b.profile!.person.firstName}`,
      ),
    );

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-6 lg:px-8 lg:py-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[0.7rem] uppercase tracking-[0.14em] text-black/40">
            People
          </p>
          <h1 className="mt-2 text-2xl font-medium tracking-[-0.03em]">Employees</h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-black/55">
            Directory, assignments, and workforce records across the organization.
          </p>
        </div>
        <a
          href="/api/exports/employee-directory"
          className="rounded-md border border-black/15 px-3 py-1.5 text-sm font-medium text-black/70 hover:bg-black/[0.03]"
        >
          Export CSV
        </a>
      </div>

      {rows.length === 0 ? (
        <div className="mt-8 border border-dashed border-black/15 bg-white p-8 text-sm text-black/45">
          No employee records yet. Hired candidates appear here from the hire transaction.
        </div>
      ) : (
        <div className="mt-8 overflow-x-auto border border-black/10 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-black/10 text-[0.7rem] uppercase tracking-[0.12em] text-black/40">
              <tr>
                <th className="px-4 py-3 font-medium">Employee</th>
                <th className="px-4 py-3 font-medium">Job</th>
                <th className="px-4 py-3 font-medium">Start date</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Onboarding</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(({ profile, onboarding }) => {
                if (!profile) return null;
                const startDate =
                  profile.employee.startDate || profile.assignment?.startDate;
                return (
                  <tr key={profile.employee.id} className="border-b border-black/5">
                    <td className="px-4 py-3">
                      <Link
                        href={`/workforce/people/${profile.employee.id}`}
                        className="font-medium text-[var(--ca-blue)] hover:underline"
                      >
                        {profile.person.firstName} {profile.person.lastName}
                      </Link>
                      <p className="text-xs text-black/45">
                        {profile.employee.employeeNumber}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-black/70">
                      {profile.positionTitle || "—"}
                      {profile.departmentName ? ` · ${profile.departmentName}` : ""}
                    </td>
                    <td className="px-4 py-3 text-black/70">{formatDate(startDate)}</td>
                    <td className="px-4 py-3 text-black/70">
                      {employeeStatusLabels[profile.employee.employmentStatus]}
                    </td>
                    <td className="px-4 py-3 text-black/70">
                      {onboarding.record
                        ? `${onboarding.percentComplete}% · ${onboarding.record.status.replaceAll("_", " ").toLowerCase()}`
                        : "—"}
                    </td>
                  </tr>
                );
              })}
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
