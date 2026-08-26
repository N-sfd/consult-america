import Link from "next/link";

export default function WorkforcePlaceholderPage({
  title,
  section,
  description,
}: {
  title: string;
  section: string;
  description: string;
}) {
  return (
    <div className="mx-auto max-w-[1200px] px-4 py-6 lg:px-8 lg:py-8">
      <p className="text-[0.7rem] uppercase tracking-[0.14em] text-black/40">
        {section}
      </p>
      <h1 className="mt-2 text-2xl font-medium tracking-[-0.03em]">{title}</h1>
      <p className="mt-3 max-w-xl text-sm leading-6 text-black/55">
        {description}
      </p>
      <div className="mt-8 border border-dashed border-black/15 bg-white p-8 text-sm text-black/45">
        Module shell ready · connect domain data in a later phase
      </div>
      <Link
        href="/workforce"
        className="mt-6 inline-block text-sm text-[var(--ca-blue)] hover:underline"
      >
        ← Back to overview
      </Link>
    </div>
  );
}
