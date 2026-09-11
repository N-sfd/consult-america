/**
 * Approved Consult America logo assets — single source of truth.
 * Do not recreate wordmarks in HTML/CSS. Do not tint/blur/shadow logo images.
 *
 * Render PNGs at natural aspect ratio (object-fit: contain).
 * Never crop/truncate descriptor text. Switch to compact below 480px.
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
 */
export const brandDisplay = {
  /** Desktop/tablet full header artwork — ~400–440px */
  marketing: { maxWidth: 420, maxHeight: 128, asset: "header" as const },
  footer: { maxWidth: 380, maxHeight: 116, asset: "horizontal" as const },
  portal: { maxWidth: 340, maxHeight: 104, asset: "horizontal" as const },
  login: { maxWidth: 260, maxHeight: 80, asset: "compact" as const },
  apply: { maxWidth: 260, maxHeight: 80, asset: "compact" as const },
  /** Mobile compact artwork (<480px) */
  mobile: { maxWidth: 220, maxHeight: 68, asset: "compact" as const },
  mark: { maxWidth: 40, maxHeight: 38, asset: "mark" as const },
} as const;

/** @deprecated Use brandDisplay.portal / brandDisplay.mobile */
export const portalBrandDisplay = {
  sidebar: brandDisplay.portal,
  mobile: brandDisplay.mobile,
} as const;

export type BrandAssetKey = keyof typeof brandAssets;
