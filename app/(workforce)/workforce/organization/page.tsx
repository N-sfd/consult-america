import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { PageHeader } from "@/components/shared";
import {
  getWorkforceHeadcountSummary,
  listDepartmentsWithHeadcount,
  listLocationsWithHeadcount,
  workforceDataAvailable,
} from "@/lib/workforce/operations";
import { getWorkforceSession } from "@/lib/workforce/session";

export const metadata: Metadata = { title: "Organization" };
export const dynamic = "force-dynamic";

export default async function WorkforceOrganizationPage() {
  const session = await getWorkforceSession();
  if (!session.roles.includes("ADMIN") && !session.roles.includes("HR")) {
    redirect("/workforce");
  }

  const persisted = workforceDataAvailable();
  const departments = persisted ? await listDepartmentsWithHeadcount() : [];
  const locations = persisted ? await listLocationsWithHeadcount() : [];
  const headcount = persisted ? await getWorkforceHeadcountSummary() : null;

  return (
    <div className="mx-auto max-w-[1400px] space-y-7">
      <PageHeader
        eyebrow="Administration"
        title="Organization"
        description="Departments, reporting lines, and location structure across the Consult America workforce."
      />

      {!persisted ? (
        <p className="rounded-lg border border-dashed border-black/15 bg-white p-5 text-sm text-black/45">
          Organization data connects when workforce data is persisted — no departments or
          locations are recorded in this environment yet.
        </p>
      ) : (
        <>
          {headcount ? (
            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard label="Total employees" value={String(headcount.totalEmployees)} />
              <StatCard label="Active" value={String(headcount.activeEmployees)} />
              <StatCard label="On leave" value={String(headcount.onLeaveEmployees)} />
              <StatCard label="Departments" value={String(departments.length)} />
            </section>
          ) : null}

          <section className="rounded-lg border border-[var(--ca-platform-border)] bg-white">
            <div className="border-b border-[var(--ca-platform-border)] px-5 py-4">
              <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-black/40">
                Departments
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead className="border-b border-[var(--ca-platform-border)] bg-[#F8FAFC] text-xs uppercase tracking-[0.08em] text-black/45">
                  <tr>
                    <th className="px-5 py-3 font-medium">Department</th>
                    <th className="px-5 py-3 font-medium">Business unit</th>
                    <th className="px-5 py-3 font-medium">Manager</th>
                    <th className="px-5 py-3 font-medium">Headcount</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {departments.map((department) => (
                    <tr key={department.id} className="border-b border-black/5 last:border-b-0">
                      <td className="px-5 py-3 font-medium">{department.name}</td>
                      <td className="px-5 py-3 text-black/70">{department.businessUnitName}</td>
                      <td className="px-5 py-3 text-black/70">
                        {department.managerName ?? "—"}
                      </td>
                      <td className="px-5 py-3 text-black/70">{department.headcount}</td>
                      <td className="px-5 py-3">
                        <span
                          className={`rounded-md px-2 py-1 text-xs font-medium ${
                            department.status === "ACTIVE"
                              ? "bg-emerald-600/10 text-emerald-800"
                              : "bg-black/[0.04] text-black/45"
                          }`}
                        >
                          {department.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {departments.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-5 py-8 text-center text-black/50">
                        No departments recorded.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <section className="rounded-lg border border-[var(--ca-platform-border)] bg-white">
            <div className="border-b border-[var(--ca-platform-border)] px-5 py-4">
              <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-black/40">
                Locations
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead className="border-b border-[var(--ca-platform-border)] bg-[#F8FAFC] text-xs uppercase tracking-[0.08em] text-black/45">
                  <tr>
                    <th className="px-5 py-3 font-medium">Location</th>
                    <th className="px-5 py-3 font-medium">City / State</th>
                    <th className="px-5 py-3 font-medium">Country</th>
                    <th className="px-5 py-3 font-medium">Headcount</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {locations.map((location) => (
                    <tr key={location.id} className="border-b border-black/5 last:border-b-0">
                      <td className="px-5 py-3 font-medium">{location.name}</td>
                      <td className="px-5 py-3 text-black/70">
                        {[location.city, location.state].filter(Boolean).join(", ") || "—"}
                      </td>
                      <td className="px-5 py-3 text-black/70">{location.country}</td>
                      <td className="px-5 py-3 text-black/70">{location.headcount}</td>
                      <td className="px-5 py-3">
                        <span
                          className={`rounded-md px-2 py-1 text-xs font-medium ${
                            location.status === "ACTIVE"
                              ? "bg-emerald-600/10 text-emerald-800"
                              : "bg-black/[0.04] text-black/45"
                          }`}
                        >
                          {location.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {locations.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-5 py-8 text-center text-black/50">
                        No locations recorded.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[var(--ca-platform-border)] bg-white p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-black/40">{label}</p>
      <p className="mt-2 text-2xl font-semibold tracking-[-0.03em]">{value}</p>
    </div>
  );
}
