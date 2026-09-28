import { cn } from "@/lib/utils";

export type ActionBannerProps = {
  variant: "success" | "error";
  message: string;
  className?: string;
};

/**
 * Standard inline banner for action success/failure/retryable-failure
 * results (server action `{ ok, message }` results). Message must already be
 * a safe, user-facing string — see lib/observability/safe-error.ts.
 */
export function ActionBanner({ variant, message, className }: ActionBannerProps) {
  const isSuccess = variant === "success";
  return (
    <p
      role={isSuccess ? "status" : "alert"}
      className={cn(
        "text-xs font-medium",
        isSuccess ? "text-emerald-700" : "text-red-600",
        className,
      )}
    >
      {message}
    </p>
  );
}
