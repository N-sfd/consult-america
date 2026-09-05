"use client";

import Link from "next/link";

import { brandAssets, brandDimensions, brandDisplay } from "@/lib/brandAssets";
import { cn } from "@/lib/utils";

export type PortalBrandSurface = "light" | "dark";

type PortalBrandProps = {
  /** light = Employee/Candidate; dark = Manager/HR/Payroll/Workforce/CRM */
  surface: PortalBrandSurface;
  href?: string;
  /** mobile topbar — approved compact asset only */
  mode?: "sidebar" | "mobile";
  className?: string;
  onNavigate?: () => void;
};

/**
 * Shared portal brand for Employee, Candidate, Manager, HR, Payroll, Workforce, CRM.
 * Dark sidebars always get a white brand block — never full-color on green.
 */
export default function PortalBrand({
  surface,
  href = "/",
  mode = "sidebar",
  className,
  onNavigate,
}: PortalBrandProps) {
  const isMobile = mode === "mobile";
  const preset = isMobile ? brandDisplay.mobile : brandDisplay.portal;
  const asset = preset.asset;
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
        maxWidth: `min(100%, ${preset.maxWidth}px)`,
        maxHeight: preset.maxHeight,
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
