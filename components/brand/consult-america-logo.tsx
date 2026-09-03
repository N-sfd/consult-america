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
  /** @deprecated Tagline is baked into image assets — this prop is ignored. */
  showTagline?: boolean;
  /** @deprecated Wordmark is baked into image assets — this prop is ignored. */
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

const DEFAULT_MAX_HEIGHT: Record<LogoLockup, string> = {
  header: "clamp(52px, 4.8vw, 64px)",
  footer: "56px",
  compact: "52px",
  mark: "clamp(44px, 10vw, 64px)",
  full: "160px",
  horizontal: "clamp(52px, 4.8vw, 64px)",
};

const DEFAULT_MAX_WIDTH: Record<LogoLockup, string | undefined> = {
  header: undefined,
  footer: undefined,
  compact: undefined,
  mark: "80px",
  full: "400px",
  horizontal: undefined,
};

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
}: {
  asset: RasterAsset;
  className?: string;
  maxHeight?: string;
  maxWidth?: string;
  style?: CSSProperties;
  priority?: boolean;
}) {
  const dim = brandDimensions[asset];

  return (
    // Native img bypasses Next.js image optimizer cache (fixes stale logo after asset swaps).
    <img
      src={brandAssets[asset]}
      alt=""
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

function WordmarkLockup({
  markHeight,
  compact = false,
  priority = false,
  className,
}: {
  markHeight: string;
  compact?: boolean;
  priority?: boolean;
  className?: string;
}) {
  return (
    <span className={cn("brand-lockup brand-lockup--wordmark", compact && "brand-lockup--compact", className)}>
      <RasterLogo
        asset="mark"
        priority={priority}
        maxHeight={markHeight}
      />
      <span className="brand-wordmark" aria-hidden="true">
        <span className="brand-wordmark-title">
          <span className="brand-wordmark-consult">Consult</span>{" "}
          <span className="brand-wordmark-america">America</span>
        </span>
        <span className="brand-wordmark-tagline">Enterprise Transformation</span>
        {!compact ? (
          <span className="brand-wordmark-practices">
            Oracle<span aria-hidden="true"> · </span>
            AI &amp; Data<span aria-hidden="true"> · </span>
            Application Engineering
          </span>
        ) : null}
      </span>
      <span className="sr-only">Consult America — Enterprise Transformation</span>
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

  const heightCss = toCss(maxHeight) ?? DEFAULT_MAX_HEIGHT[resolvedLockup];
  const widthCss = toCss(maxWidth) ?? DEFAULT_MAX_WIDTH[resolvedLockup];
  const useWordmark =
    resolvedLockup === "header" ||
    resolvedLockup === "footer" ||
    resolvedLockup === "compact" ||
    resolvedLockup === "horizontal";

  const content = useWordmark ? (
    <WordmarkLockup
      markHeight={heightCss}
      compact={resolvedLockup === "compact"}
      priority={resolvedLockup === "header"}
      className={className}
    />
  ) : (
    <span className={cn("brand-lockup inline-flex min-w-0 max-w-full items-center", className)}>
      <RasterLogo
        asset={LOCKUP_ASSET[resolvedLockup]}
        priority={false}
        maxHeight={heightCss}
        maxWidth={widthCss}
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
