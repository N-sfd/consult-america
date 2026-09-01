import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

const EXECUTIVE_TEAL_MARK = "/brand/executive-teal-mark.png";

export type ConsultAmericaLogoVariant = "light" | "dark" | "compact" | "mark";
export type ConsultAmericaLogoSize = "header" | "footer" | "compact" | "mark";

export interface ConsultAmericaLogoProps {
  href?: string;
  className?: string;
  markClassName?: string;
  variant?: ConsultAmericaLogoVariant;
  size?: ConsultAmericaLogoSize;
  showWordmark?: boolean;
  showTagline?: boolean;
  onNavigate?: () => void;
}

const sizeConfig = {
  header: {
    mark: "h-[62px] w-[70px]",
    wordmark: "text-[1.625rem] sm:text-[1.8125rem]",
    tagline: "text-[10.5px] xl:text-[11px]",
    gap: "gap-[15px]",
    maxWidth: "max-w-[390px]",
  },
  footer: {
    mark: "h-[64px] w-[72px] sm:h-[68px] sm:w-[76px]",
    wordmark: "text-[1.75rem] sm:text-[1.9375rem]",
    tagline: "text-[10.5px] sm:text-[11px]",
    gap: "gap-4",
    maxWidth: "max-w-[410px]",
  },
  compact: {
    mark: "h-[52px] w-[58px]",
    wordmark: "text-[1.375rem]",
    tagline: "text-[10px]",
    gap: "gap-3",
    maxWidth: "max-w-[320px]",
  },
  mark: {
    mark: "h-[44px] w-[50px]",
    wordmark: "",
    tagline: "",
    gap: "",
    maxWidth: "",
  },
} as const;

function Tagline({
  variant,
  className,
}: {
  variant: "light" | "dark";
  className?: string;
}) {
  const isDark = variant === "dark";

  return (
    <span
      className={cn(
        "items-center gap-2 mt-1.5 font-sans font-semibold uppercase whitespace-nowrap leading-[1.2]",
        className
      )}
    >
      <span
        className={cn("h-px w-4 shrink-0", isDark ? "bg-[#9BC4B8]/55" : "bg-[#9BC4B8]")}
        aria-hidden="true"
      />
      <span className={cn("tracking-[0.13em]", isDark ? "text-[#C9DDD7]" : "text-[#176A63]")}>
        STRATEGY
        <span className="text-[#C52F32] mx-1">•</span>
        TECHNOLOGY
        <span className="text-[#C52F32] mx-1">•</span>
        RESULTS
      </span>
      <span
        className={cn("h-px w-4 shrink-0", isDark ? "bg-[#9BC4B8]/55" : "bg-[#9BC4B8]")}
        aria-hidden="true"
      />
    </span>
  );
}

export default function ConsultAmericaLogo({
  href = "/",
  className,
  markClassName,
  variant = "light",
  size = "header",
  showWordmark = true,
  showTagline,
  onNavigate,
}: ConsultAmericaLogoProps) {
  const isMarkOnly = variant === "mark" || size === "mark";
  const isCompact = variant === "compact" || size === "compact";
  const isDarkBg = variant === "dark";

  const resolvedSize = isMarkOnly ? "mark" : isCompact ? "compact" : size;
  const config = sizeConfig[resolvedSize];

  const resolvedShowTagline =
    showTagline ?? (isMarkOnly || isCompact ? false : true);

  const taglineVisibility =
    resolvedShowTagline && !isMarkOnly
      ? size === "footer"
        ? "flex"
        : "hidden xl:flex"
      : "hidden";

  const content = (
    <span
      className={cn(
        "inline-flex items-center select-none group",
        config.gap,
        config.maxWidth,
        className
      )}
    >
      <span
        className={cn(
          "relative shrink-0 flex items-center justify-center transition-transform duration-200 group-hover:scale-[1.015]",
          config.mark,
          markClassName
        )}
      >
        <Image
          src={EXECUTIVE_TEAL_MARK}
          alt=""
          width={152}
          height={120}
          priority
          className="h-full w-full object-contain object-center"
          sizes="(max-width: 768px) 58px, 76px"
        />
      </span>

      {showWordmark && !isMarkOnly && (
        <span className="flex flex-col justify-center leading-none min-w-0">
          <span className="flex items-baseline whitespace-nowrap">
            <span
              className={cn(
                "font-serif font-semibold tracking-[-0.02em] leading-none",
                config.wordmark,
                isDarkBg ? "text-white" : "text-[#073B3A]"
              )}
            >
              Consult
            </span>
            <span
              className={cn(
                "font-serif font-semibold tracking-[-0.02em] leading-none",
                config.wordmark,
                isDarkBg ? "text-[#E14A4C]" : "text-[#C52F32]"
              )}
            >
              America
            </span>
          </span>

          <Tagline
            variant={isDarkBg ? "dark" : "light"}
            className={taglineVisibility}
          />
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
      className="inline-flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C52F32] rounded-md shrink-0"
      onClick={onNavigate}
    >
      {content}
    </Link>
  );
}
