import { cn } from "@/lib/utils";

interface SectionLabelProps {
  children: React.ReactNode;
  tone?: "light" | "dark" | "blue" | "burgundy" | "sage" | "teal" | "red";
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
        tone === "dark" && "text-[#596968]",
        tone === "blue" && "text-[#103F3E]",
        (tone === "burgundy" || tone === "red") && "text-[#B63A3A]",
        (tone === "sage" || tone === "teal") && "text-[#103F3E]",
        className,
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {children}
    </span>
  );
}
