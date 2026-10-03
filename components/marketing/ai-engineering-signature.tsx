import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const continuum = [
  { label: "Documents + data", detail: "Source files, records, and the systems that hold them." },
  { label: "AI + intelligence", detail: "Extraction and assistance grounded in that source." },
  { label: "Verified information", detail: "Answers that can be traced, reviewed, and trusted." },
  { label: "Workflow + integration", detail: "The result moves into the process, not a side tool." },
  { label: "Enterprise applications", detail: "Products shaped around the work people already do." },
];

export default function AIEngineeringSignature() {
  return (
    <section
      id="ai-engineering"
      className="relative overflow-x-clip border-b border-[var(--ca-teal-deep)] py-12 text-white sm:py-14 lg:py-16"
      style={{
        background:
          "radial-gradient(circle at 88% 12%, rgba(201,244,90,0.12), transparent 26%), linear-gradient(155deg, #073B4C 0%, #0B4655 58%, #102F35 100%)",
      }}
    >
      <div className="mkt-shell">
        <div className="grid items-start gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-5">
            <p className="text-[0.75rem] font-bold uppercase tracking-[0.14em] text-[var(--ca-lime)]">
              AI + Engineering
            </p>
            <h2 className="mt-3 font-serif text-[clamp(1.875rem,3.2vw,2.75rem)] font-semibold tracking-[-0.03em]">
              AI, data, and the applications around them.
            </h2>
            <p className="mt-4 max-w-md text-base leading-relaxed text-white/78">
              Applications shaped around real work. Data Agent is the proof — documents in, verified information out, then into the workflow.
            </p>
            <ol className="mt-8 space-y-0 border-l border-white/20 pl-5">
              {continuum.map((step, index) => (
                <li key={step.label} className="relative pb-5 last:pb-0">
                  <span
                    aria-hidden="true"
                    className="absolute -left-[1.4rem] top-1.5 h-2 w-2 rounded-full bg-[var(--ca-lime)]"
                  />
                  <p className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[var(--ca-lime)]">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <p className="mt-1 font-semibold">{step.label}</p>
                  <p className="mt-1 text-sm leading-relaxed text-white/72">{step.detail}</p>
                </li>
              ))}
            </ol>
          </div>

          <div className="lg:col-span-7">
            <p className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[var(--ca-lime)]">
              Data Agent
            </p>
            <h3 className="mt-2 font-serif text-2xl font-semibold tracking-[-0.03em]">
              Document intelligence
            </h3>
            <p className="mt-2 max-w-lg text-sm leading-relaxed text-white/75">
              Contracts and complex documents become structured fields people can search, compare, and review.
            </p>
            <div className="mt-5 overflow-hidden rounded-md bg-white shadow-[0_18px_44px_rgba(0,0,0,0.22)] ring-1 ring-white/30">
              <Image
                src="/innovation/data-agent-hero.png"
                alt="Data Agent contract intelligence platform"
                width={1440}
                height={900}
                className="h-auto w-full object-contain object-top"
                sizes="(max-width: 1024px) 100vw, 52vw"
              />
            </div>
            <Link
              href="/work/innovation/data-agent"
              className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--ca-lime)] hover:text-white"
            >
              View Data Agent
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
