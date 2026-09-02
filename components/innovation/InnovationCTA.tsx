import { ArrowUpRight } from "lucide-react";

export default function InnovationCTA({
  productName,
  technology,
  liveUrl,
}: {
  productName: string;
  technology: string[];
  liveUrl: string;
}) {
  return (
    <section className="mkt-section bg-[var(--mkt-navy)] text-white">
      <div className="mkt-shell">
        <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="mkt-eyebrow text-white/45">Technology</span>
            <div className="mt-5 flex flex-wrap gap-x-3 gap-y-2">
              {technology.map((item, index) => (
                <span key={item} className="text-white/70">
                  {item}
                  {index < technology.length - 1 && (
                    <span className="ml-3 text-white/30">·</span>
                  )}
                </span>
              ))}
            </div>
          </div>

          <a
            href={liveUrl}
            target="_blank"
            rel="noreferrer"
            className="ca-button-light w-fit shrink-0"
          >
            View Live Product
            <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>

        <p className="mt-10 max-w-2xl border-t border-white/12 pt-8 text-sm leading-6 text-white/40">
          {productName} is an active build from ConsultAmerica&apos;s Innovation
          Lab — a working product, not a mockup. Screenshots and functionality
          reflect the live application.
        </p>
      </div>
    </section>
  );
}
