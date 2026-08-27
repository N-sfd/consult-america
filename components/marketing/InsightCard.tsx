import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import MediaPanel from "@/components/marketing/MediaPanel";
import { cn } from "@/lib/utils";

interface InsightCardProps {
  href: string;
  image: string;
  imageAlt?: string;
  categoryLabel: string;
  title: string;
  summary?: string;
  readingTime: string;
  size?: "large" | "default";
  className?: string;
}

export default function InsightCard({
  href,
  image,
  imageAlt = "",
  categoryLabel,
  title,
  summary,
  readingTime,
  size = "default",
  className,
}: InsightCardProps) {
  const isLarge = size === "large";

  return (
    <Link
      href={href}
      className={cn("group flex h-full flex-col", className)}
    >
      <MediaPanel
        src={image}
        alt={imageAlt}
        overlay="none"
        className={cn(
          "w-full",
          isLarge ? "aspect-[16/10] lg:aspect-[3/2]" : "aspect-[16/10]",
        )}
      />

      <div className="mt-5 flex flex-1 flex-col border-t border-black/10 pt-5">
        <span className="mkt-eyebrow text-[var(--mkt-blue)]">
          {categoryLabel}
        </span>

        <h3
          className={cn(
            "mt-3 leading-snug text-[var(--mkt-ink)] transition-colors group-hover:text-[var(--mkt-blue)]",
            isLarge
              ? "text-xl font-medium tracking-[-0.03em] md:text-2xl"
              : "mkt-h3",
          )}
        >
          {title}
        </h3>

        {summary && isLarge ? (
          <p className="mt-3 max-w-lg text-base leading-7 text-black/55">
            {summary}
          </p>
        ) : null}

        <div className="mt-auto flex items-center justify-between pt-5">
          <span className="text-sm text-black/45">{readingTime}</span>
          <ArrowUpRight className="h-4 w-4 text-[var(--mkt-ink)] transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-1" />
        </div>
      </div>
    </Link>
  );
}
