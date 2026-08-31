import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";

interface BrandLogoProps {
  href?: string;
  className?: string;
  markClassName?: string;
  showWordmark?: boolean;
  tone?: "light" | "dark";
  priority?: boolean;
  onNavigate?: () => void;
}

export default function BrandLogo({
  href = "/",
  className,
  markClassName,
  showWordmark = true,
  tone = "light",
  priority = false,
  onNavigate,
}: BrandLogoProps) {
  // tone="dark" is for LIGHT backgrounds (scrolled light header, login, portal) -> uses dark navy logo
  // tone="light" is for DARK backgrounds (dark hero, dark footer, dark drawers) -> uses crisp light/white logo
  const logoSrc =
    tone === "dark"
      ? "/brand/consult-america-dark.png"
      : "/brand/consult-america-light.png";

  const content = (
    <span className={cn("inline-flex items-center select-none", className)}>
      <span className="relative flex items-center justify-center">
        <Image
          src={logoSrc}
          alt="Consult America"
          width={960}
          height={160}
          priority={priority}
          className={cn(
            "h-9 sm:h-10 lg:h-11 w-auto max-w-[190px] sm:max-w-[220px] lg:max-w-[245px] object-contain opacity-100",
            markClassName
          )}
        />
      </span>
      <span className="sr-only">Consult America</span>
    </span>
  );

  if (!href) return content;

  return (
    <Link
      href={href}
      aria-label="Consult America homepage"
      className="inline-flex items-center opacity-100 transition-none"
      onClick={onNavigate}
    >
      {content}
    </Link>
  );
}
