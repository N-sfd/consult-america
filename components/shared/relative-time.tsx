"use client";

import { useSyncExternalStore } from "react";

import { formatDate, formatRelativeTime } from "@/lib/recruiting/format";

/**
 * formatRelativeTime() calls Date.now(), so computing it during SSR and again
 * on the client first paint can mismatch. useSyncExternalStore serves a stable
 * absolute date on the server and a live relative string on the client.
 */
export default function RelativeTime({ iso }: { iso: string }) {
  const label = useSyncExternalStore(
    () => () => {},
    () => formatRelativeTime(iso),
    () => formatDate(iso),
  );

  return <>{label}</>;
}
