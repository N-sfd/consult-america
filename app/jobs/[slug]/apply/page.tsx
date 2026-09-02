import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import JobApplicationForm from "@/components/jobs/job-application-form";
import { careerAreaLabels } from "@/data/jobs";
import { getAllJobSlugs, getJobBySlug } from "@/lib/jobs";
import { stockImage } from "@/lib/marketing/stock-images";

interface JobApplyPageProps {
  params: Promise<{ slug: string }>;
}

const APPLY_HERO_IMAGE = stockImage("jobApplyHero", { w: 1400, q: 80 });

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
    return { title: "Apply | Consult America Careers" };
  }

  return {
    title: `Apply — ${job.title} | Consult America Careers`,
    description: `Apply for the ${job.title} opportunity at Consult America.`,
  };
}

export default async function JobApplyPage({ params }: JobApplyPageProps) {
  const { slug } = await params;
  const job = await getJobBySlug(slug);

  if (!job) {
    notFound();
  }

  return (
    <div className="bg-[var(--cr-bg)]">
      <div className="border-b border-[var(--cr-border)] bg-white">
        <div className="cr-shell py-4">
          <Link
            href={`/jobs/${job.slug}`}
            className="ca-link text-sm"
          >
            ← Back to role
          </Link>
        </div>
      </div>

      <div className="bg-[var(--cr-bg-soft)]">
        <div className="cr-shell py-12 md:py-16">
          <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-7">
              <span className="ca-eyebrow text-[var(--cr-blue)]">Careers</span>
              <h1 className="mt-5 max-w-xl text-[2.125rem] font-medium leading-[1.05] tracking-[-0.03em] text-[var(--cr-navy)] md:text-[2.75rem]">
                {job.title}
              </h1>
              <p className="mt-4 text-[var(--cr-blue)]">
                {careerAreaLabels[job.careerArea]}
              </p>
              <p className="mt-2 text-[var(--cr-text-secondary)]">
                {job.location} · {job.workplaceType} · {job.employmentType}
              </p>
              <p className="mt-6 max-w-lg text-[var(--cr-text)]">
                Help organizations move complex enterprise transformation from
                roadmap to production.
              </p>
            </div>
            <div className="lg:col-span-5">
              <div className="relative aspect-[16/9] overflow-hidden rounded-2xl lg:aspect-[4/3]">
                <Image
                  src={APPLY_HERO_IMAGE}
                  alt="Consult America professionals collaborating"
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="cr-shell py-12 md:py-16">
        <div className="mx-auto max-w-[1040px]">
          <div className="mb-8">
            <h2 className="text-2xl font-medium tracking-[-0.03em] text-[var(--cr-navy)]">
              Application
            </h2>
            <p className="mt-2 text-[var(--cr-text-secondary)]">
              Tell us about yourself and upload your resume.
            </p>
          </div>

          <JobApplicationForm
            jobTitle={job.title}
            jobSlug={job.slug}
            requisitionId={job.requisitionId}
            postingId={job.id}
            department={job.department}
            location={job.location}
            workplaceType={job.workplaceType}
            employmentType={job.employmentType}
          />
        </div>
      </div>
    </div>
  );
}
