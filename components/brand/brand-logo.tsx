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
  tone = "dark",
  priority = false,
  onNavigate,
}: BrandLogoProps) {
  // tone="light" is for DARK backgrounds (dark hero, dark drawers) -> uses crisp white #FFFDF8 and gold #D8C5AA
  // tone="dark" is for LIGHT backgrounds (light header, light footer, login, portal) -> uses deep charcoal #261F1B and warm slate #695F57
  const isDarkTone = tone === "dark";

  const content = (
    <span className={cn("inline-flex items-center select-none gap-2.5 sm:gap-3.5", className)}>
      {/* 1. CA Ribbon Monogram Mark */}
      <span className="relative flex items-center justify-center shrink-0">
        <Image
          src="/brand/ca-mark.png"
          alt="Consult America Mark"
          width={255}
          height={167}
          priority={priority}
          unoptimized
          className={cn("h-9 sm:h-10 lg:h-11 w-auto object-contain drop-shadow-[0_1px_2px_rgba(0,0,0,0.08)]", markClassName)}
        />
      </span>

      {showWordmark && (
        <>
          {/* 2. Vertical Divider Rule */}
          <span className="h-7 sm:h-8 lg:h-9 w-[1.5px] bg-[#B63A3A] shrink-0 opacity-90" />

          {/* 3. Typography Lockup (100% Solid Vector Typography) */}
          <span className="flex flex-col justify-center text-left leading-none">
            <span className="flex items-baseline gap-1.5 text-[1.12rem] sm:text-[1.25rem] lg:text-[1.38rem] font-black tracking-[-0.02em]">
              <span className={isDarkTone ? "text-[#261F1B]" : "text-[#FFFDF8]"}>
                CONSULT
              </span>
              <span className={isDarkTone ? "text-[#261F1B] font-semibold" : "text-[#FFFDF8] font-semibold"}>
                AMERICA
              </span>
            </span>
            <span
              className={cn(
                "text-[0.48rem] sm:text-[0.52rem] lg:text-[0.56rem] font-bold uppercase tracking-[0.08em] mt-1 hidden sm:flex items-center gap-1 whitespace-nowrap",
                isDarkTone ? "text-[#695F57]" : "text-[#D8C5AA]"
              )}
            >
              <span>ENTERPRISE TRANSFORMATION</span>
              <span className="text-[#B63A3A] text-[0.65rem]">•</span>
              <span>ORACLE</span>
              <span className="text-[#B63A3A] text-[0.65rem]">•</span>
              <span>AI</span>
              <span className="text-[#B63A3A] text-[0.65rem]">•</span>
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
