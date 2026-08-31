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
        tone === "light" && "text-[#A4B1BE]",
        tone === "dark" && "text-[#475467]",
        tone === "blue" && "text-[#365F8D]",
        tone === "burgundy" && "text-[#B63838]",
        tone === "sage" && "text-[#5F7D75]",
        className,
      )}
    >
      {children}
    </span>
  );
}
