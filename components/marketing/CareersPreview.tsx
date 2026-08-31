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
    <div className="grid gap-10 lg:grid-cols-12 lg:gap-10 items-center">
      <div className="flex flex-col lg:col-span-5">
        <span className="mkt-eyebrow text-[#D8C5AA]">CAREERS</span>
        <h2 className="mkt-section-heading mt-4 max-w-xl text-[#F7F0E7]">
          Build what&apos;s next.
        </h2>
        <p className="mkt-body-lg mt-3 max-w-md text-[#CFC4BA]">
          {hasOpenJobs
            ? "Join teams solving complex enterprise challenges across Oracle, AI, data, and transformation delivery."
            : "Explore opportunities across Oracle, AI, data, digital engineering, and enterprise transformation."}
        </p>
        <div className="relative mt-6 min-h-[220px] flex-1 overflow-hidden rounded-xl border border-[#6F6259] lg:min-h-[260px]">
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
        <div className="rounded-xl border border-[#6F6259] bg-[#342B27] p-6 md:p-8 shadow-[0_20px_48px_rgba(0,0,0,0.25)]">
          {hasOpenJobs ? (
            <>
              <p className="mkt-eyebrow text-[#D8C5AA]">OPEN REQUISITIONS</p>
              <ul className="mt-4 divide-y divide-[#6F6259] border-t border-[#6F6259]">
                {jobs.map((job) => (
                  <li key={job.slug}>
                    <Link
                      href={`/jobs/${job.slug}`}
                      className="group flex items-start justify-between gap-4 py-5 transition-colors hover:bg-white/[0.04] px-2 rounded-lg"
                    >
                      <div>
                        <h3 className="text-lg font-medium tracking-[-0.02em] text-[#F7F0E7] transition-colors group-hover:text-[#D8C5AA]">
                          {job.title}
                        </h3>
                        <p className="mt-1.5 text-sm text-[#CFC4BA]">
                          {job.location}
                          <span className="mx-2 text-[#6F6259]">·</span>
                          {job.workplaceType}
                        </p>
                      </div>
                      <ArrowUpRight className="mt-1 h-5 w-5 shrink-0 text-[#D8C5AA] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#F7F0E7]" />
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="mt-6 pt-4 border-t border-[#6F6259] flex items-center justify-between">
                <Link
                  href="/jobs"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#FFFAF2] px-4 py-2.5 text-xs font-bold text-[#7D2639] transition-all hover:bg-white hover:text-[#681F30]"
                >
                  View all opportunities
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </>
          ) : (
            <div>
              <p className="text-sm leading-7 text-[#CFC4BA]">
                We&apos;re always interested in experienced professionals who
                want to solve complex business challenges.
              </p>
              <Link
                href="/careers"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#FFFAF2] px-4 py-2.5 text-xs font-bold text-[#7D2639] transition-all hover:bg-white mt-6"
              >
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
