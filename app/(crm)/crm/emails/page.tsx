import type { Metadata } from "next";

import { processClientFlowEmailQueueAction } from "@/app/actions/contact-actions";
import { ClientFlowEmailRows } from "@/components/crm/clientflow-email-rows";
import { PageHeader } from "@/components/shared";
import { listClientFlowEmailOps } from "@/lib/clientflow/process-emails";

export const metadata: Metadata = {
  title: "Email delivery | CRM Workspace",
};

export const dynamic = "force-dynamic";

async function drainClientFlowQueue() {
  "use server";
  await processClientFlowEmailQueueAction();
}

export default async function CrmEmailsOpsPage() {
  const emails = await listClientFlowEmailOps();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="ClientFlow"
        title="Email delivery"
        description="Queued, retrying, and failed outbound messages. Inquiry records are never rolled back when delivery fails."
        actions={
          <form action={drainClientFlowQueue}>
            <button
              type="submit"
              className="rounded-md border border-black/15 bg-white px-3 py-1.5 text-sm font-medium text-black/70 hover:bg-black/[0.03]"
            >
              Process queue
            </button>
          </form>
        }
      />

      <ClientFlowEmailRows emails={emails} showRetry />
    </div>
  );
}
