import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-start gap-4 px-4 py-24 lg:px-8">
      <p className="text-[0.7rem] uppercase tracking-[0.14em] text-black/40">
        Consult America
      </p>
      <h1 className="font-serif text-2xl font-semibold tracking-[-0.03em]">
        Page not found
      </h1>
      <p className="text-sm leading-6 text-black/60">
        The page you&apos;re looking for doesn&apos;t exist or may have moved.
      </p>
      <Link
        href="/"
        className="rounded-md bg-[var(--ca-navy)] px-3 py-1.5 text-sm font-medium text-white hover:opacity-90"
      >
        Back to home
      </Link>
    </div>
  );
}
