import Link from "next/link";
import type { CSSProperties } from "react";

import {
  brandAssets,
  brandDimensions,
  brandDisplay,
  type BrandAssetKey,
} from "@/lib/brandAssets";
import { cn } from "@/lib/utils";

export type BrandLogoVariant = "full" | "compact" | "mark";
export type BrandLogoContext =
  | "marketing"
  | "footer"
  | "login"
  | "apply"
  | "mobile";

export type BrandLogoProps = {
  variant?: BrandLogoVariant;
  context?: BrandLogoContext;
  href?: string | null;
  className?: string;
  priority?: boolean;
  onNavigate?: () => void;
  /** @deprecated Prefer variant + context — sizes come from brandDisplay */
  lockup?: "header" | "footer" | "compact" | "mark" | "full" | "horizontal";
  /** @deprecated Ignored — sizes are centralized */
  maxHeight?: number | string;
  /** @deprecated Ignored — sizes are centralized */
  maxWidth?: number | string;
  showTagline?: boolean;
  showWordmark?: boolean;
  size?: string;
};

function resolvePreset(context: BrandLogoContext, variant?: BrandLogoVariant) {
  if (variant === "mark") return brandDisplay.mark;
  if (variant === "compact") {
    if (context === "login") return brandDisplay.login;
    if (context === "apply") return brandDisplay.apply;
    return brandDisplay.mobile;
  }
  if (context === "footer") return brandDisplay.footer;
  if (context === "login") return brandDisplay.login;
  if (context === "apply") return brandDisplay.apply;
  if (context === "mobile") return brandDisplay.mobile;
  return brandDisplay.marketing;
}

function resolveAsset(
  variant: BrandLogoVariant | undefined,
  lockup: BrandLogoProps["lockup"],
  context: BrandLogoContext,
): BrandAssetKey {
  if (variant === "mark" || lockup === "mark") return "mark";
  if (variant === "compact" || lockup === "compact") return "compact";
  if (lockup === "header") return "header";
  if (
    variant === "full" ||
    lockup === "full" ||
    lockup === "horizontal" ||
    lockup === "footer"
  ) {
    return context === "marketing" ? "header" : "horizontal";
  }
  return resolvePreset(context, variant).asset;
}

/**
 * Approved brand artwork at natural aspect ratio.
 * Never crop with object-fit:cover / overflow clipping / text ellipsis.
 */
function ArtworkLockup({
  context,
  variant,
  lockup,
  priority,
  className,
}: {
  context: BrandLogoContext;
  variant?: BrandLogoVariant;
  lockup?: BrandLogoProps["lockup"];
  priority?: boolean;
  className?: string;
}) {
  const preset = resolvePreset(context, variant);
  const assetKey = resolveAsset(variant, lockup, context);
  const dims = brandDimensions[assetKey];
  const src = brandAssets[assetKey];
  const alt =
    assetKey === "mark"
      ? "Consult America"
      : "Consult America — Innovative Technology Consulting Services";

  return (
    <span
      className={cn(
        "brand-lockup ca-brand-artwork",
        `ca-brand-artwork--${context}`,
        variant === "compact" || context === "mobile"
          ? "ca-brand-artwork--compact"
          : null,
        variant === "mark" ? "ca-brand-artwork--mark" : null,
        className,
      )}
      style={
        {
          "--brand-max-w": `${preset.maxWidth}px`,
          "--brand-max-h": `${preset.maxHeight}px`,
        } as CSSProperties
      }
    >
      <img
        src={src}
        alt={alt}
        width={dims.width}
        height={dims.height}
        decoding="async"
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : undefined}
        className="brand-logo ca-brand-artwork-img"
      />
    </span>
  );
}

/**
 * Public / auth brand mark.
 * Portal sidebars must use PortalBrand (same artwork rules).
 */
export default function BrandLogo({
  variant,
  context = "marketing",
  href = "/",
  className,
  priority = false,
  onNavigate,
  lockup,
}: BrandLogoProps) {
  const content = (
    <ArtworkLockup
      context={context}
      variant={variant}
      lockup={lockup}
      priority={priority}
      className={className}
    />
  );

  if (href === null || href === undefined) return content;

  return (
    <Link
      href={href}
      aria-label="Consult America homepage"
      className="brand-lockup-link ca-brand-lockup-link"
      onClick={onNavigate}
    >
      {content}
    </Link>
  );
}

export function ConsultAmericaLogo(props: BrandLogoProps) {
  return <BrandLogo {...props} />;
}

export type ConsultAmericaLogoProps = BrandLogoProps;
export type ConsultAmericaLogoVariant = "light" | "dark" | "compact" | "mark";
export type ConsultAmericaLogoSize = "header" | "footer" | "compact" | "mark";
