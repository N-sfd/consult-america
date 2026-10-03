import Link from "next/link";

import { companyContact } from "@/lib/site-data";

const proofs = [
  {
    label: "Practice",
    title: companyContact.experienceTagline,
    detail: "Enterprise transformation, Oracle delivery, and the applications around the work.",
  },
  {
    label: "Applications",
    title: "Software we design and run",
    detail: "Data Agent, MediGuide AI, JobLens, and Data Explorer — built as real products, not slideware.",
  },
  {
    label: "Industries",
    title: "Where the work applies",
    detail: "Public sector, healthcare, financial services, and technology operations.",
  },
  {
    label: "Platform",
    title: "One connected environment",
    detail: "CRM, recruiting, people, employee, and payroll, with administration across them.",
  },
];

export default function ProofSection() {
  return (
    <section aria-label="Why Consult America" className="border-b border-[var(--ca-line)] bg-white">
      <div className="mkt-shell py-8 sm:py-10">
        <p className="text-[0.75rem] font-bold uppercase tracking-[0.14em] text-[var(--ca-teal)]">
          Why Consult America
        </p>
        <div className="mt-6 grid grid-cols-1 gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
          {proofs.map((item) => (
            <article key={item.label} className="border-t border-[var(--ca-line)] pt-4">
              <p className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[var(--ca-teal)]">
                {item.label}
              </p>
              <h2 className="mt-2 font-serif text-xl font-semibold tracking-[-0.03em] text-[var(--ca-ink)]">
                {item.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-[var(--ca-text-secondary)]">{item.detail}</p>
            </article>
          ))}
        </div>
        <Link
          href="/about"
          className="mt-6 inline-flex text-sm font-semibold text-[var(--ca-teal)] hover:text-[var(--ca-ink)]"
        >
          About the company →
        </Link>
      </div>
    </section>
  );
}
