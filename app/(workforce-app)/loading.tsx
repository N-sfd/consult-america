import { PageHeader } from "@/components/shared/page-header";

export default function WorkforceAppLoading() {
  return (
    <div className="mx-auto w-full max-w-[1440px] space-y-6 p-6">
      <PageHeader
        eyebrow="Workforce"
        title="Loading…"
        description="Preparing your workspace."
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-24 animate-pulse rounded-md border border-[var(--ca-app-border)] bg-white"
          />
        ))}
      </div>
      <div className="h-64 animate-pulse rounded-md border border-[var(--ca-app-border)] bg-white" />
    </div>
  );
}
