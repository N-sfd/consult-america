import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Candidates",
};

const candidates = [
  {
    name: "Maya Chen",
    role: "AI Engineer",
    stage: "Interview",
    location: "Remote",
  },
  {
    name: "Jordan Blake",
    role: "Oracle SCM Consultant",
    stage: "Offer",
    location: "Maryland",
  },
  {
    name: "Priya Nair",
    role: "Data Engineer",
    stage: "Screening",
    location: "Virginia",
  },
  {
    name: "Sam Ortiz",
    role: "Senior Oracle Financials",
    stage: "Applied",
    location: "United States",
  },
  {
    name: "Aisha Rahman",
    role: "Enterprise Transformation",
    stage: "Interview",
    location: "Maryland · Hybrid",
  },
];

export default function WorkforceCandidatesPage() {
  return (
    <div className="mx-auto max-w-[1200px] px-4 py-6 lg:px-8 lg:py-8">
      <p className="text-[0.7rem] uppercase tracking-[0.14em] text-black/40">
        Recruiting
      </p>
      <h1 className="mt-2 text-2xl font-medium tracking-[-0.03em]">
        Candidates
      </h1>
      <p className="mt-2 text-sm text-black/50">
        Pipeline view · demo data until ATS integration is live
      </p>

      <div className="mt-6 overflow-hidden border border-black/8 bg-white">
        {candidates.map((person) => (
          <div
            key={person.name}
            className="grid gap-1 border-b border-black/6 px-5 py-4 last:border-0 sm:grid-cols-[1.2fr_1.2fr_0.8fr_1fr] sm:items-center"
          >
            <span className="font-medium">{person.name}</span>
            <span className="text-sm text-black/55">{person.role}</span>
            <span className="text-sm text-[var(--ca-blue)]">{person.stage}</span>
            <span className="text-sm text-black/45">{person.location}</span>
          </div>
        ))}
      </div>

      <Link
        href="/workforce"
        className="mt-6 inline-block text-sm text-[var(--ca-blue)] hover:underline"
      >
        ← Back to overview
      </Link>
    </div>
  );
}
