import type { Metadata } from "next";
import Link from "next/link";

import { listAtsOffers } from "@/lib/ats/ops";
import { getWorkforceSession } from "@/lib/workforce/session";
import { offerStatusLabels, type OfferStatus } from "@/types/recruiting";

export const metadata: Metadata = { title: "Offers" };
export const dynamic = "force-dynamic";

type SearchParams = Promise<{ status?: string }>;

function formatDay(value?: string) {
  if (!value) return "—";
  const dateOnly = /^\d{4}-\d{2}-\d{2}$/.test(value);
  const date = dateOnly ? new Date(`${value}T00:00:00`) : new Date(value);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const STATUS_FILTERS: Array<OfferStatus | "ALL"> = [
  "ALL",
  "DRAFT",
  "PENDING_APPROVAL",
  "EXTENDED",
  "ACCEPTED",
  "DECLINED",
  "WITHDRAWN",
  "EXPIRED",
];

export default async function OffersPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  await getWorkforceSession();
  const params = await searchParams;
  const status = (params.status as OfferStatus | "ALL" | undefined) ?? "ALL";
  const rows = await listAtsOffers();
  const filtered = status === "ALL" ? rows : rows.filter((row) => row.status === status);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-[0.7rem] uppercase tracking-[0.14em] text-black/40">ATS</p>
        <h1 className="mt-2 font-serif text-2xl font-semibold tracking-[-0.03em]">Offers</h1>
        <p className="mt-2 max-w-2xl text-sm text-black/55">
          Offer queue from persisted ATS records. Accepted offers remain immutable under
          existing hire-lineage rules.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {STATUS_FILTERS.map((value) => (
          <Link
            key={value}
            href={value === "ALL" ? "/app/recruiting/offers" : `/app/recruiting/offers?status=${value}`}
            className={`rounded-md px-3 py-1.5 text-sm font-medium ${
              status === value
                ? "bg-[var(--ca-platform-deep)] text-white"
                : "border border-black/15 text-black/70 hover:bg-black/[0.03]"
            }`}
          >
            {value === "ALL" ? "All" : offerStatusLabels[value]}
          </Link>
        ))}
      </div>

      <p className="text-sm text-black/45">{filtered.length} offers</p>

      <div className="overflow-x-auto rounded-lg border border-black/10 bg-white">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="border-b border-black/10 text-[0.7rem] uppercase tracking-[0.1em] text-black/40">
            <tr>
              <th className="px-4 py-3 font-medium">Candidate</th>
              <th className="px-4 py-3 font-medium">Job</th>
              <th className="px-4 py-3 font-medium">Offer date</th>
              <th className="px-4 py-3 font-medium">Proposed start</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Expires</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((row) => (
              <tr key={row.id} className="border-b border-black/5 last:border-b-0">
                <td className="px-4 py-3">
                  {row.candidateId ? (
                    <Link
                      href={`/app/recruiting/candidates/${row.candidateId}`}
                      className="font-medium text-[var(--ca-platform-mid)] hover:underline"
                    >
                      {row.candidateName}
                    </Link>
                  ) : (
                    row.candidateName
                  )}
                </td>
                <td className="px-4 py-3 text-black/70">{row.jobTitle}</td>
                <td className="px-4 py-3 text-black/70">{formatDay(row.offerDate)}</td>
                <td className="px-4 py-3 text-black/70">
                  {formatDay(row.proposedStartDate)}
                </td>
                <td className="px-4 py-3">
                  <span className="rounded-md bg-black/5 px-2 py-1 text-xs font-medium">
                    {offerStatusLabels[row.status]}
                  </span>
                </td>
                <td className="px-4 py-3 text-black/70">{formatDay(row.expiresAt)}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-black/45">
                  No data available for this period.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
