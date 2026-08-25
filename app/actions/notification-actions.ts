"use server";

import { revalidatePath } from "next/cache";

import {
  markEmployeeNotificationsRead,
  markOneNotificationRead,
} from "@/lib/self-service/notification-service";
import {
  getEmployeeSession,
  getHrSession,
  getManagerSession,
} from "@/lib/self-service/session";

export type NotificationActionResult = {
  ok: boolean;
  message: string;
};

function resolveSessionEmployeeId(portal: "employee" | "manager" | "hr") {
  if (portal === "manager") return getManagerSession().employeeId;
  if (portal === "hr") return getHrSession().employeeId;
  return getEmployeeSession().employeeId;
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
    const employeeId = resolveSessionEmployeeId(input.portal);
    markOneNotificationRead(input.notificationId, employeeId);
    revalidateNotificationPaths();
    return { ok: true, message: "Marked as read." };
  } catch (error) {
    return {
      ok: false,
      message:
        error instanceof Error
          ? error.message
          : "Unable to mark notification as read.",
    };
  }
}

export async function markAllNotificationsReadAction(input: {
  portal: "employee" | "manager" | "hr";
}): Promise<NotificationActionResult> {
  try {
    const employeeId = resolveSessionEmployeeId(input.portal);
    const count = markEmployeeNotificationsRead(employeeId);
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
      message:
        error instanceof Error
          ? error.message
          : "Unable to mark notifications as read.",
    };
  }
}
