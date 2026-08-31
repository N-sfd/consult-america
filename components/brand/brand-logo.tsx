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
  const isDarkTone = tone === "dark"; // on light background

  const content = (
    <span className={cn("inline-flex items-center gap-3", className)}>
      <span
        className={cn(
          "relative flex items-center justify-center overflow-hidden rounded-md transition-all duration-200",
          isDarkTone
            ? "h-11 w-auto"
            : "h-11 w-auto rounded-md bg-[#FFFDF8] p-1 shadow-xs ring-1 ring-white/15"
        )}
      >
        <Image
          src="/brand/logo.jpg"
          alt="Consult America Logo"
          width={180}
          height={120}
          priority={priority}
          className={cn(
            "h-10 w-auto object-contain transition-transform duration-200 hover:scale-[1.02]",
            isDarkTone ? "mix-blend-multiply" : "",
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
