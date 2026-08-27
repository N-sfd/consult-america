"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

import StageBadge, {
  CandidateAvatar,
  RequisitionStatusBadge,
} from "@/components/workforce-app/recruiting/stage-badge";
import { formatDate } from "@/lib/recruiting/format";
import type { JobDetail } from "@/lib/recruiting/repository";
import { cn } from "@/lib/utils";
import { applicationStatusLabels, type Application } from "@/types/recruiting";
import { workplaceTypeLabels, employmentTypeLabels } from "@/types/organization";

const TABS = ["Overview", "Candidates", "Pipeline", "Interviews", "Activity"] as const;
type Tab = (typeof TABS)[number];

export type Applicant = {
  application: Application;
  candidateName: string;
  candidateEmail: string;
};

export default function JobDetailView({
  detail,
  applicants,
}: {
  detail: JobDetail;
  applicants: Applicant[];
}) {
  const [tab, setTab] = useState<Tab>("Overview");
  const { requisition } = detail;

  return (
    <div className="mx-auto max-w-[1280px] px-4 py-5 lg:px-8 lg:py-6">
      <Link
        href="/app/recruiting/jobs"
        className="inline-flex items-center gap-1 text-sm text-black/50 hover:text-[var(--ca-blue)]"
      >
        <ChevronLeft className="h-3.5 w-3.5" />
        Jobs
      </Link>

      <div className="mt-3 flex flex-wrap items-start justify-between gap-4 border border-black/8 bg-white px-5 py-5">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-xl font-medium tracking-[-0.02em] text-[var(--ca-app-ink)]">
              {requisition.title}
            </h1>
            <RequisitionStatusBadge status={requisition.status} />
          </div>
          <p className="mt-1.5 text-sm text-black/50">
            {requisition.requisitionNumber}
          </p>
          <p className="mt-1 text-sm text-black/55">
            {detail.locationName} · {workplaceTypeLabels[requisition.workplaceType]} ·{" "}
            {employmentTypeLabels[requisition.employmentType]}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            disabled
            title="Editing a published requisition is coming soon"
            className="cursor-not-allowed border border-black/10 px-3 py-1.5 text-sm font-medium text-black/30"
          >
            Edit
          </button>
          {detail.postingSlug && (
            <a
              href={`/jobs/${detail.postingSlug}`}
              target="_blank"
              rel="noreferrer"
              className="border border-black/10 px-3 py-1.5 text-sm font-medium text-[var(--ca-app-ink)] hover:border-[var(--ca-blue)] hover:text-[var(--ca-blue)]"
            >
              Preview Public Job
            </a>
          )}
          <Link
            href={`/app/recruiting/jobs/${requisition.id}/pipeline`}
            className="bg-[var(--ca-blue)] px-3 py-1.5 text-sm font-medium text-white hover:bg-[var(--ca-blue-hover)]"
          >
            Open Pipeline
          </Link>
        </div>
      </div>

      <div className="mt-5 flex gap-1 overflow-x-auto border-b border-black/8">
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={cn(
              "shrink-0 border-b-2 px-3 py-2.5 text-sm font-medium transition-colors",
              tab === t
                ? "border-[var(--ca-blue)] text-[var(--ca-blue)]"
                : "border-transparent text-black/50 hover:text-[var(--ca-app-ink)]",
            )}
          >
            {t}
            {t === "Candidates" && ` (${applicants.length})`}
          </button>
        ))}
      </div>

      <div className="mt-5 border border-black/8 bg-white p-5">
        {tab === "Overview" && (
          <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
            <div className="space-y-6">
              <div>
                <p className="text-[0.65rem] uppercase tracking-[0.1em] text-black/40">
                  Summary
                </p>
                <p className="mt-2 text-sm leading-6 text-black/65">
                  {requisition.description}
                </p>
              </div>
              {requisition.responsibilities.length > 0 && (
                <div>
                  <p className="text-[0.65rem] uppercase tracking-[0.1em] text-black/40">
                    Responsibilities
                  </p>
                  <ul className="mt-2 list-disc space-y-1.5 pl-4 text-sm leading-6 text-black/65">
                    {requisition.responsibilities.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
              {requisition.qualifications.length > 0 && (
                <div>
                  <p className="text-[0.65rem] uppercase tracking-[0.1em] text-black/40">
                    Qualifications
                  </p>
                  <ul className="mt-2 list-disc space-y-1.5 pl-4 text-sm leading-6 text-black/65">
                    {requisition.qualifications.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="space-y-5">
              <Field label="Department" value={detail.departmentName} />
              <Field label="Location" value={detail.locationName} />
              <Field label="Openings" value={String(requisition.openings)} />
              <Field
                label="Salary Range"
                value={
                  requisition.salaryMin && requisition.salaryMax
                    ? `$${requisition.salaryMin.toLocaleString()} – $${requisition.salaryMax.toLocaleString()}`
                    : "—"
                }
              />
              <Field label="Created" value={formatDate(requisition.createdAt)} />
            </div>
          </div>
        )}

        {tab === "Candidates" && (
          <EmptyableList
            items={applicants}
            emptyLabel="No candidates have applied to this job yet."
            render={(applicant) => (
              <Link
                key={applicant.application.id}
                href={`/app/recruiting/candidates/${applicant.application.candidateId}`}
                className="grid grid-cols-[2fr_1fr_1fr_1fr] items-center gap-3 border-b border-black/6 py-3 text-sm last:border-0 hover:bg-[var(--ca-app-bg)]"
              >
                <span className="flex items-center gap-3">
                  <CandidateAvatar name={applicant.candidateName} />
                  <span>
                    <span className="block font-medium text-[var(--ca-app-ink)]">
                      {applicant.candidateName}
                    </span>
                    <span className="block text-xs text-black/45">
                      {applicant.candidateEmail}
                    </span>
                  </span>
                </span>
                <StageBadge stage={applicant.application.status} />
                <span className="text-black/45">
                  {applicant.application.applicationNumber}
                </span>
                <span className="text-black/45">
                  {formatDate(applicant.application.appliedAt)}
                </span>
              </Link>
            )}
          />
        )}

        {tab === "Pipeline" && (
          <div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
              {Object.entries(detail.pipelineCounts)
                .filter(([, count]) => count > 0)
                .map(([status, count]) => (
                  <div key={status} className="border border-black/8 px-3 py-2.5">
                    <p className="text-xl font-medium text-[var(--ca-app-ink)]">
                      {count}
                    </p>
                    <p className="mt-0.5 text-xs text-black/50">
                      {applicationStatusLabels[status as keyof typeof applicationStatusLabels]}
                    </p>
                  </div>
                ))}
            </div>
            <Link
              href={`/app/recruiting/jobs/${requisition.id}/pipeline`}
              className="ca-link mt-5 inline-flex text-sm"
            >
              Open full pipeline board
            </Link>
          </div>
        )}

        {tab === "Interviews" && (
          <p className="text-sm text-black/45">
            Interview scheduling for this job isn&apos;t built yet.
          </p>
        )}

        {tab === "Activity" && (
          <p className="text-sm text-black/45">
            Job-level activity history isn&apos;t built yet.
          </p>
        )}
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[0.65rem] uppercase tracking-[0.1em] text-black/40">
        {label}
      </p>
      <p className="mt-1 text-sm text-[var(--ca-app-ink)]">{value}</p>
    </div>
  );
}

function EmptyableList<T>({
  items,
  emptyLabel,
  render,
}: {
  items: T[];
  emptyLabel: string;
  render: (item: T) => React.ReactNode;
}) {
  if (items.length === 0) {
    return <p className="text-sm text-black/45">{emptyLabel}</p>;
  }
  return <div>{items.map(render)}</div>;
}
