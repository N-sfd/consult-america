"use client";

import { useState, useTransition } from "react";

import { submitExpenseAction } from "@/app/actions/expense-actions";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { expenseCategoryLabels } from "@/types/self-service";
import type { ExpenseCategory } from "@/types/self-service";

const CATEGORIES = Object.keys(expenseCategoryLabels) as ExpenseCategory[];

export default function ExpenseClaimForm() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-md bg-[var(--ca-blue)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--ca-blue-hover)]"
      >
        Submit Expense
      </button>

      <ExpenseClaimSheet
        key={open ? "open" : "closed"}
        open={open}
        onOpenChange={setOpen}
      />
    </>
  );
}

function ExpenseClaimSheet({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [category, setCategory] = useState<ExpenseCategory>(CATEGORIES[0]);
  const [amount, setAmount] = useState<number | "">("");
  const [expenseDate, setExpenseDate] = useState("");
  const [description, setDescription] = useState("");
  const [comments, setComments] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setMessage(null);
    setError(null);

    startTransition(async () => {
      const result = await submitExpenseAction({
        category,
        amount: Number(amount),
        expenseDate,
        description,
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
          <SheetTitle>Submit Expense</SheetTitle>
        </SheetHeader>

        <form
          id="expense-claim-form"
          onSubmit={handleSubmit}
          className="flex flex-1 flex-col gap-4 overflow-y-auto px-4"
        >
          <label className="block text-sm">
            <span className="text-black/55">Category</span>
            <select
              value={category}
              onChange={(event) =>
                setCategory(event.target.value as ExpenseCategory)
              }
              className="mt-1 w-full rounded-md border border-black/15 px-3 py-2 text-sm"
              required
            >
              {CATEGORIES.map((value) => (
                <option key={value} value={value}>
                  {expenseCategoryLabels[value]}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-sm">
            <span className="text-black/55">Amount (USD)</span>
            <input
              type="number"
              min={0.01}
              step={0.01}
              value={amount}
              onChange={(event) =>
                setAmount(
                  event.target.value === "" ? "" : Number(event.target.value),
                )
              }
              className="mt-1 w-full rounded-md border border-black/15 px-3 py-2 text-sm"
              required
            />
          </label>

          <label className="block text-sm">
            <span className="text-black/55">Expense Date</span>
            <input
              type="date"
              value={expenseDate}
              onChange={(event) => setExpenseDate(event.target.value)}
              className="mt-1 w-full rounded-md border border-black/15 px-3 py-2 text-sm"
              required
            />
          </label>

          <label className="block text-sm">
            <span className="text-black/55">Description</span>
            <input
              type="text"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="What was this expense for?"
              className="mt-1 w-full rounded-md border border-black/15 px-3 py-2 text-sm"
              required
            />
          </label>

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
            form="expense-claim-form"
            disabled={pending || !description || !expenseDate || amount === ""}
            className="rounded-md bg-[var(--ca-blue)] px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            Submit Claim
          </button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
