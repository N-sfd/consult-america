"use client";

import { ArrowUpRight } from "lucide-react";

import BackgroundAccent from "@/components/marketing/inner-page/background-accent";
import Reveal from "@/components/marketing/inner-page/reveal";
import { useContactPanel } from "@/components/providers/contact-provider";

export default function ContactCTA({
  headline = "Ready to move from plan to production?",
}: {
  headline?: string;
}) {
  const { setOpen } = useContactPanel();

  return (
    <section className="ca-cta-band mkt-section-compact relative overflow-hidden text-white">
      <BackgroundAccent preset="section-cta" intensity="rich" />
      <div className="mkt-shell relative z-10 flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
        <Reveal>
          <h2 className="max-w-2xl text-3xl font-medium tracking-[-0.035em] text-white md:text-4xl lg:text-[2.75rem] lg:leading-[1.08]">
            {headline}
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="group/cta ca-button-light shrink-0"
          >
            Start a conversation
            <ArrowUpRight className="mkt-cta-arrow h-4 w-4" />
          </button>
        </Reveal>
      </div>
    </section>
  );
}
