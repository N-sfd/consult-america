"use client";

import { useState, useTransition } from "react";

import { cancelLeaveAction } from "@/app/actions/leave-actions";
import type { LeaveRequest, LeaveType } from "@/types/self-service";
import { leaveRequestStatusLabels } from "@/types/self-service";

interface LeaveRequestListProps {
  requests: LeaveRequest[];
  types: LeaveType[];
}

function canCancel(request: LeaveRequest) {
  if (request.status === "PENDING") return true;
  if (request.status !== "APPROVED") return false;
  const today = new Date().toISOString().slice(0, 10);
  return request.startDate > today;
}

export default function LeaveRequestList({
  requests,
  types,
}: LeaveRequestListProps) {
  if (requests.length === 0) {
    return (
      <div className="rounded-lg border border-black/10 bg-white px-5 py-8 text-sm text-black/50">
        No leave requests yet.
      </div>
    );
  }

  return (
    <section className="rounded-lg border border-black/10 bg-white p-6">
      <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-black/40">
        Requests
      </h2>
      <ul className="mt-4 divide-y divide-black/5 text-sm">
        {requests.map((request) => (
          <LeaveRequestRow
            key={request.id}
            request={request}
            typeName={
              types.find((item) => item.id === request.leaveTypeId)?.name ??
              "Leave"
            }
          />
        ))}
      </ul>
    </section>
  );
}

function LeaveRequestRow({
  request,
  typeName,
}: {
  request: LeaveRequest;
  typeName: string;
}) {
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const cancellable = canCancel(request);

  function handleCancel() {
    setMessage(null);
    setError(null);
    startTransition(async () => {
      const result = await cancelLeaveAction({ leaveRequestId: request.id });
      if (result.ok) setMessage(result.message);
      else setError(result.message);
    });
  }

  return (
    <li className="flex flex-wrap items-center justify-between gap-3 py-3">
      <div>
        <p className="font-medium">{typeName}</p>
        <p className="mt-1 text-black/55">
          {request.startDate} – {request.endDate} · {request.hours}h
          {request.comments ? ` · ${request.comments}` : ""}
        </p>
        {(message || error) && (
          <p
            className={`mt-1 text-xs ${message ? "text-emerald-700" : "text-red-600"}`}
            role={message ? "status" : "alert"}
          >
            {message ?? error}
          </p>
        )}
      </div>
      <div className="flex items-center gap-3">
        <span className="text-xs uppercase tracking-[0.1em] text-black/45">
          {leaveRequestStatusLabels[request.status]}
        </span>
        {cancellable && (
          <button
            type="button"
            onClick={handleCancel}
            disabled={pending}
            className="rounded-md border border-black/15 px-3 py-1.5 text-xs font-medium hover:bg-black/[0.03] disabled:opacity-50"
          >
            Cancel
          </button>
        )}
      </div>
    </li>
  );
}
