import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";

import { Section, SectionEyebrow } from "@/components/section";
import { careerAreaLabels } from "@/data/jobs";
import { formatPostedDate, getAllJobSlugs, getJobBySlug } from "@/lib/jobs";

interface JobDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllJobSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: JobDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const job = getJobBySlug(slug);

  if (!job) {
    return { title: "Role Not Found | ConsultAmerica Careers" };
  }

  return {
    title: `${job.title} | ConsultAmerica Careers`,
    description: job.summary,
  };
}

export default async function JobDetailPage({ params }: JobDetailPageProps) {
  const { slug } = await params;
  const job = getJobBySlug(slug);

  if (!job) {
    notFound();
  }

  return (
    <>
      <Section tone="navy">
        {job.isDemo && (
          <p className="mb-6 inline-block border border-[var(--ca-blue)]/40 bg-[var(--ca-blue)]/10 px-4 py-2 text-xs uppercase tracking-[0.12em] text-[#93c5fd]">
            Demo position — for design and development review only
          </p>
        )}

        <SectionEyebrow onDark>{careerAreaLabels[job.careerArea]}</SectionEyebrow>
        <h1 className="ca-h1 mt-6 max-w-4xl">{job.title}</h1>

        <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/65">
          <span>{job.location}</span>
          <span>{job.workplaceType}</span>
          <span>{job.employmentType}</span>
          <span>Posted {formatPostedDate(job.postedAt)}</span>
          <span>Job ID: {job.id}</span>
        </div>

        <div className="mt-10 flex flex-wrap gap-4">
          <Link href={`/jobs/${job.slug}/apply`} className="ca-button-primary">
            Apply Now
            <ArrowUpRight className="h-4 w-4" />
          </Link>
          <Link href="/jobs" className="ca-link text-sm">
            Back to open roles
          </Link>
        </div>
      </Section>

      <Section tone="navy" className="!pt-0">
        <div className="grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <section>
              <h2 className="ca-eyebrow text-white/45">About the Role</h2>
              <p className="mt-5 max-w-3xl text-lg leading-8 text-white/70">
                {job.description}
              </p>
            </section>

            <section className="mt-14">
              <h2 className="ca-eyebrow text-white/45">What You&apos;ll Do</h2>
              <ul className="mt-5 space-y-3 text-white/70">
                {job.responsibilities.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span aria-hidden="true" className="text-[var(--ca-blue)]">
                      •
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="mt-14">
              <h2 className="ca-eyebrow text-white/45">What You&apos;ll Bring</h2>
              <ul className="mt-5 space-y-3 text-white/70">
                {job.qualifications.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span aria-hidden="true" className="text-[var(--ca-blue)]">
                      •
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            {job.preferredQualifications &&
              job.preferredQualifications.length > 0 && (
                <section className="mt-14">
                  <h2 className="ca-eyebrow text-white/45">Preferred</h2>
                  <ul className="mt-5 space-y-3 text-white/70">
                    {job.preferredQualifications.map((item) => (
                      <li key={item} className="flex gap-3">
                        <span
                          aria-hidden="true"
                          className="text-[var(--ca-blue)]"
                        >
                          •
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
          </div>

          <aside className="lg:col-span-4">
            <div className="border border-white/10 p-6 lg:sticky lg:top-28">
              <h2 className="text-lg font-medium">About ConsultAmerica</h2>
              <p className="mt-4 text-sm leading-7 text-white/60">
                ConsultAmerica helps organizations move from strategy to
                execution across enterprise transformation, Oracle platforms, AI,
                data, and digital engineering.
              </p>
              <Link
                href={`/jobs/${job.slug}/apply`}
                className="ca-button-primary mt-8 w-full"
              >
                Apply for this role
              </Link>
            </div>
          </aside>
        </div>
      </Section>
    </>
  );
}
