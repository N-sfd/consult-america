import { cn } from "@/lib/utils";

interface ProductMockupProps {
  title: string;
  subtitle?: string;
  className?: string;
  children: React.ReactNode;
  headerRight?: React.ReactNode;
}

/** Presentation chrome for product / Data Agent / Oracle UI mocks. */
export default function ProductMockup({
  title,
  subtitle,
  className,
  children,
  headerRight,
}: ProductMockupProps) {
  return (
    <div
      className={cn(
        "overflow-hidden border border-black/10 bg-white shadow-[0_32px_100px_rgba(5,7,13,0.1)]",
        className,
      )}
    >
      <div className="flex items-center justify-between border-b border-black/8 bg-[var(--mkt-navy)] px-5 py-3.5 text-white">
        <div className="flex items-center gap-3">
          <span
            className="flex h-6 w-6 items-center justify-center text-[0.6rem] font-bold text-white"
            style={{ background: "var(--ca-brand-gradient)" }}
          >
            CA
          </span>
          <div>
            <p className="text-xs font-medium tracking-[0.06em]">{title}</p>
            {subtitle ? (
              <p className="text-[0.65rem] text-white/45">{subtitle}</p>
            ) : null}
          </div>
        </div>
        {headerRight}
      </div>
      {children}
    </div>
  );
}
