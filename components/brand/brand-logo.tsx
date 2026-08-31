import Link from "next/link";
import { cn } from "@/lib/utils";

import BrandMark from "@/components/brand/brand-mark";

interface BrandLogoProps {
  href?: string;
  className?: string;
  markClassName?: string;
  showWordmark?: boolean;
  tone?: "light" | "dark";
  onNavigate?: () => void;
}

export default function BrandLogo({
  href = "/",
  className,
  markClassName,
  showWordmark = true,
  tone = "dark",
  onNavigate,
}: BrandLogoProps) {
  const isLight = tone === "light";

  const content = (
    <span className={cn("inline-flex items-center gap-3 sm:gap-3.5 select-none group", className)}>
      <span
        className={cn(
          "relative flex h-11 w-14 sm:h-12 sm:w-16 shrink-0 items-center justify-center transition-transform duration-200 group-hover:scale-105",
          markClassName
        )}
      >
        <BrandMark tone={isLight ? "light" : "dark"} className="drop-shadow-sm" />
      </span>

      {showWordmark && (
        <span className="flex flex-col justify-center leading-none">
          <span className="flex items-center gap-1.5">
            <span
              className={cn(
                "font-serif text-[1.2rem] sm:text-[1.35rem] font-bold tracking-[-0.02em] transition-colors",
                isLight ? "text-white" : "text-[#0B4A47]"
              )}
            >
              Consult
            </span>
            <span className="font-serif text-[1.2rem] sm:text-[1.35rem] font-bold tracking-[-0.02em] text-[#B83A3A] transition-colors">
              America
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-[#B83A3A] shrink-0" />
          </span>
          <span
            className={cn(
              "hidden sm:block mt-1 text-[10px] font-semibold tracking-[0.12em] whitespace-nowrap uppercase",
              isLight ? "text-white/75" : "text-[#176A63]"
            )}
          >
            Strategy · Technology · Results
          </span>
        </span>
      )}
      <span className="sr-only">Consult America - Strategy, Technology, Results</span>
    </span>
  );

  if (!href) return content;

  return (
    <Link
      href={href}
      aria-label="Consult America homepage"
      className="inline-flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B83A3A] rounded-md"
      onClick={onNavigate}
    >
      {content}
    </Link>
  );
}
