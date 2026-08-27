export default function AppBrowserFrame({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-[var(--mkt-border)] bg-white shadow-[0_16px_48px_rgba(16,42,67,0.08)]">
      <div className="flex items-center justify-between border-b border-[var(--mkt-border)] bg-[var(--mkt-ice)] px-4 py-2.5">
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-[#f87171]" />
          <span className="h-2 w-2 rounded-full bg-[#fbbf24]" />
          <span className="h-2 w-2 rounded-full bg-[#4ade80]" />
        </div>
        <span className="text-xs font-medium text-[var(--mkt-navy)]">{title}</span>
        <span className="w-12" />
      </div>
      {children}
    </div>
  );
}
