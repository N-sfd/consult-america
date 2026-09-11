"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft } from "lucide-react";

import CandidateMatchForm from "@/components/workforce-app/recruiting/candidate-match-form";
import StageBadge, {
  CandidateAvatar,
  RequisitionStatusBadge,
} from "@/components/workforce-app/recruiting/stage-badge";
import { formatDate } from "@/lib/recruiting/format";
import type { JobDetail } from "@/lib/recruiting/repository";
import { cn } from "@/lib/utils";
import { applicationStatusLabels, type Application } from "@/types/recruiting";
import { workplaceTypeLabels, employmentTypeLabels } from "@/types/organization";

const TABS = [
  "Overview",
  "Applications",
  "Candidate Match",
  "Interviews",
  "Offers",
  "Activity",
] as const;
type Tab = (typeof TABS)[number];

const TAB_PARAM: Record<string, Tab> = {
  overview: "Overview",
  applications: "Applications",
  candidates: "Applications",
  match: "Candidate Match",
  "candidate-match": "Candidate Match",
  interviews: "Interviews",
  offers: "Offers",
  activity: "Activity",
  pipeline: "Applications",
};

export type Applicant = {
  application: Application;
  candidateName: string;
  candidateEmail: string;
  matchScore?: number;
};

function matchTone(score: number) {
  if (score >= 70) return "text-emerald-700 bg-emerald-50 border-emerald-200";
  if (score >= 40) return "text-amber-700 bg-amber-50 border-amber-200";
  return "text-red-700 bg-red-50 border-red-200";
}

function tabFromParam(value: string | null): Tab {
  if (!value) return "Overview";
  return TAB_PARAM[value.toLowerCase()] ?? "Overview";
}

