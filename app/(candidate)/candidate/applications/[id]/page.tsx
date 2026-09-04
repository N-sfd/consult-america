import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { formatDateTime } from "@/lib/recruiting/format";
import { recruitingRepository } from "@/lib/recruiting";
import { requireCandidateActor } from "@/lib/candidate/security";
import { applicationStatusLabels } from "@/types/recruiting";

export const metadata: Metadata = {
  title: "Application | ConsultAmerica",
};

export const dynamic = "force-dynamic";

export default async function CandidateApplicationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { session } = await requireCandidateActor();
  const profile = await recruitingRepository.getCandidateProfile(
    session.candidateId,
  );

  const application = profile?.applications.find((a) => a.applicationId === id);
  if (!application) notFound();

  const timeline = (profile?.activities ?? []).filter(
    (activity) => activity.applicationId === id,
  );

  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/candidate/applications"
          className="text-sm font-medium text-[var(--ca-blue)] hover:underline"
        >
          ← All applications
        </Link>
        <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em]">
          {application.requisitionTitle}
        </h1>
        <p className="mt-2 text-black/55">
          {application.applicationNumber} · {application.postingLocation}
        </p>
      </div>

      <section className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-black/10 bg-white p-5">
          <p className="text-xs uppercase tracking-[0.12em] text-black/40">
            Status
          </p>
          <p className="mt-3 text-lg font-semibold">
            {applicationStatusLabels[application.status]}
          </p>
        </div>
        <div className="rounded-lg border border-black/10 bg-white p-5">
          <p className="text-xs uppercase tracking-[0.12em] text-black/40">
            Applied
          </p>
          <p className="mt-3 text-lg font-semibold">
            {formatDateTime(application.appliedAt)}
          </p>
        </div>
        <div className="rounded-lg border border-black/10 bg-white p-5">
          <p className="text-xs uppercase tracking-[0.12em] text-black/40">
            Last Updated
          </p>
          <p className="mt-3 text-lg font-semibold">
            {formatDateTime(application.updatedAt)}
          </p>
        </div>
      </section>

      <section className="rounded-lg border border-black/10 bg-white p-6">
        <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-black/40">
          Timeline
        </h2>
        {timeline.length === 0 ? (
          <p className="mt-4 text-sm text-black/50">No activity recorded yet.</p>
        ) : (
          <ul className="mt-4 space-y-3 text-sm">
            {timeline.map((activity) => (
              <li key={activity.id} className="flex justify-between gap-3">
                <span className="text-black/70">{activity.summary}</span>
                <span className="shrink-0 text-black/40">
                  {formatDateTime(activity.createdAt)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
