"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { createEmployeeDirect } from "@/lib/hr/actions";
import {
  employmentTypeLabels,
  workplaceTypeLabels,
  type EmploymentType,
  type WorkplaceType,
} from "@/types/organization";
import type { EmployeeProfile } from "@/types/hr";

type ReferenceItem = { id: string; name: string };
type PositionItem = { id: string; title: string; departmentId: string };
type ManagerItem = { id: string; name: string };

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

const fieldClass =
  "mt-1.5 h-9 w-full rounded-md border border-black/10 bg-white px-3 text-sm outline-none focus:border-[var(--ca-blue)]";
const labelClass = "text-xs font-medium uppercase tracking-[0.08em] text-black/45";

export default function AddEmployeeForm({
  departments,
  positions,
  locations,
  managers,
}: {
  departments: (ReferenceItem & { businessUnitId: string })[];
  positions: PositionItem[];
  locations: ReferenceItem[];
  managers: ManagerItem[];
}) {
  const router = useRouter();
  const [departmentId, setDepartmentId] = useState(departments[0]?.id ?? "");
  const [authorizationType, setAuthorizationType] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const positionsForDepartment = useMemo(
    () => positions.filter((p) => p.departmentId === departmentId),
    [positions, departmentId],
  );

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    const formData = new FormData(event.currentTarget);

    try {
      const result = await createEmployeeDirect({
        firstName: String(formData.get("firstName") ?? "").trim(),
        lastName: String(formData.get("lastName") ?? "").trim(),
        preferredName: (formData.get("preferredName") as string) || undefined,
        personalEmail: (formData.get("email") as string) || undefined,
        phone: (formData.get("phone") as string) || undefined,
        departmentId,
        positionId: String(formData.get("positionId") ?? ""),
        locationId: String(formData.get("locationId") ?? ""),
        managerEmployeeId: (formData.get("managerId") as string) || undefined,
        employmentType: formData.get("employmentType") as EmploymentType,
        workplaceType: formData.get("workplaceType") as WorkplaceType,
        startDate: String(formData.get("startDate") ?? ""),
        employmentStatus: formData.get("employmentStatus") as EmployeeProfile["employmentStatus"],
        authorizationType: authorizationType || undefined,
        authorizationExpirationDate:
          (formData.get("authorizationExpirationDate") as string) || undefined,
      });

      if (!result.ok) {
        setError(result.error);
        setSubmitting(false);
        return;
      }

      router.push(`/workforce/people/${result.employeeId}`);
    } catch {
      setError("Something went wrong adding this employee. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-[860px] px-4 py-6 lg:px-8 lg:py-8">
      <p className="text-[0.7rem] uppercase tracking-[0.14em] text-black/40">People</p>
      <h1 className="mt-2 font-serif text-2xl font-semibold tracking-[-0.03em]">
        Add Employee
      </h1>
      <p className="mt-3 max-w-xl text-sm leading-6 text-black/55">
        Create an employee record directly — for contractor conversions,
        acquisitions, or backfilling existing staff. Candidates hired through
        the recruiting pipeline become employees automatically from an
        accepted offer instead.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-8">
        {error ? (
          <div className="rounded-md border border-[var(--ca-error)]/30 bg-[var(--ca-error)]/5 px-4 py-3 text-sm text-[var(--ca-error)]">
            {error}
          </div>
        ) : null}

        <section className="rounded-xl border border-black/10 bg-white p-6 shadow-sm">
          <h2 className="font-serif text-lg font-semibold">Personal</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label>
              <span className={labelClass}>First Name</span>
              <input name="firstName" required className={fieldClass} />
            </label>
            <label>
              <span className={labelClass}>Last Name</span>
              <input name="lastName" required className={fieldClass} />
            </label>
            <label>
              <span className={labelClass}>Preferred Name (optional)</span>
              <input name="preferredName" className={fieldClass} />
            </label>
            <label>
              <span className={labelClass}>Email</span>
              <input name="email" type="email" className={fieldClass} />
            </label>
            <label>
              <span className={labelClass}>Phone</span>
              <input name="phone" type="tel" className={fieldClass} />
            </label>
          </div>
        </section>

        <section className="rounded-xl border border-black/10 bg-white p-6 shadow-sm">
          <h2 className="font-serif text-lg font-semibold">Employment</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label>
              <span className={labelClass}>Employee Number</span>
              <input
                disabled
                value="Assigned automatically"
                className={`${fieldClass} bg-black/[0.03] text-black/40`}
              />
            </label>
            <label>
              <span className={labelClass}>Department</span>
              <select
                name="departmentId"
                required
                value={departmentId}
                onChange={(e) => setDepartmentId(e.target.value)}
                className={fieldClass}
              >
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span className={labelClass}>Job Title</span>
              <select name="positionId" required className={fieldClass}>
                {positionsForDepartment.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span className={labelClass}>Manager</span>
              <select name="managerId" className={fieldClass} defaultValue="">
                <option value="">No manager assigned</option>
                {managers.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span className={labelClass}>Location</span>
              <select name="locationId" required className={fieldClass}>
                {locations.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span className={labelClass}>Employment Type</span>
              <select name="employmentType" required className={fieldClass} defaultValue="FULL_TIME">
                {Object.entries(employmentTypeLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span className={labelClass}>Workplace</span>
              <select name="workplaceType" required className={fieldClass} defaultValue="ONSITE">
                {Object.entries(workplaceTypeLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span className={labelClass}>Start Date</span>
              <input name="startDate" type="date" required className={fieldClass} />
            </label>
            <label>
              <span className={labelClass}>Status</span>
              <select name="employmentStatus" required className={fieldClass} defaultValue="ACTIVE">
                <option value="ACTIVE">Active</option>
                <option value="PRE_HIRE">Pre-Hire</option>
              </select>
            </label>
          </div>
        </section>

        <section className="rounded-xl border border-black/10 bg-white p-6 shadow-sm">
          <h2 className="font-serif text-lg font-semibold">Work Authorization</h2>
          <p className="mt-1 text-sm text-black/50">
            Operational tracking only — this does not make or record any
            immigration decision.
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label>
              <span className={labelClass}>Work Authorization Type</span>
              <select
                value={authorizationType}
                onChange={(e) => setAuthorizationType(e.target.value)}
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
              <span className={labelClass}>Expiration Date (if applicable)</span>
              <input
                name="authorizationExpirationDate"
                type="date"
                className={fieldClass}
              />
            </label>
          </div>
        </section>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="rounded-md bg-[var(--ca-navy)] px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
          >
            {submitting ? "Adding…" : "Add Employee"}
          </button>
          <Link href="/workforce/people" className="text-sm text-black/55 hover:underline">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
