import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { cn } from "@/lib/utils";

interface IndustryTileProps {
  number: string;
  title: string;
  description: string;
  href: string;
  image: string;
  imageAlt: string;
  className?: string;
}

export default function IndustryTile({
  number,
  title,
  description,
  href,
  image,
  imageAlt,
  className,
}: IndustryTileProps) {
  return (
    <Link
      href={href}
      className={cn(
        "ca-industry-tile group relative block min-h-[280px] md:min-h-[320px]",
        className,
      )}
    >
      <Image
        src={image}
        alt={imageAlt}
        fill
        className="mkt-media-scale object-cover"
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[var(--mkt-ink)]/90 via-[var(--mkt-ink)]/35 to-[var(--mkt-ink)]/10" />
      <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-7">
        <span className="mkt-eyebrow text-white/45">{number}</span>
        <h3 className="mt-3 text-xl font-medium tracking-[-0.03em] text-white md:text-2xl">
          {title}
        </h3>
        <p className="mt-3 max-w-sm text-sm leading-6 text-white/70">
          {description}
        </p>
        <ArrowUpRight className="mt-4 h-5 w-5 text-white transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-1" />
      </div>
    </Link>
  );
}
