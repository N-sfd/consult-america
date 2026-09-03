"use server";

import { revalidatePath } from "next/cache";

import { writeAuditLog } from "@/lib/self-service/audit-store";
import {
  markEmployeeNotificationsRead,
  markOneNotificationRead,
} from "@/lib/self-service/notification-service";
import {
  requireEmployeeActor,
  requireHrActor,
  requireManagerActor,
  requirePermission,
  toActionErrorMessage,
  type PortalActor,
} from "@/lib/self-service/security";

export type NotificationActionResult = {
  ok: boolean;
  message: string;
};

async function resolveActor(
  portal: "employee" | "manager" | "hr",
): Promise<PortalActor> {
  if (portal === "manager") return requireManagerActor();
  if (portal === "hr") return requireHrActor();
  return requireEmployeeActor();
}

function revalidateNotificationPaths() {
  revalidatePath("/employee/notifications");
  revalidatePath("/manager/notifications");
  revalidatePath("/hr/notifications");
  revalidatePath("/employee");
  revalidatePath("/manager");
  revalidatePath("/hr/requests");
}

export async function markNotificationReadAction(input: {
  notificationId: string;
  portal: "employee" | "manager" | "hr";
}): Promise<NotificationActionResult> {
  try {
    const actor = await resolveActor(input.portal);
    requirePermission(actor, "self.notification.read");

    markOneNotificationRead(input.notificationId, actor.session.employeeId);

    writeAuditLog({
      eventType: "NOTIFICATION_READ",
      actorEmployeeId: actor.session.employeeId,
      actorRole: actor.role,
      resourceType: "NOTIFICATION",
      resourceId: input.notificationId,
      summary: "Marked notification as read",
    });

    revalidateNotificationPaths();
    return { ok: true, message: "Marked as read." };
  } catch (error) {
    return {
      ok: false,
      message: toActionErrorMessage(
        error,
        "Unable to mark notification as read.",
      ),
    };
  }
}

export async function markAllNotificationsReadAction(input: {
  portal: "employee" | "manager" | "hr";
}): Promise<NotificationActionResult> {
  try {
    const actor = await resolveActor(input.portal);
    requirePermission(actor, "self.notification.read");

    const count = markEmployeeNotificationsRead(actor.session.employeeId);

    writeAuditLog({
      eventType: "NOTIFICATION_MARK_ALL_READ",
      actorEmployeeId: actor.session.employeeId,
      actorRole: actor.role,
      summary: `Marked ${count} notifications as read`,
    });

    revalidateNotificationPaths();
    return {
      ok: true,
      message:
        count === 0
          ? "No unread notifications."
          : `Marked ${count} notification${count === 1 ? "" : "s"} as read.`,
    };
  } catch (error) {
    return {
      ok: false,
      message: toActionErrorMessage(
        error,
        "Unable to mark notifications as read.",
      ),
    };
  }
}
