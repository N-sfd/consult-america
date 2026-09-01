/** Approved Executive Teal logo — single source of truth for all brand image paths. */
export const brandAssets = {
  master: "/brand/ca-logo-master.png",
  full: "/brand/ca-logo-full.png",
  horizontal: "/brand/ca-logo-horizontal.png",
  compact: "/brand/ca-logo-compact.png",
  mark: "/brand/ca-logo-mark.png",
} as const;

export const brandDimensions = {
  horizontal: { width: 1600, height: 380 },
  compact: { width: 1000, height: 238 },
  mark: { width: 400, height: 325 },
  full: { width: 800, height: 465 },
} as const;

export type BrandAssetKey = keyof typeof brandAssets;
