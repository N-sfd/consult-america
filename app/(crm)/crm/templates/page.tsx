import type { Metadata } from "next";

import { PageHeader, StatusBadge } from "@/components/shared";
import { listClientFlowTemplates } from "@/lib/clientflow/template-admin";

export const metadata: Metadata = {
  title: "Email templates | CRM Workspace",
};

export const dynamic = "force-dynamic";

export default async function CrmEmailTemplatesPage() {
  const templates = await listClientFlowTemplates();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="ClientFlow"
        title="Email templates"
        description="Inspect approved acknowledgment and notification templates. Templates describe communication only — workflows decide timing."
      />

      <div className="overflow-x-auto rounded-lg border border-black/10 bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-black/10 text-xs uppercase tracking-wide text-black/45">
            <tr>
              <th className="px-4 py-3 font-semibold">Name</th>
              <th className="px-4 py-3 font-semibold">Purpose</th>
              <th className="px-4 py-3 font-semibold">Service</th>
              <th className="px-4 py-3 font-semibold">Version</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Subject</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            {templates.map((tpl) => (
              <tr key={tpl.id}>
                <td className="px-4 py-3">
                  <p className="font-medium text-[var(--ca-app-ink)]">{tpl.name}</p>
                  <p className="text-xs text-black/40">{tpl.key}</p>
                </td>
                <td className="px-4 py-3 text-black/65">{tpl.purpose}</td>
                <td className="px-4 py-3 text-black/65">{tpl.serviceName ?? "—"}</td>
                <td className="px-4 py-3 text-black/65">v{tpl.version}</td>
                <td className="px-4 py-3">
                  <StatusBadge tone={tpl.isActive ? "success" : "muted"}>
                    {tpl.isActive ? "Active" : "Inactive"}
                  </StatusBadge>
                </td>
                <td className="max-w-xs truncate px-4 py-3 text-black/55">{tpl.subject}</td>
              </tr>
            ))}
            {templates.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-black/45">
                  No templates found.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
