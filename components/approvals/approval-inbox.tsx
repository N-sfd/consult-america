"use client";

import Link from "next/link";
import { useMemo, useState, useTransition } from "react";

import {
  actOnApprovalAction,
  type ApprovalInboxAction,
} from "@/app/actions/approval-actions";
import type { ApprovalInboxItem } from "@/lib/self-service/approval-service";
import { approvalStatusLabels, expenseCategoryLabels } from "@/types/self-service";

interface ApprovalInboxProps {
  items: ApprovalInboxItem[];
  allPending: ApprovalInboxItem[];
  recent: ApprovalInboxItem[];
  activeFilter: string;
}

export default function ApprovalInbox({
  items,
  allPending,
  recent,
  activeFilter,
}: ApprovalInboxProps) {
  return (
    <div className="space-y-8">
      <FilterBar activeFilter={activeFilter} counts={countByType(allPending)} />

      <section className="space-y-4">
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-black/40">
            Pending
          </h2>
          <p className="text-sm text-black/45">{items.length} waiting</p>
        </div>

        {items.length === 0 ? (
          <div className="rounded-lg border border-black/10 bg-white px-5 py-8 text-sm text-black/50">
            No pending approvals
            {activeFilter !== "ALL" ? ` for ${activeFilter.toLowerCase()}` : ""}.
          </div>
        ) : (
          items.map((item) => (
            <ApprovalCard key={item.approval.id} item={item} />
          ))
        )}
      </section>

      <section className="rounded-lg border border-black/10 bg-white p-6">
        <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-black/40">
          Recent Decisions
        </h2>
        {recent.length === 0 ? (
          <p className="mt-4 text-sm text-black/50">No recent decisions yet.</p>
        ) : (
          <ul className="mt-4 divide-y divide-black/5 text-sm">
            {recent.map((item) => (
              <li
                key={item.approval.id}
                className="flex flex-wrap items-center justify-between gap-3 py-3"
              >
                <div>
                  <p className="font-medium">
                    {item.typeLabel} · {item.requesterName}
                  </p>
                  <p className="mt-1 text-black/55">{item.approval.summary}</p>
                </div>
                <span className="text-xs uppercase tracking-[0.1em] text-black/45">
                  {approvalStatusLabels[item.approval.status]}
                  {item.approval.actedAt
                    ? ` · ${item.approval.actedAt.slice(0, 10)}`
                    : ""}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function countByType(items: ApprovalInboxItem[]) {
  return {
    ALL: items.length,
    TIMESHEET: items.filter((i) => i.approval.requestType === "TIMESHEET")
      .length,
    LEAVE: items.filter((i) => i.approval.requestType === "LEAVE").length,
    PROFILE_CHANGE: items.filter(
      (i) => i.approval.requestType === "PROFILE_CHANGE",
    ).length,
    EXPENSE: items.filter((i) => i.approval.requestType === "EXPENSE").length,
  };
}

function FilterBar({
  activeFilter,
  counts,
}: {
  activeFilter: string;
  counts: Record<string, number>;
}) {
  const filters = [
    { value: "ALL", label: "All" },
    { value: "TIMESHEET", label: "Timesheet" },
    { value: "LEAVE", label: "Leave" },
    { value: "PROFILE_CHANGE", label: "Profile" },
    { value: "EXPENSE", label: "Expense" },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((filter) => {
        const href =
          filter.value === "ALL"
            ? "/manager/approvals"
            : `/manager/approvals?type=${filter.value}`;
        const active = activeFilter === filter.value;
        const count =
          filter.value === "ALL"
            ? counts.ALL
            : (counts[filter.value] ?? 0);
        return (
          <Link
            key={filter.value}
            href={href}
            className={`rounded-md px-3 py-1.5 text-sm font-medium ${
              active
                ? "bg-[var(--ca-blue)] text-white"
                : "border border-black/15 text-black/70 hover:bg-black/[0.03]"
            }`}
          >
            {filter.label} · {count}
          </Link>
        );
      })}
    </div>
  );
}

function ApprovalCard({ item }: { item: ApprovalInboxItem }) {
  const [expanded, setExpanded] = useState(true);
  const [comment, setComment] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const supportsReturn = item.approval.requestType === "TIMESHEET";

  const detailLines = useMemo(() => buildDetailLines(item), [item]);

  function run(action: ApprovalInboxAction) {
    setMessage(null);
    setError(null);
    startTransition(async () => {
      const result = await actOnApprovalAction({
        approvalId: item.approval.id,
        action,
        comment,
      });
      if (result.ok) setMessage(result.message);
      else setError(result.message);
    });
  }

  return (
    <article className="rounded-lg border border-black/10 bg-white p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.1em] text-[var(--ca-blue)]">
            {item.typeLabel}
          </p>
          <p className="mt-2 text-lg font-medium">{item.requesterName}</p>
          <p className="mt-1 text-sm text-black/55">{item.approval.summary}</p>
          <p className="mt-2 text-xs text-black/40">
            Submitted {item.approval.submittedAt.slice(0, 10)}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href={item.deepLink}
            className="text-sm font-medium text-[var(--ca-blue)] hover:underline"
          >
            Open queue
          </Link>
          <button
            type="button"
            onClick={() => setExpanded((value) => !value)}
            className="rounded-md border border-black/15 px-3 py-1.5 text-xs font-medium hover:bg-black/[0.03]"
          >
            {expanded ? "Hide detail" : "Review"}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="mt-5 space-y-5 border-t border-black/5 pt-5">
          <dl className="grid gap-3 text-sm sm:grid-cols-2">
            {detailLines.map((line) => (
              <div key={line.label}>
                <dt className="text-xs uppercase tracking-[0.1em] text-black/40">
                  {line.label}
                </dt>
                <dd className="mt-1 text-[#0B1220]">{line.value}</dd>
              </div>
            ))}
          </dl>

          {item.detail.kind === "TIMESHEET" && (
            <ul className="grid gap-2 text-sm sm:grid-cols-2">
              {item.detail.entries.map((entry) => (
                <li
                  key={entry.id}
                  className="flex justify-between rounded-md bg-[#F8FAFC] px-3 py-2"
                >
                  <span>
                    {entry.workDate} · {entry.timeType}
                  </span>
                  <span className="font-medium">{entry.hours}h</span>
                </li>
              ))}
            </ul>
          )}

          {item.history.length > 0 && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-black/40">
                History
              </p>
              <ul className="mt-3 space-y-2 text-sm text-black/60">
                {item.history.map((event) => (
                  <li key={event.id}>
                    {event.action} · {event.actedAt.slice(0, 10)}
                    {event.comment ? ` · ${event.comment}` : ""}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <label className="block text-xs uppercase tracking-[0.1em] text-black/40">
            Comment
            {supportsReturn
              ? " (required for reject / return)"
              : " (required for reject)"}
            <textarea
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              rows={3}
              className="mt-2 w-full rounded-md border border-black/15 px-3 py-2 text-sm font-normal normal-case tracking-normal text-[#0B1220]"
            />
          </label>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              disabled={pending}
              onClick={() => run("APPROVED")}
              className="rounded-md bg-[var(--ca-blue)] px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
            >
              Approve
            </button>
            {supportsReturn && (
              <button
                type="button"
                disabled={pending}
                onClick={() => run("RETURNED")}
                className="rounded-md border border-black/15 px-4 py-2 text-sm font-medium disabled:opacity-50"
              >
                Return for Correction
              </button>
            )}
            <button
              type="button"
              disabled={pending}
              onClick={() => run("REJECTED")}
              className="rounded-md border border-red-200 px-4 py-2 text-sm font-medium text-red-700 disabled:opacity-50"
            >
              Reject
            </button>
          </div>

          {message && (
            <p className="text-sm text-emerald-700" role="status">
              {message}
            </p>
          )}
          {error && (
            <p className="text-sm text-red-600" role="alert">
              {error}
            </p>
          )}
        </div>
      )}
    </article>
  );
}

function buildDetailLines(item: ApprovalInboxItem) {
  const lines = [
    { label: "Requester", value: item.requesterName },
    { label: "Request Type", value: item.typeLabel },
    {
      label: "Submitted",
      value: item.approval.submittedAt.slice(0, 10),
    },
  ];

  if (item.detail.kind === "TIMESHEET") {
    lines.push(
      {
        label: "Period",
        value: `${item.detail.sheet.periodStart} – ${item.detail.sheet.periodEnd}`,
      },
      {
        label: "Total Hours",
        value: `${item.detail.sheet.totalHours} hours`,
      },
    );
  }

  if (item.detail.kind === "LEAVE") {
    lines.push(
      {
        label: "Leave Type",
        value: item.detail.leaveType?.name ?? "Leave",
      },
      {
        label: "Dates",
        value: `${item.detail.request.startDate} – ${item.detail.request.endDate}`,
      },
      {
        label: "Hours",
        value: `${item.detail.request.hours} hours`,
      },
      {
        label: "Current Balance",
        value:
          item.detail.balance != null
            ? `${item.detail.balance.available} hours`
            : "—",
      },
      {
        label: "Balance After Approval",
        value:
          item.detail.balance != null
            ? `${item.detail.balance.available - item.detail.request.hours} hours`
            : "—",
      },
    );
    if (item.detail.request.comments) {
      lines.push({
        label: "Employee Comment",
        value: item.detail.request.comments,
      });
    }
  }

  if (item.detail.kind === "PROFILE_CHANGE") {
    lines.push(
      {
        label: "Change Type",
        value: item.detail.request.changeType.replaceAll("_", " "),
      },
      {
        label: "Current Value",
        value: item.detail.request.currentValue,
      },
      {
        label: "Requested Value",
        value: item.detail.request.requestedValue,
      },
    );
  }

  if (item.detail.kind === "EXPENSE") {
    lines.push(
      {
        label: "Category",
        value: expenseCategoryLabels[item.detail.claim.category],
      },
      {
        label: "Amount",
        value: `$${item.detail.claim.amount.toFixed(2)} ${item.detail.claim.currency}`,
      },
      {
        label: "Expense Date",
        value: item.detail.claim.expenseDate,
      },
      {
        label: "Description",
        value: item.detail.claim.description,
      },
    );
  }

  if (item.detail.kind === "UNSUPPORTED") {
    lines.push({ label: "Detail", value: item.detail.message });
  }

  return lines;
}
