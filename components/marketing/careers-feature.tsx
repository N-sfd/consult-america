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
      className="mkt-section relative overflow-hidden bg-[var(--mkt-careers)]"
    >
      <div className="mkt-shell relative z-10">
        <CareersPreview
          openCount={jobs.length}
          jobs={previewJobs}
          imageSrc="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=1400&q=80"
          imageAlt="ConsultAmerica team collaborating in a modern workplace"
        />
      </div>
    </section>
  );
}
