import CareersPreview from "@/components/marketing/CareersPreview";
import { getOpenJobs } from "@/lib/jobs";

export default async function CareersFeature() {
  const jobs = await getOpenJobs();
  const previewJobs = jobs.slice(0, 3).map((job) => ({
    slug: job.slug,
    title: job.title.replace(/\s*\(Demo\)\s*/gi, "").trim(),
    location: job.location,
    workplaceType: job.workplaceType,
  }));

  return (
    <section
      id="careers"
      className="mkt-section relative overflow-hidden bg-[#2B2420] text-[#F7F0E7]"
    >
      <div className="mkt-shell relative z-10">
        <CareersPreview jobs={previewJobs} />
      </div>
    </section>
  );
}
