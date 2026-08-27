"use client";

import { useMemo, useState, useTransition } from "react";

import { submitLeaveAction } from "@/app/actions/leave-actions";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { LeaveBalance, LeaveType } from "@/types/self-service";

interface LeaveRequestFormProps {
  types: LeaveType[];
  balances: LeaveBalance[];
}

export default function LeaveRequestForm({
  types,
  balances,
}: LeaveRequestFormProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-md bg-[var(--ca-blue)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--ca-blue-hover)]"
      >
        Request Leave
      </button>

      <LeaveRequestSheet
        key={open ? "open" : "closed"}
        open={open}
        onOpenChange={setOpen}
        types={types}
        balances={balances}
      />
    </>
  );
}

function LeaveRequestSheet({
  open,
  onOpenChange,
  types,
  balances,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  types: LeaveType[];
  balances: LeaveBalance[];
}) {
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

  const duration = useMemo(() => {
    if (partialDay) return hours;
    if (!startDate || !endDate || endDate < startDate) return 0;
    let count = 0;
    const cursor = new Date(`${startDate}T00:00:00`);
    const end = new Date(`${endDate}T00:00:00`);
    while (cursor <= end) {
      const day = cursor.getDay();
      if (day !== 0 && day !== 6) count += 1;
      cursor.setDate(cursor.getDate() + 1);
    }
    return count * 8;
  }, [partialDay, hours, startDate, endDate]);

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
        setTimeout(() => onOpenChange(false), 900);
      } else {
        setError(result.message);
      }
    });
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Request Leave</SheetTitle>
        </SheetHeader>

        <form
          id="leave-request-form"
          onSubmit={handleSubmit}
          className="flex flex-1 flex-col gap-4 overflow-y-auto px-4"
        >
          <label className="block text-sm">
            <span className="text-black/55">Leave Type</span>
            <select
              value={leaveTypeId}
              onChange={(event) => setLeaveTypeId(event.target.value)}
              className="mt-1 w-full rounded-md border border-black/15 px-3 py-2 text-sm"
              required
            >
              {types.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
            <span className="mt-1 block text-xs text-black/45">
              {selectedBalance
                ? `${selectedBalance.available} hours available`
                : "No balance on file for this type"}
            </span>
          </label>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={partialDay}
              onChange={(event) => {
                setPartialDay(event.target.checked);
                if (event.target.checked) setEndDate(startDate);
              }}
              className="h-4 w-4"
            />
            <span>
              Partial day
              <span className="ml-1 text-xs text-black/45">
                (single date, custom hours)
              </span>
            </span>
          </label>

          <label className="block text-sm">
            <span className="text-black/55">Start Date</span>
            <input
              type="date"
              value={startDate}
              onChange={(event) => {
                setStartDate(event.target.value);
                if (partialDay) setEndDate(event.target.value);
              }}
              className="mt-1 w-full rounded-md border border-black/15 px-3 py-2 text-sm"
              required
            />
          </label>

          <label className="block text-sm">
            <span className="text-black/55">End Date</span>
            <input
              type="date"
              value={partialDay ? startDate : endDate}
              onChange={(event) => setEndDate(event.target.value)}
              disabled={partialDay}
              className="mt-1 w-full rounded-md border border-black/15 px-3 py-2 text-sm disabled:bg-black/[0.03]"
              required={!partialDay}
            />
          </label>

          {partialDay && (
            <label className="block text-sm">
              <span className="text-black/55">Hours</span>
              <input
                type="number"
                min={0.5}
                max={8}
                step={0.5}
                value={hours}
                onChange={(event) => setHours(Number(event.target.value))}
                className="mt-1 w-full rounded-md border border-black/15 px-3 py-2 text-sm"
                required
              />
            </label>
          )}

          <div className="rounded-md bg-[#F8FAFC] px-3 py-2 text-sm">
            <span className="text-black/55">Duration</span>
            <span className="ml-2 font-medium">{duration} hours</span>
          </div>

          <label className="block text-sm">
            <span className="text-black/55">Comments</span>
            <textarea
              value={comments}
              onChange={(event) => setComments(event.target.value)}
              rows={3}
              className="mt-1 w-full rounded-md border border-black/15 px-3 py-2 text-sm"
              placeholder="Optional note for your manager"
            />
          </label>

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
        </form>

        <SheetFooter className="flex-row justify-end gap-2">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="rounded-md border border-black/15 px-4 py-2 text-sm font-medium hover:bg-black/[0.03]"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="leave-request-form"
            disabled={pending || !leaveTypeId}
            className="rounded-md bg-[var(--ca-blue)] px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            Submit Request
          </button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
