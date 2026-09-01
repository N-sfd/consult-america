import Link from "next/link";
import { cn } from "@/lib/utils";

import BrandMark from "@/components/brand/brand-mark";

interface BrandLogoProps {
  href?: string;
  className?: string;
  markClassName?: string;
  showWordmark?: boolean;
  showTagline?: boolean;
  tone?: "light" | "dark";
  onNavigate?: () => void;
}

export default function BrandLogo({
  href = "/",
  className,
  markClassName,
  showWordmark = true,
  showTagline = true,
  tone = "dark",
  onNavigate,
}: BrandLogoProps) {
  const isLight = tone === "light";

  const content = (
    <span className={cn("inline-flex items-center gap-3 select-none group", className)}>
      <span
        className={cn(
          "relative flex h-10 w-[3.25rem] sm:h-11 sm:w-[3.6rem] shrink-0 items-center justify-center transition-transform duration-200 group-hover:scale-[1.02]",
          markClassName
        )}
      >
        <BrandMark tone={isLight ? "light" : "dark"} />
      </span>

      {showWordmark && (
        <span className="flex flex-col justify-center leading-none min-w-0">
          <span className="flex items-baseline gap-0">
            <span
              className={cn(
                "font-serif text-[1.125rem] sm:text-[1.25rem] font-semibold tracking-[-0.025em]",
                isLight ? "text-white" : "text-[#073B3A]"
              )}
            >
              Consult
            </span>
            <span className="font-serif text-[1.125rem] sm:text-[1.25rem] font-semibold tracking-[-0.025em] text-[#B83A3A]">
              America
            </span>
          </span>

          {showTagline && (
            <span
              className={cn(
                "hidden sm:flex items-center gap-2 mt-1.5 text-[9px] font-medium tracking-[0.14em] uppercase whitespace-nowrap",
                isLight ? "text-white/72" : "text-[#176A63]"
              )}
            >
              <span
                className={cn("h-px w-3", isLight ? "bg-white/35" : "bg-[#9BC4B8]")}
                aria-hidden="true"
              />
              <span>Strategy · Technology · Results</span>
              <span
                className={cn("h-px w-3", isLight ? "bg-white/35" : "bg-[#9BC4B8]")}
                aria-hidden="true"
              />
            </span>
          )}
        </span>
      )}
      <span className="sr-only">Consult America — Strategy, Technology, Results</span>
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
