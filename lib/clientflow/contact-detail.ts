import { getSupabaseServiceClient, isSupabaseConfigured } from "@/app/lib/supabase/server";
import { memoryGetContactDetail } from "@/lib/clientflow/memory-store";
import type {
  ClientFlowEmailMessage,
  ClientFlowInquiry,
  ClientFlowServiceEnrollment,
  ContactClientFlowDetail,
  ServiceEnrollmentStatus,
} from "@/lib/clientflow/types";

function mapEmail(row: Record<string, unknown>): ClientFlowEmailMessage {
  return {
    id: row.id as string,
    contactId: row.contact_id as string,
    inquiryId: (row.inquiry_id as string) ?? undefined,
    accountId: row.account_id as string,
    templateKey: row.template_key as string,
    templateId: (row.template_id as string) ?? undefined,
    templateVersion:
      row.template_version !== undefined && row.template_version !== null
        ? Number(row.template_version)
        : undefined,
    purpose: row.purpose as ClientFlowEmailMessage["purpose"],
    toAddress: row.to_address as string,
    subject: row.subject as string,
    bodyText: row.body_text as string,
    status: row.status as ClientFlowEmailMessage["status"],
    attemptCount: Number(row.attempt_count ?? 0),
    maxAttempts: Number(row.max_attempts ?? 5),
    lastError: (row.last_error as string) ?? undefined,
    lastAttemptAt: (row.last_attempt_at as string) ?? undefined,
    sentAt: (row.sent_at as string) ?? undefined,
    failedAt: (row.failed_at as string) ?? undefined,
    providerMessageId: (row.provider_message_id as string) ?? undefined,
    provider: (row.provider as ClientFlowEmailMessage["provider"]) ?? undefined,
    idempotencyKey: row.idempotency_key as string,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

export async function getContactClientFlowDetail(
  contactId: string,
): Promise<ContactClientFlowDetail | undefined> {
  if (!isSupabaseConfigured() || !getSupabaseServiceClient()) {
    return memoryGetContactDetail(contactId);
  }

  const client = getSupabaseServiceClient()!;

  const { data: contactRow, error } = await client
    .from("crm_contacts")
    .select("*, crm_accounts(name)")
    .eq("id", contactId)
    .maybeSingle();

  if (error || !contactRow) return undefined;

  const accountName =
    (contactRow.crm_accounts as { name?: string } | null)?.name ?? "—";

  const [
    { data: inquiryRows },
    { data: activityRows },
    { data: emailRows },
    { data: enrollmentRows },
  ] = await Promise.all([
    client
      .from("crm_inquiries")
      .select("*, crm_services(name)")
      .eq("contact_id", contactId)
      .order("created_at", { ascending: false }),
    client
      .from("crm_activities")
      .select("*")
      .eq("contact_id", contactId)
      .order("created_at", { ascending: false })
      .limit(100),
    client
      .from("crm_email_messages")
      .select("*")
      .eq("contact_id", contactId)
      .order("created_at", { ascending: false })
      .limit(100),
    client
      .from("crm_service_enrollments")
      .select("*, crm_services(name)")
      .eq("contact_id", contactId)
      .order("updated_at", { ascending: false }),
  ]);

  const activities = (activityRows ?? []).map((row) => ({
    id: row.id as string,
    type: row.type as string,
    subject: row.subject as string,
    body: (row.body as string) ?? undefined,
    createdAt: row.created_at as string,
    metadata: (row.metadata as Record<string, unknown>) ?? undefined,
  }));

  const inquiries: ClientFlowInquiry[] = (inquiryRows ?? []).map((row) => ({
    id: row.id as string,
    contactId: row.contact_id as string,
    accountId: row.account_id as string,
    serviceId: (row.service_id as string) ?? undefined,
    serviceName:
      (row.crm_services as { name?: string } | null)?.name ?? undefined,
    companyName: row.company_name as string,
    message: (row.message as string) ?? undefined,
    sourcePage: (row.source_page as string) ?? undefined,
    sourceChannel: row.source_channel as string,
    campaign: (row.campaign as string) ?? undefined,
    utm: (row.utm as Record<string, unknown>) ?? {},
    consentGiven: Boolean(row.consent_given),
    status: row.status as string,
    createdAt: row.created_at as string,
  }));

  const enrollments: ClientFlowServiceEnrollment[] = (enrollmentRows ?? []).map((row) => {
    const enrollmentId = row.id as string;
    return {
      id: enrollmentId,
      contactId: row.contact_id as string,
      accountId: row.account_id as string,
      serviceId: row.service_id as string,
      serviceName:
        (row.crm_services as { name?: string } | null)?.name ?? "Service",
      sourceInquiryId: (row.source_inquiry_id as string) ?? undefined,
      status: row.status as ServiceEnrollmentStatus,
      ownerUserId: row.owner_user_id as string,
      createdAt: row.created_at as string,
      updatedAt: row.updated_at as string,
      recentStatusChanges: activities
        .filter(
          (a) =>
            a.metadata?.enrollment_id === enrollmentId &&
            (a.metadata?.event === "enrollment_status_changed" ||
              a.metadata?.event === "enrollment_created" ||
              a.metadata?.event === "enrollment_updated"),
        )
        .slice(0, 5)
        .map((a) => ({
          id: a.id,
          subject: a.subject,
          body: a.body,
          createdAt: a.createdAt,
          fromStatus: (a.metadata?.from_status as string) ?? undefined,
          toStatus: (a.metadata?.to_status as string) ?? undefined,
        })),
    };
  });

  return {
    contact: {
      id: contactRow.id as string,
      accountId: contactRow.account_id as string,
      accountName,
      name: contactRow.name as string,
      email: contactRow.email as string,
      emailNormalized: (contactRow.email_normalized as string) ?? "",
      title: (contactRow.title as string) ?? undefined,
      phone: (contactRow.phone as string) ?? undefined,
      consentAt: (contactRow.consent_at as string) ?? undefined,
      lastInquiryAt: (contactRow.last_inquiry_at as string) ?? undefined,
      createdAt: contactRow.created_at as string,
    },
    inquiries,
    enrollments,
    activities,
    emails: (emailRows ?? []).map((row) => mapEmail(row as Record<string, unknown>)),
  };
}
