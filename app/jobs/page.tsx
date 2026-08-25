import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import JobBoard from "@/components/jobs/job-board";
import { Section, SectionEyebrow, SectionLead } from "@/components/section";
import { getJobFilterOptions, getOpenJobs } from "@/lib/jobs";

export const metadata: Metadata = {
  title: "Open Roles | ConsultAmerica Careers",
  description:
    "Explore career opportunities at ConsultAmerica across Oracle, AI, data, consulting, and enterprise transformation.",
};

export default async function JobsPage() {
  const jobs = await getOpenJobs();
  const filterOptions = getJobFilterOptions(jobs);

  return (
    <>
      <Section tone="navy">
        <SectionEyebrow onDark>Open Roles</SectionEyebrow>
        <h1 className="ca-h1 mt-6 max-w-4xl">Find your next opportunity.</h1>
        <SectionLead onDark>
          Join ConsultAmerica and work on complex enterprise transformation,
          Oracle, AI, data, and digital engineering initiatives.
        </SectionLead>
        <Link href="/careers" className="ca-link mt-8 inline-flex text-sm">
          Life at ConsultAmerica
        </Link>
      </Section>

      <Section tone="navy" className="!pt-0">
        <Suspense
          fallback={
            <p className="text-white/55">Loading opportunities...</p>
          }
        >
          <JobBoard jobs={jobs} filterOptions={filterOptions} />
        </Suspense>

        <p className="mt-16 border-t border-white/10 pt-8 text-xs leading-6 text-white/40">
          ConsultAmerica is committed to providing equal employment opportunities
          to qualified applicants and employees in accordance with applicable
          law.
        </p>
      </Section>
    </>
  );
}
