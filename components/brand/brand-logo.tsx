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
  const logoSrc = "/brand/logo-transparent.png";

  const content = (
    <span className={cn("inline-flex items-center", className)}>
      <span className="relative flex items-center justify-center transition-all duration-200">
        <Image
          src={logoSrc}
          alt="Consult America Logo"
          width={220}
          height={134}
          priority={priority}
          className={cn(
            "h-10 sm:h-11 w-auto object-contain transition-transform duration-200 hover:scale-[1.02]",
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
