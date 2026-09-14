"use client";

import RouteAccessError from "@/components/shared/route-access-error";

export default function WorkforceAppError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <RouteAccessError reset={reset} />;
}
