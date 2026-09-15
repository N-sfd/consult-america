"use client";

import { useState, useTransition } from "react";

import { retryClientFlowEmailAction } from "@/app/actions/contact-actions";
import type { ClientFlowEmailMessage } from "@/lib/clientflow/types";
import { StatusBadge } from "@/components/shared";

const statusTone: Record<string, "neutral" | "success" | "warning" | "danger" | "info"> = {
  queued: "info",
  retrying: "warning",
  sent: "success",
  failed: "danger",
  simulated: "neutral",
};

export function ClientFlowEmailRetryButton({ messageId }: { messageId: string }) {
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        disabled={pending}
        className="rounded-md border border-black/15 px-2.5 py-1 text-xs font-medium text-black/70 hover:bg-black/[0.03] disabled:opacity-50"
        onClick={() => {
          setMessage(null);
          startTransition(async () => {
            const result = await retryClientFlowEmailAction(messageId);
            setMessage(result.message);
          });
        }}
      >
        {pending ? "Retrying…" : "Retry send"}
      </button>
      {message ? <p className="text-[0.65rem] text-black/50">{message}</p> : null}
    </div>
  );
}

export function ClientFlowEmailRows({
  emails,
  showRetry,
}: {
  emails: ClientFlowEmailMessage[];
  showRetry?: boolean;
}) {
  if (emails.length === 0) {
    return <p className="text-sm text-black/50">No email messages yet.</p>;
  }

  return (
    <ul className="divide-y divide-black/5 rounded-lg border border-black/10 bg-white">
      {emails.map((email) => (
        <li key={email.id} className="flex flex-wrap items-start justify-between gap-3 px-4 py-3">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge tone={statusTone[email.status] ?? "neutral"}>
                {email.status}
              </StatusBadge>
              <p className="truncate text-sm font-medium text-black/80">{email.subject}</p>
            </div>
            <p className="mt-1 text-xs text-black/45">
              {email.purpose.replaceAll("_", " ")} · to {email.toAddress} · attempts{" "}
              {email.attemptCount}/{email.maxAttempts}
              {email.provider ? ` · provider ${email.provider}` : ""}
              {email.templateKey
                ? ` · template ${email.templateKey}${
                    email.templateVersion != null ? ` v${email.templateVersion}` : ""
                  }`
                : ""}
            </p>
            {email.lastError ? (
              <p className="mt-1 text-xs text-red-700">Error: {email.lastError}</p>
            ) : null}
          </div>
          {showRetry && email.status !== "sent" && !email.providerMessageId ? (
            <ClientFlowEmailRetryButton messageId={email.id} />
          ) : null}
        </li>
      ))}
    </ul>
  );
}
