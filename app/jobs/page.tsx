import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import JobBoard from "@/components/jobs/job-board";
import { getJobFilterOptions, getOpenJobs } from "@/lib/jobs";

export const metadata: Metadata = {
  title: "Open Roles | Consult America Careers",
  description:
    "Explore career opportunities at Consult America across Oracle, AI, data, consulting, and enterprise transformation.",
};

export default async function JobsPage() {
  const jobs = await getOpenJobs();
  const filterOptions = getJobFilterOptions(jobs);

  return (
    <div className="bg-[var(--cr-bg)]">
      <div className="cr-shell py-14 md:py-20 lg:py-24">
        <span className="ca-eyebrow text-[var(--cr-blue)]">Open Roles</span>
        <h1 className="ca-h1 mt-6 max-w-4xl text-[var(--cr-navy)]">
          Find your next opportunity.
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-[1.65] text-[var(--cr-text-secondary)]">
          Join Consult America and work on complex enterprise transformation,
          Oracle, AI, data, and digital engineering initiatives.
        </p>
        <Link href="/careers" className="ca-link mt-8 inline-flex text-sm">
          Life at Consult America
        </Link>
      </div>

      <div className="cr-shell pb-14 md:pb-20 lg:pb-24">
        <Suspense
          fallback={
            <p className="text-[var(--cr-text-secondary)]">
              Loading opportunities...
            </p>
          }
        >
          <JobBoard jobs={jobs} filterOptions={filterOptions} />
        </Suspense>

        <p className="mt-16 border-t border-[var(--cr-border)] pt-8 text-xs leading-6 text-[var(--cr-text-secondary)]">
          Consult America is committed to providing equal employment opportunities
          to qualified applicants and employees in accordance with applicable
          law.
        </p>
      </div>
    </div>
  );
}
