"use client";

import { useContactPanel } from "@/components/providers/contact-provider";

export default function GrowthCta() {
  const { setOpen } = useContactPanel();

  return (
    <section className="border-t border-white/10 bg-black px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
      <div className="mx-auto max-w-[94.5em]">
        <p className="ca-display">Ready to unlock growth?</p>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="ca-button-primary mt-10"
        >
          Contact Us
        </button>
      </div>
    </section>
  );
}
