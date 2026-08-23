import Link from "next/link";

import { Section, SectionEyebrow, SectionLead } from "@/components/section";
import { Button } from "@/components/ui/button";

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
      <Section tone="off-white">
        <SectionEyebrow>{eyebrow}</SectionEyebrow>
        <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight text-ca-ink">
          {title}
        </h1>
        <SectionLead>{description}</SectionLead>
        <Button className="mt-8" nativeButton={false} render={<Link href="/contact" />}>
          Start a conversation
        </Button>
      </Section>
      <Section tone="white">
        <div className="grid gap-4 md:grid-cols-2">
          {items.map((item) => (
            <article
              key={item.title}
              className="rounded-[var(--ca-radius-md)] border border-ca-border bg-ca-white p-6"
            >
              <h2 className="font-medium text-ca-ink">{item.title}</h2>
              <p className="mt-2 text-sm text-ca-muted">{item.description}</p>
            </article>
          ))}
        </div>
      </Section>
    </>
  );
}
