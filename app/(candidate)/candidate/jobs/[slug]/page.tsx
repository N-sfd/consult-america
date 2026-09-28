import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import ProposalDraftButton from "@/components/candidate/proposal-draft-button";
import SaveJobButton from "@/components/candidate/save-job-button";
import { PageHeader } from "@/components/shared";
import { isJobSaved } from "@/lib/candidate/job-analyzer-store";
import { requireCandidateActor } from "@/lib/candidate/security";
import { getJobBySlug } from "@/lib/jobs";
import { getSupabaseServiceClient } from "@/app/lib/supabase/server";
import { recruitingRepository } from "@/lib/recruiting";
import { candidateApplicationStatusLabels } from "@/types/recruiting";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const job = await getJobBySlug(slug);
  return {
    title: job ? `${job.title} | Candidate` : "Job",
  };
}

export default async function CandidateJobDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const job = await getJobBySlug(slug);
  if (!job) notFound();

  const { session } = await requireCandidateActor();
  const profile = await recruitingRepository.getCandidateProfile(session.candidateId);
  const application = profile?.applications.find(
    (item) => item.requisitionId === job.requisitionId,
  );

  const client = getSupabaseServiceClient();
  let saved = false;
  if (client) {
    const { data } = await client
      .from("candidate_saved_jobs")
      .select("id")
      .eq("candidate_id", session.candidateId)
      .eq("job_requisition_id", job.requisitionId)
      .maybeSingle();
    saved = Boolean(data?.id);
  } else {
    saved = isJobSaved(session.candidateId, job.requisitionId);
  }

  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/candidate/jobs"
          className="text-sm font-medium text-[var(--ca-platform-mid)] hover:underline"
        >
          ← All jobs
        </Link>
        <div className="mt-3">
          <PageHeader
            eyebrow={`${job.location} · ${job.workplaceType} · ${job.employmentType}`}
            title={job.title}
            description={job.summary}
            actions={
              <div className="flex flex-wrap gap-2">
                <SaveJobButton
                  jobRequisitionId={job.requisitionId}
                  initiallySaved={saved}
                />
                {application ? (
                  <Link
                    href={`/candidate/applications/${application.applicationId}`}
                    className="rounded-lg border border-[var(--ca-platform-border)] px-3.5 py-2 text-sm font-semibold text-[var(--ca-platform-ink)]"
                  >
                    View application ({candidateApplicationStatusLabels[application.status]})
                  </Link>
                ) : (
                  <Link
                    href={`/jobs/${job.slug}/apply`}
                    className="rounded-lg bg-[var(--ca-platform-deep)] px-3.5 py-2 text-sm font-semibold text-white"
                  >
                    Apply
                  </Link>
                )}
                <Link
                  href={`/candidate/job-match?job=${job.requisitionId}`}
                  className="rounded-lg border border-[var(--ca-platform-border)] px-3.5 py-2 text-sm font-semibold text-[var(--ca-platform-ink)]"
                >
                  Run AI Job Analyzer
                </Link>
              </div>
            }
          />
        </div>
      </div>

      <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-6">
          <article className="ca-platform-card space-y-4 p-6">
            <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--ca-platform-muted)]">
              About the role
            </h2>
            <p className="text-sm leading-relaxed text-[var(--ca-platform-ink)] whitespace-pre-wrap">
              {job.description}
            </p>
          </article>

          {job.responsibilities.length > 0 ? (
            <article className="ca-platform-card space-y-3 p-6">
              <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--ca-platform-muted)]">
                Responsibilities
              </h2>
              <ul className="list-disc space-y-1 pl-5 text-sm text-[var(--ca-platform-ink)]">
                {job.responsibilities.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ) : null}

          {job.qualifications.length > 0 ? (
            <article className="ca-platform-card space-y-3 p-6">
              <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--ca-platform-muted)]">
                Qualifications
              </h2>
              <ul className="list-disc space-y-1 pl-5 text-sm text-[var(--ca-platform-ink)]">
                {job.qualifications.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ) : null}
        </div>

        <aside className="space-y-4">
          <div className="ca-platform-card space-y-3 p-5">
            <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--ca-platform-muted)]">
              AI Job Analyzer
            </h2>
            <p className="text-sm text-[var(--ca-platform-muted)]">
              Review this listing, create a tailored proposal, and auto-save the role.
            </p>
            <ProposalDraftButton
              jobRequisitionId={job.requisitionId}
              jobTitle={job.title}
              jobSummary={job.summary}
              location={job.location}
            />
          </div>
          <div className="ca-platform-card space-y-2 p-5 text-sm text-[var(--ca-platform-muted)]">
            <p>
              <span className="font-semibold text-[var(--ca-platform-ink)]">Department:</span>{" "}
              {job.department}
            </p>
            <p>
              <span className="font-semibold text-[var(--ca-platform-ink)]">Posted:</span>{" "}
              {job.postedAt}
            </p>
            <Link
              href="/candidate/profile"
              className="inline-block font-semibold text-[var(--ca-platform-mid)] hover:underline"
            >
              Update personal information →
            </Link>
          </div>
        </aside>
      </section>
    </div>
  );
}
