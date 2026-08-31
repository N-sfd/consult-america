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
    <div className="grid gap-10 lg:grid-cols-12 lg:gap-14 items-stretch">
      {/* Left Column: Full-Height Collaborative Team Photo (50%) */}
      <div className="relative min-h-[380px] lg:h-[480px] lg:col-span-6 overflow-hidden rounded-xl border border-[#E2E7EC] bg-[#FFFFFF] shadow-[0_12px_36px_rgba(20,30,45,0.06)]">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          className="object-cover mkt-img-graded"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#101828]/70 via-[#101828]/20 to-transparent" />
        <div className="absolute bottom-6 left-6 right-6 text-white">
          <span className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#EEF2F5]">
            PRACTICE DELIVERY TEAMS
          </span>
          <p className="mt-1 text-sm font-semibold text-[#FFFFFF]">
            Work alongside senior architects, AI engineers, and functional leaders on complex enterprise programs.
          </p>
        </div>
      </div>

      {/* Right Column: Clean White Panel with Open Requisitions (50%) */}
      <div className="lg:col-span-6 flex flex-col justify-between rounded-xl border border-[#E2E7EC] bg-[#FFFFFF] p-8 sm:p-10 shadow-[0_12px_36px_rgba(20,30,45,0.06)]">
        <div>
          <span className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#B63838]">
            CAREERS
          </span>
          <h2 className="mt-3 font-serif text-3xl font-semibold tracking-[-0.03em] text-[#101828] sm:text-4xl">
            Build what&apos;s next.
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-[#475467]">
            Work across enterprise transformation, Oracle, AI, data and product
            engineering. Small, senior teams attached directly to client outcomes.
          </p>

          <div className="mt-8 border-t border-[#E2E7EC] pt-4">
            <div className="flex items-center justify-between pb-3">
              <p className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#B63838]">
                OPEN REQUISITIONS
              </p>
              <span className="text-xs text-[#475467]">
                {jobs.length} Active Positions
              </span>
            </div>

            {hasOpenJobs ? (
              <ul className="divide-y divide-[#E2E7EC]">
                {jobs.map((job) => (
                  <li key={job.slug}>
                    <Link
                      href={`/jobs/${job.slug}`}
                      className="group flex items-start justify-between gap-4 py-4 transition-colors hover:bg-[#F7F8FA] px-3 rounded-md"
                    >
                      <div>
                        <p className="text-sm font-bold text-[#101828] transition-colors group-hover:text-[#B63838]">
                          {job.title}
                        </p>
                        <p className="mt-0.5 text-xs text-[#475467]">
                          {job.location} · {job.workplaceType}
                        </p>
                      </div>
                      <ArrowUpRight
                        className="mt-1 h-3.5 w-3.5 shrink-0 text-[#B63838] opacity-70 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100"
                        aria-hidden="true"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="py-6 text-center text-xs text-[#475467]">
                No current open requisitions.
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 border-t border-[#E2E7EC] pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link
            href="/careers"
            className="ca-button-primary w-full sm:w-auto text-xs font-semibold !min-h-10"
          >
            <span>View all opportunities</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
          <span className="text-xs text-[#475467]">
            Equal Opportunity Employer
          </span>
        </div>
      </div>
    </div>
  );
}
