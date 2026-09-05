import Link from "next/link";
import type { CSSProperties } from "react";

import { brandAssets, brandDimensions, type BrandAssetKey } from "@/lib/brandAssets";
import { cn } from "@/lib/utils";

export type BrandLogoVariant = "full" | "compact" | "mark" | "header";
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
  /** @deprecated Prefer variant + context */
  lockup?: "header" | "footer" | "compact" | "mark" | "full" | "horizontal";
  maxHeight?: number | string;
  maxWidth?: number | string;
  showTagline?: boolean;
  showWordmark?: boolean;
  size?: string;
  variantTone?: "light" | "dark";
};

const CONTEXT_SIZE: Record<
  BrandLogoContext,
  { maxWidth: number; maxHeight: number; asset: BrandAssetKey }
> = {
  marketing: { maxWidth: 260, maxHeight: 60, asset: "header" },
  footer: { maxWidth: 320, maxHeight: 108, asset: "horizontal" },
  login: { maxWidth: 236, maxHeight: 48, asset: "compact" },
  apply: { maxWidth: 220, maxHeight: 46, asset: "compact" },
  mobile: { maxWidth: 180, maxHeight: 42, asset: "compact" },
};

function resolveAsset(
  variant: BrandLogoVariant | undefined,
  lockup: BrandLogoProps["lockup"],
  context: BrandLogoContext,
): BrandAssetKey {
  if (variant === "mark" || lockup === "mark") return "mark";
  if (variant === "compact" || lockup === "compact") return "compact";
  if (variant === "header" || lockup === "header") return "header";
  if (variant === "full" || lockup === "full" || lockup === "horizontal" || lockup === "footer") {
    return "horizontal";
  }
  return CONTEXT_SIZE[context].asset;
}

/**
 * Public / auth brand mark. Portal sidebars must use PortalBrand instead.
 */
export default function BrandLogo({
  variant,
  context = "marketing",
  href = "/",
  className,
  priority = false,
  onNavigate,
  lockup,
  maxHeight,
  maxWidth,
}: BrandLogoProps) {
  const asset = resolveAsset(variant, lockup, context);
  const preset = CONTEXT_SIZE[context];
  const dim = brandDimensions[asset];
  const width =
    typeof maxWidth === "number"
      ? maxWidth
      : typeof maxWidth === "string"
        ? maxWidth
        : `${variant === "mark" ? 40 : preset.maxWidth}px`;
  const height =
    typeof maxHeight === "number"
      ? maxHeight
      : typeof maxHeight === "string"
        ? maxHeight
        : `${variant === "mark" ? 38 : preset.maxHeight}px`;

  const content = (
    <span className={cn("brand-lockup", `brand-lockup--${context}`, className)}>
      <img
        src={brandAssets[asset]}
        alt="Consult America"
        width={dim.width}
        height={dim.height}
        decoding="async"
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : undefined}
        className="brand-logo"
        style={
          {
            maxWidth: width,
            maxHeight: height,
          } as CSSProperties
        }
      />
      <span className="sr-only">Consult America — Enterprise Transformation</span>
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
