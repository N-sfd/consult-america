import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export type FormFieldProps = {
  label: string;
  htmlFor?: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
};

export function FormField({
  label,
  htmlFor,
  hint,
  error,
  required,
  children,
  className,
}: FormFieldProps) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <label
        htmlFor={htmlFor}
        className="block text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--ca-app-muted)]"
      >
        {label}
        {required ? <span className="ml-0.5 text-[var(--ca-error)]">*</span> : null}
      </label>
      {children}
      {hint && !error ? (
        <p className="text-xs text-[var(--ca-app-muted)]">{hint}</p>
      ) : null}
      {error ? <p className="text-xs text-red-700">{error}</p> : null}
    </div>
  );
}

export type FormSectionProps = {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
  actions?: ReactNode;
};

export function FormSection({
  title,
  description,
  children,
  className,
  actions,
}: FormSectionProps) {
  return (
    <section
      className={cn(
        "space-y-4 border border-[var(--ca-app-border)] bg-white p-4 sm:p-5",
        className,
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[var(--ca-app-border)] pb-3">
        <div className="space-y-1">
          <h2 className="text-sm font-semibold text-[var(--ca-app-ink)]">{title}</h2>
          {description ? (
            <p className="text-sm text-[var(--ca-app-muted)]">{description}</p>
          ) : null}
        </div>
        {actions}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">{children}</div>
    </section>
  );
}
