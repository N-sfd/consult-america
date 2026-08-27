"use client";

import { useMemo, useState, useTransition } from "react";

import {
  acknowledgeDocumentAction,
  viewEmployeeDocumentAction,
} from "@/app/actions/document-actions";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsList, TabsTab } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
  documentCategoryLabels,
  documentStatusLabels,
  getDocumentStatus,
  type DocumentCategory,
  type DocumentStatus,
  type EmployeeDocumentView,
} from "@/types/self-service";

const CATEGORY_FILTERS: Array<{ value: "ALL" | DocumentCategory; label: string }> = [
  { value: "ALL", label: "All" },
  { value: "EMPLOYMENT", label: documentCategoryLabels.EMPLOYMENT },
  { value: "POLICY", label: documentCategoryLabels.POLICY },
  { value: "PERSONAL", label: documentCategoryLabels.PERSONAL },
  { value: "CERTIFICATION", label: documentCategoryLabels.CERTIFICATION },
];

const STATUS_STYLES: Record<DocumentStatus, string> = {
  AVAILABLE: "bg-black/5 text-black/60",
  ACTION_REQUIRED: "bg-amber-100 text-amber-800",
  ACKNOWLEDGED: "bg-emerald-100 text-emerald-800",
  EXPIRING_SOON: "bg-amber-100 text-amber-800",
  EXPIRED: "bg-red-100 text-red-700",
};

/** Date-only strings ("YYYY-MM-DD") must parse as local dates, not UTC
 * midnight, or they render one day early in negative-UTC timezones. */
function formatDate(value?: string) {
  if (!value) return "—";
  const dateOnly = /^\d{4}-\d{2}-\d{2}$/.test(value);
  const date = dateOnly ? new Date(`${value}T00:00:00`) : new Date(value);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function EmployeeDocumentList({
  documents,
}: {
  documents: EmployeeDocumentView[];
}) {
  const [category, setCategory] = useState<"ALL" | DocumentCategory>("ALL");
  const [selected, setSelected] = useState<EmployeeDocumentView | null>(null);

  const filtered = useMemo(
    () =>
      category === "ALL"
        ? documents
        : documents.filter((doc) => doc.category === category),
    [documents, category],
  );

  return (
    <div className="space-y-4">
      <Tabs
        value={category}
        onValueChange={(value) => setCategory(value as "ALL" | DocumentCategory)}
      >
        <TabsList>
          {CATEGORY_FILTERS.map((filter) => (
            <TabsTab key={filter.value} value={filter.value}>
              {filter.label}
            </TabsTab>
          ))}
        </TabsList>
      </Tabs>

      <div className="overflow-x-auto rounded-lg border border-black/10 bg-white">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead className="border-b border-black/10 bg-[#F8FAFC] text-xs uppercase tracking-[0.08em] text-black/45">
            <tr>
              <th className="px-4 py-3 font-medium">Document</th>
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((doc) => {
              const status = getDocumentStatus(doc);
              return (
                <tr
                  key={doc.id}
                  onClick={() => setSelected(doc)}
                  className="cursor-pointer border-b border-black/5 last:border-b-0 hover:bg-[var(--ca-app-bg,#f6f8fb)]"
                >
                  <td className="px-4 py-4 font-medium">{doc.documentType}</td>
                  <td className="px-4 py-4 text-black/55">
                    {documentCategoryLabels[doc.category]}
                  </td>
                  <td className="px-4 py-4 text-black/55">
                    {formatDate(doc.effectiveDate ?? doc.uploadedAt)}
                  </td>
                  <td className="px-4 py-4">
                    <Badge
                      variant="outline"
                      className={cn("border-transparent", STATUS_STYLES[status])}
                    >
                      {documentStatusLabels[status]}
                    </Badge>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-black/50">
                  No documents in this category.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-black/40">
        Document access is checked server-side. Changing a document id cannot
        reveal another employee&apos;s file.
      </p>

      <DocumentDetailSheet
        key={selected?.id ?? "empty"}
        document={selected}
        onOpenChange={(open) => {
          if (!open) setSelected(null);
        }}
      />
    </div>
  );
}

function DocumentDetailSheet({
  document,
  onOpenChange,
}: {
  document: EmployeeDocumentView | null;
  onOpenChange: (open: boolean) => void;
}) {
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [acknowledged, setAcknowledged] = useState(false);
  const [pending, startTransition] = useTransition();

  const status = document ? getDocumentStatus(document) : null;
  const needsAcknowledgement =
    document?.requiresAcknowledgement && !document.acknowledgedAt;

  function openDocument() {
    if (!document) return;
    setMessage(null);
    setError(null);
    startTransition(async () => {
      const result = await viewEmployeeDocumentAction({
        documentId: document.id,
      });
      if (result.ok) setMessage(result.message);
      else setError(result.message);
    });
  }

  function acknowledge() {
    if (!document) return;
    setMessage(null);
    setError(null);
    startTransition(async () => {
      const result = await acknowledgeDocumentAction({
        documentId: document.id,
      });
      if (result.ok) setMessage(result.message);
      else setError(result.message);
    });
  }

  return (
    <Sheet open={Boolean(document)} onOpenChange={onOpenChange}>
      <SheetContent>
        {document && status && (
          <>
        <SheetHeader>
          <SheetTitle>{document.documentType}</SheetTitle>
        </SheetHeader>

        <div className="flex-1 space-y-4 overflow-y-auto px-4">
          <Badge
            variant="outline"
            className={cn("border-transparent", STATUS_STYLES[status])}
          >
            {documentStatusLabels[status]}
          </Badge>

          <dl className="space-y-3 text-sm">
            {document.version && (
              <div className="flex justify-between gap-4">
                <dt className="text-black/45">Version</dt>
                <dd className="font-medium">{document.version}</dd>
              </div>
            )}
            <div className="flex justify-between gap-4">
              <dt className="text-black/45">Published</dt>
              <dd className="font-medium">
                {formatDate(document.effectiveDate ?? document.uploadedAt)}
              </dd>
            </div>
            {document.expiresAt && (
              <div className="flex justify-between gap-4">
                <dt className="text-black/45">Expires</dt>
                <dd className="font-medium">{formatDate(document.expiresAt)}</dd>
              </div>
            )}
            <div className="flex justify-between gap-4">
              <dt className="text-black/45">Acknowledgement</dt>
              <dd className="font-medium">
                {document.requiresAcknowledgement
                  ? document.acknowledgedAt
                    ? `Acknowledged ${formatDate(document.acknowledgedAt)}`
                    : "Required"
                  : "Not required"}
              </dd>
            </div>
          </dl>

          <button
            type="button"
            disabled={pending}
            onClick={openDocument}
            className="w-full rounded-md border border-black/15 px-3 py-2 text-sm font-medium hover:bg-black/[0.03] disabled:opacity-50"
          >
            View Document
          </button>

          {needsAcknowledgement && (
            <div className="space-y-3 rounded-md border border-black/10 bg-[var(--ca-app-bg,#f6f8fb)] p-4">
              <label className="flex items-start gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={acknowledged}
                  onChange={(e) => setAcknowledged(e.target.checked)}
                  className="mt-0.5"
                />
                I acknowledge that I have reviewed this document.
              </label>
              <button
                type="button"
                disabled={!acknowledged || pending}
                onClick={acknowledge}
                className="w-full rounded-md bg-[var(--ca-blue)] px-3 py-2 text-sm font-medium text-white disabled:opacity-40"
              >
                Acknowledge
              </button>
            </div>
          )}

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

        <SheetFooter />
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
