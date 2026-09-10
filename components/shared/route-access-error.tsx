"use client";

/**
 * Shared error boundary for the HR/Manager/Payroll/Workforce route groups.
 * requireHrActor()/requireManagerActor()/requirePayrollActor() (and the
 * People pages' own requireHrActor() calls) throw a plain Error when an
 * authenticated user lacks the role a page requires — there was no
 * error.tsx anywhere in the app, so that throw fell through to Next's
 * default framework error page (a raw stack trace in dev, a generic 500 in
 * production) instead of a clean, on-brand message. In production Next
 * strips the real error message before it reaches this component, so this
 * can't reliably distinguish "wrong role" from an actual crash — it shows
 * one safe, generic message either way rather than guessing.
 */
export default function RouteAccessError({ reset }: { reset: () => void }) {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-start gap-4 px-4 py-16 lg:px-8">
      <p className="text-[0.7rem] uppercase tracking-[0.14em] text-black/40">
        Consult America
      </p>
      <h1 className="font-serif text-2xl font-semibold tracking-[-0.03em]">
        This section isn&apos;t available
      </h1>
      <p className="text-sm leading-6 text-black/60">
        You don&apos;t have access to this page, or something went wrong
        loading it. If you think this is a mistake, contact your
        administrator.
      </p>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={reset}
          className="rounded-md border border-black/15 px-3 py-1.5 text-sm font-medium text-black/70 hover:bg-black/[0.03]"
        >
          Try again
        </button>
        <a
          href="/login"
          className="rounded-md bg-[var(--ca-navy)] px-3 py-1.5 text-sm font-medium text-white hover:opacity-90"
        >
          Back to sign in
        </a>
      </div>
    </div>
  );
}
