import { cn } from "@/lib/utils";

interface SectionLabelProps {
  children: React.ReactNode;
  tone?: "light" | "dark" | "blue";
  className?: string;
}

export default function SectionLabel({
  children,
  tone = "light",
  className,
}: SectionLabelProps) {
  return (
    <span
      className={cn(
        "mkt-eyebrow",
        tone === "light" && "text-white/55",
        tone === "dark" && "text-black/45",
        tone === "blue" && "text-[var(--mkt-blue-soft)]",
        className,
      )}
    >
      {children}
    </span>
  );
}
