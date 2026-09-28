export type BackendUnavailableStateProps = {
  label?: string;
};

/**
 * For a proactively-detected condition (e.g. a page checks
 * isSupabaseConfigured() before rendering) — distinct from RouteAccessError,
 * which covers an unexpected thrown error/permission denial. This is a known,
 * named state: "the backend isn't reachable right now," not "something broke."
 */
export function BackendUnavailableState({
  label = "This isn't available right now. Please try again shortly.",
}: BackendUnavailableStateProps) {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-start gap-3 px-4 py-16 lg:px-8">
      <p className="text-[0.7rem] uppercase tracking-[0.14em] text-black/40">
        Consult America
      </p>
      <h2 className="font-serif text-xl font-semibold tracking-[-0.03em]">
        Temporarily unavailable
      </h2>
      <p className="text-sm leading-6 text-black/60">{label}</p>
    </div>
  );
}
