"use client";

import Image from "next/image";
import { useState } from "react";

import AppBrowserFrame from "@/components/marketing/AppBrowserFrame";

function DataAgentFallback() {
  return (
    <div className="flex h-full flex-col bg-[#F4EFE6] p-4">
      <div className="grid grid-cols-4 gap-2">
        {["Documents", "Clauses", "Fields", "Review"].map((label) => (
          <div
            key={label}
            className="rounded border border-[#D7CCBD] bg-[#FFFDF8] px-2 py-3 text-center"
          >
            <p className="text-[0.6rem] uppercase tracking-[0.1em] text-[#695F57]">
              {label}
            </p>
          </div>
        ))}
      </div>
      <div className="mt-3 flex-1 rounded border border-[#D7CCBD] bg-[#FFFDF8] p-3">
        <p className="text-[0.65rem] font-bold uppercase tracking-[0.1em] text-[#695F57]">
          Contract repository
        </p>
        <div className="mt-3 space-y-2">
          {["MSA-2024-8841", "SOW-2025-1120", "NDA-2025-0042"].map((row) => (
            <div
              key={row}
              className="rounded bg-[#DFE4DA] px-3 py-2 text-xs font-semibold text-[#261F1B]"
            >
              {row}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function DataAgentScreenshot({
  className = "",
}: {
  className?: string;
}) {
  const [useFallback, setUseFallback] = useState(false);

  return (
    <div className={className}>
      <AppBrowserFrame title="Data Agent">
        <div className="relative aspect-[16/10] bg-[#F4EFE6]">
          {useFallback ? (
            <DataAgentFallback />
          ) : (
            <Image
              src="/innovation/data-agent-hero.png"
              alt="Data Agent contract intelligence platform"
              fill
              className="object-cover object-top"
              sizes="(max-width: 1024px) 100vw, 50vw"
              onError={() => setUseFallback(true)}
            />
          )}
        </div>
      </AppBrowserFrame>
    </div>
  );
}
