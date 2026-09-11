import type { Metadata } from "next";
import Link from "next/link";

import RetryDeliveryButton from "@/components/workforce/retry-delivery-button";
import { listNotificationDeliveries } from "@/lib/workforce/operations";
import { requireHrActor, requirePermission } from "@/lib/self-service/security";

export const metadata: Metadata = { title: "Notifications" };

type SearchParams = Promise<{ status?: string; channel?: string }>;

const STATUS_FILTERS = ["ALL", "pending", "processing", "sent", "failed", "cancelled"] as const;
const CHANNEL_FILTERS = ["ALL", "in_app", "email"] as const;

function buildHref(status: string, channel: string) {
  const params = new URLSearchParams();
  if (status !== "ALL") params.set("status", status);
  if (channel !== "ALL") params.set("channel", channel);
  const qs = params.toString();
  return qs ? `/workforce/notifications?${qs}` : "/workforce/notifications";
}

function formatTimestamp(value?: string) {
  if (!value) return "—";
  return value.slice(0, 19).replace("T", " ");
}

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-black/5 text-black/60",
  processing: "bg-blue-100 text-blue-800",
  sent: "bg-emerald-100 text-emerald-800",
  failed: "bg-red-100 text-red-700",
  cancelled: "bg-black/5 text-black/40",
};

export default async function WorkforceNotificationsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const actor = await requireHrActor();
  requirePermission(actor, "notifications.manage");

  const params = await searchParams;
  const status = params.status ?? "ALL";
  const channel = params.channel ?? "ALL";

  const deliveries = await listNotificationDeliveries({
    status: status !== "ALL" ? status : undefined,
    channel: channel !== "ALL" ? channel : undefined,
  });

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-6 lg:px-8 lg:py-8">
      <div>
        <p className="text-[0.7rem] uppercase tracking-[0.14em] text-black/40">
          Workforce
        </p>
        <h1 className="mt-2 font-serif text-2xl font-semibold tracking-[-0.03em]">
          Notifications
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-6 text-black/55">
          Delivery state for every notification the system has sent, across
          in-app and email channels. Failed email deliveries can be retried
          immediately.
        </p>
      </div>

      <div className="mt-6 space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-black/40">
          Status
        </p>
        <div className="flex flex-wrap gap-2">
          {STATUS_FILTERS.map((value) => (
            <Link
              key={value}
              href={buildHref(value, channel)}
              className={`rounded-md px-3 py-1.5 text-sm font-medium ${
                status === value
                  ? "bg-[var(--ca-blue)] text-white"
                  : "border border-black/15 text-black/70 hover:bg-black/[0.03]"
              }`}
            >
              {value === "ALL" ? "All statuses" : value}
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-4 space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-black/40">
          Channel
        </p>
        <div className="flex flex-wrap gap-2">
          {CHANNEL_FILTERS.map((value) => (
            <Link
              key={value}
              href={buildHref(status, value)}
              className={`rounded-md px-3 py-1.5 text-sm font-medium ${
                channel === value
                  ? "bg-[var(--ca-blue)] text-white"
                  : "border border-black/15 text-black/70 hover:bg-black/[0.03]"
              }`}
            >
              {value === "ALL" ? "All channels" : value}
            </Link>
          ))}
        </div>
      </div>

      <p className="mt-6 text-sm text-black/45">{deliveries.length} matching deliveries</p>

      <div className="mt-3 overflow-x-auto rounded-lg border border-black/10 bg-white">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="border-b border-black/10 bg-[#F8FAFC] text-xs uppercase tracking-[0.08em] text-black/45">
            <tr>
              <th className="px-4 py-3 font-medium">Recipient</th>
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium">Channel</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Attempts</th>
              <th className="px-4 py-3 font-medium">Last Attempt</th>
              <th className="px-4 py-3 font-medium">Failure Reason</th>
              <th className="px-4 py-3 font-medium">Correlation ID</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {deliveries.map((delivery) => (
              <tr key={delivery.id} className="border-b border-black/5 last:border-b-0">
                <td className="px-4 py-3 text-black/70">{delivery.recipient}</td>
                <td className="px-4 py-3 text-black/70">
                  {delivery.title ?? delivery.notificationType ?? "—"}
                </td>
                <td className="px-4 py-3 text-black/70">{delivery.channel}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-md px-2 py-1 text-xs font-medium ${
                      STATUS_STYLES[delivery.status] ?? "bg-black/5 text-black/60"
                    }`}
                  >
                    {delivery.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-black/70">{delivery.attemptCount}</td>
                <td className="px-4 py-3 text-black/70">
                  {formatTimestamp(delivery.lastAttemptAt)}
                </td>
                <td className="px-4 py-3 text-black/55">{delivery.failureReason ?? "—"}</td>
                <td className="px-4 py-3 font-mono text-xs text-black/40">
                  {delivery.correlationId ?? "—"}
                </td>
                <td className="px-4 py-3">
                  {delivery.channel === "email" && delivery.status === "failed" ? (
                    <RetryDeliveryButton deliveryId={delivery.id} />
                  ) : (
                    <span className="text-black/30">—</span>
                  )}
                </td>
              </tr>
            ))}
            {deliveries.length === 0 && (
              <tr>
                <td colSpan={9} className="px-4 py-8 text-center text-black/50">
                  No deliveries match these filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
