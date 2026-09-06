"use client";

import Link from "next/link";

import BrandLogo from "@/components/brand/brand-logo";
import { cn } from "@/lib/utils";

export type PortalBrandSurface = "light" | "dark";

type PortalBrandProps = {
  /** light = Employee/Candidate; dark = Manager/HR/Payroll/Workforce/CRM */
  surface: PortalBrandSurface;
  href?: string;
  /** mobile topbar — title-only compact lockup */
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
  const lockup = (
    <BrandLogo
      href={null}
      context={isMobile ? "mobile" : "marketing"}
      variant={isMobile ? "compact" : "full"}
      priority
      className="ca-portal-brand-logo"
    />
  );

  const linked = href ? (
    <Link
      href={href}
      aria-label="Consult America homepage"
      className="ca-portal-brand-link"
      onClick={onNavigate}
    >
      {lockup}
    </Link>
  ) : (
    lockup
  );

  if (isMobile) {
    return (
      <div className={cn("ca-portal-brand ca-portal-brand--mobile", className)}>
        {linked}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "ca-portal-brand",
        surface === "dark" ? "ca-portal-brand--block" : "ca-portal-brand--light",
        className,
      )}
    >
      {linked}
    </div>
  );
}
