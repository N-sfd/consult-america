import type { Metadata } from "next";

import NotificationCenter from "@/components/notifications/notification-center";
import {
  getNotificationUnreadCount,
  getNotificationsForEmployee,
  type NotificationFilter,
} from "@/lib/self-service/notification-service";
import { getHrSession } from "@/lib/self-service/session";

export const metadata: Metadata = {
  title: "Notifications | ConsultAmerica",
};

type SearchParams = Promise<{ filter?: string }>;

function parseFilter(value?: string): NotificationFilter {
  if (value === "UNREAD" || value === "READ" || value === "ALL") return value;
  return "ALL";
}

export default async function HrNotificationsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const session = await getHrSession();
  const params = await searchParams;
  const filter = parseFilter(params.filter);
  const notifications = getNotificationsForEmployee(
    session.employeeId,
    filter,
  );
  const unreadCount = getNotificationUnreadCount(session.employeeId);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-[-0.04em]">
          Notifications
        </h1>
        <p className="mt-2 text-black/55">
          New HR requests and employee replies.
          {unreadCount > 0 ? ` ${unreadCount} unread.` : " You are caught up."}
        </p>
      </div>

      <NotificationCenter
        notifications={notifications}
        unreadCount={unreadCount}
        portal="hr"
        activeFilter={filter}
        basePath="/hr/notifications"
      />
    </div>
  );
}
