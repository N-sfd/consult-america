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
  tone = "dark",
  onNavigate,
}: BrandLogoProps) {
  const isLight = tone === "light"; // For dark backgrounds (footer, dark panels)

  const content = (
    <span className={cn("inline-flex items-center gap-3 select-none group", className)}>
      {/* Precision Geometric C+A Enterprise Monogram Mark */}
      <span
        className={cn(
          "relative flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-lg transition-transform duration-200 group-hover:scale-105",
          markClassName
        )}
      >
        <svg
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-full w-full drop-shadow-2xs"
        >
          {/* Base Geometric Container */}
          <rect
            width="40"
            height="40"
            rx="8"
            fill={isLight ? "#102033" : "#F7F9FA"}
            stroke={isLight ? "#1E3752" : "#DDE4E8"}
            strokeWidth="1.2"
          />

          {/* Geometric 'C' Architectural Arc */}
          <path
            d="M26 13.5H16C13.5147 13.5 11.5 15.5147 11.5 18V22C11.5 24.4853 13.5147 26.5 16 26.5H26"
            stroke={isLight ? "#FFFFFF" : "#102033"}
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Precision 'A' Directional Transformation Peak in Consult America Red */}
          <path
            d="M21 26.5L24.5 14L28 26.5"
            stroke="#B63A3A"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Crossbar Accent */}
          <path
            d="M22.5 22.5H26.5"
            stroke="#B63A3A"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
        </svg>
      </span>

      {/* Confident Enterprise Wordmark */}
      {showWordmark && (
        <span className="flex flex-col justify-center leading-none">
          <span className="flex items-center gap-1.5">
            <span
              className={cn(
                "font-serif text-[1.1rem] sm:text-[1.22rem] font-bold tracking-[-0.02em] transition-colors",
                isLight ? "text-white" : "text-[#102033]"
              )}
            >
              Consult
            </span>
            <span
              className={cn(
                "font-serif text-[1.1rem] sm:text-[1.22rem] font-bold tracking-[-0.02em] transition-colors",
                isLight ? "text-white" : "text-[#102033]"
              )}
            >
              America
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-[#B63A3A] shrink-0" />
          </span>
          <span
            className={cn(
              "mt-0.5 text-[0.58rem] sm:text-[0.62rem] font-bold tracking-[0.22em] uppercase font-mono",
              isLight ? "text-[#97A8B7]" : "text-[#526170]"
            )}
          >
            Enterprise &amp; AI
          </span>
        </span>
      )}
      <span className="sr-only">Consult America - Enterprise Transformation &amp; AI</span>
    </span>
  );

  if (!href) return content;

  return (
    <Link
      href={href}
      aria-label="Consult America homepage"
      className="inline-flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B63A3A] rounded-md"
      onClick={onNavigate}
    >
      {content}
    </Link>
  );
}
