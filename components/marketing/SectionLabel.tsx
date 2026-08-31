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
        tone === "light" && "text-[#97A8B7]",
        tone === "dark" && "text-[#526170]",
        tone === "blue" && "text-[#47739B]",
        (tone === "burgundy" || tone === "red") && "text-[#BA3535]",
        (tone === "sage" || tone === "teal") && "text-[#357C78]",
        className,
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {children}
    </span>
  );
}
