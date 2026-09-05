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
  if (lockup === "header") return "horizontal"; // full readable lockup, not truncated crop
  if (
    variant === "full" ||
    lockup === "full" ||
    lockup === "horizontal" ||
    lockup === "footer"
  ) {
    return "horizontal";
  }
  return resolvePreset(context, variant).asset;
}

/**
 * Public / auth brand mark.
 * Portal sidebars must use PortalBrand (same artwork + white-block rules).
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
  const preset = resolvePreset(context, variant);
  const asset = resolveAsset(variant, lockup, context);
  const dim = brandDimensions[asset];
  const isMarketingFull = context === "marketing" && asset === "horizontal";

  const content = (
    <span
      className={cn("brand-lockup", `brand-lockup--${context}`, className)}
      style={
        {
          "--brand-max-w": `${preset.maxWidth}px`,
          "--brand-max-h": `${preset.maxHeight}px`,
        } as CSSProperties
      }
    >
      <img
        src={brandAssets[asset]}
        alt="Consult America"
        width={dim.width}
        height={dim.height}
        decoding="async"
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : undefined}
        className={cn("brand-logo", isMarketingFull && "brand-logo--full-primary")}
        style={
          isMarketingFull
            ? undefined
            : {
                maxWidth: preset.maxWidth,
                maxHeight: preset.maxHeight,
              }
        }
      />

      {isMarketingFull ? (
        <img
          src={brandAssets.compact}
          alt=""
          aria-hidden
          width={brandDimensions.compact.width}
          height={brandDimensions.compact.height}
          decoding="async"
          className="brand-logo brand-logo--compact-fallback"
        />
      ) : null}

      <span className="sr-only">
        Consult America — Innovative Technology Consulting Services
      </span>
    </span>
  );

  if (href === null || href === undefined) return content;

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

export function ConsultAmericaLogo(props: BrandLogoProps) {
  return <BrandLogo {...props} />;
}

export type ConsultAmericaLogoProps = BrandLogoProps;
export type ConsultAmericaLogoVariant = "light" | "dark" | "compact" | "mark";
export type ConsultAmericaLogoSize = "header" | "footer" | "compact" | "mark";
