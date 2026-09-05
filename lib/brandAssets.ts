/**
 * Approved Consult America logo assets — single source of truth.
 * Do not recreate wordmarks in HTML/CSS. Do not tint/blur/shadow logo images.
 */
export const brandAssets = {
  horizontal: "/brand/ca-logo-horizontal.png?v=lockup-12",
  header: "/brand/ca-logo-header.png?v=lockup-12",
  compact: "/brand/ca-logo-compact.png?v=lockup-12",
  mark: "/brand/ca-logo-mark.png?v=lockup-12",
} as const;

export const brandDimensions = {
  header: { width: 2232, height: 528 },
  horizontal: { width: 2432, height: 643 },
  compact: { width: 1832, height: 383 },
  mark: { width: 420, height: 395 },
} as const;

/**
 * Portal sidebar brand sizing — do not shrink below these targets.
 * Full-color lockup must keep "Consult America" + "ENTERPRISE TRANSFORMATION" readable.
 */
export const portalBrandDisplay = {
  /** Desktop / drawer sidebar — full-color horizontal lockup */
  sidebar: {
    maxWidth: 280,
    maxHeight: 70,
  },
  /** Mobile top bar only — approved compact asset, never scaled-down full lockup */
  mobile: {
    maxWidth: 180,
    maxHeight: 42,
  },
} as const;

export type BrandAssetKey = keyof typeof brandAssets;
