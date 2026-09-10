"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import {
  candidateAcceptOffer,
  candidateDeclineOffer,
} from "@/lib/recruiting/actions";
import ConfirmDialog from "@/components/candidate/confirm-dialog";

export default function CandidateOfferActions({
  applicationId,
}: {
  applicationId: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [confirmingDecline, setConfirmingDecline] = useState(false);

  function onDecline() {
    setError(null);
    startTransition(async () => {
      const result = await candidateDeclineOffer(applicationId);
      setConfirmingDecline(false);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      router.refresh();
    });
  }

  return (
    <div>
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          disabled={pending}
          className="inline-flex h-10 items-center rounded-lg bg-[var(--ca-platform-red)] px-4 text-sm font-semibold text-white disabled:opacity-60"
          onClick={() => {
            setError(null);
            startTransition(async () => {
              const result = await candidateAcceptOffer(applicationId);
              if (!result.ok) {
                setError(result.error);
                return;
              }
              router.refresh();
            });
          }}
        >
          {pending ? "Saving…" : "Accept Offer"}
        </button>
        <button
          type="button"
          disabled={pending}
          className="inline-flex h-10 items-center rounded-lg border border-black/15 px-4 text-sm font-semibold text-black/70 disabled:opacity-60"
          onClick={() => setConfirmingDecline(true)}
        >
          Decline Offer
        </button>
      </div>
      {error ? <p className="mt-2 text-sm text-red-700">{error}</p> : null}
      <ConfirmDialog
        open={confirmingDecline}
        onOpenChange={setConfirmingDecline}
        title="Decline this offer?"
        description="This cannot be undone. The recruiting team will be notified that you've declined."
        confirmLabel="Decline Offer"
        pending={pending}
        onConfirm={onDecline}
      />
    </div>
  );
}
