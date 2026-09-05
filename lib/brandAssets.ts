/**
 * Approved Consult America logo assets — single source of truth.
 * Do not recreate wordmarks in HTML/CSS. Do not tint/blur/shadow logo images.
 *
 * Rule: never shrink the full lockup until ENTERPRISE TRANSFORMATION and
 * ORACLE • AI & DATA • APPLICATION ENGINEERING become unreadable.
 * Fix container width first; switch to compact/mark lockups when needed.
 */
export const brandAssets = {
  horizontal: "/brand/ca-logo-horizontal.png?v=innovative-4",
  header: "/brand/ca-logo-header.png?v=innovative-4",
  compact: "/brand/ca-logo-compact.png?v=innovative-4",
  mark: "/brand/ca-logo-mark.png?v=innovative-4",
} as const;

export const brandDimensions = {
  header: { width: 1200, height: 192 },
  horizontal: { width: 1360, height: 217 },
  compact: { width: 1100, height: 176 },
  mark: { width: 256, height: 256 },
} as const;

/**
 * Canonical display sizes — pages must not invent one-off widths.
 * Full lockup target: ~320–360px wide, max-height 70–72px.
 * Narrow headers switch to compact via CSS (not by crushing artwork).
 */
export const brandDisplay = {
  /** Public header / Jobs / Careers — full lockup */
  marketing: { maxWidth: 340, maxHeight: 64, asset: "horizontal" as const },
  /** Footer — larger than header, not oversized */
  footer: { maxWidth: 360, maxHeight: 72, asset: "horizontal" as const },
  /** Portal sidebars (Employee, Candidate, Manager, HR, Payroll, Workforce, CRM) */
  portal: { maxWidth: 320, maxHeight: 56, asset: "horizontal" as const },
  /** Login / signup header */
  login: { maxWidth: 240, maxHeight: 44, asset: "compact" as const },
  /** Job application simplified header */
  apply: { maxWidth: 240, maxHeight: 44, asset: "compact" as const },
  /** Mobile / tablet compact lockup — fits beside hamburger */
  mobile: { maxWidth: 260, maxHeight: 48, asset: "compact" as const },
  mark: { maxWidth: 40, maxHeight: 38, asset: "mark" as const },
} as const;

/** @deprecated Use brandDisplay.portal / brandDisplay.mobile */
export const portalBrandDisplay = {
  sidebar: brandDisplay.portal,
  mobile: brandDisplay.mobile,
} as const;

export type BrandAssetKey = keyof typeof brandAssets;
