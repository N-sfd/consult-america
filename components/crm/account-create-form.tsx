"use client";

import { useState, useTransition } from "react";

import { createAccountAction } from "@/lib/crm/actions";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { accountStatusLabels, accountTierLabels } from "@/types/crm";
import type { AccountStatus, AccountTier } from "@/types/crm";

const TIERS = Object.keys(accountTierLabels) as AccountTier[];
const STATUSES = Object.keys(accountStatusLabels) as AccountStatus[];

export default function AccountCreateForm() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-md bg-[var(--ca-blue)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--ca-blue-hover)]"
      >
        New Account
      </button>

      <AccountCreateSheet key={open ? "open" : "closed"} open={open} onOpenChange={setOpen} />
    </>
  );
}

function AccountCreateSheet({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [name, setName] = useState("");
  const [industry, setIndustry] = useState("");
  const [website, setWebsite] = useState("");
  const [tier, setTier] = useState<AccountTier>("MID_MARKET");
  const [status, setStatus] = useState<AccountStatus>("PROSPECT");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setMessage(null);
    setError(null);

    startTransition(async () => {
      const result = await createAccountAction({ name, industry, website, tier, status });
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
          <SheetTitle>New Account</SheetTitle>
        </SheetHeader>

        <form
          id="account-create-form"
          onSubmit={handleSubmit}
          className="flex flex-1 flex-col gap-4 overflow-y-auto px-4"
        >
          <label className="block text-sm">
            <span className="text-black/55">Account Name</span>
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="mt-1 w-full rounded-md border border-black/15 px-3 py-2 text-sm"
              required
            />
          </label>

          <label className="block text-sm">
            <span className="text-black/55">Industry</span>
            <input
              type="text"
              value={industry}
              onChange={(event) => setIndustry(event.target.value)}
              className="mt-1 w-full rounded-md border border-black/15 px-3 py-2 text-sm"
            />
          </label>

          <label className="block text-sm">
            <span className="text-black/55">Website</span>
            <input
              type="text"
              value={website}
              onChange={(event) => setWebsite(event.target.value)}
              placeholder="example.com"
              className="mt-1 w-full rounded-md border border-black/15 px-3 py-2 text-sm"
            />
          </label>

          <label className="block text-sm">
            <span className="text-black/55">Tier</span>
            <select
              value={tier}
              onChange={(event) => setTier(event.target.value as AccountTier)}
              className="mt-1 w-full rounded-md border border-black/15 px-3 py-2 text-sm"
            >
              {TIERS.map((value) => (
                <option key={value} value={value}>
                  {accountTierLabels[value]}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-sm">
            <span className="text-black/55">Status</span>
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value as AccountStatus)}
              className="mt-1 w-full rounded-md border border-black/15 px-3 py-2 text-sm"
            >
              {STATUSES.map((value) => (
                <option key={value} value={value}>
                  {accountStatusLabels[value]}
                </option>
              ))}
            </select>
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
            form="account-create-form"
            disabled={pending || !name.trim()}
            className="rounded-md bg-[var(--ca-blue)] px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            Create Account
          </button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
