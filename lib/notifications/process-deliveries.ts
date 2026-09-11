import type { SupabaseClient } from "@supabase/supabase-js";

import { getSupabaseServiceClient } from "@/app/lib/supabase/server";
import { sendNotificationEmail } from "@/lib/notifications/email";
import { templateForNotificationType } from "@/lib/notifications/templates";

export type ProcessDeliveriesResult = {
  processed: number;
  sent: number;
  failed: number;
  skipped: number;
};

type DeliveryRow = {
  id: string;
  notification_id: string;
  recipient: string;
  status: string;
  provider_message_id: string | null;
  attempt_count: number;
};

type NotificationRow = {
  id: string;
  notification_type: string;
  title: string;
  message: string;
  entity_type: string | null;
  entity_id: string | null;
};

type DeliveryOutcome =
  | { ok: true; status: "sent" | "skipped" | "cancelled" }
  | { ok: false; status: "failed"; message: string };

/**
 * Processes exactly one delivery row against its notification, updating
 * notification_deliveries in place. Shared by the batch processor below and
 * the single-delivery retry action, so both go through identical logic.
 */
async function processOneDelivery(
  client: SupabaseClient,
  delivery: DeliveryRow,
  notification: NotificationRow | undefined,
): Promise<DeliveryOutcome> {
  if (delivery.provider_message_id) {
    return { ok: true, status: "skipped" };
  }

  const template = notification ? templateForNotificationType(notification.notification_type) : null;

  if (!notification || !template) {
    await client
      .from("notification_deliveries")
      .update({
        status: "cancelled",
        last_attempt_at: new Date().toISOString(),
        failure_reason: "No email template for this notification type",
      })
      .eq("id", delivery.id);
    return { ok: true, status: "cancelled" };
  }

  await client
    .from("notification_deliveries")
    .update({ status: "processing", last_attempt_at: new Date().toISOString() })
    .eq("id", delivery.id);

  const outcome = await sendNotificationEmail({
    template,
    recipient: delivery.recipient,
    data: { title: notification.title, message: notification.message, actionUrl: undefined },
  });

  if (outcome.ok) {
    await client
      .from("notification_deliveries")
      .update({
        status: "sent",
        sent_at: new Date().toISOString(),
        provider_message_id: outcome.providerMessageId ?? null,
        attempt_count: delivery.attempt_count + 1,
      })
      .eq("id", delivery.id);
    return { ok: true, status: "sent" };
  }

  await client
    .from("notification_deliveries")
    .update({
      status: "failed",
      failed_at: new Date().toISOString(),
      failure_reason: outcome.error,
      attempt_count: delivery.attempt_count + 1,
    })
    .eq("id", delivery.id);
  return { ok: false, status: "failed", message: outcome.error };
}

/**
 * Drains pending (and previously failed) email deliveries. This is the only
 * place that ever calls the email provider — never inside the request/DB
 * transaction that created the notification, so a slow or unavailable
 * provider can never roll back an approved leave request, a submitted
 * timesheet, or any other business action.
 *
 * Idempotent: a delivery already 'sent' is never revisited (the caller reads
 * rows filtered to pending/failed only), and a delivery with a
 * provider_message_id already recorded is treated as sent rather than
 * resent, so retrying this function is always safe.
 */
export async function processPendingEmailDeliveries(limit = 25): Promise<ProcessDeliveriesResult> {
  const client = getSupabaseServiceClient();
  const result: ProcessDeliveriesResult = { processed: 0, sent: 0, failed: 0, skipped: 0 };
  if (!client) return result;

  const { data: deliveries, error } = await client
    .from("notification_deliveries")
    .select("id, notification_id, recipient, status, provider_message_id, attempt_count")
    .eq("channel", "email")
    .in("status", ["pending", "failed"])
    .order("created_at", { ascending: true })
    .limit(limit);

  if (error) throw new Error(error.message);
  if (!deliveries || deliveries.length === 0) return result;

  const notificationIds = [...new Set(deliveries.map((d) => d.notification_id as string))];
  const { data: notifications, error: notifError } = await client
    .from("notifications")
    .select("id, notification_type, title, message, entity_type, entity_id")
    .in("id", notificationIds);
  if (notifError) throw new Error(notifError.message);

  const notificationById = new Map(
    (notifications ?? []).map((n) => [n.id as string, n as NotificationRow]),
  );

  for (const delivery of deliveries as DeliveryRow[]) {
    result.processed += 1;
    const notification = notificationById.get(delivery.notification_id);
    const outcome = await processOneDelivery(client, delivery, notification);
    if (outcome.status === "sent") result.sent += 1;
    else if (outcome.status === "failed") result.failed += 1;
    else result.skipped += 1;
  }

  return result;
}

/**
 * Retries exactly one delivery immediately. There's no scheduler in this
 * codebase to pick up a row merely reset to 'pending', so the
 * /workforce/notifications Retry button needs an outcome right away.
 */
export async function retryNotificationDelivery(
  deliveryId: string,
): Promise<{ ok: true; status: string } | { ok: false; message: string }> {
  const client = getSupabaseServiceClient();
  if (!client) {
    return { ok: false, message: "Notification delivery requires the connected environment." };
  }

  const { data: delivery, error } = await client
    .from("notification_deliveries")
    .select("id, notification_id, recipient, status, provider_message_id, attempt_count, channel")
    .eq("id", deliveryId)
    .maybeSingle();
  if (error) return { ok: false, message: error.message };
  if (!delivery) return { ok: false, message: "Delivery not found." };
  if (delivery.channel !== "email") {
    return { ok: false, message: "Only email deliveries can be retried." };
  }

  const { data: notification, error: notifError } = await client
    .from("notifications")
    .select("id, notification_type, title, message, entity_type, entity_id")
    .eq("id", delivery.notification_id)
    .maybeSingle();
  if (notifError) return { ok: false, message: notifError.message };

  const outcome = await processOneDelivery(
    client,
    delivery as DeliveryRow,
    (notification as NotificationRow | null) ?? undefined,
  );
  if (outcome.ok) return { ok: true, status: outcome.status };
  return { ok: false, message: outcome.message };
}
