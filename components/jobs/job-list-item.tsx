import Link from "next/link";
import { ArrowUpRight, Bookmark } from "lucide-react";

import SaveJobButton from "@/components/candidate/save-job-button";
import { careerAreaLabels, formatPostedDate, type Job } from "@/lib/jobs";

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
          <h2 className="text-xl font-medium tracking-[-0.03em] text-[var(--cr-navy)] transition-colors duration-200 group-hover:text-[var(--cr-blue)]">
            {job.title}
          </h2>
          <p className="mt-2 text-sm text-[var(--cr-blue)]">
            {careerAreaLabels[job.careerArea]}
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
            {primaryCta}
            <ArrowUpRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-1" />
          </span>
        </div>
      </Link>
    );
  }

  return (
    <article className="ca-platform-card grid gap-4 p-5 md:grid-cols-12 md:items-center">
      <div className="md:col-span-5">
        <Link
          href={detailHref}
          className="text-lg font-semibold text-[var(--ca-platform-ink)] hover:underline"
        >
          {job.title}
        </Link>
        <p className="mt-1 text-sm text-[var(--ca-platform-mid)]">
          {careerAreaLabels[job.careerArea]}
        </p>
        {saved ? (
          <p className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-[var(--ca-platform-muted)]">
            <Bookmark className="h-3.5 w-3.5" aria-hidden />
            Saved
          </p>
        ) : null}
      </div>

      <div className="md:col-span-3">
        <p className="text-sm text-[var(--ca-platform-ink)]">{job.location}</p>
        <p className="mt-1 text-sm text-[var(--ca-platform-muted)]">
          {job.workplaceType} · {job.employmentType}
        </p>
        <p className="mt-2 text-xs text-[var(--ca-platform-muted)]">
          Posted {formatPostedDate(job.postedAt)}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2 md:col-span-4 md:justify-end">
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
            className="rounded-lg bg-[var(--ca-platform-deep)] px-3 py-2 text-sm font-semibold text-white"
          >
            {applicationCta.label}
          </Link>
        ) : (
          <Link
            href={`/jobs/${job.slug}/apply`}
            className="rounded-lg bg-[var(--ca-platform-deep)] px-3 py-2 text-sm font-semibold text-white"
          >
            Apply
          </Link>
        )}
      </div>
    </article>
  );
}
