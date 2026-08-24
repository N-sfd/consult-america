import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

const tones = {
  "off-white": "bg-black text-white",
  white: "bg-black text-white",
  surface: "bg-black text-white",
  navy: "bg-black text-white",
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
      <div className="mx-auto w-full max-w-[94.5em] px-5 py-16 sm:px-8 md:py-24 lg:px-12">
        {children}
      </div>
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
        "text-sm tracking-[0.16em] uppercase",
        onDark ? "text-white/55" : "text-white/55",
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
        "mt-5 max-w-2xl text-lg text-white/60",
        onDark && "text-white/60",
        className,
      )}
    >
      {children}
    </p>
  );
}
