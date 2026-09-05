"use client";

import Link from "next/link";

import { brandAssets, brandDimensions, portalBrandDisplay } from "@/lib/brandAssets";
import { cn } from "@/lib/utils";

export type PortalBrandSurface = "light" | "dark";

type PortalBrandProps = {
  /** light = Employee/Candidate white sidebar; dark = Manager/HR/Payroll/Workforce/CRM */
  surface: PortalBrandSurface;
  href?: string;
  /** mobile topbar uses approved compact asset — never a shrunk full lockup */
  mode?: "sidebar" | "mobile";
  className?: string;
  onNavigate?: () => void;
};

/**
 * Single portal brand treatment.
 * - light sidebar → full-color logo on white
 * - dark sidebar → WHITE brand block + full-color logo (never on green)
 * - mobile header → compact approved asset
 *
 * Portals must not set their own logo widths.
 */
export default function PortalBrand({
  surface,
  href = "/",
  mode = "sidebar",
  className,
  onNavigate,
}: PortalBrandProps) {
  const isMobile = mode === "mobile";
  const asset = isMobile ? "compact" : "horizontal";
  const display = isMobile ? portalBrandDisplay.mobile : portalBrandDisplay.sidebar;
  const dim = brandDimensions[asset];

  const image = (
    <img
      src={brandAssets[asset]}
      alt="Consult America"
      width={dim.width}
      height={dim.height}
      decoding="async"
      loading="eager"
      fetchPriority="high"
      className="ca-portal-brand-logo"
      style={{
        maxWidth: `min(100%, ${display.maxWidth}px)`,
        maxHeight: display.maxHeight,
      }}
    />
  );

  const lockup = href ? (
    <Link
      href={href}
      aria-label="Consult America homepage"
      className="ca-portal-brand-link"
      onClick={onNavigate}
    >
      {image}
    </Link>
  ) : (
    image
  );

  if (isMobile) {
    return <div className={cn("ca-portal-brand ca-portal-brand--mobile", className)}>{lockup}</div>;
  }

  return (
    <div
      className={cn(
        "ca-portal-brand",
        surface === "dark" ? "ca-portal-brand--block" : "ca-portal-brand--light",
        className,
      )}
    >
      {lockup}
    </div>
  );
}
