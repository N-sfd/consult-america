import CaseStudyCard from "@/components/marketing/CaseStudyCard";
import BackgroundAccent from "@/components/marketing/inner-page/background-accent";
import Reveal from "@/components/marketing/inner-page/reveal";
import type { DetailPageWorkItem } from "@/lib/marketing/detail-page-types";

export default function RelatedWork({ items }: { items: DetailPageWorkItem[] }) {
  if (items.length === 0) return null;

  return (
    <section className="relative overflow-hidden bg-[#073B3A]">
      <BackgroundAccent preset="section-dark" intensity="rich" />
      <div className="mkt-shell relative z-10 py-14 lg:py-16">
        <Reveal>
          <p className="mkt-eyebrow text-[#9BC4B8]">Related Work</p>
          <h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-white md:text-4xl">
            Proof from delivery.
          </h2>
        </Reveal>
      </div>
      {items.map((item, index) => (
        <Reveal key={item.href} delay={index * 0.08}>
          <CaseStudyCard
            number={item.number}
            category={item.category}
            title={item.title}
            description={item.description}
            href={item.href}
            image={item.image}
            imageAlt={item.imageAlt}
            tone="dark"
            className="relative z-10 border-t-0"
          />
        </Reveal>
      ))}
    </section>
  );
}
