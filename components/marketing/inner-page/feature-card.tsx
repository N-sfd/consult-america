"use client";

import Reveal from "@/components/marketing/inner-page/reveal";
import { cn } from "@/lib/utils";

export default function FeatureCard({
  children,
  className,
  delay = 0,
  hover = true,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  hover?: boolean;
}) {
  return (
    <Reveal delay={delay}>
      <article
        className={cn(
          "ca-feature-card rounded-2xl border border-[#C9DDD7]/80 bg-white p-6 md:p-7",
          hover && "ca-feature-card--hover",
          className,
        )}
      >
        {children}
      </article>
    </Reveal>
  );
}
