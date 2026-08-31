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
  const isDarkTone = tone === "dark"; // on light background (header)
  // If dark tone (light background header), we can use the original light-bg logo or the new logo with clean styling
  // If light tone (dark background footer / dark sections), we use the new dark-bg logo directly

  const logoSrc = isDarkTone ? "/brand/logo.jpg" : "/brand/logo-dark.png";

  const content = (
    <span className={cn("inline-flex items-center gap-3", className)}>
      <span
        className={cn(
          "relative flex items-center justify-center overflow-hidden transition-all duration-200",
          isDarkTone
            ? "h-11 w-auto"
            : "h-12 w-auto"
        )}
      >
        <Image
          src={logoSrc}
          alt="Consult America Logo"
          width={180}
          height={120}
          priority={priority}
          className={cn(
            "h-10 w-auto object-contain transition-transform duration-200 hover:scale-[1.02]",
            isDarkTone ? "mix-blend-multiply" : "brightness-105",
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
