"use client";

import { useState, useTransition } from "react";

import {
  approveLeaveAction,
  rejectLeaveAction,
} from "@/app/actions/leave-actions";
import type { LeaveBalance, LeaveRequest, LeaveType } from "@/types/self-service";

interface ManagerLeaveItem {
  request: LeaveRequest;
  leaveType?: LeaveType;
  balance?: LeaveBalance;
  employeeName: string;
}

interface LeaveApprovalListProps {
  items: ManagerLeaveItem[];
}

export default function LeaveApprovalList({ items }: LeaveApprovalListProps) {
  if (items.length === 0) {
    return (
      <div className="rounded-lg border border-black/10 bg-white px-5 py-8 text-sm text-black/50">
        No leave requests waiting for approval.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <LeaveApprovalCard key={item.request.id} item={item} />
      ))}
    </div>
  );
}

function LeaveApprovalCard({ item }: { item: ManagerLeaveItem }) {
  const [comment, setComment] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function run(action: () => Promise<{ ok: boolean; message: string }>) {
    setMessage(null);
    setError(null);
    startTransition(async () => {
      const result = await action();
      if (result.ok) setMessage(result.message);
      else setError(result.message);
    });
  }

  return (
    <article className="rounded-lg border border-black/10 bg-white p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="font-medium">{item.employeeName}</p>
          <p className="mt-1 text-sm text-black/55">
            {item.leaveType?.name ?? "Leave"} · {item.request.startDate} –{" "}
            {item.request.endDate}
          </p>
          <p className="mt-1 text-sm text-black/45">
            {item.request.hours} hours · Submitted{" "}
            {item.request.submittedAt?.slice(0, 10) ?? "—"}
          </p>
          {item.request.comments && (
            <p className="mt-2 text-sm text-black/55">{item.request.comments}</p>
          )}
        </div>
        <div className="text-right text-sm">
          <p className="text-xs uppercase tracking-[0.1em] text-[var(--ca-blue)]">
            Review
          </p>
          <p className="mt-2 text-black/55">
            Balance · {item.balance?.available ?? "—"}h available
          </p>
        </div>
      </div>

      <label className="mt-5 block text-xs uppercase tracking-[0.1em] text-black/40">
        Comment (required for reject)
        <textarea
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          rows={3}
          className="mt-2 w-full rounded-md border border-black/15 px-3 py-2 text-sm font-normal normal-case tracking-normal text-[#0B1220]"
        />
      </label>

      <div className="mt-4 flex flex-wrap gap-3">
        <button
          type="button"
          disabled={pending}
          onClick={() =>
            run(() =>
              approveLeaveAction({ leaveRequestId: item.request.id }),
            )
          }
          className="rounded-md bg-[var(--ca-blue)] px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          Approve
        </button>
        <button
          type="button"
          disabled={pending}
          onClick={() =>
            run(() =>
              rejectLeaveAction({
                leaveRequestId: item.request.id,
                comment,
              }),
            )
          }
          className="rounded-md border border-red-200 px-4 py-2 text-sm font-medium text-red-700 disabled:opacity-50"
        >
          Reject
        </button>
      </div>

      {message && (
        <p className="mt-4 text-sm text-emerald-700" role="status">
          {message}
        </p>
      )}
      {error && (
        <p className="mt-4 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </article>
  );
}
