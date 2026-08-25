"use client";

import { useMemo, useState, useTransition } from "react";

import { submitLeaveAction } from "@/app/actions/leave-actions";
import type { LeaveBalance, LeaveType } from "@/types/self-service";

interface LeaveRequestFormProps {
  types: LeaveType[];
  balances: LeaveBalance[];
}

export default function LeaveRequestForm({
  types,
  balances,
}: LeaveRequestFormProps) {
  const defaultType = types[0]?.id ?? "";
  const [leaveTypeId, setLeaveTypeId] = useState(defaultType);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [partialDay, setPartialDay] = useState(false);
  const [hours, setHours] = useState(8);
  const [comments, setComments] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const selectedBalance = useMemo(
    () => balances.find((item) => item.leaveTypeId === leaveTypeId),
    [balances, leaveTypeId],
  );

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setMessage(null);
    setError(null);

    startTransition(async () => {
      const result = await submitLeaveAction({
        leaveTypeId,
        startDate,
        endDate: partialDay ? startDate : endDate,
        partialDay,
        hours: partialDay ? hours : undefined,
        comments,
      });
      if (result.ok) {
        setMessage(result.message);
        setComments("");
        setStartDate("");
        setEndDate("");
        setPartialDay(false);
        setHours(8);
      } else {
        setError(result.message);
      }
    });
  }

  return (
    <section className="rounded-lg border border-black/10 bg-white p-6">
      <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-black/40">
        Request Leave
      </h2>

      <form onSubmit={handleSubmit} className="mt-5 grid gap-4 md:grid-cols-2">
        <label className="block text-xs uppercase tracking-[0.1em] text-black/40">
          Leave Type
          <select
            value={leaveTypeId}
            onChange={(event) => setLeaveTypeId(event.target.value)}
            className="mt-2 w-full rounded-md border border-black/15 px-3 py-2 text-sm font-normal normal-case tracking-normal text-[#0B1220]"
            required
          >
            {types.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
          <span className="mt-1 block text-[0.7rem] normal-case tracking-normal text-black/45">
            {selectedBalance
              ? `${selectedBalance.available} hours available`
              : "No balance on file for this type"}
          </span>
        </label>

        <label className="flex items-end gap-3 text-sm text-[#0B1220]">
          <input
            type="checkbox"
            checked={partialDay}
            onChange={(event) => {
              setPartialDay(event.target.checked);
              if (event.target.checked) setEndDate(startDate);
            }}
            className="mb-2.5 h-4 w-4"
          />
          <span>
            Partial day
            <span className="mt-1 block text-xs text-black/45">
              Single date with custom hours
            </span>
          </span>
        </label>

        <label className="block text-xs uppercase tracking-[0.1em] text-black/40">
          Start Date
          <input
            type="date"
            value={startDate}
            onChange={(event) => {
              setStartDate(event.target.value);
              if (partialDay) setEndDate(event.target.value);
            }}
            className="mt-2 w-full rounded-md border border-black/15 px-3 py-2 text-sm font-normal normal-case tracking-normal text-[#0B1220]"
            required
          />
        </label>

        <label className="block text-xs uppercase tracking-[0.1em] text-black/40">
          End Date
          <input
            type="date"
            value={partialDay ? startDate : endDate}
            onChange={(event) => setEndDate(event.target.value)}
            disabled={partialDay}
            className="mt-2 w-full rounded-md border border-black/15 px-3 py-2 text-sm font-normal normal-case tracking-normal text-[#0B1220] disabled:bg-black/[0.03]"
            required={!partialDay}
          />
        </label>

        {partialDay && (
          <label className="block text-xs uppercase tracking-[0.1em] text-black/40">
            Hours
            <input
              type="number"
              min={0.5}
              max={8}
              step={0.5}
              value={hours}
              onChange={(event) => setHours(Number(event.target.value))}
              className="mt-2 w-full rounded-md border border-black/15 px-3 py-2 text-sm font-normal normal-case tracking-normal text-[#0B1220]"
              required
            />
          </label>
        )}

        <label className="block text-xs uppercase tracking-[0.1em] text-black/40 md:col-span-2">
          Comments
          <textarea
            value={comments}
            onChange={(event) => setComments(event.target.value)}
            rows={3}
            className="mt-2 w-full rounded-md border border-black/15 px-3 py-2 text-sm font-normal normal-case tracking-normal text-[#0B1220]"
            placeholder="Optional note for your manager"
          />
        </label>

        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={pending || !leaveTypeId}
            className="rounded-md bg-[var(--ca-blue)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--ca-blue-hover)] disabled:opacity-50"
          >
            Submit Leave Request
          </button>
        </div>
      </form>

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
    </section>
  );
}
