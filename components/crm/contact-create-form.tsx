"use client";

import { useState, useTransition } from "react";

import { createContactAction } from "@/lib/crm/actions";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

export default function ContactCreateForm({ accountId }: { accountId: string }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isPrimary, setIsPrimary] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setMessage(null);
    setError(null);

    startTransition(async () => {
      const result = await createContactAction({
        accountId,
        name,
        title,
        email,
        phone,
        isPrimary,
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
        Add Contact
      </button>

      <Sheet key={open ? "open" : "closed"} open={open} onOpenChange={setOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Add Contact</SheetTitle>
          </SheetHeader>

          <form
            id="contact-create-form"
            onSubmit={handleSubmit}
            className="flex flex-1 flex-col gap-4 overflow-y-auto px-4"
          >
            <label className="block text-sm">
              <span className="text-black/55">Name</span>
              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="mt-1 w-full rounded-md border border-black/15 px-3 py-2 text-sm"
                required
              />
            </label>
            <label className="block text-sm">
              <span className="text-black/55">Title</span>
              <input
                type="text"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                className="mt-1 w-full rounded-md border border-black/15 px-3 py-2 text-sm"
              />
            </label>
            <label className="block text-sm">
              <span className="text-black/55">Email</span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="mt-1 w-full rounded-md border border-black/15 px-3 py-2 text-sm"
                required
              />
            </label>
            <label className="block text-sm">
              <span className="text-black/55">Phone</span>
              <input
                type="tel"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                className="mt-1 w-full rounded-md border border-black/15 px-3 py-2 text-sm"
              />
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={isPrimary}
                onChange={(event) => setIsPrimary(event.target.checked)}
                className="h-4 w-4"
              />
              <span>Primary contact</span>
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
              form="contact-create-form"
              disabled={pending || !name.trim() || !email.trim()}
              className="rounded-md bg-[var(--ca-blue)] px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
            >
              Add Contact
            </button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
}
