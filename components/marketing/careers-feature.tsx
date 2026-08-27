import CareersPreview from "@/components/marketing/CareersPreview";
import { getOpenJobs } from "@/lib/jobs";

const careerAreas = [
  "Enterprise Transformation",
  "Oracle & Enterprise Platforms",
  "AI & Data",
  "Digital Engineering",
];

export default async function CareersFeature() {
  const jobs = await getOpenJobs();
  const realJobs = jobs.filter((job) => !job.isDemo);
  const previewJobs = realJobs.slice(0, 3).map((job) => ({
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
          openCount={realJobs.length}
          jobs={previewJobs}
          careerAreas={careerAreas}
          imageSrc="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=1400&q=80"
          imageAlt="ConsultAmerica team collaborating in a modern workplace"
        />
      </div>
    </section>
  );
}
