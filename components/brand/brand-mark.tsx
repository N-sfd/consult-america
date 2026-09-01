import { cn } from "@/lib/utils";

interface BrandMarkProps {
  className?: string;
  tone?: "dark" | "light";
}

export default function BrandMark({ className, tone = "dark" }: BrandMarkProps) {
  const isLight = tone === "light";

  const cPrimary = isLight ? "#FFFFFF" : "#176A63";
  const cAccent = isLight ? "#D4E5DF" : "#287B72";
  const aPrimary = isLight ? "#FFFFFF" : "#073B3A";
  const aCut = isLight ? "#073B3A" : "#0B4A47";
  const accent = "#B83A3A";

  return (
    <svg
      viewBox="0 0 96 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={cn("h-full w-full", className)}
    >
      {/* C — flat crescent */}
      <path
        d="M50 4C24 4 4 22 4 38C4 56 22 70 46 70C52 70 56 68 60 64C38 68 18 54 14 38C10 22 26 6 50 6C54 6 56 5 58 4C56 4 53 4 50 4Z"
        fill={cPrimary}
      />

      {/* Inner swoosh */}
      <path
        d="M18 32C20 24 28 16 40 14C34 12 26 14 20 20C14 26 14 34 16 40C18 46 24 52 32 54C26 50 18 42 18 32Z"
        fill={cAccent}
        opacity={isLight ? 0.7 : 1}
      />

      {/* A */}
      <path d="M54 4L90 68H72L64 52H56L48 68H30L54 4Z" fill={aPrimary} />

      {/* A counter-space */}
      <path
        d="M56 22L62 40H70L76 22H56Z"
        fill={aCut}
        opacity={isLight ? 0.14 : 0.32}
      />

      {/* Red accent */}
      <path d="M60 46L66 38H72L66 56L60 46Z" fill={accent} />
    </svg>
  );
}
