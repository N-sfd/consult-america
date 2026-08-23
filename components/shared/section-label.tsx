interface SectionLabelProps {
  children: React.ReactNode;
  light?: boolean;
}

export default function SectionLabel({
  children,
  light = false,
}: SectionLabelProps) {
  return (
    <span
      className={`ca-eyebrow ${
        light ? "text-white/60" : "text-[var(--ca-muted)]"
      }`}
    >
      {children}
    </span>
  );
}
