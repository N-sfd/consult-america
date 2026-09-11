"use server";

import { revalidatePath } from "next/cache";

import { retryNotificationDelivery } from "@/lib/notifications/process-deliveries";
import {
  requireHrActor,
  requirePermission,
  toActionErrorMessage,
} from "@/lib/self-service/security";

export type NotificationAdminActionResult = {
  ok: boolean;
  message: string;
};

export async function retryNotificationDeliveryAction(input: {
  deliveryId: string;
}): Promise<NotificationAdminActionResult> {
  try {
    const actor = await requireHrActor();
    requirePermission(actor, "notifications.manage");

    const result = await retryNotificationDelivery(input.deliveryId);
    revalidatePath("/workforce/notifications");

    if (!result.ok) return { ok: false, message: result.message };
    return { ok: true, message: `Delivery ${result.status}.` };
  } catch (error) {
    return {
      ok: false,
      message: toActionErrorMessage(error, "Unable to retry delivery."),
    };
  }
}