export default function JobDetailView({
  detail,
  applicants,
}: {
  detail: JobDetail;
  applicants: Applicant[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [tab, setTab] = useState<Tab>(() => tabFromParam(searchParams.get("tab")));
  const { requisition } = detail;

  const interviewApplicants = useMemo(
    () =>
      applicants.filter(
        (a) =>
          a.application.status === "INTERVIEW" ||
          a.application.status === "FINAL_INTERVIEW",
      ),
    [applicants],
  );

  const offerApplicants = useMemo(
    () => applicants.filter((a) => a.application.status === "OFFER"),
    [applicants],
  );

  function selectTab(next: Tab) {
    setTab(next);
    const param =
      next === "Overview"
        ? "overview"
        : next === "Applications"
          ? "applications"
          : next === "Candidate Match"
            ? "match"
            : next === "Interviews"
              ? "interviews"
              : next === "Offers"
                ? "offers"
                : "activity";
    router.replace(`?tab=${param}`, { scroll: false });
  }

  const jobOption = {
    requisitionId: requisition.id,
    title: requisition.title,
    departmentName: detail.departmentName,
    locationName: detail.locationName,
  };

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
          <p className="mt-2 max-w-2xl text-xs text-black/40">
            Recruiting command center — applications, match intelligence, interviews,
            and offers stay on this requisition through hire.
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
          <button
            type="button"
            onClick={() => selectTab("Candidate Match")}
            className="border border-black/10 px-3 py-1.5 text-sm font-medium text-[var(--ca-app-ink)] hover:border-[var(--ca-blue)] hover:text-[var(--ca-blue)]"
          >
            Candidate Match
          </button>
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
            onClick={() => selectTab(t)}
            className={cn(
              "shrink-0 border-b-2 px-3 py-2.5 text-sm font-medium transition-colors",
              tab === t
                ? "border-[var(--ca-blue)] text-[var(--ca-blue)]"
                : "border-transparent text-black/50 hover:text-[var(--ca-app-ink)]",
            )}
          >
            {t}
            {t === "Applications" && ` (${applicants.length})`}
            {t === "Interviews" && interviewApplicants.length > 0
              ? ` (${interviewApplicants.length})`
              : null}
            {t === "Offers" && offerApplicants.length > 0
              ? ` (${offerApplicants.length})`
              : null}
          </button>
        ))}
      </div>

      <div
        className={cn(
          "mt-5",
          tab === "Candidate Match" ? "" : "border border-black/8 bg-white p-5",
        )}
      >
        {tab === "Overview" && (
          <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
            <div className="space-y-6">
              <div>
                <p className="text-[0.65rem] uppercase tracking-[0.1em] text-black/40">
                  Job description
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
                    Requirements / qualifications
                  </p>
                  <ul className="mt-2 list-disc space-y-1.5 pl-4 text-sm leading-6 text-black/65">
                    {requisition.qualifications.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                  <button
                    type="button"
                    onClick={() => selectTab("Candidate Match")}
                    className="ca-link mt-4 inline-flex text-sm"
                  >
                    Match applicants to these requirements
                  </button>
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
              <div className="border-t border-black/8 pt-4">
                <p className="text-[0.65rem] uppercase tracking-[0.1em] text-black/40">
                  Pipeline snapshot
                </p>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {Object.entries(detail.pipelineCounts)
                    .filter(([, count]) => count > 0)
                    .slice(0, 6)
                    .map(([status, count]) => (
                      <div key={status} className="border border-black/8 px-2 py-2">
                        <p className="text-lg font-medium text-[var(--ca-app-ink)]">{count}</p>
                        <p className="text-[0.65rem] text-black/45">
                          {applicationStatusLabels[status as keyof typeof applicationStatusLabels]}
                        </p>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === "Applications" && (
          <div>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-black/55">
                Applicants for this requisition. Open an application to review evidence,
                interviews, and offer state without leaving the ATS.
              </p>
              <Link
                href={`/app/recruiting/jobs/${requisition.id}/pipeline`}
                className="text-sm font-medium text-[var(--ca-blue)] hover:underline"
              >
                Open pipeline board
              </Link>
            </div>
            <EmptyableList
              items={applicants}
              emptyLabel="No candidates have applied to this job yet."
              render={(applicant) => (
                <div
                  key={applicant.application.id}
                  className="grid grid-cols-1 items-center gap-3 border-b border-black/6 py-3 text-sm last:border-0 sm:grid-cols-[2fr_auto_1fr_1fr_auto]"
                >
                  <Link
                    href={`/app/recruiting/applications/${applicant.application.id}`}
                    className="flex items-center gap-3 hover:opacity-90"
                  >
                    <CandidateAvatar name={applicant.candidateName} />
                    <span>
                      <span className="block font-medium text-[var(--ca-app-ink)]">
                        {applicant.candidateName}
                      </span>
                      <span className="block text-xs text-black/45">
                        {applicant.candidateEmail}
                      </span>
                    </span>
                  </Link>
                  {applicant.matchScore !== undefined ? (
                    <span
                      className={cn(
                        "inline-flex w-fit items-center rounded-sm border px-2 py-0.5 text-xs font-semibold",
                        matchTone(applicant.matchScore),
                      )}
                    >
                      {Math.round(applicant.matchScore)}% match
                    </span>
                  ) : (
                    <span className="text-xs text-black/35">Not scored</span>
                  )}
                  <StageBadge stage={applicant.application.status} />
                  <span className="text-black/45">
                    {formatDate(applicant.application.appliedAt)}
                  </span>
                  <Link
                    href={`/app/recruiting/applications/${applicant.application.id}`}
                    className="text-sm font-medium text-[var(--ca-blue)] hover:underline"
                  >
                    Review
                  </Link>
                </div>
              )}
            />
          </div>
        )}

        {tab === "Candidate Match" && (
          <CandidateMatchForm
            jobs={[jobOption]}
            lockedRequisitionId={requisition.id}
            variant="embedded"
          />
        )}

        {tab === "Interviews" && (
          <div>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-black/55">
                Applications currently in interview stages for this requisition.
              </p>
              <Link
                href="/app/recruiting/interviews"
                className="text-sm font-medium text-[var(--ca-blue)] hover:underline"
              >
                All interviews
              </Link>
            </div>
            <EmptyableList
              items={interviewApplicants}
              emptyLabel="No interview-stage applications yet. Advance applicants from Applications or the pipeline."
              render={(applicant) => (
                <Link
                  key={applicant.application.id}
                  href={`/app/recruiting/applications/${applicant.application.id}`}
                  className="flex items-center justify-between gap-3 border-b border-black/6 py-3 text-sm last:border-0 hover:bg-[var(--ca-app-bg)]"
                >
                  <span className="font-medium text-[var(--ca-app-ink)]">
                    {applicant.candidateName}
                  </span>
                  <StageBadge stage={applicant.application.status} />
                </Link>
              )}
            />
          </div>
        )}

        {tab === "Offers" && (
          <div>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-black/55">
                Offer-stage applications. Accepted offers convert to the canonical
                employee record — do not create a second employee manually.
              </p>
              <Link
                href="/app/recruiting/offers"
                className="text-sm font-medium text-[var(--ca-blue)] hover:underline"
              >
                All offers
              </Link>
            </div>
            <EmptyableList
              items={offerApplicants}
              emptyLabel="No offer-stage applications yet."
              render={(applicant) => (
                <Link
                  key={applicant.application.id}
                  href={`/app/recruiting/applications/${applicant.application.id}`}
                  className="flex items-center justify-between gap-3 border-b border-black/6 py-3 text-sm last:border-0 hover:bg-[var(--ca-app-bg)]"
                >
                  <span className="font-medium text-[var(--ca-app-ink)]">
                    {applicant.candidateName}
                  </span>
                  <StageBadge stage={applicant.application.status} />
                </Link>
              )}
            />
          </div>
        )}

        {tab === "Activity" && (
          <div className="space-y-3 text-sm text-black/55">
            <p>
              Job-level activity consolidates application stage moves, match runs,
              interviews, and offers for this requisition.
            </p>
            <p className="text-black/45">
              Detailed timelines remain on each{" "}
              <button
                type="button"
                onClick={() => selectTab("Applications")}
                className="text-[var(--ca-blue)] hover:underline"
              >
                application
              </button>{" "}
              and in Administration → Audit.
            </p>
            <Link
              href="/workforce/audit"
              className="inline-flex text-sm font-medium text-[var(--ca-blue)] hover:underline"
            >
              Open audit log
            </Link>
          </div>
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
