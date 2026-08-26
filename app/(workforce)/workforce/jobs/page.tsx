import type { Metadata } from "next";
import Link from "next/link";

import { getOpenJobs } from "@/lib/jobs";

export const metadata: Metadata = {
  title: "Jobs",
};

export default async function WorkforceJobsPage() {
  const jobs = await getOpenJobs();

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-6 lg:px-8 lg:py-8">
      <p className="text-[0.7rem] uppercase tracking-[0.14em] text-black/40">
        Recruiting
      </p>
      <h1 className="mt-2 text-2xl font-medium tracking-[-0.03em]">Jobs</h1>
      <p className="mt-2 text-sm text-black/50">
        {jobs.length} published openings · synced with the public careers board
      </p>

      <div className="mt-6 overflow-hidden border border-black/8 bg-white">
        <div className="grid grid-cols-[1.4fr_1fr_0.8fr_0.6fr] gap-3 border-b border-black/8 bg-[var(--ca-app-bg)] px-5 py-3 text-[0.65rem] uppercase tracking-[0.1em] text-black/40">
          <span>Role</span>
          <span>Location</span>
          <span>Workplace</span>
          <span>Status</span>
        </div>
        {jobs.map((job) => (
          <Link
            key={job.slug}
            href={`/jobs/${job.slug}`}
            className="grid grid-cols-1 gap-1 border-b border-black/6 px-5 py-4 text-sm last:border-0 hover:bg-[var(--ca-app-bg)] sm:grid-cols-[1.4fr_1fr_0.8fr_0.6fr] sm:items-center sm:gap-3"
          >
            <span className="font-medium">{job.title}</span>
            <span className="text-black/55">{job.location}</span>
            <span className="text-black/55">{job.workplaceType}</span>
            <span className="text-[var(--ca-blue)]">Open</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
