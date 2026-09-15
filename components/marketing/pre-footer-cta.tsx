"use client";

import { ArrowUpRight } from "lucide-react";

import { useContactPanel } from "@/components/providers/contact-provider";

/**
 * Optional mid-page CTA — light surface so it never stacks as a second dark block
 * against HomepageContactSection + SiteFooter.
 */
export default function PreFooterCta() {
  const { setOpen } = useContactPanel();

  return (
    <section className="relative overflow-x-clip border-b border-[var(--ca-line)] bg-[var(--ca-canvas)] py-12 sm:py-14">
      <div className="relative z-10 mx-auto max-w-[1440px] px-6 lg:px-8 xl:px-10">
        <div className="max-w-2xl">
          <h2 className="font-serif text-[clamp(1.5rem,2.6vw,2.25rem)] font-semibold tracking-[-0.03em] text-[var(--ca-ink)]">
            Build what&apos;s next.
          </h2>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-[var(--ca-text-secondary)]">
            Bring transformation, data, AI and engineering together around the outcomes that matter.
          </p>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="mt-7 inline-flex h-[52px] cursor-pointer items-center justify-center gap-2 rounded-lg bg-[var(--ca-lime)] px-7 text-sm font-semibold text-[var(--ca-ink)] transition-colors hover:bg-[var(--ca-accent-hover)]"
          >
            Start a Conversation
            <ArrowUpRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
