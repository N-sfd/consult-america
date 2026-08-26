import { cn } from "@/lib/utils";

export type MetricItem = {
  value: string;
  label: string;
  detail?: string;
};

interface MetricStripProps {
  items: MetricItem[];
  tone?: "light" | "dark";
  className?: string;
}

export default function MetricStrip({
  items,
  tone = "light",
  className,
}: MetricStripProps) {
  const isLight = tone === "light";

  return (
    <div
      className={cn(
        "grid gap-8 border-t sm:grid-cols-2 lg:grid-cols-4 lg:gap-0",
        isLight ? "border-white/12" : "border-black/10",
        className,
      )}
    >
      {items.map((item, index) => (
        <div
          key={`${item.value}-${item.label}`}
          className={cn(
            "pt-6 lg:px-8 lg:first:pl-0 lg:last:pr-0",
            index > 0 && "lg:border-l",
            isLight ? "lg:border-white/12" : "lg:border-black/10",
          )}
        >
          <p
            className={cn(
              "text-3xl font-medium tracking-[-0.04em] md:text-4xl",
              isLight ? "text-white" : "text-[var(--mkt-ink)]",
            )}
          >
            {item.value}
          </p>
          <p
            className={cn(
              "mt-2 text-sm font-medium uppercase tracking-[0.12em]",
              isLight ? "text-white/45" : "text-black/45",
            )}
          >
            {item.label}
          </p>
          {item.detail ? (
            <p
              className={cn(
                "mt-2 max-w-[14rem] text-sm leading-6",
                isLight ? "text-white/55" : "text-black/55",
              )}
            >
              {item.detail}
            </p>
          ) : null}
        </div>
      ))}
    </div>
  );
}
