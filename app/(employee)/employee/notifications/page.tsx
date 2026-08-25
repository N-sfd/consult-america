import type { Metadata } from "next";

import { getNotifications } from "@/lib/self-service";
import { getEmployeeSession } from "@/lib/self-service/session";

export const metadata: Metadata = {
  title: "Notifications | ConsultAmerica",
};

export default function EmployeeNotificationsPage() {
  const session = getEmployeeSession();
  const notifications = getNotifications(session.employeeId);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-[-0.04em]">
          Notifications
        </h1>
        <p className="mt-2 text-black/55">
          Database-backed notification center foundation. Real-time delivery
          comes later.
        </p>
      </div>

      <ul className="divide-y divide-black/5 overflow-hidden rounded-lg border border-black/10 bg-white">
        {notifications.map((item) => (
          <li key={item.id} className="px-5 py-4">
            <p className="font-medium">{item.title}</p>
            <p className="mt-1 text-sm text-black/55">{item.message}</p>
            <p className="mt-2 text-xs text-black/35">
              {item.createdAt.slice(0, 10)}
              {item.readAt ? "" : " · Unread"}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
