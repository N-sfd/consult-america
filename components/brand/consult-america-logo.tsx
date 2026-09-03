import Link from "next/link";
import type { CSSProperties } from "react";

import { brandAssets, brandDimensions, type BrandAssetKey } from "@/lib/brandAssets";
import { cn } from "@/lib/utils";

export type ConsultAmericaLogoVariant = "light" | "dark" | "compact" | "mark";
export type ConsultAmericaLogoSize = "header" | "footer" | "compact" | "mark";
export type LogoLockup = "header" | "footer" | "compact" | "mark" | "full" | "horizontal";

export interface ConsultAmericaLogoProps {
  href?: string;
  className?: string;
  variant?: ConsultAmericaLogoVariant;
  size?: ConsultAmericaLogoSize;
  lockup?: LogoLockup;
  /** Max rendered height — scales width proportionally. */
  maxHeight?: number | string;
  /** Max rendered width — scales height proportionally. */
  maxWidth?: number | string;
  /** @deprecated Tagline is controlled by lockup — this prop is ignored. */
  showTagline?: boolean;
  /** @deprecated Wordmark is controlled by lockup — this prop is ignored. */
  showWordmark?: boolean;
  onNavigate?: () => void;
}

type RasterAsset = "full" | "compact" | "mark" | "horizontal";

const LOCKUP_ASSET: Record<LogoLockup, RasterAsset> = {
  header: "mark",
  footer: "mark",
  compact: "mark",
  mark: "mark",
  full: "full",
  horizontal: "mark",
};

/** Wordmark + taglines as bold HTML so title/subtitle stay readable at header scale. */
const TEXT_LOCKUPS: LogoLockup[] = ["header", "footer", "compact", "horizontal"];

function toCss(value?: number | string) {
  if (value === undefined) return undefined;
  return typeof value === "number" ? `${value}px` : value;
}

function RasterLogo({
  asset,
  className,
  maxHeight,
  maxWidth,
  style,
  priority,
  alt = "Consult America",
}: {
  asset: RasterAsset;
  className?: string;
  maxHeight?: string;
  maxWidth?: string;
  style?: CSSProperties;
  priority?: boolean;
  alt?: string;
}) {
  const dim = brandDimensions[asset];

  return (
    // Native img bypasses Next.js image optimizer cache (fixes stale logo after asset swaps).
    <img
      src={brandAssets[asset]}
      alt={alt}
      width={dim.width}
      height={dim.height}
      decoding="async"
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : undefined}
      className={cn("brand-logo block h-auto w-auto max-w-full object-contain object-left", className)}
      style={{
        maxHeight,
        maxWidth,
        width: "auto",
        height: "auto",
        aspectRatio: `${dim.width} / ${dim.height}`,
        ...style,
      }}
    />
  );
}

function BoldWordmarkLockup({
  className,
  markHeight,
  priority,
}: {
  className?: string;
  markHeight: string;
  priority?: boolean;
}) {
  return (
    <span className={cn("brand-lockup brand-lockup--text inline-flex min-w-0 max-w-full items-center gap-3", className)}>
      <RasterLogo
        asset="mark"
        alt=""
        priority={priority}
        maxHeight={markHeight}
        className="brand-logo-mark shrink-0"
      />
      <span className="brand-wordmark min-w-0">
        <span className="brand-wordmark-title">
          <span className="brand-wordmark-consult">Consult</span>{" "}
          <span className="brand-wordmark-america">America</span>
        </span>
        <span className="brand-wordmark-tagline">Enterprise Transformation</span>
        <span className="brand-wordmark-practices">
          Oracle<span aria-hidden="true"> · </span>AI &amp; Data
          <span aria-hidden="true"> · </span>Application Engineering
        </span>
      </span>
    </span>
  );
}

export default function ConsultAmericaLogo({
  href = "/",
  className,
  variant = "light",
  size,
  lockup,
  maxHeight,
  maxWidth,
  onNavigate,
}: ConsultAmericaLogoProps) {
  const resolvedLockup: LogoLockup =
    lockup ??
    (variant === "mark" || size === "mark"
      ? "mark"
      : variant === "compact" || size === "compact"
        ? "compact"
        : size === "footer"
          ? "footer"
          : "header");

  const useTextLockup = TEXT_LOCKUPS.includes(resolvedLockup);
  const markHeight =
    toCss(maxHeight) ??
    (resolvedLockup === "footer"
      ? "64px"
      : resolvedLockup === "compact"
        ? "58px"
        : "clamp(58px, 5vw, 72px)");

  const content = useTextLockup ? (
    <BoldWordmarkLockup
      className={className}
      markHeight={markHeight}
      priority={resolvedLockup === "header"}
    />
  ) : (
    <span className={cn("brand-lockup inline-flex min-w-0 max-w-full items-center", className)}>
      <RasterLogo
        asset={LOCKUP_ASSET[resolvedLockup]}
        priority={resolvedLockup === "header"}
        maxHeight={toCss(maxHeight) ?? "clamp(44px, 10vw, 64px)"}
        maxWidth={toCss(maxWidth)}
      />
      <span className="sr-only">Consult America — Enterprise Transformation</span>
    </span>
  );

  if (!href) return content;

  return (
    <Link
      href={href}
      aria-label="Consult America homepage"
      className="inline-flex min-w-0 max-w-full shrink items-center rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C52F32]"
      onClick={onNavigate}
    >
      {content}
    </Link>
  );
}

export { brandAssets, brandDimensions, type BrandAssetKey };
