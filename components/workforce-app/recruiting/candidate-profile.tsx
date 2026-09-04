"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

import { formatDate, formatDateTime } from "@/lib/recruiting/format";
import type { CandidateProfileDetail as CandidateProfileData } from "@/lib/recruiting/repository";
import { cn } from "@/lib/utils";
import { applicationStatusLabels } from "@/types/recruiting";

const TABS = [
  "Overview",
  "Resume",
  "Experience",
  "Applications",
  "Interviews",
  "Feedback",
  "Documents",
  "Activity",
] as const;

type Tab = (typeof TABS)[number];

export default function CandidateProfile({
  profile,
}: {
  profile: CandidateProfileData;
}) {
  const [tab, setTab] = useState<Tab>("Overview");
  const { candidate, applications, experience, education, skills, documents, interviews, feedback, activities } =
    profile;

  const latestApplication = [...applications].sort(
    (a, b) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime(),
  )[0];

  const fullName = candidate.preferredName
    ? `${candidate.preferredName} ${candidate.lastName}`
    : `${candidate.firstName} ${candidate.lastName}`;

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-6 lg:px-8 lg:py-8">
      <Link
        href="/app/recruiting/candidates"
        className="inline-flex items-center gap-1 text-sm text-black/50 hover:text-[var(--ca-blue)]"
      >
        <ChevronLeft className="h-3.5 w-3.5" />
        Back to candidates
      </Link>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-4 border border-black/8 bg-white px-5 py-5 lg:px-6">
        <div>
          <h1 className="text-2xl font-medium tracking-[-0.03em] text-[var(--ca-app-ink)]">
            {fullName}
          </h1>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-black/55">
            {latestApplication && <span>{latestApplication.requisitionTitle}</span>}
            {latestApplication && <span className="text-black/25">·</span>}
            <span className="text-[var(--ca-blue)]">
              {latestApplication
                ? applicationStatusLabels[latestApplication.status]
                : "No active application"}
            </span>
            <span className="text-black/25">·</span>
            <span>Match —</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <a
            href={`mailto:${candidate.email}`}
            className="border border-black/10 px-3 py-1.5 text-sm font-medium text-[var(--ca-app-ink)] transition-colors hover:border-[var(--ca-blue)] hover:text-[var(--ca-blue)]"
          >
            Email
          </a>
          <button
            type="button"
            disabled
            title="Interview scheduling is coming soon"
            className="cursor-not-allowed border border-black/10 px-3 py-1.5 text-sm font-medium text-black/30"
          >
            Schedule
          </button>
          <button
            type="button"
            disabled
            title="Stage transitions are coming soon"
            className="cursor-not-allowed border border-black/10 px-3 py-1.5 text-sm font-medium text-black/30"
          >
            Move Stage
          </button>
          <button
            type="button"
            disabled
            className="cursor-not-allowed border border-black/10 px-3 py-1.5 text-sm font-medium text-black/30"
          >
            More
          </button>
        </div>
      </div>

      <div className="mt-6 flex gap-1 overflow-x-auto border-b border-black/8">
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
          </button>
        ))}
      </div>

      <div className="mt-6 border border-black/8 bg-white p-5 lg:p-6">
        {tab === "Overview" && (
          <div className="grid gap-6 sm:grid-cols-2">
            <Field label="Email" value={candidate.email} />
            <Field label="Phone" value={candidate.phone ?? "—"} />
            <Field
              label="Work Authorization"
              value={candidate.workAuthorization ?? "—"}
            />
            <Field
              label="Willing to Relocate"
              value={
                candidate.willingToRelocate === undefined
                  ? "—"
                  : candidate.willingToRelocate
                    ? "Yes"
                    : "No"
              }
            />
            <Field label="Source" value={candidate.source ?? "—"} />
            <Field label="LinkedIn" value={candidate.linkedinUrl ?? "—"} />
            <div className="sm:col-span-2">
              <p className="text-[0.65rem] uppercase tracking-[0.1em] text-black/40">
                Skills
              </p>
              {skills.length ? (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {skills.map((skill) => (
                    <span
                      key={skill.id}
                      className="border border-black/10 px-2 py-0.5 text-xs text-black/60"
                    >
                      {skill.skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="mt-1 text-sm text-black/45">No skills on file.</p>
              )}
            </div>
          </div>
        )}

        {tab === "Resume" && (
          <EmptyableList
            items={documents.filter((d) => d.documentType === "RESUME")}
            emptyLabel="No resume on file."
            render={(doc) => (
              <a
                key={doc.id}
                href={doc.storagePath}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between border-b border-black/6 py-3 text-sm last:border-0 hover:text-[var(--ca-blue)]"
              >
                <span>{doc.fileName}</span>
                <span className="text-black/45">
                  {formatDate(doc.uploadedAt)}
                </span>
              </a>
            )}
          />
        )}

        {tab === "Experience" && (
          <div className="space-y-6">
            {experience.length === 0 && education.length === 0 && (
              <p className="text-sm text-black/45">No experience on file.</p>
            )}
            {experience.length > 0 && (
              <div>
                <p className="text-[0.65rem] uppercase tracking-[0.1em] text-black/40">
                  Work History
                </p>
                <div className="mt-2 space-y-4">
                  {experience.map((job) => (
                    <div key={job.id} className="border-b border-black/6 pb-4 last:border-0">
                      <p className="font-medium text-[var(--ca-app-ink)]">
                        {job.title} · {job.company}
                      </p>
                      <p className="mt-0.5 text-xs text-black/45">
                        {formatDate(job.startDate)} —{" "}
                        {job.isCurrent ? "Present" : formatDate(job.endDate)}
                      </p>
                      {job.description && (
                        <p className="mt-1.5 text-sm text-black/60">
                          {job.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {education.length > 0 && (
              <div>
                <p className="text-[0.65rem] uppercase tracking-[0.1em] text-black/40">
                  Education
                </p>
                <div className="mt-2 space-y-3">
                  {education.map((ed) => (
                    <div key={ed.id}>
                      <p className="font-medium text-[var(--ca-app-ink)]">
                        {ed.institution}
                      </p>
                      <p className="text-xs text-black/45">
                        {[ed.degree, ed.fieldOfStudy].filter(Boolean).join(", ") || "—"}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {tab === "Applications" && (
          <EmptyableList
            items={applications}
            emptyLabel="No applications on file."
            render={(app) => (
              <div
                key={app.applicationId}
                className="grid grid-cols-2 gap-2 border-b border-black/6 py-3 text-sm last:border-0 sm:grid-cols-4"
              >
                <span className="font-medium text-[var(--ca-app-ink)]">
                  {app.requisitionTitle}
                </span>
                <span className="text-black/45">{app.applicationNumber}</span>
                <span className="text-[var(--ca-blue)]">
                  {applicationStatusLabels[app.status]}
                </span>
                <span className="text-black/45">{formatDate(app.appliedAt)}</span>
              </div>
            )}
          />
        )}

        {tab === "Interviews" && (
          <EmptyableList
            items={interviews}
            emptyLabel="No interviews scheduled."
            render={(interview) => (
              <div
                key={interview.id}
                className="grid grid-cols-2 gap-2 border-b border-black/6 py-3 text-sm last:border-0 sm:grid-cols-4"
              >
                <span className="font-medium text-[var(--ca-app-ink)]">
                  {interview.requisitionTitle}
                </span>
                <span className="text-black/45">{interview.interviewType}</span>
                <span className="text-black/45">
                  {formatDateTime(interview.scheduledAt)}
                </span>
                <span className="text-[var(--ca-blue)]">{interview.status}</span>
              </div>
            )}
          />
        )}

        {tab === "Feedback" && (
          <EmptyableList
            items={feedback}
            emptyLabel="No interview feedback yet."
            render={(fb) => (
              <div key={fb.id} className="border-b border-black/6 py-3 text-sm last:border-0">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-[var(--ca-app-ink)]">
                    {fb.recommendation.replace("_", " ")}
                  </span>
                  {fb.score != null && (
                    <span className="text-black/45">Score: {fb.score}</span>
                  )}
                </div>
                {fb.strengths && (
                  <p className="mt-1 text-black/60">Strengths: {fb.strengths}</p>
                )}
                {fb.concerns && (
                  <p className="mt-1 text-black/60">Concerns: {fb.concerns}</p>
                )}
                {fb.notes && <p className="mt-1 text-black/60">{fb.notes}</p>}
              </div>
            )}
          />
        )}

        {tab === "Documents" && (
          <EmptyableList
            items={documents}
            emptyLabel="No documents on file."
            render={(doc) => (
              <a
                key={doc.id}
                href={doc.storagePath}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between border-b border-black/6 py-3 text-sm last:border-0 hover:text-[var(--ca-blue)]"
              >
                <span>
                  {doc.fileName}{" "}
                  <span className="text-black/40">({doc.documentType})</span>
                </span>
                <span className="text-black/45">{formatDate(doc.uploadedAt)}</span>
              </a>
            )}
          />
        )}

        {tab === "Activity" && (
          <EmptyableList
            items={activities}
            emptyLabel="No activity recorded yet."
            render={(activity) => (
              <div key={activity.id} className="border-b border-black/6 py-3 text-sm last:border-0">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-[var(--ca-app-ink)]">
                    {activity.summary}
                  </span>
                  <span className="text-black/45">
                    {formatDateTime(activity.createdAt)}
                  </span>
                </div>
              </div>
            )}
          />
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
