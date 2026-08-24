import Link from "next/link";

import { Section, SectionEyebrow, SectionLead } from "@/components/section";

type MarketingPageProps = {
  eyebrow: string;
  title: string;
  description: string;
  items: { title: string; description: string }[];
};

export function MarketingPage({
  eyebrow,
  title,
  description,
  items,
}: MarketingPageProps) {
  return (
    <>
      <Section tone="navy">
        <SectionEyebrow onDark>{eyebrow}</SectionEyebrow>
        <h1 className="ca-h1 mt-6 max-w-4xl">{title}</h1>
        <SectionLead onDark>{description}</SectionLead>
        <Link href="/contact" className="ca-button-primary mt-10 inline-flex">
          Contact Us
        </Link>
      </Section>
      <Section tone="navy" className="!pt-0">
        <div className="divide-y divide-white/10 border-y border-white/10">
          {items.map((item) => (
            <article key={item.title} className="grid gap-3 py-8 md:grid-cols-12 md:py-10">
              <h2 className="text-xl md:col-span-4">{item.title}</h2>
              <p className="text-white/55 md:col-span-8">{item.description}</p>
            </article>
          ))}
        </div>
      </Section>
    </>
  );
}
