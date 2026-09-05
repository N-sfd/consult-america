/**
 * Legacy entry — prefer BrandLogo (public/auth) or PortalBrand (portals).
 */
export {
  default,
  ConsultAmericaLogo,
  type BrandLogoProps as ConsultAmericaLogoProps,
  type ConsultAmericaLogoVariant,
  type ConsultAmericaLogoSize,
} from "@/components/brand/brand-logo";

export type LogoLockup = "header" | "footer" | "compact" | "mark" | "full" | "horizontal";
export { brandAssets, brandDimensions, type BrandAssetKey } from "@/lib/brandAssets";
