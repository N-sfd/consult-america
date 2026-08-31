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
  const content = (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <span className="relative flex h-9 w-9 shrink-0 overflow-hidden rounded-sm bg-white sm:h-10 sm:w-10">
        <Image
          src="/brand/logo.jpg"
          alt=""
          width={40}
          height={40}
          priority={priority}
          className={cn("h-full w-full object-contain", markClassName)}
        />
      </span>
      {showWordmark ? (
        <span
          className={cn(
            "text-[0.9rem] font-semibold tracking-[0.1em] sm:text-[1.05rem]",
            tone === "light" ? "text-[#F7F0E7]" : "text-[#261F1B]",
          )}
        >
          CONSULTAMERICA
        </span>
      ) : null}
      <span className="sr-only">ConsultAmerica</span>
    </span>
  );

  if (!href) return content;

  return (
    <Link
      href={href}
      aria-label="ConsultAmerica homepage"
      className="inline-flex"
      onClick={onNavigate}
    >
      {content}
    </Link>
  );
}
