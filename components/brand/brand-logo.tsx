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
  const isLight = tone === "light"; // For dark backgrounds (footer, dark panels)

  const content = (
    <span className={cn("inline-flex items-center gap-2.5 sm:gap-3 select-none group", className)}>
      {/* Official 3D CA Dimensional Emblem Mark */}
      <span
        className={cn(
          "relative flex h-10 w-12 sm:h-11 sm:w-14 shrink-0 items-center justify-center transition-transform duration-200 group-hover:scale-105",
          markClassName
        )}
      >
        <Image
          src="/brand/ca-logo-mark.png"
          alt="Consult America CA Emblem"
          width={120}
          height={80}
          priority={priority}
          className="h-full w-auto object-contain drop-shadow-sm"
        />
      </span>

          {/* Confident Enterprise Wordmark & Subtitle */}
          {showWordmark && (
            <span className="flex flex-col justify-center leading-none">
              <span className="flex items-center gap-1.5">
                <span
                  className={cn(
                    "font-serif text-[1.12rem] sm:text-[1.22rem] font-bold tracking-[-0.02em] transition-colors",
                    isLight ? "text-white" : "text-[#163536]"
                  )}
                >
                  Consult
                </span>
                <span
                  className={cn(
                    "font-serif text-[1.12rem] sm:text-[1.22rem] font-bold tracking-[-0.02em] text-[#B63A3A] transition-colors"
                  )}
                >
                  America
                </span>
                <span className="h-1.5 w-1.5 rounded-full bg-[#B63A3A] shrink-0" />
              </span>
              <span
                className={cn(
                  "hidden sm:block mt-0.5 text-[9.5px] font-medium tracking-[0.06em] whitespace-nowrap",
                  isLight ? "text-white/70" : "text-[#687773]"
                )}
              >
                Transform. Modernize. Build.
              </span>
            </span>
          )}
          <span className="sr-only">Consult America - Transform. Modernize. Build.</span>
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
