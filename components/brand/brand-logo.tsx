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
  // tone="light" is for DARK backgrounds (charcoal footer #211E1B, dark drawers) -> uses crisp white #FFFDF8 and sand/gold #D8C5AA
  // tone="dark" is for LIGHT backgrounds (light header, login, portal) -> uses deep charcoal #261F1B and warm slate #695F57
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
          className={cn("h-8 sm:h-9 lg:h-10 w-auto object-contain shrink-0", markClassName)}
        />
      </span>

      {showWordmark && (
        <>
          {/* 2. Vertical Divider Rule */}
          <span className="h-6 sm:h-7 lg:h-8 w-[1.5px] bg-[#B63A3A] shrink-0 opacity-90" />

          {/* 3. Typography Lockup (100% Solid Vector Typography) */}
          <span className="flex flex-col justify-center text-left leading-none shrink-0">
            <span className="flex items-baseline gap-1 text-[1.05rem] sm:text-[1.18rem] lg:text-[1.28rem] font-extrabold tracking-[-0.02em] whitespace-nowrap">
              <span className={isDarkTone ? "text-[#261F1B]" : "text-[#FFFDF8]"}>
                CONSULT
              </span>
              <span className={isDarkTone ? "text-[#261F1B] font-medium" : "text-[#FFFDF8] font-medium"}>
                AMERICA
              </span>
            </span>
            <span
              className={cn(
                "text-[0.40rem] sm:text-[0.44rem] lg:text-[0.48rem] font-bold uppercase tracking-[0.06em] mt-1 flex items-center gap-1 whitespace-nowrap flex-nowrap shrink-0",
                isDarkTone ? "text-[#695F57]" : "text-[#D8C5AA]"
              )}
            >
              <span className="shrink-0">ENTERPRISE TRANSFORMATION</span>
              <span className="text-[#B63A3A] text-[0.55rem] shrink-0">•</span>
              <span className="shrink-0">ORACLE</span>
              <span className="text-[#B63A3A] text-[0.55rem] shrink-0">•</span>
              <span className="shrink-0">AI</span>
              <span className="text-[#B63A3A] text-[0.55rem] shrink-0">•</span>
              <span className="shrink-0">ENGINEERING</span>
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
      onClick={onNavigate}
      className="inline-flex items-center transition-opacity hover:opacity-95 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B63A3A] rounded-sm"
    >
      {content}
    </Link>
  );
}
