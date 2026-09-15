import { getSupabaseServiceClient, isSupabaseConfigured } from "@/app/lib/supabase/server";
import { listClientAckTemplates } from "@/lib/clientflow/templates";

export type ClientFlowTemplateRow = {
  id: string;
  key: string;
  name: string;
  purpose: string;
  serviceId?: string;
  serviceName?: string;
  version: number;
  isActive: boolean;
  subject: string;
  updatedAt?: string;
};

export async function listClientFlowTemplates(): Promise<ClientFlowTemplateRow[]> {
  if (!isSupabaseConfigured() || !getSupabaseServiceClient()) {
    return listClientAckTemplates().map((t) => ({
      id: t.id,
      key: t.key,
      name: t.name,
      purpose: "CLIENT_ACK",
      serviceId: `svc-${t.serviceKey}`,
      serviceName: t.serviceKey,
      version: t.version,
      isActive: t.isActive,
      subject: t.subject,
    }));
  }

  const client = getSupabaseServiceClient()!;
  const { data, error } = await client
    .from("crm_email_templates")
    .select("id, key, name, purpose, service_id, version, is_active, subject, updated_at, crm_services(name)")
    .order("purpose", { ascending: true })
    .order("name", { ascending: true });

  if (error || !data) {
    console.error("[clientflow] list templates failed", error?.code);
    return [];
  }

  return data.map((row) => ({
    id: row.id as string,
    key: row.key as string,
    name: row.name as string,
    purpose: (row.purpose as string) ?? "—",
    serviceId: (row.service_id as string) ?? undefined,
    serviceName:
      (row.crm_services as { name?: string } | null)?.name ?? undefined,
    version: Number(row.version ?? 1),
    isActive: Boolean(row.is_active),
    subject: row.subject as string,
    updatedAt: (row.updated_at as string) ?? undefined,
  }));
}
