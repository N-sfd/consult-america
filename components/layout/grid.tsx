import { type ReactNode } from "react";

import { cn } from "@/lib/utils";

export function Shell({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn("ca-shell", className)}>{children}</div>;
}

export function Grid({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn("ca-grid", className)}>{children}</div>;
}
