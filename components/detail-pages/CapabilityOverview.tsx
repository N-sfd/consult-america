import PageSection from "@/components/marketing/inner-page/page-section";
import Reveal from "@/components/marketing/inner-page/reveal";
import type { DetailPageOverviewItem } from "@/lib/marketing/detail-page-types";

export default function CapabilityOverview({
  heading = "Where we focus",
  items,
}: {
  heading?: string;
  items: DetailPageOverviewItem[];
}) {
  return (
    <PageSection tone="soft" eyebrow="Focus areas" title={heading}>
      <div className="overflow-hidden rounded-2xl border border-[#C9DDD7]/70 bg-white/80 shadow-[0_8px_32px_rgba(7,59,58,0.05)] backdrop-blur-sm">
        <div className="grid md:grid-cols-2 lg:grid-cols-4">
          {items.map((item, index) => (
            <Reveal key={item.title} delay={index * 0.06}>
              <div className="group border-b border-[#E1ECE8] p-6 transition-colors hover:bg-[#F8FAF9] md:border-r md:[&:nth-child(2n)]:border-r-0 lg:[&:nth-child(2n)]:border-r lg:[&:nth-child(4n)]:border-r-0">
                <p className="mkt-eyebrow text-[#5B6D6B]">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-3 text-lg font-semibold tracking-[-0.02em] text-[#122D2E] transition-colors group-hover:text-[#176A63]">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-[#5B6D6B]">{item.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </PageSection>
  );
}
