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
  maxHeight?: number | string;
  maxWidth?: number | string;
  showTagline?: boolean;
  showWordmark?: boolean;
  onNavigate?: () => void;
}

type RasterAsset = "compact" | "mark" | "horizontal" | "header";

const LOCKUP_ASSET: Record<LogoLockup, RasterAsset> = {
  header: "header",
  footer: "horizontal",
  compact: "compact",
  mark: "mark",
  full: "horizontal",
  horizontal: "horizontal",
};

const DEFAULT_MAX_HEIGHT: Record<LogoLockup, string> = {
  header: "78px",
  footer: "120px",
  compact: "64px",
  mark: "64px",
  full: "240px",
  horizontal: "120px",
};

const DEFAULT_MAX_WIDTH: Record<LogoLockup, string | undefined> = {
  header: "480px",
  footer: "600px",
  // "compact" is only ever used in the app-shell sidebars (240px wide, 32px
  // of horizontal padding) — must fit inside that or it clips against the
  // sidebar edge with no visible warning.
  compact: "180px",
  mark: "80px",
  full: "420px",
  horizontal: "600px",
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
    <img
      src={brandAssets[asset]}
      alt="Consult America"
      width={dim.width}
      height={dim.height}
      decoding="async"
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : undefined}
      className={cn("brand-logo", className)}
      style={{
        maxHeight,
        maxWidth,
        ...style,
      }}
    />
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

  const asset = LOCKUP_ASSET[resolvedLockup];
  const heightCss = toCss(maxHeight) ?? DEFAULT_MAX_HEIGHT[resolvedLockup];
  const widthCss = toCss(maxWidth) ?? DEFAULT_MAX_WIDTH[resolvedLockup];

  const content = (
    <span className={cn("brand-lockup", className)}>
      <RasterLogo
        asset={asset}
        priority={resolvedLockup === "header"}
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
      className="brand-lockup-link"
      onClick={onNavigate}
    >
      {content}
    </Link>
  );
}

export { brandAssets, brandDimensions, type BrandAssetKey };
