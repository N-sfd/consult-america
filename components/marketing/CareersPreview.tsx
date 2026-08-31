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
  imageSrc = "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1400&q=80",
  imageAlt = "ConsultAmerica senior engineering and transformation consultants collaborating",
}: CareersPreviewProps) {
  const hasOpenJobs = jobs.length > 0;

  return (
    <div className="grid gap-10 lg:grid-cols-12 lg:gap-14 items-center">
      {/* Left Column: Copy & Photo */}
      <div className="flex flex-col lg:col-span-5">
        <span className="text-xs font-bold uppercase tracking-[0.14em] text-[#D8C5AA]">
          CAREERS
        </span>
        <h2 className="mt-4 text-3xl font-bold tracking-[-0.03em] text-[#F7F0E7] sm:text-4xl lg:text-5xl">
          Build what&apos;s next.
        </h2>
        <p className="mt-4 text-base leading-relaxed text-[#CFC4BA]">
          Work across enterprise transformation, Oracle, AI, data and product
          engineering alongside senior practitioners attached directly to delivery.
        </p>

        <div className="relative mt-8 aspect-[16/10] overflow-hidden rounded-2xl border border-[#6F6259]">
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 42vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#261F1B]/60 to-transparent" />
        </div>
      </div>

      {/* Right Column: Open Roles from ATS */}
      <div className="lg:col-span-7">
        <div className="rounded-2xl border border-[#6F6259] bg-[#342B27] p-6 sm:p-8 shadow-[0_20px_48px_rgba(0,0,0,0.25)]">
          <div className="flex items-center justify-between border-b border-[#6F6259] pb-4">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#D8C5AA]">
              OPEN REQUISITIONS
            </p>
            <span className="text-xs font-semibold text-[#CFC4BA]">
              {jobs.length} Active Positions
            </span>
          </div>

          {hasOpenJobs ? (
            <ul className="divide-y divide-[#6F6259]">
              {jobs.map((job) => (
                <li key={job.slug}>
                  <Link
                    href={`/jobs/${job.slug}`}
                    className="group flex items-start justify-between gap-4 py-5 transition-colors hover:bg-white/[0.04] px-3 rounded-lg"
                  >
                    <div>
                      <p className="text-base font-bold text-[#F7F0E7] transition-colors group-hover:text-[#D8C5AA]">
                        {job.title}
                      </p>
                      <p className="mt-1 text-xs text-[#CFC4BA]">
                        {job.location} · {job.workplaceType}
                      </p>
                    </div>
                    <ArrowUpRight
                      className="mt-1 h-4 w-4 shrink-0 text-[#D8C5AA] opacity-70 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100"
                      aria-hidden="true"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="py-8 text-center text-sm text-[#CFC4BA]">
              No current open requisitions. Explore all practice areas.
            </div>
          )}

          <div className="mt-6 border-t border-[#6F6259] pt-5">
            <Link
              href="/jobs"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#FFFAF2] px-6 text-sm font-bold text-[#7D2639] transition-all hover:bg-[#FFFDF8] hover:text-[#681F30] w-full sm:w-auto"
            >
              View opportunities
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
