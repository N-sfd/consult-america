"use client";

import { ArrowUpRight } from "lucide-react";

import Atmosphere from "@/components/layout/atmosphere";
import { useContactPanel } from "@/components/providers/contact-provider";

export default function GrowthCta() {
  const { setOpen } = useContactPanel();

  return (
    <section className="relative overflow-hidden border-t border-white/10 bg-black ca-gutter py-24 lg:py-32">
      <Atmosphere variant="section" />
      <div className="relative z-10 mx-auto max-w-[94.5em]">
        <p className="ca-h1 max-w-4xl">Ready to unlock growth?</p>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="ca-button-primary mt-10"
        >
          Contact Us
          <ArrowUpRight className="h-4 w-4" />
        </button>
      </div>
    </section>
  );
}
