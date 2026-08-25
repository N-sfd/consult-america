import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { careerAreaLabels, type Job } from "@/data/jobs";
import { formatPostedDate } from "@/lib/jobs";

interface JobListItemProps {
  job: Job;
}

export default function JobListItem({ job }: JobListItemProps) {
  return (
    <Link
      href={`/jobs/${job.slug}`}
      className="group grid gap-4 border-b border-white/10 py-7 md:grid-cols-12 md:items-center"
    >
      <div className="md:col-span-5">
        <h2 className="text-xl font-medium tracking-[-0.03em] transition-colors duration-200 group-hover:text-[#93c5fd] md:text-2xl">
          {job.title}
        </h2>
        <p className="mt-2 text-sm text-[var(--ca-blue)]">
          {careerAreaLabels[job.careerArea]}
        </p>
      </div>

      <div className="md:col-span-4">
        <p className="text-sm text-white/70">{job.location}</p>
        <p className="mt-1 text-sm text-white/45">
          {job.workplaceType} · {job.employmentType}
        </p>
        <p className="mt-2 text-xs text-white/35">
          Posted {formatPostedDate(job.postedAt)}
        </p>
      </div>

      <div className="flex md:col-span-3 md:justify-end">
        <span className="inline-flex items-center gap-2 text-sm font-medium text-white/70 transition-colors group-hover:text-white">
          View Role
          <ArrowUpRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-1" />
        </span>
      </div>
    </Link>
  );
}
