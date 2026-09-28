"use client";

import { useState, useTransition } from "react";

import { retryNotificationDeliveryAction } from "@/app/actions/notification-admin-actions";
import { ActionBanner } from "@/components/shared/action-banner";

export default function RetryDeliveryButton({ deliveryId }: { deliveryId: string }) {
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function retry() {
    setMessage(null);
    setError(null);
    startTransition(async () => {
      const result = await retryNotificationDeliveryAction({ deliveryId });
      if (result.ok) setMessage(result.message);
      else setError(result.message);
    });
  }

  return (
    <div className="space-y-1">
      <button
        type="button"
        disabled={pending}
        onClick={retry}
        className="rounded-md border border-black/15 px-3 py-1.5 text-xs font-medium hover:bg-black/[0.03] disabled:opacity-50"
      >
        {pending ? "Retrying…" : "Retry"}
      </button>
      {message && <ActionBanner variant="success" message={message} />}
      {error && <ActionBanner variant="error" message={error} />}
    </div>
  );
}
