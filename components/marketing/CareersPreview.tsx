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
  jobs: CareersPreviewJob[];
  imageSrc?: string;
  imageAlt?: string;
}

export default function CareersPreview({
  jobs,
  imageSrc = "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1400&q=80",
  imageAlt = "ConsultAmerica team in a working session",
}: CareersPreviewProps) {
  const hasOpenJobs = jobs.length > 0;

  return (
    <div className="grid gap-10 lg:grid-cols-12 lg:gap-10">
      <div className="flex flex-col lg:col-span-5">
        <span className="mkt-eyebrow text-[var(--mkt-blue)]">CAREERS</span>
        <h2 className="mkt-section-heading mt-5 max-w-xl text-[var(--mkt-navy)]">
          Build what&apos;s next.
        </h2>
        <p className="mkt-body-lg mt-4 max-w-md">
          {hasOpenJobs
            ? "Join teams solving complex enterprise challenges across Oracle, AI, data, and transformation delivery."
            : "Explore opportunities across Oracle, AI, data, digital engineering, and enterprise transformation."}
        </p>
        <div className="relative mt-6 min-h-[200px] flex-1 overflow-hidden rounded-2xl lg:min-h-[240px]">
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
        <div className="rounded-2xl border border-[var(--mkt-border)] bg-white p-6 md:p-8">
          {hasOpenJobs ? (
            <>
              <p className="mkt-eyebrow text-[var(--mkt-muted)]">OPEN ROLES</p>
              <ul className="mt-4 divide-y divide-[var(--mkt-border)] border-t border-[var(--mkt-border)]">
                {jobs.map((job) => (
                  <li key={job.slug}>
                    <Link
                      href={`/jobs/${job.slug}`}
                      className="group flex items-start justify-between gap-4 py-5 transition-colors hover:bg-[var(--mkt-ice)]"
                    >
                      <div>
                        <h3 className="text-lg font-medium tracking-[-0.02em] text-[var(--mkt-navy)] transition-colors group-hover:text-[var(--mkt-blue)]">
                          {job.title}
                        </h3>
                        <p className="mt-1.5 text-sm text-[var(--mkt-muted)]">
                          {job.location}
                          <span className="mx-2 text-[var(--mkt-border)]">
                            ·
                          </span>
                          {job.workplaceType}
                        </p>
                      </div>
                      <ArrowUpRight className="mt-1 h-5 w-5 shrink-0 text-[var(--mkt-muted)] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[var(--mkt-blue)]" />
                    </Link>
                  </li>
                ))}
              </ul>
              <Link href="/jobs" className="ca-link mt-6 inline-flex text-sm">
                View all opportunities
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </>
          ) : (
            <div>
              <p className="text-sm leading-7 text-[var(--mkt-muted)]">
                We&apos;re always interested in experienced professionals who
                want to solve complex business challenges.
              </p>
              <Link href="/careers" className="ca-link mt-6 inline-flex text-sm">
                Explore careers
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
