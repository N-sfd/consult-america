import CaseStudyCard from "@/components/marketing/CaseStudyCard";
import type { DetailPageWorkItem } from "@/lib/marketing/detail-page-types";

export default function RelatedWork({ items }: { items: DetailPageWorkItem[] }) {
  if (items.length === 0) return null;

  return (
    <section className="bg-[var(--mkt-ink)]">
      <div className="mkt-shell py-14 lg:py-16">
        <p className="mkt-eyebrow text-white/40">Related Work</p>
      </div>
      {items.map((item) => (
        <CaseStudyCard
          key={item.href}
          number={item.number}
          category={item.category}
          title={item.title}
          description={item.description}
          href={item.href}
          image={item.image}
          imageAlt={item.imageAlt}
          tone="dark"
          className="border-t-0"
        />
      ))}
    </section>
  );
}
