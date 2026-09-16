"use client";

import { useState, useTransition } from "react";

import { updateNotificationPreferenceAction } from "@/app/actions/workforce-settings-actions";
import type { NotificationPreferenceRow } from "@/lib/workforce/operations";

export default function NotificationPreferencesForm({
  preferences,
}: {
  preferences: NotificationPreferenceRow[];
}) {
  const [rows, setRows] = useState(preferences);
  const [savingType, setSavingType] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function toggle(type: string, field: "inAppEnabled" | "emailEnabled") {
    const current = rows.find((row) => row.type === type);
    if (!current) return;
    const next = { ...current, [field]: !current[field] };

    setError(null);
    setSavingType(type);
    setRows((prev) => prev.map((row) => (row.type === type ? next : row)));

    startTransition(async () => {
      const result = await updateNotificationPreferenceAction({
        notificationType: type,
        inAppEnabled: next.inAppEnabled,
        emailEnabled: next.emailEnabled,
      });
      setSavingType(null);
      if (!result.ok) {
        setError(result.message);
        setRows((prev) => prev.map((row) => (row.type === type ? current : row)));
      }
    });
  }

  return (
    <div className="rounded-lg border border-[var(--ca-platform-border)] bg-white">
      {error ? (
        <p className="border-b border-[var(--ca-platform-border)] bg-red-50 px-5 py-2 text-sm text-red-700">
          {error}
        </p>
      ) : null}
      <table className="w-full text-left text-sm">
        <thead className="border-b border-[var(--ca-platform-border)] bg-[#F8FAFC] text-xs uppercase tracking-[0.08em] text-black/45">
          <tr>
            <th className="px-5 py-3 font-medium">Notification type</th>
            <th className="px-5 py-3 font-medium">In-app</th>
            <th className="px-5 py-3 font-medium">Email</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.type} className="border-b border-black/5 last:border-b-0">
              <td className="px-5 py-3 font-medium">
                {row.label}
                {pending && savingType === row.type ? (
                  <span className="ml-2 text-xs font-normal text-black/40">Saving…</span>
                ) : null}
              </td>
              <td className="px-5 py-3">
                <input
                  type="checkbox"
                  checked={row.inAppEnabled}
                  onChange={() => toggle(row.type, "inAppEnabled")}
                  disabled={pending && savingType === row.type}
                  className="h-4 w-4"
                  aria-label={`${row.label} in-app notifications`}
                />
              </td>
              <td className="px-5 py-3">
                <input
                  type="checkbox"
                  checked={row.emailEnabled}
                  onChange={() => toggle(row.type, "emailEnabled")}
                  disabled={pending && savingType === row.type}
                  className="h-4 w-4"
                  aria-label={`${row.label} email notifications`}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
