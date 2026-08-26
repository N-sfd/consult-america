import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export type CareersPreviewJob = {
  slug: string;
  title: string;
  location: string;
  workplaceType: string;
};

interface CareersPreviewProps {
  openCount: number;
  jobs: CareersPreviewJob[];
  imageSrc?: string;
  imageAlt?: string;
}

export default function CareersPreview({
  openCount,
  jobs,
  imageSrc = "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1400&q=80",
  imageAlt = "Professionals collaborating in a shared workspace",
}: CareersPreviewProps) {
  return (
    <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
      <div className="flex flex-col lg:col-span-5">
        <span className="mkt-eyebrow text-[var(--mkt-blue)]">CAREERS</span>
        <h2 className="mkt-section-heading mt-8 max-w-xl text-[var(--mkt-navy)]">
          Build what&apos;s next.
        </h2>
        <p className="mkt-body-lg mt-6 max-w-md">
          Join teams solving complex enterprise challenges across Oracle, AI,
          data, and transformation delivery.
        </p>
        <div className="relative mt-8 min-h-[220px] flex-1 overflow-hidden lg:min-h-[280px]">
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 42vw"
          />
        </div>
      </div>

      <div className="lg:col-span-7">
        <div className="border border-[var(--mkt-border)] bg-white p-6 md:p-8 lg:p-10">
          <div className="flex items-end justify-between gap-4 border-b border-[var(--mkt-border)] pb-6">
            <div>
              <p className="mkt-eyebrow text-[var(--mkt-muted)]">OPEN ROLES</p>
              <p className="mt-3 text-4xl font-medium tracking-[-0.04em] text-[var(--mkt-navy)] md:text-5xl">
                {openCount}
                <span className="ml-2 text-lg font-normal text-[var(--mkt-muted)] md:text-xl">
                  opportunities
                </span>
              </p>
            </div>
            <Link
              href="/jobs"
              className="hidden text-sm text-[var(--mkt-blue)] transition-opacity hover:opacity-70 sm:inline-flex sm:items-center sm:gap-1"
            >
              View all jobs
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <ul className="mt-2">
            {jobs.map((job) => (
              <li key={job.slug}>
                <Link
                  href={`/jobs/${job.slug}`}
                  className="group flex items-start justify-between gap-4 border-b border-[var(--mkt-border)] py-6 transition-colors hover:bg-[var(--mkt-ice)]"
                >
                  <div>
                    <h3 className="text-lg font-medium tracking-[-0.02em] text-[var(--mkt-navy)] transition-colors group-hover:text-[var(--mkt-blue)] md:text-xl">
                      {job.title}
                    </h3>
                    <p className="mt-2 text-sm text-[var(--mkt-muted)]">
                      {job.location}
                      <span className="mx-2 text-[var(--mkt-border)]">·</span>
                      {job.workplaceType}
                    </p>
                  </div>
                  <ArrowUpRight className="mt-1 h-5 w-5 shrink-0 text-[var(--mkt-muted)] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[var(--mkt-blue)]" />
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/careers" className="ca-button-primary">
              Explore careers
              <ArrowUpRight className="h-4 w-4" />
            </Link>
            <Link
              href="/jobs"
              className="ca-link px-1 py-3"
            >
              View all jobs
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
