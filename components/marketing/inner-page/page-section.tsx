"use client";

import BackgroundAccent, {
  type AccentPreset,
} from "@/components/marketing/inner-page/background-accent";
import Reveal from "@/components/marketing/inner-page/reveal";
import { cn } from "@/lib/utils";

export type SectionTone = "white" | "soft" | "sage" | "dark" | "gradient";

const toneClass: Record<SectionTone, string> = {
  white: "mkt-section-bg-white",
  soft: "mkt-section-bg-soft",
  sage: "mkt-section-bg-sage",
  dark: "mkt-section-bg-dark",
  gradient: "mkt-section-bg-gradient",
};

const accentPreset: Record<SectionTone, AccentPreset> = {
  white: "section-white",
  soft: "section-soft",
  sage: "section-sage",
  dark: "section-dark",
  gradient: "section-sage",
};

export default function PageSection({
  children,
  tone = "white",
  accent = true,
  compact = true,
  eyebrow,
  title,
  lead,
  id,
  className,
  headerClassName,
}: {
  children: React.ReactNode;
  tone?: SectionTone;
  accent?: boolean;
  compact?: boolean;
  eyebrow?: string;
  lead?: string;
  title?: string;
  id?: string;
  className?: string;
  headerClassName?: string;
}) {
  const isDark = tone === "dark" || tone === "gradient";

  return (
    <section
      id={id}
      className={cn(
        "ca-page-section relative overflow-hidden",
        compact ? "mkt-section-compact" : "mkt-section",
        toneClass[tone],
        className,
      )}
    >
      {accent ? (
        <BackgroundAccent preset={accentPreset[tone]} intensity="normal" />
      ) : null}

      <div className="mkt-shell relative z-10">
        {(eyebrow || title || lead) && (
          <header className={cn("mb-8 max-w-3xl", headerClassName)}>
            {eyebrow ? (
              <Reveal>
                <p
                  className={cn(
                    "mkt-eyebrow",
                    isDark ? "text-[#9BC4B8]" : "text-[#176A63]",
                  )}
                >
                  {eyebrow}
                </p>
              </Reveal>
            ) : null}
            {title ? (
              <Reveal delay={0.06}>
                <h2
                  className={cn(
                    "mkt-section-heading mt-4",
                    isDark && "!text-white",
                  )}
                >
                  {title}
                </h2>
              </Reveal>
            ) : null}
            {lead ? (
              <Reveal delay={0.12}>
                <p
                  className={cn(
                    "mkt-inner-hero-body mt-4",
                    isDark && "mkt-inner-hero-body--light",
                  )}
                >
                  {lead}
                </p>
              </Reveal>
            ) : null}
          </header>
        )}
        {children}
      </div>
    </section>
  );
}
