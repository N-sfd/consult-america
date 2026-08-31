import { cn } from "@/lib/utils";

interface SectionLabelProps {
  children: React.ReactNode;
  tone?: "light" | "dark" | "blue" | "burgundy" | "sage";
  className?: string;
}

export default function SectionLabel({
  children,
  tone = "dark",
  className,
}: SectionLabelProps) {
  return (
    <span
      className={cn(
        "mkt-eyebrow",
        tone === "light" && "text-[#D8C5AA]",
        tone === "dark" && "text-[#695F57]",
        (tone === "blue" || tone === "burgundy") && "text-[#7D2639]",
        tone === "sage" && "text-[#657766]",
        className,
      )}
    >
      {children}
    </span>
  );
}
