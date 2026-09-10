"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

import RecruiterCandidateDocuments, {
  ApplicationSubmittedDocuments,
} from "@/components/workforce-app/recruiting/recruiter-candidate-documents";
import InterviewStatusActions from "@/components/workforce-app/recruiting/interview-status-actions";
import SubmitInterviewFeedbackButton from "@/components/workforce-app/recruiting/submit-interview-feedback-button";
import { formatDate, formatDateTime } from "@/lib/recruiting/format";
import type { CandidateProfileDetail as CandidateProfileData } from "@/lib/recruiting/repository";
import { cn } from "@/lib/utils";
import { employmentTypeLabels, workplaceTypeLabels } from "@/types/organization";
import { applicationStatusLabels } from "@/types/recruiting";

const TABS = [
  "Overview",
  "Profile",
  "Experience",
  "Education",
  "Skills",
  "Applications",
  "Documents",
  "Interviews",
  "Offer",
  "Activity",
] as const;

type Tab = (typeof TABS)[number];

export default function CandidateProfile({
  profile,
}: {
  profile: CandidateProfileData;
}) {
  const [tab, setTab] = useState<Tab>("Overview");
  const { candidate, applications, experience, education, skills, documents, applicationDocumentLinks, statusHistory, offers, interviews, feedback, activities } =
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
              label="Location"
              value={
                [candidate.city, candidate.state].filter(Boolean).join(", ") || "—"
              }
            />
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
            <div className="sm:col-span-2">
              <p className="text-[0.65rem] uppercase tracking-[0.1em] text-black/40">
                Current Resume
              </p>
              {(() => {
                const primary = documents.find(
                  (d) =>
                    d.documentType === "RESUME" &&
                    (d.isPrimaryResume || d.status === "ACTIVE"),
                );
                return (
                  <p className="mt-1 text-sm text-[var(--ca-app-ink)]">
                    {primary
                      ? `${primary.fileName}${primary.isPrimaryResume ? " · Current" : ""}`
                      : "No primary resume on file."}
                  </p>
                );
              })()}
            </div>
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

        {tab === "Profile" && (
          <div className="grid gap-6 sm:grid-cols-2">
            <Field label="First Name" value={candidate.firstName} />
            <Field label="Last Name" value={candidate.lastName} />
            <Field label="Preferred Name" value={candidate.preferredName ?? "—"} />
            <Field label="Email" value={candidate.email} />
            <Field label="Phone" value={candidate.phone ?? "—"} />
            <Field label="City" value={candidate.city ?? "—"} />
            <Field label="State" value={candidate.state ?? "—"} />
            <Field label="LinkedIn" value={candidate.linkedinUrl ?? "—"} />
            <Field label="Portfolio" value={candidate.portfolioUrl ?? "—"} />
            <Field label="GitHub" value={candidate.githubUrl ?? "—"} />
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
            <div className="sm:col-span-2">
              <p className="text-[0.65rem] uppercase tracking-[0.1em] text-black/40">
                Professional Summary
              </p>
              <p className="mt-1 whitespace-pre-wrap text-sm text-[var(--ca-app-ink)]">
                {candidate.professionalSummary?.trim() || "—"}
              </p>
            </div>
          </div>
        )}

        {tab === "Experience" && (
          <div className="space-y-6">
            {experience.length === 0 ? (
              <p className="text-sm text-black/45">No experience on file.</p>
            ) : (
              <div className="space-y-4">
                {experience.map((job) => (
                  <div key={job.id} className="border-b border-black/6 pb-4 last:border-0">
                    <p className="font-medium text-[var(--ca-app-ink)]">
                      {job.title} · {job.company}
                    </p>
                    {job.location && (
                      <p className="mt-0.5 text-xs text-black/45">{job.location}</p>
                    )}
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
            )}
          </div>
        )}

        {tab === "Education" && (
          <div className="space-y-3">
            {education.length === 0 ? (
              <p className="text-sm text-black/45">No education on file.</p>
            ) : (
              education.map((ed) => (
                <div key={ed.id} className="border-b border-black/6 pb-3 last:border-0">
                  <p className="font-medium text-[var(--ca-app-ink)]">
                    {ed.institution}
                  </p>
                  <p className="text-xs text-black/45">
                    {[ed.degree, ed.fieldOfStudy].filter(Boolean).join(", ") || "—"}
                  </p>
                  {(ed.startDate || ed.endDate) && (
                    <p className="mt-1 text-xs text-black/45">
                      {[ed.startDate, ed.endDate].filter(Boolean).join(" — ")}
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {tab === "Skills" && (
          skills.length ? (
            <div className="flex flex-wrap gap-1.5">
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
            <p className="text-sm text-black/45">No skills on file.</p>
          )
        )}

        {tab === "Applications" && (
          <EmptyableList
            items={applications}
            emptyLabel="No applications on file."
            render={(app) => {
              const appHistory = (statusHistory ?? [])
                .filter((h) => h.applicationId === app.applicationId)
                .sort(
                  (a, b) =>
                    new Date(a.createdAt).getTime() -
                    new Date(b.createdAt).getTime(),
                );
              const appOffer = (offers ?? []).find(
                (o) => o.applicationId === app.applicationId,
              );
              return (
              <div
                key={app.applicationId}
                className="space-y-3 border-b border-black/6 py-4 last:border-0"
              >
                <div className="grid grid-cols-2 gap-2 text-sm sm:grid-cols-5">
                  <span className="font-medium text-[var(--ca-app-ink)]">
                    {app.requisitionTitle}
                  </span>
                  <span className="text-black/45">{app.applicationNumber}</span>
                  <span className="text-[var(--ca-blue)]">
                    {applicationStatusLabels[app.status]}
                  </span>
                  <span className="text-black/45">
                    {app.employmentType ? employmentTypeLabels[app.employmentType] : "—"}
                  </span>
                  <span className="text-black/45">{formatDate(app.appliedAt)}</span>
                </div>
                <ApplicationSubmittedDocuments
                  applicationId={app.applicationId}
                  documents={documents}
                  applicationDocumentLinks={applicationDocumentLinks}
                />
                {appOffer ? (
                  <p className="text-sm text-black/60">
                    Offer: {appOffer.offerNumber} · {appOffer.status}
                  </p>
                ) : null}
                {appHistory.length > 0 ? (
                  <div>
                    <p className="text-[0.65rem] uppercase tracking-[0.1em] text-black/40">
                      Status History
                    </p>
                    <ul className="mt-2 space-y-1.5 text-sm text-black/65">
                      {appHistory.map((entry) => (
                        <li key={entry.id} className="flex justify-between gap-3">
                          <span>
                            {entry.fromStatus
                              ? `${applicationStatusLabels[entry.fromStatus]} → ${applicationStatusLabels[entry.toStatus]}`
                              : applicationStatusLabels[entry.toStatus]}
                            {entry.note ? ` — ${entry.note}` : ""}
                          </span>
                          <span className="shrink-0 text-black/40">
                            {formatDate(entry.createdAt)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
              );
            }}
          />
        )}

        {tab === "Documents" && (
          <div className="space-y-6">
            <div>
              <p className="text-[0.65rem] uppercase tracking-[0.1em] text-black/40">
                Current Resume
              </p>
              <RecruiterCandidateDocuments
                documents={documents.filter(
                  (d) =>
                    d.documentType === "RESUME" &&
                    (d.isPrimaryResume || d.status === "ACTIVE"),
                )}
                applicationDocumentLinks={[]}
              />
            </div>
            <div>
              <p className="mb-2 text-[0.65rem] uppercase tracking-[0.1em] text-black/40">
                All Documents &amp; Application History
              </p>
              <RecruiterCandidateDocuments
                documents={documents}
                applicationDocumentLinks={applicationDocumentLinks}
              />
            </div>
          </div>
        )}

        {tab === "Interviews" && (
          <div className="space-y-6">
            <EmptyableList
              items={interviews}
              emptyLabel="No interviews scheduled."
              render={(interview) => (
                <div
                  key={interview.id}
                  className="space-y-2 border-b border-black/6 py-3 text-sm last:border-0"
                >
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    <span className="font-medium text-[var(--ca-app-ink)]">
                      {interview.requisitionTitle}
                    </span>
                    <span className="text-black/45">{interview.interviewType}</span>
                    <span className="text-black/45">
                      {formatDateTime(interview.scheduledAt)} ·{" "}
                      {interview.durationMinutes} min
                    </span>
                    <InterviewStatusActions
                      interviewId={interview.id}
                      applicationId={interview.applicationId}
                      requisitionId={
                        applications.find(
                          (a) => a.applicationId === interview.applicationId,
                        )?.requisitionId ?? ""
                      }
                      status={interview.status}
                    />
                  </div>
                  {interview.locationOrLink ? (
                    <p className="text-black/55">
                      Location/link: {interview.locationOrLink}
                    </p>
                  ) : null}
                  <SubmitInterviewFeedbackButton
                    interviewId={interview.id}
                    applicationId={interview.applicationId}
                    candidateId={candidate.id}
                  />
                </div>
              )}
            />
            <div>
              <p className="mb-2 text-[0.65rem] uppercase tracking-[0.1em] text-black/40">
                Interview Feedback
              </p>
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
            </div>
          </div>
        )}

        {tab === "Offer" && (
          <EmptyableList
            items={offers ?? []}
            emptyLabel="No offers on file."
            render={(offer) => (
              <div
                key={offer.id}
                className="border-b border-black/6 py-3 text-sm last:border-0"
              >
                <p className="font-medium text-[var(--ca-app-ink)]">
                  {offer.offerNumber} · {offer.status}
                </p>
                <p className="mt-1 text-black/55">
                  {employmentTypeLabels[offer.employmentType]} ·{" "}
                  {workplaceTypeLabels[offer.workplaceType]} · Start {offer.startDate}
                  {offer.expirationDate ? ` · Expires ${offer.expirationDate}` : ""}
                </p>
                <p className="mt-1 text-black/55">
                  {offer.baseSalary != null
                    ? `${offer.currency} ${offer.baseSalary} salary`
                    : offer.hourlyRate != null
                      ? `${offer.currency} ${offer.hourlyRate}/hr`
                      : "No compensation on file."}
                </p>
                {offer.termsSummary ? (
                  <p className="mt-1 whitespace-pre-wrap text-black/55">
                    {offer.termsSummary}
                  </p>
                ) : null}
              </div>
            )}
          />
        )}

        {tab === "Activity" && (
          <div className="space-y-3">
            <p className="text-[0.65rem] uppercase tracking-[0.1em] text-black/40">
              Timeline
            </p>
            {(statusHistory ?? []).length === 0 && activities.length === 0 ? (
              <p className="py-8 text-center text-sm text-black/40">
                No activity recorded yet.
              </p>
            ) : (
              <ul className="space-y-2">
                {[
                  ...(statusHistory ?? []).map((entry) => ({
                    id: `hist-${entry.id}`,
                    at: entry.createdAt,
                    summary: entry.fromStatus
                      ? `${applicationStatusLabels[entry.fromStatus]} → ${applicationStatusLabels[entry.toStatus]}`
                      : applicationStatusLabels[entry.toStatus],
                    note: entry.note,
                  })),
                  ...activities.map((activity) => ({
                    id: activity.id,
                    at: activity.createdAt,
                    summary: activity.summary,
                    note: undefined as string | undefined,
                  })),
                ]
                  .sort(
                    (a, b) =>
                      new Date(b.at).getTime() - new Date(a.at).getTime(),
                  )
                  .map((item) => (
                    <li
                      key={item.id}
                      className="flex justify-between gap-3 border-b border-black/6 py-3 text-sm last:border-0"
                    >
                      <span className="text-[var(--ca-app-ink)]">
                        {item.summary}
                        {item.note ? (
                          <span className="text-black/50"> — {item.note}</span>
                        ) : null}
                      </span>
                      <span className="shrink-0 text-black/45">
                        {formatDateTime(item.at)}
                      </span>
                    </li>
                  ))}
              </ul>
            )}
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
