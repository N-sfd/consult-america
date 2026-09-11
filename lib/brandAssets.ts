/**
 * Approved Consult America logo assets — single source of truth.
 * Do not recreate wordmarks in HTML/CSS. Do not tint/blur/shadow logo images.
 *
 * Rule: never shrink the full lockup until ENTERPRISE TRANSFORMATION and
 * ORACLE • AI & DATA • APPLICATION ENGINEERING become unreadable.
 * Fix container width first; switch to compact/mark lockups when needed.
 */
export const brandAssets = {
  horizontal: "/brand/ca-logo-horizontal.png?v=crisp-1",
  header: "/brand/ca-logo-header.png?v=crisp-1",
  compact: "/brand/ca-logo-compact.png?v=crisp-1",
  mark: "/brand/ca-logo-mark.png?v=crisp-1",
} as const;

export const brandDimensions = {
  header: { width: 1400, height: 423 },
  horizontal: { width: 1042, height: 315 },
  compact: { width: 1100, height: 333 },
  mark: { width: 512, height: 512 },
} as const;

/**
 * Canonical display sizes — pages must not invent one-off widths.
 * UI lockups use the hi-res mark + live text; PNG paths are for OG/meta.
 */
export const brandDisplay = {
  /** Header lockup — CSS clamp/breakpoints refine width; keep max at ~340–360px */
  marketing: { maxWidth: 340, maxHeight: 80, asset: "horizontal" as const },
  footer: { maxWidth: 380, maxHeight: 72, asset: "horizontal" as const },
  portal: { maxWidth: 340, maxHeight: 64, asset: "horizontal" as const },
  login: { maxWidth: 260, maxHeight: 48, asset: "compact" as const },
  apply: { maxWidth: 260, maxHeight: 48, asset: "compact" as const },
  /** Compact header lockup when descriptor would be unreadable */
  mobile: { maxWidth: 220, maxHeight: 48, asset: "compact" as const },
  mark: { maxWidth: 40, maxHeight: 38, asset: "mark" as const },
} as const;

/** @deprecated Use brandDisplay.portal / brandDisplay.mobile */
export const portalBrandDisplay = {
  sidebar: brandDisplay.portal,
  mobile: brandDisplay.mobile,
} as const;

export type BrandAssetKey = keyof typeof brandAssets;
