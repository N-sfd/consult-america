"use client";

import { ArrowUpRight } from "lucide-react";

import { useContactPanel } from "@/components/providers/contact-provider";

export default function InlinePracticeCTA({
  practice,
  serviceKey,
  prompt,
  label,
}: {
  practice: string;
  serviceKey?: string;
  prompt: string;
  label?: string;
}) {
  const { setOpen } = useContactPanel();

  return (
    <div className="mx-auto flex max-w-[1100px] flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#E1ECE8] bg-[#F8FAF9] px-6 py-5">
      <p className="text-sm text-[#5B6D6B]">{prompt}</p>
      <button
        type="button"
        onClick={() => setOpen(true, { practice, serviceKey })}
        className="inline-flex h-11 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-lg bg-[var(--ca-teal-deep)] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#0B4655]"
      >
        {label ?? `Talk to a ${practice} expert`}
        <ArrowUpRight className="h-4 w-4" />
      </button>
    </div>
  );
}
