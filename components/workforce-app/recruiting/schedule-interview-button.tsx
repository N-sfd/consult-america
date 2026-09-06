"use client";

import { useState, useTransition } from "react";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { scheduleInterview } from "@/lib/recruiting/actions";
import type { InterviewType } from "@/types/recruiting";

const fieldClass =
  "mt-1.5 h-9 w-full border border-black/10 bg-white px-3 text-sm outline-none focus:border-[var(--ca-blue)]";
const actionButtonClass =
  "mt-2 h-7 w-full border border-black/15 bg-white px-1.5 text-xs font-medium text-black/70 outline-none transition-colors hover:border-[var(--ca-blue)] hover:text-[var(--ca-blue)] disabled:opacity-50";

const TYPES: { value: InterviewType; label: string }[] = [
  { value: "PHONE_SCREEN", label: "Phone screen" },
  { value: "VIDEO", label: "Video" },
  { value: "TECHNICAL", label: "Technical" },
  { value: "PANEL", label: "Panel" },
  { value: "ONSITE", label: "Onsite" },
  { value: "FINAL", label: "Final" },
];

export default function ScheduleInterviewButton({
  applicationId,
  requisitionId,
}: {
  applicationId: string;
  requisitionId: string;
}) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <p className="mt-2 text-[0.65rem] font-medium text-[var(--ca-success,#16865b)]">
        Interview scheduled
      </p>
    );
  }

  function handleSubmit(formData: FormData) {
    const date = String(formData.get("date") ?? "");
    const time = String(formData.get("time") ?? "");
    const interviewType = String(formData.get("interviewType") ?? "VIDEO") as InterviewType;
    const durationMinutes = Number(formData.get("durationMinutes") ?? 60);
    const locationOrLink = String(formData.get("locationOrLink") ?? "") || undefined;

    if (!date || !time) {
      setError("Date and time are required");
      return;
    }

    const scheduledAt = new Date(`${date}T${time}`).toISOString();
    setError(null);
    startTransition(async () => {
      const result = await scheduleInterview({
        applicationId,
        requisitionId,
        interviewType,
        scheduledAt,
        durationMinutes,
        locationOrLink,
      });
      if (result.ok) {
        setDone(true);
        setOpen(false);
      } else {
        setError(result.error);
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<button type="button" className={actionButtonClass} />}>
        Schedule Interview
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Schedule Interview</DialogTitle>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-3">
          <label className="block">
            <span className="text-xs font-medium text-black/60">Type</span>
            <select name="interviewType" className={fieldClass} defaultValue="VIDEO">
              {TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-xs font-medium text-black/60">Date</span>
            <input name="date" type="date" required className={fieldClass} />
          </label>
          <label className="block">
            <span className="text-xs font-medium text-black/60">Time</span>
            <input name="time" type="time" required className={fieldClass} />
          </label>
          <label className="block">
            <span className="text-xs font-medium text-black/60">Duration (minutes)</span>
            <input
              name="durationMinutes"
              type="number"
              min={15}
              defaultValue={60}
              className={fieldClass}
            />
          </label>
          <label className="block">
            <span className="text-xs font-medium text-black/60">
              Location or video link
            </span>
            <input name="locationOrLink" className={fieldClass} />
          </label>
          {error ? <p className="text-xs text-[var(--ca-error)]">{error}</p> : null}
          <DialogFooter>
            <button
              type="submit"
              disabled={pending}
              className="h-9 border border-[var(--ca-blue)] bg-[var(--ca-blue)] px-4 text-sm font-medium text-white disabled:opacity-50"
            >
              {pending ? "Scheduling…" : "Schedule"}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
