import { cn } from "@/lib/utils";

interface BrandMarkProps {
  className?: string;
  tone?: "dark" | "light";
}

export default function BrandMark({ className, tone = "dark" }: BrandMarkProps) {
  const isLight = tone === "light";

  const cOuterStart = isLight ? "#E1ECE8" : "#4B9488";
  const cOuterMid = isLight ? "#C9DDD7" : "#176A63";
  const cOuterEnd = isLight ? "#9BC4B8" : "#0B4A47";
  const cInnerStart = isLight ? "#FFFFFF" : "#9BC4B8";
  const cInnerMid = isLight ? "#E1ECE8" : "#287B72";
  const cInnerEnd = isLight ? "#C9DDD7" : "#105A55";
  const aStart = isLight ? "#FFFFFF" : "#176A63";
  const aMid = isLight ? "#E1ECE8" : "#0B4A47";
  const aEnd = isLight ? "#C9DDD7" : "#073B3A";
  const highlight = isLight ? "#FFFFFF" : "#9BC4B8";

  return (
    <svg
      viewBox="0 0 120 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={cn("h-full w-full", className)}
    >
      <defs>
        <linearGradient id="ca-c-outer" x1="6" y1="8" x2="58" y2="74" gradientUnits="userSpaceOnUse">
          <stop stopColor={cOuterStart} />
          <stop offset="0.42" stopColor={cOuterMid} />
          <stop offset="1" stopColor={cOuterEnd} />
        </linearGradient>
        <linearGradient id="ca-c-inner" x1="16" y1="18" x2="50" y2="64" gradientUnits="userSpaceOnUse">
          <stop stopColor={cInnerStart} />
          <stop offset="0.5" stopColor={cInnerMid} />
          <stop offset="1" stopColor={cInnerEnd} />
        </linearGradient>
        <linearGradient id="ca-a-body" x1="64" y1="8" x2="114" y2="74" gradientUnits="userSpaceOnUse">
          <stop stopColor={aStart} />
          <stop offset="0.5" stopColor={aMid} />
          <stop offset="1" stopColor={aEnd} />
        </linearGradient>
      </defs>

      {/* Outer C ribbon */}
      <path
        d="M56 8C30 8 8 26 6 44C4 60 18 74 38 76C46 77 52 75 58 71C50 77 38 80 26 80C8 80 0 62 2 42C5 18 28 0 56 0C64 0 70 2 74 6C68 4 62 4 56 8Z"
        fill="url(#ca-c-outer)"
      />

      {/* Inner C ribbon */}
      <path
        d="M52 18C34 18 20 30 18 42C16 52 24 62 36 64C42 65 48 63 52 60C44 65 34 67 26 67C12 67 4 55 6 43C8 29 24 16 44 16C50 16 54 17 56 18C52 17 52 17 52 18Z"
        fill="url(#ca-c-inner)"
      />

      {/* C highlight */}
      <path
        d="M18 28C22 22 32 16 44 16C48 16 52 17 54 19C46 15 36 16 28 22C22 26 19 31 18 28Z"
        fill={highlight}
        opacity={isLight ? 0.95 : 0.5}
      />

      {/* A body */}
      <path
        d="M64 6L114 74H96L86 58H74L64 74H44L64 6ZM70 20L76 40H84L90 20H70Z"
        fill="url(#ca-a-body)"
      />

      {/* A inner cut */}
      <path
        d="M70 20L76 40H84L90 20H70ZM68 44L74 52H86L92 44H68Z"
        fill={isLight ? "#E1ECE8" : "#105A55"}
        opacity="0.75"
      />

      {/* Red accent */}
      <path d="M74 48L80 40H86L80 58L74 48Z" fill="#B83A3A" />
    </svg>
  );
}
