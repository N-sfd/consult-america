import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import ApplicationQuickActions from "@/components/workforce-app/recruiting/application-quick-actions";
import { candidateStageFor } from "@/lib/recruiting/candidate-stage";
import { recruitingRepository } from "@/lib/recruiting";
import { getWorkforceSession } from "@/lib/workforce/session";
import {
  applicationStatusLabels,
  candidateInterviewStatusLabels,
  offerStatusLabels,
} from "@/types/recruiting";

export const metadata: Metadata = { title: "Application" };
export const dynamic = "force-dynamic";

function formatDate(value?: string) {
  if (!value) return "—";
  return new Date(value).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatDay(value?: string) {
  if (!value) return "—";
  const dateOnly = /^\d{4}-\d{2}-\d{2}$/.test(value);
  const date = dateOnly ? new Date(`${value}T00:00:00`) : new Date(value);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default async function ApplicationDetailPage({
  params,
}: {
  params: Promise<{ applicationId: string }>;
}) {
  await getWorkforceSession();
  const { applicationId } = await params;

  const queue = await recruitingRepository.listApplicationsQueue();
  const queueItem = queue.find((row) => row.applicationId === applicationId);
  const application = await recruitingRepository.getApplicationById(applicationId);
  if (!application && !queueItem) notFound();

  const candidateId = queueItem?.candidateId ?? application?.candidateId;
  const detail = candidateId
    ? await recruitingRepository.getCandidateProfile(candidateId)
    : undefined;

  const appSummary = detail?.applications.find((a) => a.applicationId === applicationId);
  const interviews =
    detail?.interviews.filter((i) => i.applicationId === applicationId) ?? [];
  const offers = detail?.offers?.filter((o) => o.applicationId === applicationId) ?? [];
  const history =
    detail?.statusHistory?.filter((h) => h.applicationId === applicationId) ?? [];
  const activities =
    detail?.activities.filter((a) => a.applicationId === applicationId) ?? [];
  const docs =
    detail?.applicationDocumentLinks?.filter((d) => d.applicationId === applicationId) ??
    [];

  const status = (queueItem?.status ?? application?.status)!;
  const jobTitle =
    queueItem?.jobTitle ?? appSummary?.requisitionTitle ?? "Role";
  const candidateName =
    queueItem?.candidateName ??
    (detail
      ? `${detail.candidate.firstName} ${detail.candidate.lastName}`
      : "Candidate");

  return (
    <div className="mx-auto max-w-[1200px] space-y-6 px-4 py-6 lg:px-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[0.7rem] uppercase tracking-[0.14em] text-black/40">
            Application
          </p>
          <h1 className="mt-2 font-serif text-2xl font-semibold tracking-[-0.03em]">
            {candidateName}
          </h1>
          <p className="mt-2 text-sm text-black/55">
            {queueItem?.applicationNumber ?? applicationId} · {jobTitle} ·{" "}
            {candidateStageFor(status)} (
            {applicationStatusLabels[status]})
          </p>
        </div>
        <div className="flex flex-wrap gap-2 text-sm">
          {candidateId ? (
            <Link
              href={`/app/recruiting/candidates/${candidateId}`}
              className="rounded-md border border-black/15 px-3 py-1.5 font-medium text-black/70 hover:bg-black/[0.03]"
            >
              Candidate
            </Link>
          ) : null}
          {queueItem?.requisitionId || application?.requisitionId ? (
            <Link
              href={`/app/recruiting/jobs/${queueItem?.requisitionId ?? application?.requisitionId}/pipeline`}
              className="rounded-md border border-black/15 px-3 py-1.5 font-medium text-black/70 hover:bg-black/[0.03]"
            >
              Job pipeline
            </Link>
          ) : null}
        </div>
      </div>

      <section className="rounded-lg border border-black/10 bg-white p-5">
        <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-black/40">
          Quick actions
        </h2>
        <div className="mt-3">
          <ApplicationQuickActions
            applicationId={applicationId}
            requisitionId={queueItem?.requisitionId ?? application?.requisitionId}
            currentStatus={status}
          />
        </div>
        <p className="mt-3 text-xs text-black/45">
          Only transitions allowed by the application status machine are shown.
          Hire conversion still requires an accepted offer where applicable.
        </p>
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-lg border border-black/10 bg-white p-5">
          <h2 className="font-serif text-lg font-semibold">Candidate summary</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between gap-3">
              <dt className="text-black/45">Email</dt>
              <dd>{queueItem?.candidateEmail ?? detail?.candidate.email ?? "—"}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-black/45">Phone</dt>
              <dd>{detail?.candidate.phone ?? "—"}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-black/45">Source</dt>
              <dd>{detail?.candidate.source ?? "—"}</dd>
            </div>
          </dl>
        </section>

        <section className="rounded-lg border border-black/10 bg-white p-5">
          <h2 className="font-serif text-lg font-semibold">Job summary</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between gap-3">
              <dt className="text-black/45">Role</dt>
              <dd>{jobTitle}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-black/45">Department</dt>
              <dd>{queueItem?.departmentName ?? "—"}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-black/45">Location</dt>
              <dd>{queueItem?.locationName ?? "—"}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-black/45">Applied</dt>
              <dd>{formatDay(queueItem?.appliedAt ?? application?.appliedAt)}</dd>
            </div>
          </dl>
        </section>

        <section className="rounded-lg border border-black/10 bg-white p-5">
          <h2 className="font-serif text-lg font-semibold">Submitted resume</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {docs.map((doc) => (
              <li key={doc.id} className="text-black/70">
                {doc.documentRole || doc.purpose || "Document"} · attached{" "}
                {formatDay(doc.attachedAt || doc.createdAt)}
              </li>
            ))}
            {docs.length === 0 && (
              <li className="text-black/45">No application documents linked.</li>
            )}
          </ul>
        </section>

        <section className="rounded-lg border border-black/10 bg-white p-5">
          <h2 className="font-serif text-lg font-semibold">Application answers</h2>
          <p className="mt-3 whitespace-pre-wrap text-sm text-black/70">
            {application?.coverLetter ||
              application?.additionalInformation ||
              "No cover letter or additional information on file."}
          </p>
        </section>

        <section className="rounded-lg border border-black/10 bg-white p-5">
          <h2 className="font-serif text-lg font-semibold">Interview history</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {interviews.map((interview) => (
              <li key={interview.id}>
                {interview.interviewType.replaceAll("_", " ")} ·{" "}
                {candidateInterviewStatusLabels[interview.status]} ·{" "}
                {formatDate(interview.scheduledAt)}
              </li>
            ))}
            {interviews.length === 0 && (
              <li className="text-black/45">No interviews yet.</li>
            )}
          </ul>
        </section>

        <section className="rounded-lg border border-black/10 bg-white p-5">
          <h2 className="font-serif text-lg font-semibold">Offer status</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {offers.map((offer) => (
              <li key={offer.id}>
                {offerStatusLabels[offer.status]} · start {formatDay(offer.startDate)}
              </li>
            ))}
            {offers.length === 0 && (
              <li className="text-black/45">No offer on this application.</li>
            )}
          </ul>
        </section>
      </div>

      <section className="rounded-lg border border-black/10 bg-white p-5">
        <h2 className="font-serif text-lg font-semibold">Activity timeline</h2>
        <ul className="mt-4 space-y-3">
          {history.map((event) => (
            <li key={event.id} className="text-sm">
              <p className="font-medium">
                {applicationStatusLabels[event.toStatus]}
                {event.fromStatus
                  ? ` ← ${applicationStatusLabels[event.fromStatus]}`
                  : ""}
              </p>
              <p className="mt-1 text-xs text-black/45">{formatDate(event.createdAt)}</p>
            </li>
          ))}
          {activities.map((activity) => (
            <li key={activity.id} className="text-sm">
              <p className="font-medium">{activity.summary}</p>
              <p className="mt-1 text-xs text-black/45">
                {activity.activityType} · {formatDate(activity.createdAt)}
              </p>
            </li>
          ))}
          {history.length === 0 && activities.length === 0 && (
            <li className="text-sm text-black/45">No activity recorded yet.</li>
          )}
        </ul>
      </section>

      <Link
        href="/app/recruiting/applications"
        className="inline-block text-sm text-[var(--ca-platform-mid)] hover:underline"
      >
        ← Back to applications
      </Link>
    </div>
  );
}
