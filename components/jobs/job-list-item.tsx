import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { careerAreaLabels, formatPostedDate, type Job } from "@/lib/jobs";

interface JobListItemProps {
  job: Job;
}

export default function JobListItem({ job }: JobListItemProps) {
  return (
    <Link
      href={`/jobs/${job.slug}`}
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
          View Role
          <ArrowUpRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-1" />
        </span>
      </div>
    </Link>
  );
}
