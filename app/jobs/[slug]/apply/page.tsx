import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import JobApplicationForm from "@/components/jobs/job-application-form";
import { Section, SectionEyebrow, SectionLead } from "@/components/section";
import { getAllJobSlugs, getJobBySlug } from "@/lib/jobs";

interface JobApplyPageProps {
  params: Promise<{ slug: string }>;
}

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
    return { title: "Apply | ConsultAmerica Careers" };
  }

  return {
    title: `Apply — ${job.title} | ConsultAmerica Careers`,
    description: `Apply for the ${job.title} opportunity at ConsultAmerica.`,
  };
}

export default async function JobApplyPage({ params }: JobApplyPageProps) {
  const { slug } = await params;
  const job = await getJobBySlug(slug);

  if (!job) {
    notFound();
  }

  return (
    <>
      <Section tone="navy">
        <SectionEyebrow onDark>Apply</SectionEyebrow>
        <h1 className="ca-h1 mt-6 max-w-4xl">{job.title}</h1>
        <SectionLead onDark>
          Complete the form below to express your interest in this role. No
          account is required.
        </SectionLead>
        <Link href={`/jobs/${job.slug}`} className="ca-link mt-6 inline-flex text-sm">
          Back to role details
        </Link>
      </Section>

      <Section tone="navy" className="!pt-0">
        <JobApplicationForm
          jobTitle={job.title}
          requisitionId={job.requisitionId}
          postingId={job.id}
        />
      </Section>
    </>
  );
}
