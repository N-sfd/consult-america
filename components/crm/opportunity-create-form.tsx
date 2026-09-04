"use client";

import { useState, useTransition } from "react";

import { createOpportunityAction } from "@/lib/crm/actions";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

export default function OpportunityCreateForm({ accountId }: { accountId: string }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState<number | "">("");
  const [probability, setProbability] = useState(10);
  const [expectedCloseDate, setExpectedCloseDate] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setMessage(null);
    setError(null);

    startTransition(async () => {
      const result = await createOpportunityAction({
        accountId,
        name,
        amount: Number(amount),
        probability,
        expectedCloseDate,
      });
      if (result.ok) {
        setMessage(result.message);
        setTimeout(() => setOpen(false), 900);
      } else {
        setError(result.message);
      }
    });
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-md border border-black/15 px-3 py-1.5 text-xs font-medium hover:bg-black/[0.03]"
      >
        New Opportunity
      </button>

      <Sheet key={open ? "open" : "closed"} open={open} onOpenChange={setOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>New Opportunity</SheetTitle>
          </SheetHeader>

          <form
            id="opportunity-create-form"
            onSubmit={handleSubmit}
            className="flex flex-1 flex-col gap-4 overflow-y-auto px-4"
          >
            <label className="block text-sm">
              <span className="text-black/55">Opportunity Name</span>
              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="mt-1 w-full rounded-md border border-black/15 px-3 py-2 text-sm"
                required
              />
            </label>
            <label className="block text-sm">
              <span className="text-black/55">Amount (USD)</span>
              <input
                type="number"
                min={1}
                step={1000}
                value={amount}
                onChange={(event) =>
                  setAmount(event.target.value === "" ? "" : Number(event.target.value))
                }
                className="mt-1 w-full rounded-md border border-black/15 px-3 py-2 text-sm"
                required
              />
            </label>
            <label className="block text-sm">
              <span className="text-black/55">Probability (%)</span>
              <input
                type="number"
                min={0}
                max={100}
                value={probability}
                onChange={(event) => setProbability(Number(event.target.value))}
                className="mt-1 w-full rounded-md border border-black/15 px-3 py-2 text-sm"
              />
            </label>
            <label className="block text-sm">
              <span className="text-black/55">Expected Close Date</span>
              <input
                type="date"
                value={expectedCloseDate}
                onChange={(event) => setExpectedCloseDate(event.target.value)}
                className="mt-1 w-full rounded-md border border-black/15 px-3 py-2 text-sm"
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
              onClick={() => setOpen(false)}
              className="rounded-md border border-black/15 px-4 py-2 text-sm font-medium hover:bg-black/[0.03]"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="opportunity-create-form"
              disabled={pending || !name.trim() || amount === ""}
              className="rounded-md bg-[var(--ca-blue)] px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
            >
              Create Opportunity
            </button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
}
