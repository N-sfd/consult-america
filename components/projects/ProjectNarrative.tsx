import { cn } from "@/lib/utils";

export default function ProjectNarrative({
  eyebrow,
  heading,
  body,
  tone = "white",
}: {
  eyebrow: string;
  heading: string;
  body: string;
  tone?: "white" | "ice";
}) {
  return (
    <section
      className={cn(
        "mkt-section-compact",
        tone === "white" ? "bg-white" : "bg-[var(--mkt-ice)]",
      )}
    >
      <div className="mkt-shell">
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <span className="mkt-eyebrow text-[var(--mkt-muted)]">
              {eyebrow}
            </span>
          </div>
          <div className="lg:col-span-8">
            <h2 className="text-2xl font-medium tracking-[-0.03em] text-[var(--mkt-navy)] md:text-3xl">
              {heading}
            </h2>
            <p className="mkt-body mt-5 max-w-2xl">{body}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
