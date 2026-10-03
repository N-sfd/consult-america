import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export default function HomepageFinalCta() {
  return (
    <section aria-label="Start a conversation" className="bg-[var(--ca-teal-deep)] text-white">
      <div className="mkt-shell flex flex-col items-start justify-between gap-6 py-12 sm:py-14 md:flex-row md:items-center">
        <h2 className="max-w-xl font-serif text-[clamp(1.75rem,3vw,2.5rem)] font-semibold tracking-[-0.03em]">
          Ready to put AI to work on your data?
        </h2>
        <Link
          href="/contact"
          className="inline-flex h-12 items-center gap-2 rounded-lg bg-[var(--ca-lime)] px-6 text-sm font-semibold text-[var(--ca-ink)] hover:bg-[var(--ca-lime-soft)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--ca-teal-deep)]"
        >
          Start a conversation
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
