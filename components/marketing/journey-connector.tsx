/**
 * Marks a section's top border as a continuation point in the Enterprise
 * Transformation → Oracle → CRM → AI & Data → Application Engineering
 * sequence — the "Lime Signal" motif applied to seams between sections
 * instead of inventing a new decorative element per section.
 */
export default function JourneyConnector() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute left-1/2 top-0 z-20 hidden h-2.5 w-2.5 -translate-x-1/2 lg:block"
    >
      <span className="block h-full w-full rounded-full bg-[var(--ca-lime)] shadow-[0_0_0_4px_#fff]" />
    </div>
  );
}
