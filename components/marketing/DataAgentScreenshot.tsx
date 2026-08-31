"use client";

import Image from "next/image";

export default function DataAgentScreenshot() {
  return (
    <div className="overflow-hidden rounded-xl border border-[#DDE4E8] bg-white p-2.5 sm:p-3 shadow-[0_16px_50px_rgba(16,32,51,0.08)]">
      {/* Browser bar */}
      <div className="flex items-center justify-between border-b border-[#E9EEF1] bg-[#F4F6F7] px-3.5 py-2 -mx-2.5 -mt-2.5 mb-2.5 sm:-mx-3 sm:-mt-3 sm:mb-3 rounded-t-lg">
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-[#DDE4E8]" />
          <span className="h-2 w-2 rounded-full bg-[#DDE4E8]" />
          <span className="h-2 w-2 rounded-full bg-[#DDE4E8]" />
        </div>
        <span className="font-mono text-xs text-[#526170]">
          data-agent.consultamerica.internal
        </span>
        <div className="w-8" />
      </div>

      <div className="relative aspect-[16/10] overflow-hidden rounded bg-white">
        <Image
          src="/innovation/data-agent-hero.png"
          alt="Data Agent document intelligence workspace"
          fill
          className="object-cover object-top"
          sizes="(max-width: 1024px) 100vw, 55vw"
        />
      </div>
    </div>
  );
}
