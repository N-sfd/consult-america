import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import JobApplicationForm from "@/components/jobs/job-application-form";
import { PageHeader } from "@/components/shared";
import { careerAreaLabels } from "@/data/jobs";
import { getOptionalCandidateSession } from "@/lib/candidate/session";
import { getAllJobSlugs, getJobBySlug } from "@/lib/jobs";
import { recruitingRepository } from "@/lib/recruiting";
import { isSupabaseConfigured } from "@/app/lib/supabase/server";

interface JobApplyPageProps {
  params: Promise<{ slug: string }>;
}

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  const slugs = await getAllJobSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: JobApplyPageProps): Promise<Metadata> {
  const { slug } = await params;
  const job = await getJobBySlug(slug);

  if (!job) {
    return { title: { absolute: "Apply | Consult America Careers" } };
  }

  return {
    title: { absolute: `Apply — ${job.title} | Consult America Careers` },
    description: `Apply for the ${job.title} opportunity at Consult America.`,
  };
}

/**
 * Calm operational Apply surface — brand tokens without marketing density.
 * Decorative photography / motion belong on Jobs landing, not here.
 */
export default async function JobApplyPage({ params }: JobApplyPageProps) {
  const { slug } = await params;
  const job = await getJobBySlug(slug);

  if (!job) {
    notFound();
  }

  const session = await getOptionalCandidateSession();
  let existingResume: {
    id: string;
    fileName: string;
    uploadedAt: string;
    fileSize?: number;
  } | null = null;

  if (session) {
    const profile = await recruitingRepository.getCandidateProfile(
      session.candidateId,
    );
    const resume =
      profile?.documents.find(
        (d) =>
          d.documentType === "RESUME" &&
          d.isPrimaryResume &&
          (d.status === "ACTIVE" || !d.status),
      ) ??
      profile?.documents.find(
        (d) =>
          d.documentType === "RESUME" && (d.status === "ACTIVE" || !d.status),
      );
    if (resume) {
      existingResume = {
        id: resume.id,
        fileName: resume.fileName,
        uploadedAt: resume.uploadedAt,
        fileSize: resume.fileSize,
      };
    }
  }

  return (
    <div className="experience-app min-h-[70vh]">
      <div className="border-b border-[var(--exp-border)] bg-white">
        <div className="mx-auto max-w-[1040px] px-5 py-3 md:px-8">
          <Link
            href={`/jobs/${job.slug}`}
            className="text-sm font-medium text-[var(--exp-muted)] transition-colors hover:text-[var(--exp-accent)]"
          >
            ← Back to role
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-[1040px] space-y-8 px-5 py-8 md:px-8 md:py-10">
        <PageHeader
          eyebrow="Apply"
          title={job.title}
          description={`${careerAreaLabels[job.careerArea]} · ${job.location} · ${job.workplaceType} · ${job.employmentType}`}
          meta={
            <nav className="ca-workflow-lineage" aria-label="Hiring workflow">
              <span aria-current="step">Apply</span>
              <span className="ca-workflow-sep" aria-hidden>
                →
              </span>
              <span>Profile</span>
              <span className="ca-workflow-sep" aria-hidden>
                →
              </span>
              <span>Match</span>
              <span className="ca-workflow-sep" aria-hidden>
                →
              </span>
              <span>Review</span>
              <span className="ca-workflow-sep" aria-hidden>
                →
              </span>
              <span>Interview</span>
              <span className="ca-workflow-sep" aria-hidden>
                →
              </span>
              <span>Offer</span>
            </nav>
          }
        />

        <section className="ca-app-panel p-5 sm:p-6">
          <h2 className="text-sm font-semibold text-[var(--exp-text)]">
            Application
          </h2>
          <p className="mt-1 text-sm text-[var(--exp-muted)]">
            Complete the steps below. You can reuse an existing resume if you
            already have a candidate account.
          </p>
          <div className="mt-6">
            <JobApplicationForm
              jobTitle={job.title}
              jobSlug={job.slug}
              requisitionId={job.requisitionId}
              postingId={job.id}
              department={job.department}
              location={job.location}
              workplaceType={job.workplaceType}
              employmentType={job.employmentType}
              existingResume={existingResume}
              supabaseConnected={isSupabaseConfigured()}
              prefill={
                session
                  ? {
                      firstName: session.displayName.split(" ")[0] ?? "",
                      lastName: session.displayName.split(" ").slice(1).join(" "),
                      email: session.email,
                    }
                  : undefined
              }
            />
          </div>
        </section>
      </div>
    </div>
  );
}
