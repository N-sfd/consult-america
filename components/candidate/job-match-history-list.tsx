"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

import JobMatchResultCard from "@/components/candidate/job-match-result-card";
import { formatDateTime } from "@/lib/recruiting/format";
import type { JobMatchResult } from "@/lib/candidate/job-match";

type HistoryRow = {
  id: string;
  createdAt: string;
  isJobRequisition: boolean;
  result: JobMatchResult | null;
};

export default function JobMatchHistoryList({ rows }: { rows: HistoryRow[] }) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <ul className="mt-4 space-y-3 text-sm">
      {rows.map((row) => {
        const expanded = expandedId === row.id;
        return (
          <li key={row.id} className="border-b border-black/5 pb-3 last:border-0">
            <button
              type="button"
              onClick={() => setExpandedId(expanded ? null : row.id)}
              className="flex w-full flex-wrap items-center justify-between gap-2 text-left"
            >
              <span>
                Match {row.result?.overallMatch ?? "—"}%
                {row.isJobRequisition ? " · Consult America role" : " · Pasted JD"}
              </span>
              <span className="flex items-center gap-2 text-black/40">
                {formatDateTime(row.createdAt)}
                {expanded ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </span>
            </button>
            {expanded && row.result ? (
              <div className="mt-3">
                <JobMatchResultCard result={row.result} />
              </div>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}
