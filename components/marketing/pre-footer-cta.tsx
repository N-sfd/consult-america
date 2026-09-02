"use client";

import { ArrowUpRight } from "lucide-react";

import HomeBackgroundArc from "@/components/marketing/home-background-arc";
import { useContactPanel } from "@/components/providers/contact-provider";

export default function PreFooterCta() {
  const { setOpen } = useContactPanel();

  return (
    <section
      className="relative overflow-hidden py-16 sm:py-20 lg:py-24"
      style={{
        background:
          "linear-gradient(135deg, #073B3A 0%, #0B4A47 50%, #176A63 100%)",
      }}
    >
      <HomeBackgroundArc tone="light" className="-right-[18%] top-1/2 -translate-y-1/2 opacity-90" />

      <div className="relative z-10 mx-auto max-w-[1440px] px-6 lg:px-8 xl:px-10">
        <div className="max-w-2xl">
          <h2 className="font-serif text-[clamp(1.75rem,3vw,2.75rem)] font-semibold tracking-[-0.03em] text-white">
            Build what&apos;s next.
          </h2>
          <p className="mt-5 max-w-xl text-[1.0625rem] leading-relaxed text-white/80">
            Bring transformation, data, AI and engineering together around the outcomes that matter.
          </p>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="mt-9 inline-flex h-12 cursor-pointer items-center justify-center gap-2 rounded-full bg-[#B83A3A] px-7 text-sm font-semibold text-white transition-colors hover:bg-[#992F31]"
          >
            Start a Conversation
            <ArrowUpRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
