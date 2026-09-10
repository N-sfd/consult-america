"use client";

import { useEffect, useState } from "react";

import { formatDate, formatRelativeTime } from "@/lib/recruiting/format";

/**
 * formatRelativeTime() calls Date.now(), so computing it once during SSR
 * and again during client hydration produces two different strings (e.g.
 * "35 seconds ago" vs "36 seconds ago") and trips a hydration-mismatch
 * error. Render the same SSR-safe absolute date on both the server and the
 * client's first paint, then switch to the live relative string after
 * mount — a normal post-hydration update, not a mismatch.
 */
export default function RelativeTime({ iso }: { iso: string }) {
  const [label, setLabel] = useState<string | null>(null);

  useEffect(() => {
    setLabel(formatRelativeTime(iso));
  }, [iso]);

  return <>{label ?? formatDate(iso)}</>;
}
