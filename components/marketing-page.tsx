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
        <div className="grid gap-4 md:grid-cols-12">
          {items.map((item) => (
            <article key={item.title} className="ca-card p-6 md:col-span-6">
              <h2 className="text-xl font-semibold">{item.title}</h2>
              <p className="mt-2 text-sm leading-[1.5] text-white/60">{item.description}</p>
            </article>
          ))}
        </div>
      </Section>
    </>
  );
}
