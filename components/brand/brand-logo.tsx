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
  // tone="dark" is for light backgrounds (like header) -> uses dark text edition
  // tone="light" is for dark backgrounds (like footer) -> uses light/silver text edition
  const logoSrc =
    tone === "dark" ? "/brand/logo-header.png" : "/brand/logo-footer.png";

  const content = (
    <span className={cn("inline-flex items-center", className)}>
      <span className="relative flex items-center justify-center transition-all duration-200">
        <Image
          src={logoSrc}
          alt="Consult America Logo"
          width={280}
          height={150}
          priority={priority}
          className={cn(
            "h-11 sm:h-12 lg:h-[50px] w-auto object-contain transition-transform duration-200 hover:scale-[1.02]",
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
