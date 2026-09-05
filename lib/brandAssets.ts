/**
 * Approved Consult America logo assets — single source of truth.
 * Do not recreate wordmarks in HTML/CSS. Do not tint/blur/shadow logo images.
 *
 * Rule: never shrink the full lockup until ENTERPRISE TRANSFORMATION and
 * ORACLE • AI & DATA • APPLICATION ENGINEERING become unreadable.
 * Fix container width first; switch to compact/mark lockups when needed.
 */
export const brandAssets = {
  horizontal: "/brand/ca-logo-horizontal.png?v=lockup-13",
  header: "/brand/ca-logo-header.png?v=lockup-13",
  compact: "/brand/ca-logo-compact.png?v=lockup-13",
  mark: "/brand/ca-logo-mark.png?v=lockup-13",
} as const;

export const brandDimensions = {
  header: { width: 2232, height: 528 },
  horizontal: { width: 2432, height: 643 },
  compact: { width: 1832, height: 383 },
  mark: { width: 420, height: 395 },
} as const;

/**
 * Canonical display sizes — pages must not invent one-off widths.
 * Full lockup target: 300–340px wide, max-height 70–72px.
 */
export const brandDisplay = {
  /** Public header / Jobs / Careers — full lockup */
  marketing: { maxWidth: 320, maxHeight: 72, asset: "horizontal" as const },
  /** Footer — larger than header, not oversized */
  footer: { maxWidth: 340, maxHeight: 90, asset: "horizontal" as const },
  /** Portal sidebars (Employee, Candidate, Manager, HR, Payroll, Workforce, CRM) */
  portal: { maxWidth: 320, maxHeight: 72, asset: "horizontal" as const },
  /** Login / signup header */
  login: { maxWidth: 220, maxHeight: 48, asset: "compact" as const },
  /** Job application simplified header */
  apply: { maxWidth: 220, maxHeight: 48, asset: "compact" as const },
  /** Mobile / tablet compact lockup — readable, not tiny */
  mobile: { maxWidth: 200, maxHeight: 46, asset: "compact" as const },
  mark: { maxWidth: 40, maxHeight: 38, asset: "mark" as const },
} as const;

/** @deprecated Use brandDisplay.portal / brandDisplay.mobile */
export const portalBrandDisplay = {
  sidebar: brandDisplay.portal,
  mobile: brandDisplay.mobile,
} as const;

export type BrandAssetKey = keyof typeof brandAssets;
