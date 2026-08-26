import { cn } from "@/lib/utils";

interface SectionLabelProps {
  children: React.ReactNode;
  tone?: "light" | "dark" | "blue";
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
        tone === "light" && "text-white/60",
        tone === "dark" && "text-[var(--mkt-muted)]",
        tone === "blue" && "text-[var(--mkt-blue)]",
        className,
      )}
    >
      {children}
    </span>
  );
}
