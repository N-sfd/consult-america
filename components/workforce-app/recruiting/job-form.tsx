"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { createJob } from "@/lib/recruiting/actions";
import { careerAreaLabels } from "@/data/jobs";
import {
  employmentTypeLabels,
  workplaceTypeLabels,
  type EmploymentType,
  type WorkplaceType,
} from "@/types/organization";
import type { CareerArea } from "@/types/recruiting";

type ReferenceItem = { id: string; name: string };
type PositionItem = { id: string; title: string; departmentId: string };

const fieldClass =
  "mt-1.5 h-9 w-full border border-black/10 bg-white px-3 text-sm outline-none focus:border-[var(--ca-blue)]";

export default function JobForm({
  departments,
  locations,
  positions,
}: {
  departments: ReferenceItem[];
  locations: ReferenceItem[];
  positions: PositionItem[];
}) {
  const router = useRouter();
  const [departmentId, setDepartmentId] = useState(departments[0]?.id ?? "");
  const [submitting, setSubmitting] = useState<"draft" | "publish" | null>(null);
  const [error, setError] = useState<string | null>(null);

  const positionsForDepartment = useMemo(
    () => positions.filter((p) => p.departmentId === departmentId),
    [positions, departmentId],
  );

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const submitter = (event.nativeEvent as SubmitEvent)
      .submitter as HTMLButtonElement | null;
    const publishNow = submitter?.value === "publish";
    setSubmitting(publishNow ? "publish" : "draft");

    const formData = new FormData(event.currentTarget);
    const department = departments.find((d) => d.id === departmentId);
    const location = locations.find((l) => l.id === formData.get("locationId"));

    const responsibilities = String(formData.get("responsibilities") ?? "")
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
    const qualifications = String(formData.get("qualifications") ?? "")
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
    const preferredQualifications = String(
      formData.get("preferredQualifications") ?? "",
    )
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    try {
      const result = await createJob({
        title: String(formData.get("title") ?? ""),
        departmentId,
        departmentName: department?.name ?? "—",
        positionId: String(formData.get("positionId") ?? ""),
        locationId: String(formData.get("locationId") ?? ""),
        locationName: location?.name ?? "—",
        hiringManagerUserId: (formData.get("hiringManager") as string) || undefined,
        recruiterUserId: (formData.get("recruiter") as string) || undefined,
        employmentType: formData.get("employmentType") as EmploymentType,
        workplaceType: formData.get("workplaceType") as WorkplaceType,
        careerArea: formData.get("careerArea") as CareerArea,
        openings: Number(formData.get("openings") ?? 1),
        salaryMin: formData.get("salaryMin")
          ? Number(formData.get("salaryMin"))
          : undefined,
        salaryMax: formData.get("salaryMax")
          ? Number(formData.get("salaryMax"))
          : undefined,
        description: String(formData.get("summary") ?? ""),
        responsibilities,
        qualifications,
        preferredQualifications,
        publishNow,
      });

      router.push(`/app/recruiting/jobs/${result.requisitionId}`);
    } catch {
      setError("Something went wrong creating this requisition. Please try again.");
      setSubmitting(null);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto max-w-[860px] px-4 py-5 lg:px-8 lg:py-6"
    >
      <h1 className="text-[1.75rem] font-medium tracking-[-0.02em] text-[var(--ca-app-ink)]">
        New Requisition
      </h1>
      <p className="mt-1 text-sm text-black/50">
        Create a hiring requisition. Publish now to send it to the public
        careers site, or save as a draft to finish later.
      </p>

      {error && (
        <p className="mt-4 border border-[var(--ca-error)]/30 bg-[var(--ca-error)]/5 px-4 py-3 text-sm text-[var(--ca-error)]">
          {error}
        </p>
      )}

      <Section title="Job Details">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Job Title" required className="sm:col-span-2">
            <input name="title" required className={fieldClass} />
          </Field>

          <Field label="Department" required>
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
          </Field>

          <Field label="Position" required>
            <select name="positionId" required className={fieldClass}>
              {positionsForDepartment.length === 0 ? (
                <option value="">No positions in this department</option>
              ) : (
                positionsForDepartment.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title}
                  </option>
                ))
              )}
            </select>
          </Field>

          <Field label="Career Area" required>
            <select name="careerArea" required className={fieldClass}>
              {Object.entries(careerAreaLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Employment Type" required>
            <select name="employmentType" required className={fieldClass}>
              {Object.entries(employmentTypeLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Workplace Type" required>
            <select name="workplaceType" required className={fieldClass}>
              {Object.entries(workplaceTypeLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Location" required>
            <select name="locationId" required className={fieldClass}>
              {locations.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.name}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Number of Openings">
            <input
              name="openings"
              type="number"
              min={1}
              defaultValue={1}
              className={fieldClass}
            />
          </Field>
        </div>
      </Section>

      <Section title="Hiring Team">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Hiring Manager" required>
            <input name="hiringManager" required className={fieldClass} />
          </Field>
          <Field label="Recruiter">
            <input name="recruiter" className={fieldClass} />
          </Field>
        </div>
      </Section>

      <Section title="Compensation">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Salary / Rate Minimum">
            <input name="salaryMin" type="number" min={0} className={fieldClass} />
          </Field>
          <Field label="Salary / Rate Maximum">
            <input name="salaryMax" type="number" min={0} className={fieldClass} />
          </Field>
        </div>
      </Section>

      <Section title="Job Content">
        <div className="grid gap-4">
          <Field label="Summary" required>
            <textarea name="summary" required rows={3} className={`${fieldClass} h-auto py-2`} />
          </Field>
          <Field label="Responsibilities" hint="One per line">
            <textarea name="responsibilities" rows={4} className={`${fieldClass} h-auto py-2`} />
          </Field>
          <Field label="Qualifications" hint="One per line">
            <textarea name="qualifications" rows={4} className={`${fieldClass} h-auto py-2`} />
          </Field>
          <Field label="Preferred Qualifications" hint="One per line">
            <textarea
              name="preferredQualifications"
              rows={3}
              className={`${fieldClass} h-auto py-2`}
            />
          </Field>
        </div>
      </Section>

      <div className="mt-6 flex items-center justify-between border-t border-black/10 pt-5">
        <Link
          href="/app/recruiting/jobs"
          className="text-sm font-medium text-black/55 hover:text-[var(--ca-app-ink)]"
        >
          Cancel
        </Link>
        <div className="flex gap-2">
          <button
            type="submit"
            name="action"
            value="draft"
            disabled={submitting !== null}
            className="border border-black/10 px-3.5 py-2 text-sm font-medium text-[var(--ca-app-ink)] disabled:opacity-50"
          >
            {submitting === "draft" ? "Saving…" : "Save Draft"}
          </button>
          <button
            type="submit"
            name="action"
            value="publish"
            disabled={submitting !== null}
            className="bg-[var(--ca-blue)] px-3.5 py-2 text-sm font-medium text-white hover:bg-[var(--ca-blue-hover)] disabled:opacity-50"
          >
            {submitting === "publish" ? "Publishing…" : "Publish Job"}
          </button>
        </div>
      </div>
    </form>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-6 border border-black/8 bg-white p-5">
      <p className="text-[0.65rem] font-semibold uppercase tracking-[0.1em] text-black/40">
        {title}
      </p>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function Field({
  label,
  required,
  hint,
  className,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={`block ${className ?? ""}`}>
      <span className="text-xs font-medium text-black/60">
        {label}
        {required && <span className="text-[var(--ca-error)]"> *</span>}
      </span>
      {children}
      {hint && <span className="mt-1 block text-[0.7rem] text-black/35">{hint}</span>}
    </label>
  );
}
