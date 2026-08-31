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
  // tone="dark" is for LIGHT backgrounds (scrolled light header, login, portal) -> uses solid #102033 wordmark
  // tone="light" is for DARK backgrounds (dark hero, dark footer, dark drawers) -> uses crisp #FFFFFF wordmark
  const logoSrc =
    tone === "dark"
      ? "/brand/consult-america-dark.svg"
      : "/brand/consult-america-light.svg";

  const content = (
    <span className={cn("inline-flex items-center select-none", className)}>
      <span className="relative flex items-center justify-center">
        <Image
          src={logoSrc}
          alt="Consult America"
          width={460}
          height={88}
          priority={priority}
          unoptimized
          className={cn(
            "h-10 sm:h-[42px] lg:h-[46px] w-auto max-w-[165px] sm:max-w-[190px] lg:max-w-[215px] object-contain opacity-100",
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
