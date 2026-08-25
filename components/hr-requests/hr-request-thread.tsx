"use client";

import { useState, useTransition } from "react";

import {
  addEmployeeHrMessageAction,
  addHrReplyAction,
  updateHrRequestStatusAction,
} from "@/app/actions/hr-request-actions";
import type {
  HrRequest,
  HrRequestMessage,
  HrRequestStatus,
} from "@/types/self-service";
import {
  hrRequestCategoryLabels,
  hrRequestPriorityLabels,
  hrRequestStatusLabels,
} from "@/types/self-service";

interface HrRequestThreadProps {
  request: HrRequest;
  messages: HrRequestMessage[];
  mode: "employee" | "hr";
  employeeName: string;
}

export default function HrRequestThread({
  request,
  messages,
  mode,
  employeeName,
}: HrRequestThreadProps) {
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<HrRequestStatus>(request.status);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const closed =
    request.status === "RESOLVED" || request.status === "CLOSED";
  const canEmployeeReply = mode === "employee" && !closed;
  const canHrReply = mode === "hr" && request.status !== "CLOSED";

  function sendMessage() {
    setFeedback(null);
    setError(null);
    startTransition(async () => {
      const result =
        mode === "employee"
          ? await addEmployeeHrMessageAction({
              hrRequestId: request.id,
              message,
            })
          : await addHrReplyAction({
              hrRequestId: request.id,
              message,
            });
      if (result.ok) {
        setFeedback(result.message);
        setMessage("");
      } else {
        setError(result.message);
      }
    });
  }

  function saveStatus() {
    setFeedback(null);
    setError(null);
    startTransition(async () => {
      const result = await updateHrRequestStatusAction({
        hrRequestId: request.id,
        status,
      });
      if (result.ok) setFeedback(result.message);
      else setError(result.message);
    });
  }

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-black/10 bg-white p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs text-black/40">{request.requestNumber}</p>
            <h1 className="mt-2 text-2xl font-semibold tracking-[-0.04em]">
              {request.subject}
            </h1>
            <p className="mt-2 text-sm text-black/55">
              {hrRequestCategoryLabels[request.category]} ·{" "}
              {hrRequestPriorityLabels[request.priority]} · {employeeName}
            </p>
          </div>
          <span className="text-xs uppercase tracking-[0.1em] text-black/45">
            {hrRequestStatusLabels[request.status]}
          </span>
        </div>
      </section>

      <section className="rounded-lg border border-black/10 bg-white p-6">
        <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-black/40">
          Conversation
        </h2>
        <ul className="mt-4 space-y-4">
          {messages.map((item) => (
            <li
              key={item.id}
              className={`rounded-md px-4 py-3 text-sm ${
                item.authorRole === "HR"
                  ? "bg-[#EEF3F8]"
                  : "bg-[#F8FAFC]"
              }`}
            >
              <p className="text-xs uppercase tracking-[0.1em] text-black/40">
                {item.authorRole === "HR" ? "HR" : "Employee"} ·{" "}
                {item.createdAt.slice(0, 10)}
              </p>
              <p className="mt-2 whitespace-pre-wrap text-[#0B1220]">
                {item.message}
              </p>
            </li>
          ))}
        </ul>

        {(canEmployeeReply || canHrReply) && (
          <div className="mt-5 space-y-3 border-t border-black/5 pt-5">
            <label className="block text-xs uppercase tracking-[0.1em] text-black/40">
              {mode === "hr" ? "HR Reply" : "Your Message"}
              <textarea
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                rows={4}
                className="mt-2 w-full rounded-md border border-black/15 px-3 py-2 text-sm font-normal normal-case tracking-normal text-[#0B1220]"
              />
            </label>
            <button
              type="button"
              disabled={pending || !message.trim()}
              onClick={sendMessage}
              className="rounded-md bg-[var(--ca-blue)] px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
            >
              Send
            </button>
          </div>
        )}
      </section>

      {mode === "hr" && (
        <section className="rounded-lg border border-black/10 bg-white p-6">
          <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-black/40">
            Update Status
          </h2>
          <div className="mt-4 flex flex-wrap items-end gap-3">
            <label className="block text-xs uppercase tracking-[0.1em] text-black/40">
              Status
              <select
                value={status}
                onChange={(event) =>
                  setStatus(event.target.value as HrRequestStatus)
                }
                className="mt-2 block min-w-[14rem] rounded-md border border-black/15 px-3 py-2 text-sm font-normal normal-case tracking-normal text-[#0B1220]"
              >
                {(Object.keys(hrRequestStatusLabels) as HrRequestStatus[]).map(
                  (item) => (
                    <option key={item} value={item}>
                      {hrRequestStatusLabels[item]}
                    </option>
                  ),
                )}
              </select>
            </label>
            <button
              type="button"
              disabled={pending}
              onClick={saveStatus}
              className="rounded-md border border-black/15 px-4 py-2 text-sm font-medium disabled:opacity-50"
            >
              Save Status
            </button>
          </div>
        </section>
      )}

      {feedback && (
        <p className="text-sm text-emerald-700" role="status">
          {feedback}
        </p>
      )}
      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
