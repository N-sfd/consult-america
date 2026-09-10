import type { Metadata } from "next";

import { recruitingRepository } from "@/lib/recruiting";
import CandidateMatchForm from "@/components/workforce-app/recruiting/candidate-match-form";

export const metadata: Metadata = { title: "Candidate Match" };

export default async function Page() {
  const jobs = await recruitingRepository.listJobSummaries();

  return (
    <div className="mx-auto max-w-[1100px] px-4 py-5 lg:px-8 lg:py-6">
      <h1 className="text-[1.75rem] font-medium tracking-[-0.02em] text-[var(--ca-app-ink)]">
        Candidate Match Analysis
      </h1>
      <p className="mt-1 max-w-2xl text-sm text-black/50">
        Compare a job description with candidate profiles and resumes to
        identify relevant skills and experience.
      </p>

      <CandidateMatchForm
        jobs={jobs
          .filter((job) => job.status === "PUBLISHED" || job.status === "APPROVED")
          .map((job) => ({
            requisitionId: job.requisitionId,
            title: job.title,
            departmentName: job.departmentName,
            locationName: job.locationName,
          }))}
      />
    </div>
  );
}
