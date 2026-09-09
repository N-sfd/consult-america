import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getEmployeeOnboarding, getEmployeeProfile } from "@/lib/self-service";

export const metadata: Metadata = { title: "Employee" };

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

export default async function Page({
  params,
}: {
  params: Promise<{ employeeId: string }>;
}) {
  const { employeeId } = await params;
  const [profile, onboarding] = await Promise.all([
    getEmployeeProfile(employeeId),
    getEmployeeOnboarding(employeeId),
  ]);

  if (!profile) notFound();

  const startDate = profile.employee.startDate || profile.assignment?.startDate;

  const fields = [
    ["Employee number", profile.employee.employeeNumber],
    ["Email", profile.person.personalEmail || profile.employee.workEmail || "—"],
    ["Job", profile.positionTitle || "—"],
    ["Department", profile.departmentName || "—"],
    ["Manager", profile.managerName || "Pending"],
    ["Start date", formatDate(startDate)],
    ["Hire date", formatDate(profile.employee.hireDate)],
    ["Employment", profile.statusLabel],
    [
      "Onboarding",
      onboarding.record
        ? `${onboarding.record.status.replaceAll("_", " ").toLowerCase()} · ${onboarding.percentComplete}%`
        : "—",
    ],
    [
      "Portal access",
      profile.employee.portalAccessStatus === "ready" ? "Ready" : "Pending",
    ],
  ];

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-6 lg:px-8 lg:py-8">
      <p className="text-[0.7rem] uppercase tracking-[0.14em] text-black/40">
        People
      </p>
      <h1 className="mt-2 text-2xl font-medium tracking-[-0.03em]">
        {profile.person.firstName} {profile.person.lastName}
      </h1>
      <p className="mt-3 max-w-xl text-sm leading-6 text-black/55">
        Employee record created by hire. Candidate and application history stay
        on the recruiting record.
      </p>

      <dl className="mt-8 grid gap-4 border border-black/10 bg-white p-6 sm:grid-cols-2">
        {fields.map(([label, value]) => (
          <div key={label}>
            <dt className="text-[0.7rem] uppercase tracking-[0.12em] text-black/40">
              {label}
            </dt>
            <dd className="mt-1 text-sm text-black/80">{value}</dd>
          </div>
        ))}
      </dl>

      <Link
        href="/workforce/people"
        className="mt-6 inline-block text-sm text-[var(--ca-blue)] hover:underline"
      >
        ← Back to employees
      </Link>
    </div>
  );
}
