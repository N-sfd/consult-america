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
  // tone="dark" is for LIGHT backgrounds (scrolled light header, login, portal) -> uses solid dark navy #102033
  // tone="light" is for DARK backgrounds (dark hero, dark footer, dark drawers) -> uses crisp white #FFFDF8
  const isDarkTone = tone === "dark";

  const content = (
    <span className={cn("inline-flex items-center select-none gap-2.5 sm:gap-3", className)}>
      {/* 1. CA Ribbon Monogram Mark */}
      <span className="relative flex items-center justify-center shrink-0">
        <Image
          src="/brand/ca-mark.png"
          alt="Consult America Mark"
          width={255}
          height={167}
          priority={priority}
          unoptimized
          className={cn("h-8 sm:h-9 lg:h-10 w-auto object-contain", markClassName)}
        />
      </span>

      {showWordmark && (
        <>
          {/* 2. Vertical Divider Rule */}
          <span className="h-6 sm:h-7 lg:h-8 w-[1.5px] bg-[#B63A3A] shrink-0 opacity-90" />

          {/* 3. Typography Lockup (100% Solid Vector Typography) */}
          <span className="flex flex-col justify-center text-left leading-none">
            <span className="flex items-baseline gap-1 text-[1.05rem] sm:text-[1.18rem] lg:text-[1.28rem] font-extrabold tracking-[-0.02em]">
              <span className={isDarkTone ? "text-[#102033]" : "text-[#FFFDF8]"}>
                CONSULT
              </span>
              <span className={isDarkTone ? "text-[#102033] font-medium" : "text-[#FFFDF8] font-medium"}>
                AMERICA
              </span>
            </span>
            <span
              className={cn(
                "text-[0.46rem] sm:text-[0.50rem] lg:text-[0.54rem] font-bold uppercase tracking-[0.06em] mt-1 hidden sm:flex items-center gap-1 whitespace-nowrap",
                isDarkTone ? "text-[#695F57]" : "text-[#D8C5AA]"
              )}
            >
              <span>ENTERPRISE TRANSFORMATION</span>
              <span className="text-[#B63A3A] text-[0.6rem]">•</span>
              <span>ORACLE</span>
              <span className="text-[#B63A3A] text-[0.6rem]">•</span>
              <span>AI</span>
              <span className="text-[#B63A3A] text-[0.6rem]">•</span>
              <span>ENGINEERING</span>
            </span>
          </span>
        </>
      )}
      <span className="sr-only">Consult America</span>
    </span>
  );

  if (!href) return content;

  return (
    <Link
      href={href}
      aria-label="Consult America homepage"
      className="inline-flex items-center opacity-100 transition-none group"
      onClick={onNavigate}
    >
      {content}
    </Link>
  );
}
