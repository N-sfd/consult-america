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

/** Presentation shell for homepage careers + live jobs preview. */
export default function CareersPreview({
  openCount,
  jobs,
  imageSrc = "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1400&q=80",
  imageAlt = "Professionals collaborating in a shared workspace",
}: CareersPreviewProps) {
  return (
    <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
      <div className="flex flex-col lg:col-span-5">
        <span className="mkt-eyebrow text-white/55">CAREERS</span>
        <h2 className="mkt-section-heading mt-8 max-w-xl text-white">
          Build what&apos;s next.
        </h2>
        <p className="mkt-body-lg mt-6 max-w-md text-white/65">
          Join teams solving complex enterprise challenges across Oracle, AI,
          data, and transformation delivery.
        </p>
        <div className="relative mt-10 min-h-[280px] flex-1 overflow-hidden lg:min-h-[360px]">
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 42vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--mkt-navy)]/50 to-transparent" />
        </div>
      </div>

      <div className="lg:col-span-7">
        <div className="border border-white/12 bg-white/[0.03] p-6 md:p-8 lg:p-10">
          <div className="flex items-end justify-between gap-4 border-b border-white/10 pb-6">
            <div>
              <p className="mkt-eyebrow text-white/40">OPEN ROLES</p>
              <p className="mt-3 text-4xl font-medium tracking-[-0.04em] text-white md:text-5xl">
                {openCount}
                <span className="ml-2 text-lg font-normal text-white/45 md:text-xl">
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
                  className="group flex items-start justify-between gap-4 border-b border-white/10 py-6 transition-colors hover:bg-white/[0.03]"
                >
                  <div>
                    <h3 className="text-lg font-medium tracking-[-0.02em] text-white transition-colors group-hover:text-[var(--mkt-blue-soft)] md:text-xl">
                      {job.title}
                    </h3>
                    <p className="mt-2 text-sm text-white/50">
                      {job.location}
                      <span className="mx-2 text-white/25">·</span>
                      {job.workplaceType}
                    </p>
                  </div>
                  <ArrowUpRight className="mt-1 h-5 w-5 shrink-0 text-white/40 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-white" />
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/careers" className="ca-button-light">
              Explore careers
              <ArrowUpRight className="h-4 w-4" />
            </Link>
            <Link
              href="/jobs"
              className="inline-flex items-center gap-2 px-1 py-3 text-sm font-medium text-white transition-opacity hover:opacity-70"
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
