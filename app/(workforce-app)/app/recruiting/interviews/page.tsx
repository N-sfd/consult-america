import type { Metadata } from "next";
import Link from "next/link";

import { listAtsInterviews } from "@/lib/ats/ops";
import { getWorkforceSession } from "@/lib/workforce/session";
import { candidateInterviewStatusLabels, type InterviewStatus } from "@/types/recruiting";

export const metadata: Metadata = { title: "Interviews" };
export const dynamic = "force-dynamic";

type SearchParams = Promise<{ status?: string }>;

function formatDate(value?: string) {
  if (!value) return "—";
  return new Date(value).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

const STATUS_FILTERS: Array<InterviewStatus | "ALL"> = [
  "ALL",
  "SCHEDULED",
  "COMPLETED",
  "CANCELLED",
  "NO_SHOW",
];

export default async function InterviewsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  await getWorkforceSession();
  const params = await searchParams;
  const status = (params.status as InterviewStatus | "ALL" | undefined) ?? "ALL";
  const rows = await listAtsInterviews();
  const filtered =
    status === "ALL" ? rows : rows.filter((row) => row.status === status);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-[0.7rem] uppercase tracking-[0.14em] text-black/40">ATS</p>
        <h1 className="mt-2 font-serif text-2xl font-semibold tracking-[-0.03em]">
          Interviews
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-black/55">
          Scheduled and completed interviews. Interviewer feedback stays internal —
          candidates only see candidate-safe interview details in their portal.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {STATUS_FILTERS.map((value) => (
          <Link
            key={value}
            href={value === "ALL" ? "/app/recruiting/interviews" : `/app/recruiting/interviews?status=${value}`}
            className={`rounded-md px-3 py-1.5 text-sm font-medium ${
              status === value
                ? "bg-[var(--ca-platform-deep)] text-white"
                : "border border-black/15 text-black/70 hover:bg-black/[0.03]"
            }`}
          >
            {value === "ALL" ? "All" : candidateInterviewStatusLabels[value]}
          </Link>
        ))}
      </div>

      <p className="text-sm text-black/45">{filtered.length} interviews</p>

      <div className="overflow-x-auto rounded-lg border border-black/10 bg-white">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="border-b border-black/10 text-[0.7rem] uppercase tracking-[0.1em] text-black/40">
            <tr>
              <th className="px-4 py-3 font-medium">Candidate</th>
              <th className="px-4 py-3 font-medium">Job</th>
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium">Date / Time</th>
              <th className="px-4 py-3 font-medium">Interviewers</th>
              <th className="px-4 py-3 font-medium">Status</th>
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
                <td className="px-4 py-3 text-black/70">
                  {row.interviewType.replaceAll("_", " ")}
                </td>
                <td className="px-4 py-3 text-black/70">{formatDate(row.scheduledAt)}</td>
                <td className="px-4 py-3 text-black/55">
                  {row.interviewers.length > 0
                    ? `${row.interviewers.length} assigned`
                    : "—"}
                </td>
                <td className="px-4 py-3">
                  <span className="rounded-md bg-black/5 px-2 py-1 text-xs font-medium">
                    {candidateInterviewStatusLabels[row.status]}
                  </span>
                </td>
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
