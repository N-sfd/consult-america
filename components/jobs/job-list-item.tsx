import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import SaveJobButton from "@/components/candidate/save-job-button";
import { careerAreaLabels, formatPostedDate, type Job } from "@/lib/jobs";
import { isPracticeJob } from "@/lib/jobs/candidate-catalog";

interface JobListItemProps {
  job: Job;
  /** Candidate-portal CTA when an application already exists for this role */
  applicationCta?: {
    label: string;
    href: string;
  };
  /** When true, row links into the candidate portal detail shell */
  portalMode?: boolean;
  saved?: boolean;
}

export default function JobListItem({
  job,
  applicationCta,
  portalMode = false,
  saved = false,
}: JobListItemProps) {
  const detailHref = portalMode
    ? `/candidate/jobs/${job.slug}`
    : applicationCta?.href ?? `/jobs/${job.slug}`;
  const primaryCta = portalMode
    ? "View role"
    : applicationCta?.label ?? "View Role";

  if (!portalMode) {
    return (
      <Link
        href={detailHref}
        className="group cr-card grid gap-4 p-6 transition-colors hover:border-[var(--cr-blue)]/40 md:grid-cols-12 md:items-center"
      >
        <div className="md:col-span-5">
          <h2 className="text-lg font-medium tracking-[-0.02em] text-[var(--cr-navy)] transition-colors duration-200 group-hover:text-[var(--cr-blue)]">
            {job.title}
            {job.isNew ? (
              <span className="ml-2 align-middle text-[0.65rem] font-bold uppercase tracking-[0.12em] text-[var(--ca-teal)]">
                New
              </span>
            ) : null}
          </h2>
          <p className="mt-1 text-sm text-[var(--cr-text-secondary)]">{job.summary}</p>
          <p className="mt-2 text-sm text-[var(--cr-blue)]">
            {job.department}
          </p>
        </div>

        <div className="md:col-span-4">
          <p className="text-sm text-[var(--cr-text)]">{job.location}</p>
          <p className="mt-1 text-sm text-[var(--cr-text-secondary)]">
            {job.workplaceType} · {job.employmentType}
          </p>
          <p className="mt-2 text-xs text-[#8a98a8]">
            Posted {formatPostedDate(job.postedAt)}
          </p>
        </div>

        <div className="flex md:col-span-3 md:justify-end">
          <span className="inline-flex items-center gap-2 text-sm font-medium text-[var(--cr-text)] transition-colors group-hover:text-[var(--cr-blue)]">
            {primaryCta === "View Role" ? "View Job" : primaryCta}
            <ArrowUpRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-1" />
          </span>
        </div>
      </Link>
    );
  }

  const practice = isPracticeJob(job);

  return (
    <article className="ca-platform-card grid gap-3 p-4 md:grid-cols-12 md:items-center md:p-5">
      <div className="md:col-span-7">
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href={detailHref}
            className="text-base font-semibold text-[var(--ca-platform-ink)] hover:underline"
          >
            {job.title}
          </Link>
          {practice ? (
            <span className="rounded-full border border-[var(--ca-platform-border)] px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-[0.08em] text-[var(--ca-platform-muted)]">
              Practice
            </span>
          ) : null}
        </div>
        <p className="mt-1 text-sm text-[var(--ca-platform-muted)]">
          {careerAreaLabels[job.careerArea]} · {job.location} · {job.workplaceType} · {job.employmentType}
        </p>
        <p className="mt-1 text-xs text-[var(--ca-platform-muted)]">
          Posted {formatPostedDate(job.postedAt)}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2 md:col-span-5 md:justify-end">
        <SaveJobButton
          jobRequisitionId={job.requisitionId}
          initiallySaved={saved}
        />
        <Link
          href={detailHref}
          className="rounded-lg border border-[var(--ca-platform-border)] px-3 py-2 text-sm font-semibold"
        >
          {primaryCta}
        </Link>
        {applicationCta ? (
          <Link
            href={applicationCta.href}
            className="rounded-lg bg-[var(--ca-lime)] px-3 py-2 text-sm font-semibold text-[var(--ca-ink)]"
          >
            {applicationCta.label}
          </Link>
        ) : practice ? null : (
          <Link
            href={`/jobs/${job.slug}/apply`}
            className="rounded-lg bg-[var(--ca-lime)] px-3 py-2 text-sm font-semibold text-[var(--ca-ink)]"
          >
            Apply
          </Link>
        )}
      </div>
    </article>
  );
}
