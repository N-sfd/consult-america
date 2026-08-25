import Link from "next/link";

interface PortalPlaceholderProps {
  title: string;
  description: string;
  phaseNote: string;
  backHref?: string;
  backLabel?: string;
}

export default function PortalPlaceholder({
  title,
  description,
  phaseNote,
  backHref = "/employee",
  backLabel = "Back to employee home",
}: PortalPlaceholderProps) {
  return (
    <div className="rounded-lg border border-black/10 bg-white p-8">
      <h1 className="text-2xl font-semibold tracking-[-0.03em]">{title}</h1>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-black/60">
        {description}
      </p>
      <p className="mt-6 text-xs uppercase tracking-[0.12em] text-[var(--ca-blue)]">
        {phaseNote}
      </p>
      <Link
        href={backHref}
        className="mt-8 inline-flex text-sm font-medium text-[var(--ca-blue)] hover:underline"
      >
        {backLabel}
      </Link>
    </div>
  );
}
