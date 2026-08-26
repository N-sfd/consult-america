import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import Container from "@/components/layout/container";
import Section from "@/components/layout/section";
import { getOpenJobs } from "@/lib/jobs";

export default async function CareersFeature() {
  const jobs = await getOpenJobs();
  const previewJobs = jobs.slice(0, 3);
  const openCount = jobs.length;

  return (
    <Section
      id="careers"
      className="relative overflow-hidden bg-[#071A2F] text-white"
    >
      <Container className="relative z-10">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="flex flex-col lg:col-span-5">
            <span className="ca-eyebrow text-white/55">CAREERS</span>

            <h2 className="ca-h2 mt-8 max-w-xl text-white">
              Build what&apos;s next.
            </h2>

            <p className="mt-6 max-w-md text-lg leading-8 text-white/65">
              Join teams solving complex enterprise challenges across Oracle,
              AI, data, and transformation delivery.
            </p>

            <div className="relative mt-10 min-h-[280px] flex-1 overflow-hidden lg:min-h-[360px]">
              <Image
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1400&q=80"
                alt="Diverse professionals collaborating around a shared workspace"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 42vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#071A2F]/50 to-transparent" />
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="border border-white/12 bg-white/[0.03] p-6 md:p-8 lg:p-10">
              <div className="flex items-end justify-between gap-4 border-b border-white/10 pb-6">
                <div>
                  <p className="ca-eyebrow text-white/40">OPEN ROLES</p>
                  <p className="mt-3 text-4xl font-medium tracking-[-0.04em] text-white md:text-5xl">
                    {openCount}
                    <span className="ml-2 text-lg font-normal text-white/45 md:text-xl">
                      opportunities
                    </span>
                  </p>
                </div>
                <Link
                  href="/jobs"
                  className="hidden text-sm text-[var(--ca-blue)] transition-opacity hover:opacity-70 sm:inline-flex sm:items-center sm:gap-1"
                >
                  View all jobs
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              <ul className="mt-2">
                {previewJobs.map((job) => (
                  <li key={job.slug}>
                    <Link
                      href={`/jobs/${job.slug}`}
                      className="group flex items-start justify-between gap-4 border-b border-white/10 py-6 transition-colors hover:bg-white/[0.03]"
                    >
                      <div>
                        <h3 className="text-lg font-medium tracking-[-0.02em] text-white transition-colors group-hover:text-[#93c5fd] md:text-xl">
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
      </Container>
    </Section>
  );
}
