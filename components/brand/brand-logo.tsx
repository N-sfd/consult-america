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
  if (lockup === "header") return "horizontal";
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

function showTaglineFor(context: BrandLogoContext, variant?: BrandLogoVariant) {
  if (variant === "mark" || variant === "compact") return false;
  if (context === "login" || context === "apply" || context === "mobile") {
    return false;
  }
  return true;
}

/**
 * Crisp lockup: hi-res mark artwork + live vector text (never scaled bitmap type).
 */
function CrispLockup({
  context,
  variant,
  priority,
  className,
}: {
  context: BrandLogoContext;
  variant?: BrandLogoVariant;
  priority?: boolean;
  className?: string;
}) {
  const preset = resolvePreset(context, variant);
  const withTagline = showTaglineFor(context, variant);
  const markOnly = variant === "mark";
  const markSize =
    variant === "mark"
      ? brandDisplay.mark.maxHeight
      : context === "footer"
        ? 56
        : context === "login" || context === "apply" || context === "mobile"
          ? 40
          : 58;

  if (markOnly) {
    return (
      <span
        className={cn("ca-brand-lockup ca-brand-lockup--mark", className)}
        style={
          {
            "--brand-max-w": `${preset.maxWidth}px`,
            "--brand-max-h": `${preset.maxHeight}px`,
          } as CSSProperties
        }
      >
        <img
          src={brandAssets.mark}
          alt="Consult America"
          width={brandDimensions.mark.width}
          height={brandDimensions.mark.height}
          decoding="async"
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : undefined}
          className="ca-brand-mark"
          style={{ width: markSize, height: markSize }}
        />
      </span>
    );
  }

  return (
    <span
      className={cn(
        "ca-brand-lockup",
        `ca-brand-lockup--${context}`,
        withTagline ? "ca-brand-lockup--tagged" : "ca-brand-lockup--title-only",
        className,
      )}
      style={
        {
          "--brand-max-w": `${preset.maxWidth}px`,
          "--brand-max-h": `${preset.maxHeight}px`,
          "--brand-mark-size": `${markSize}px`,
        } as CSSProperties
      }
    >
      <img
        src={brandAssets.mark}
        alt=""
        aria-hidden
        width={brandDimensions.mark.width}
        height={brandDimensions.mark.height}
        decoding="async"
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : undefined}
        className="ca-brand-mark"
      />
      <span className="ca-brand-wordmark">
        <span className="ca-brand-title">Consult America</span>
        {withTagline ? (
          <span className="ca-brand-tagline">
            Innovative Technology Consulting Services
          </span>
        ) : null}
      </span>
      <span className="sr-only">
        Consult America — Innovative Technology Consulting Services
      </span>
    </span>
  );
}

/**
 * Public / auth brand mark.
 * Portal sidebars must use PortalBrand (same crisp lockup + white-block rules).
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
  // Keep resolveAsset for callers that still reference PNG paths elsewhere.
  void resolveAsset(variant, lockup, context);

  const content = (
    <CrispLockup
      context={context}
      variant={variant}
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
