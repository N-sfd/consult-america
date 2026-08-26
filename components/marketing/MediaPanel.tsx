"use client";

import Image from "next/image";

import { cn } from "@/lib/utils";

interface MediaPanelProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
  overlay?: "dark" | "navy" | "none";
  children?: React.ReactNode;
  scaleOnHover?: boolean;
}

export default function MediaPanel({
  src,
  alt,
  className,
  priority = false,
  sizes = "(max-width: 1024px) 100vw, 50vw",
  overlay = "dark",
  children,
  scaleOnHover = true,
}: MediaPanelProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden bg-[var(--mkt-navy)]",
        scaleOnHover && "mkt-media-hover group",
        className,
      )}
    >
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        className={cn(
          "object-cover",
          scaleOnHover && "mkt-media-scale will-change-transform",
        )}
      />
      {overlay === "dark" && (
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[var(--mkt-ink)]/70 via-[var(--mkt-ink)]/15 to-transparent" />
      )}
      {overlay === "navy" && (
        <div className="pointer-events-none absolute inset-0 bg-[var(--mkt-navy)]/45" />
      )}
      {children ? (
        <div className="absolute inset-0 z-10">{children}</div>
      ) : null}
    </div>
  );
}
