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
  // tone="dark" is for light backgrounds (like scrolled header) -> uses dark charcoal text edition
  // tone="light" is for dark backgrounds (like dark hero, footer) -> uses luminous white text edition
  const logoSrc =
    tone === "dark"
      ? "/brand/consult-america-logo-dark.png"
      : "/brand/consult-america-header-light.png";

  const content = (
    <span className={cn("inline-flex items-center", className)}>
      <span className="relative flex items-center justify-center transition-all duration-200">
        <Image
          src={logoSrc}
          alt="Consult America"
          width={280}
          height={150}
          priority={priority}
          className={cn(
            "h-10 sm:h-[42px] lg:h-[44px] w-auto max-w-[170px] sm:max-w-[195px] lg:max-w-[215px] object-contain transition-transform duration-200 hover:scale-[1.01]",
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
      className="inline-flex items-center"
      onClick={onNavigate}
    >
      {content}
    </Link>
  );
}
