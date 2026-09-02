import { cn } from "@/lib/utils";

interface SectionLabelProps {
  children: React.ReactNode;
  tone?: "light" | "dark" | "blue" | "burgundy" | "sage" | "teal" | "red" | "emerald";
  className?: string;
}

export default function SectionLabel({
  children,
  tone = "burgundy",
  className,
}: SectionLabelProps) {
  return (
    <span
      className={cn(
        "mkt-eyebrow inline-flex items-center gap-1.5",
        tone === "light" && "text-white/80",
        tone === "dark" && "text-[#5B6D6B]",
        tone === "blue" && "text-[#176A63]",
        (tone === "burgundy" || tone === "red") && "text-[#B83A3A]",
        (tone === "sage" || tone === "teal") && "text-[#176A63]",
        tone === "emerald" && "text-[#9BC4B8]",
        className,
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {children}
    </span>
  );
}
