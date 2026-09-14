import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import { EmptyState } from "@/components/shared/empty-state";

export type DataTableColumn<T> = {
  key: string;
  header: ReactNode;
  className?: string;
  headerClassName?: string;
  cell: (row: T) => ReactNode;
};

export type DataTableProps<T> = {
  columns: DataTableColumn<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyAction?: ReactNode;
  className?: string;
  dense?: boolean;
};

/**
 * Dense operational table shell. Prefer drawers/modals for row actions.
 */
export function DataTable<T>({
  columns,
  rows,
  rowKey,
  emptyTitle = "No records",
  emptyDescription,
  emptyAction,
  className,
  dense = true,
}: DataTableProps<T>) {
  if (rows.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        action={emptyAction}
        compact
        className={className}
      />
    );
  }

  return (
    <div
      className={cn(
        "overflow-x-auto border border-[var(--ca-app-border)] bg-white",
        className,
      )}
    >
      <table className="w-full min-w-[640px] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-[var(--ca-app-border)] bg-[var(--ca-app-canvas)]">
            {columns.map((col) => (
              <th
                key={col.key}
                className={cn(
                  "px-3 font-semibold uppercase tracking-[0.08em] text-[11px] text-[var(--ca-app-muted)]",
                  dense ? "py-2.5" : "py-3",
                  col.headerClassName,
                )}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={rowKey(row)}
              className="border-b border-[var(--ca-app-border)]/70 last:border-b-0 hover:bg-[var(--ca-app-selected)]"
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={cn(
                    "px-3 align-middle text-[var(--ca-app-ink)]",
                    dense ? "py-2.5" : "py-3.5",
                    col.className,
                  )}
                >
                  {col.cell(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
