/** Approved Executive Teal logo — single source of truth for all brand image paths. */
export const brandAssets = {
  full: "/brand/ca-logo-horizontal.png?v=lockup-10",
  horizontal: "/brand/ca-logo-horizontal.png?v=lockup-10",
  header: "/brand/ca-logo-header.png?v=lockup-10",
  compact: "/brand/ca-logo-compact.png?v=lockup-10",
  mark: "/brand/ca-logo-mark.png?v=lockup-10",
} as const;

export const brandDimensions = {
  header: { width: 2232, height: 528 },
  horizontal: { width: 2432, height: 643 },
  compact: { width: 1832, height: 383 },
  mark: { width: 420, height: 395 },
  full: { width: 2432, height: 643 },
} as const;

export type BrandAssetKey = keyof typeof brandAssets;
