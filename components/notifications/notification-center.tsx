"use client";

import Link from "next/link";
import { useState, useTransition } from "react";

import {
  markAllNotificationsReadAction,
  markNotificationReadAction,
} from "@/app/actions/notification-actions";
import { notificationTypeLabel } from "@/lib/self-service/notification-service";
import type { Notification } from "@/types/self-service";

interface NotificationCenterProps {
  notifications: Notification[];
  unreadCount: number;
  portal: "employee" | "manager" | "hr";
  activeFilter: "ALL" | "UNREAD" | "READ";
  basePath: string;
}

export default function NotificationCenter({
  notifications,
  unreadCount,
  portal,
  activeFilter,
  basePath,
}: NotificationCenterProps) {
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function markAll() {
    setMessage(null);
    setError(null);
    startTransition(async () => {
      const result = await markAllNotificationsReadAction({ portal });
      if (result.ok) setMessage(result.message);
      else setError(result.message);
    });
  }

  function markOne(notificationId: string) {
    setMessage(null);
    setError(null);
    startTransition(async () => {
      const result = await markNotificationReadAction({
        notificationId,
        portal,
      });
      if (result.ok) setMessage(result.message);
      else setError(result.message);
    });
  }

  const filters = [
    { value: "ALL", label: "All" },
    { value: "UNREAD", label: "Unread" },
    { value: "READ", label: "Read" },
  ] as const;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => {
            const href =
              filter.value === "ALL"
                ? basePath
                : `${basePath}?filter=${filter.value}`;
            const active = activeFilter === filter.value;
            return (
              <Link
                key={filter.value}
                href={href}
                className={`rounded-md px-3 py-1.5 text-sm font-medium ${
                  active
                    ? "bg-[var(--ca-blue)] text-white"
                    : "border border-black/15 text-black/70 hover:bg-black/[0.03]"
                }`}
              >
                {filter.label}
              </Link>
            );
          })}
        </div>

        <button
          type="button"
          disabled={pending || unreadCount === 0}
          onClick={markAll}
          className="rounded-md border border-black/15 px-4 py-2 text-sm font-medium hover:bg-black/[0.03] disabled:opacity-50"
        >
          Mark all as read
        </button>
      </div>

      <ul className="divide-y divide-black/5 overflow-hidden rounded-lg border border-black/10 bg-white">
        {notifications.map((item) => {
          const unread = !item.readAt;
          return (
            <li
              key={item.id}
              className={`px-5 py-4 ${unread ? "bg-[#F8FBFF]" : ""}`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-xs uppercase tracking-[0.1em] text-[var(--ca-blue)]">
                    {notificationTypeLabel(item.type)}
                    {unread ? " · Unread" : ""}
                  </p>
                  <p className="mt-1 font-medium">{item.title}</p>
                  <p className="mt-1 text-sm text-black/55">{item.message}</p>
                  <p className="mt-2 text-xs text-black/35">
                    {item.createdAt.slice(0, 10)}
                    {item.createdAt.slice(11, 16)
                      ? ` · ${item.createdAt.slice(11, 16)} UTC`
                      : ""}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {item.actionUrl && (
                    <Link
                      href={item.actionUrl}
                      onClick={() => {
                        if (unread) markOne(item.id);
                      }}
                      className="rounded-md bg-[var(--ca-blue)] px-3 py-1.5 text-xs font-medium text-white"
                    >
                      Open
                    </Link>
                  )}
                  {unread && (
                    <button
                      type="button"
                      disabled={pending}
                      onClick={() => markOne(item.id)}
                      className="rounded-md border border-black/15 px-3 py-1.5 text-xs font-medium disabled:opacity-50"
                    >
                      Mark read
                    </button>
                  )}
                </div>
              </div>
            </li>
          );
        })}
        {notifications.length === 0 && (
          <li className="px-5 py-8 text-sm text-black/50">
            No notifications
            {activeFilter === "UNREAD"
              ? " unread"
              : activeFilter === "READ"
                ? " marked as read"
                : ""}
            .
          </li>
        )}
      </ul>

      {message && (
        <p className="text-sm text-emerald-700" role="status">
          {message}
        </p>
      )}
      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
