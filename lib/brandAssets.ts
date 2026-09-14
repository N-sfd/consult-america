/**
 * Approved Consult America logo assets — single source of truth.
 * Do not recreate mark artwork. Wordmark/tagline may be live type for balance.
 *
 * Never crop the mark. Vertically center title+tagline with the mark.
 * Prefer compact (title-only) under 480px instead of ellipsis.
 */
export const brandAssets = {
  horizontal: "/brand/ca-logo-horizontal.png?v=balance-3",
  header: "/brand/ca-logo-header.png?v=balance-3",
  /** User-approved framed lockup (JPEG) — fallback / OG only; UI uses CrispLockup */
  balanced: "/brand/ca-logo-balanced.jpg?v=balance-3",
  compact: "/brand/ca-logo-compact.png?v=balance-3",
  mark: "/brand/ca-logo-mark.png?v=balance-3",
} as const;

export const brandDimensions = {
  header: { width: 1400, height: 423 },
  horizontal: { width: 1042, height: 315 },
  balanced: { width: 1024, height: 341 },
  compact: { width: 1100, height: 333 },
  mark: { width: 512, height: 512 },
} as const;

/**
 * Canonical display sizes — pages must not invent one-off widths.
 */
export const brandDisplay = {
  /** Desktop header lockup — room for full tagline beside mark */
  marketing: { maxWidth: 440, maxHeight: 72, asset: "balanced" as const },
  footer: { maxWidth: 400, maxHeight: 68, asset: "balanced" as const },
  portal: { maxWidth: 340, maxHeight: 56, asset: "balanced" as const },
  /** Auth header — full title + tagline, vertically centered with mark */
  login: { maxWidth: 400, maxHeight: 68, asset: "balanced" as const },
  apply: { maxWidth: 280, maxHeight: 52, asset: "compact" as const },
  /** Phone header — mark + title only, vertically centered */
  mobile: { maxWidth: 260, maxHeight: 52, asset: "compact" as const },
  mark: { maxWidth: 40, maxHeight: 40, asset: "mark" as const },
} as const;

/** @deprecated Use brandDisplay.portal / brandDisplay.mobile */
export const portalBrandDisplay = {
  sidebar: brandDisplay.portal,
  mobile: brandDisplay.mobile,
} as const;

export type BrandAssetKey = keyof typeof brandAssets;
