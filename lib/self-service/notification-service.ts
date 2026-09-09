import {
  getUnreadNotificationCount,
  listNotificationsForEmployee,
  markAllNotificationsRead,
  markNotificationRead,
} from "@/lib/self-service/workflow-store";
import {
  countPersistedUnreadNotifications,
  listPersistedNotifications,
  markAllPersistedNotificationsRead,
  markPersistedNotificationRead,
  workforceDataAvailable,
  type NotificationFilter,
} from "@/lib/workforce/operations";
import type { Notification } from "@/types/self-service";

export type { NotificationFilter };

export async function getNotificationsForEmployee(
  employeeId: string,
  filter: NotificationFilter = "ALL",
): Promise<Notification[]> {
  if (workforceDataAvailable()) {
    return listPersistedNotifications(employeeId, filter);
  }
  const items = listNotificationsForEmployee(employeeId);
  if (filter === "UNREAD") return items.filter((item) => !item.readAt);
  if (filter === "READ") return items.filter((item) => Boolean(item.readAt));
  return items;
}

export async function getNotificationUnreadCount(employeeId: string) {
  if (workforceDataAvailable()) {
    return countPersistedUnreadNotifications(employeeId);
  }
  return getUnreadNotificationCount(employeeId);
}

export async function markOneNotificationRead(
  notificationId: string,
  employeeId: string,
) {
  if (workforceDataAvailable()) {
    return markPersistedNotificationRead(employeeId, notificationId);
  }
  return markNotificationRead({ notificationId, employeeId });
}

export async function markEmployeeNotificationsRead(employeeId: string) {
  if (workforceDataAvailable()) {
    return markAllPersistedNotificationsRead(employeeId);
  }
  return markAllNotificationsRead(employeeId);
}

export function notificationTypeLabel(type: string) {
  const labels: Record<string, string> = {
    LEAVE_APPROVED: "Leave",
    LEAVE_REJECTED: "Leave",
    LEAVE_SUBMITTED: "Leave",
    TIMESHEET_APPROVED: "Timesheet",
    TIMESHEET_REJECTED: "Timesheet",
    TIMESHEET_RETURNED: "Timesheet",
    TIMESHEET_SUBMITTED: "Timesheet",
    APPROVAL: "Approval",
    HR_REQUEST: "HR Request",
    HR_REQUEST_CREATED: "HR Request",
    HR_REQUEST_EMPLOYEE_REPLY: "HR Request",
    HR_REQUEST_HR_REPLY: "HR Request",
    HR_REQUEST_STATUS: "HR Request",
    PROFILE_CHANGE_APPROVED: "Profile",
    PROFILE_CHANGE_REJECTED: "Profile",
  };
  return labels[type] ?? "Update";
}
