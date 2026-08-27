import Image from "next/image";

import type { InnovationScreenshot } from "@/data/innovation-products";

export default function ProductExperience({
  items,
}: {
  items: InnovationScreenshot[];
}) {
  if (items.length === 0) return null;

  return (
    <section className="mkt-section-compact bg-[var(--mkt-ice)]">
      <div className="mkt-shell">
        <span className="mkt-eyebrow text-[var(--mkt-muted)]">
          The Experience
        </span>
        <h2 className="mkt-section-heading mt-5 max-w-2xl text-[var(--mkt-navy)]">
          What it looks like in use.
        </h2>

        <div
          className={`mt-10 grid gap-8 ${items.length > 1 ? "md:grid-cols-2" : ""}`}
        >
          {items.map((shot) => (
            <figure key={shot.src}>
              <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-[var(--mkt-border)] shadow-[0_20px_50px_rgba(16,42,67,0.08)]">
                <Image
                  src={shot.src}
                  alt={shot.alt}
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <figcaption className="mt-3 text-sm text-[var(--mkt-muted)]">
                {shot.caption}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
