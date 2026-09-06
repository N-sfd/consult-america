"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";

import {
  candidateAcceptOffer,
  candidateDeclineOffer,
} from "@/lib/recruiting/actions";

export default function CandidateOfferActions({
  applicationId,
}: {
  applicationId: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex flex-wrap gap-3">
      <button
        type="button"
        disabled={pending}
        className="inline-flex h-10 items-center rounded-lg bg-[#B83A3A] px-4 text-sm font-semibold text-white disabled:opacity-60"
        onClick={() => {
          startTransition(async () => {
            const result = await candidateAcceptOffer(applicationId);
            if (!result.ok) {
              window.alert(result.error);
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
        onClick={() => {
          if (!window.confirm("Decline this offer?")) return;
          startTransition(async () => {
            const result = await candidateDeclineOffer(applicationId);
            if (!result.ok) {
              window.alert(result.error);
              return;
            }
            router.refresh();
          });
        }}
      >
        Decline Offer
      </button>
    </div>
  );
}
