"use client";

import { ArrowUpRight } from "lucide-react";

import SectionBackdrop from "@/components/marketing/section-backdrop";
import { useContactPanel } from "@/components/providers/contact-provider";

export default function PreFooterCta() {
  const { setOpen } = useContactPanel();

  return (
    <section className="ca-grad-dark relative overflow-hidden py-16 sm:py-20 lg:py-24">
      <SectionBackdrop variant="cta" />

      <div className="relative z-10 mx-auto max-w-[1440px] px-6 text-center lg:px-8 xl:px-10">
        <h2 className="font-serif text-[clamp(1.75rem,3vw,2.5rem)] font-semibold tracking-[-0.03em] text-white">
          Ready to move your technology forward?
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-[1.0625rem] leading-relaxed text-white/80">
          Let&apos;s talk about what you&apos;re transforming, modernizing or building.
        </p>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="mt-9 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#B83A3A] px-7 text-sm font-semibold text-white transition-colors hover:bg-[#992F31] cursor-pointer"
        >
          Talk to an Expert
          <ArrowUpRight className="h-4 w-4" />
        </button>
      </div>
    </section>
  );
}
