/** Approved Executive Teal logo — single source of truth for all brand image paths. */
export const brandAssets = {
  master: "/brand/ca-logo-master.png",
  full: "/brand/ca-logo-full.png",
  horizontal: "/brand/ca-logo-horizontal.png",
  compact: "/brand/ca-logo-compact.png",
  mark: "/brand/ca-logo-mark.png",
} as const;

export const brandDimensions = {
  horizontal: { width: 1617, height: 442 },
  compact: { width: 1011, height: 276 },
  mark: { width: 699, height: 582 },
  full: { width: 900, height: 588 },
} as const;

export type BrandAssetKey = keyof typeof brandAssets;
