import Link from "next/link";
import { Bookmark, FileSearch, Search, Sparkles } from "lucide-react";

const CAPABILITIES = [
  {
    icon: Search,
    title: "Search for job opportunities",
    detail: "Browse and filter Consult America roles that fit your background.",
    href: "/candidate/jobs",
    cta: "Search jobs",
  },
  {
    icon: FileSearch,
    title: "Review job listings quickly",
    detail: "Open a role in the portal, scan requirements, and run a match score.",
    href: "/candidate/jobs",
    cta: "Review listings",
  },
  {
    icon: Sparkles,
    title: "Create tailored proposals",
    detail: "Draft a cover letter from your profile, skills, and match insights.",
    href: "/candidate/job-match",
    cta: "Open analyzer",
  },
  {
    icon: Bookmark,
    title: "Automatically save",
    detail: "Favorite roles you care about — proposals also save the job for you.",
    href: "/candidate/saved-jobs",
    cta: "Saved jobs",
  },
] as const;

export default function JobAnalyzerCapabilities() {
  return (
    <section className="grid gap-3 sm:grid-cols-2">
      {CAPABILITIES.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.title}
            href={item.href}
            className="ca-platform-card group flex flex-col gap-3 p-5 transition-colors hover:border-[var(--ca-platform-mid)]"
          >
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--ca-app-selected)] text-[var(--ca-platform-deep)]">
              <Icon className="h-4 w-4" aria-hidden />
            </span>
            <div>
              <h3 className="text-sm font-semibold text-[var(--ca-platform-ink)]">
                {item.title}
              </h3>
              <p className="mt-1 text-sm text-[var(--ca-platform-muted)]">{item.detail}</p>
            </div>
            <span className="mt-auto text-sm font-semibold text-[var(--ca-platform-mid)] group-hover:underline">
              {item.cta} →
            </span>
          </Link>
        );
      })}
    </section>
  );
}
