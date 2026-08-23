import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

const tones = {
  "off-white": "bg-ca-off-white text-ca-ink",
  white: "bg-ca-white text-ca-ink",
  surface: "bg-ca-surface text-ca-ink",
  navy: "bg-ca-navy text-ca-white",
} as const;

type SectionProps = {
  tone: keyof typeof tones;
  id?: string;
  className?: string;
  children: ReactNode;
};

export function Section({ tone, id, className, children }: SectionProps) {
  return (
    <section id={id} className={cn(tones[tone], className)}>
      <div className="mx-auto w-full max-w-ca px-6 py-20 md:py-24">{children}</div>
    </section>
  );
}

export function SectionEyebrow({
  children,
  onDark = false,
}: {
  children: ReactNode;
  onDark?: boolean;
}) {
  return (
    <p
      className={cn(
        "text-sm font-medium tracking-[0.16em] uppercase",
        onDark ? "text-ca-white/70" : "text-ca-muted"
      )}
    >
      {children}
    </p>
  );
}

export function SectionLead({
  children,
  onDark = false,
  className,
}: {
  children: ReactNode;
  onDark?: boolean;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "mt-5 max-w-2xl text-lg",
        onDark ? "text-ca-white/70" : "text-ca-muted",
        className
      )}
    >
      {children}
    </p>
  );
}
