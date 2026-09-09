import { getSupabaseServiceClient } from "@/app/lib/supabase/server";
import { sendNotificationEmail } from "@/lib/notifications/email";
import { templateForNotificationType } from "@/lib/notifications/templates";

export type ProcessDeliveriesResult = {
  processed: number;
  sent: number;
  failed: number;
  skipped: number;
};

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

  const notificationById = new Map((notifications ?? []).map((n) => [n.id as string, n]));

  for (const delivery of deliveries) {
    result.processed += 1;

    if (delivery.provider_message_id) {
      result.skipped += 1;
      continue;
    }

    const notification = notificationById.get(delivery.notification_id as string);
    const template = notification ? templateForNotificationType(notification.notification_type as string) : null;

    if (!notification || !template) {
      await client
        .from("notification_deliveries")
        .update({
          status: "cancelled",
          last_attempt_at: new Date().toISOString(),
          failure_reason: "No email template for this notification type",
        })
        .eq("id", delivery.id);
      result.skipped += 1;
      continue;
    }

    await client
      .from("notification_deliveries")
      .update({ status: "processing", last_attempt_at: new Date().toISOString() })
      .eq("id", delivery.id);

    const outcome = await sendNotificationEmail({
      template,
      recipient: delivery.recipient as string,
      data: {
        title: notification.title as string,
        message: notification.message as string,
        actionUrl: undefined,
      },
    });

    if (outcome.ok) {
      await client
        .from("notification_deliveries")
        .update({
          status: "sent",
          sent_at: new Date().toISOString(),
          provider_message_id: outcome.providerMessageId ?? null,
          attempt_count: (delivery.attempt_count as number) + 1,
        })
        .eq("id", delivery.id);
      result.sent += 1;
    } else {
      await client
        .from("notification_deliveries")
        .update({
          status: "failed",
          failed_at: new Date().toISOString(),
          failure_reason: outcome.error,
          attempt_count: (delivery.attempt_count as number) + 1,
        })
        .eq("id", delivery.id);
      result.failed += 1;
    }
  }

  return result;
}
