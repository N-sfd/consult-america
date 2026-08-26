import CareersPreview from "@/components/marketing/CareersPreview";
import { getOpenJobs } from "@/lib/jobs";

export default async function CareersFeature() {
  const jobs = await getOpenJobs();
  const previewJobs = jobs.slice(0, 3).map((job) => ({
    slug: job.slug,
    title: job.title,
    location: job.location,
    workplaceType: job.workplaceType,
  }));

  return (
    <section
      id="careers"
      className="mkt-section relative overflow-hidden bg-[var(--mkt-navy)] text-white"
    >
      <div className="mkt-shell relative z-10">
        <CareersPreview openCount={jobs.length} jobs={previewJobs} />
      </div>
    </section>
  );
}
