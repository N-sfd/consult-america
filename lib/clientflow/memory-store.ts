import { firstNameFromDisplayName, normalizeEmail } from "@/lib/clientflow/normalize-email";
import {
  renderTemplate,
  selectClientAckTemplate,
} from "@/lib/clientflow/templates";
import type {
  ClientFlowEmailMessage,
  ClientFlowServiceEnrollment,
  ContactClientFlowDetail,
  ServiceEnrollmentStatus,
  TalkToExpertInput,
  TalkToExpertResult,
} from "@/lib/clientflow/types";

type MemAccount = { id: string; name: string; nameNormalized: string };
type MemContact = {
  id: string;
  accountId: string;
  name: string;
  email: string;
  emailNormalized: string;
  consentAt?: string;
  lastInquiryAt?: string;
  createdAt: string;
};
type MemInquiry = {
  id: string;
  contactId: string;
  accountId: string;
  serviceKey: string;
  serviceName: string;
  companyName: string;
  message?: string;
  sourcePage?: string;
  sourceChannel: string;
  campaign?: string;
  utm: Record<string, string>;
  consentGiven: boolean;
  status: string;
  createdAt: string;
};
type MemActivity = {
  id: string;
  accountId: string;
  contactId: string;
  inquiryId?: string;
  type: string;
  subject: string;
  body?: string;
  createdAt: string;
  metadata?: Record<string, unknown>;
};
type MemEnrollment = {
  id: string;
  contactId: string;
  accountId: string;
  serviceId: string;
  serviceKey: string;
  serviceName: string;
  sourceInquiryId?: string;
  status: ServiceEnrollmentStatus;
  ownerUserId: string;
  createdAt: string;
  updatedAt: string;
};

const accounts: MemAccount[] = [];
const contacts: MemContact[] = [];
const inquiries: MemInquiry[] = [];
const activities: MemActivity[] = [];
const emails: ClientFlowEmailMessage[] = [];
const enrollments: MemEnrollment[] = [];

const SERVICE_NAMES: Record<string, string> = {
  general: "General Consulting",
  oracle: "Oracle Transformation",
  ai_data: "AI & Data",
  application_engineering: "Application Engineering",
  crm_cx: "CRM & Customer Experience",
  managed_services: "Managed Services",
};

function nowIso() {
  return new Date().toISOString();
}

function id(prefix: string) {
  return `${prefix}-${crypto.randomUUID()}`;
}

/** Test-only reset. */
export function resetClientFlowMemoryForTests() {
  accounts.splice(0, accounts.length);
  contacts.splice(0, contacts.length);
  inquiries.splice(0, inquiries.length);
  activities.splice(0, activities.length);
  emails.splice(0, emails.length);
  enrollments.splice(0, enrollments.length);
}

function upsertEnrollment(input: {
  contactId: string;
  accountId: string;
  serviceKey: string;
  serviceName: string;
  inquiryId: string;
  ownerUserId?: string;
}): { enrollment: MemEnrollment; created: boolean } {
  const serviceId = `svc-${input.serviceKey}`;
  const existing = enrollments.find(
    (e) =>
      e.contactId === input.contactId &&
      e.serviceId === serviceId &&
      e.status !== "Completed",
  );
  const ts = nowIso();
  if (existing) {
    existing.accountId = input.accountId;
    existing.sourceInquiryId = input.inquiryId;
    existing.updatedAt = ts;
    if (input.ownerUserId) existing.ownerUserId = input.ownerUserId;
    activities.unshift({
      id: id("act"),
      accountId: input.accountId,
      contactId: input.contactId,
      inquiryId: input.inquiryId,
      type: "SYSTEM",
      subject: `${input.serviceName} enrollment updated`,
      body: "Existing open enrollment linked to new inquiry",
      createdAt: ts,
      metadata: {
        event: "enrollment_updated",
        enrollment_id: existing.id,
        service_id: serviceId,
      },
    });
    return { enrollment: existing, created: false };
  }

  const enrollment: MemEnrollment = {
    id: id("enr"),
    contactId: input.contactId,
    accountId: input.accountId,
    serviceId,
    serviceKey: input.serviceKey,
    serviceName: input.serviceName,
    sourceInquiryId: input.inquiryId,
    status: "Interested",
    ownerUserId: input.ownerUserId ?? "profile-clientflow-system",
    createdAt: ts,
    updatedAt: ts,
  };
  enrollments.unshift(enrollment);
  activities.unshift({
    id: id("act"),
    accountId: input.accountId,
    contactId: input.contactId,
    inquiryId: input.inquiryId,
    type: "SYSTEM",
    subject: `${input.serviceName} enrollment created (Interested)`,
    body: "Service enrollment opened from Talk to Expert",
    createdAt: ts,
    metadata: {
      event: "enrollment_created",
      enrollment_id: enrollment.id,
      service_id: serviceId,
      status: "Interested",
    },
  });
  return { enrollment, created: true };
}

export function memorySubmitTalkToExpert(input: TalkToExpertInput): TalkToExpertResult {
  if (!input.consentGiven) {
    return { ok: false, error: "Consent is required.", code: "consent_required" };
  }

  const emailNorm = normalizeEmail(input.email);
  const companyNorm = input.company.trim().toLowerCase();
  const serviceKey = input.serviceKey?.trim() || "general";
  const serviceName = SERVICE_NAMES[serviceKey] ?? SERVICE_NAMES.general;
  const ts = nowIso();

  let account = accounts.find((a) => a.nameNormalized === companyNorm);
  if (!account) {
    account = {
      id: id("acct"),
      name: input.company.trim(),
      nameNormalized: companyNorm,
    };
    accounts.push(account);
  }

  let contact = contacts.find((c) => c.emailNormalized === emailNorm);
  let contactCreated = false;
  if (!contact) {
    contactCreated = true;
    contact = {
      id: id("cont"),
      accountId: account.id,
      name: input.name.trim(),
      email: input.email.trim(),
      emailNormalized: emailNorm,
      consentAt: ts,
      lastInquiryAt: ts,
      createdAt: ts,
    };
    contacts.push(contact);
  } else {
    contact.name = input.name.trim();
    contact.email = input.email.trim();
    contact.accountId = account.id;
    contact.lastInquiryAt = ts;
    contact.consentAt = contact.consentAt ?? ts;
  }

  const inquiry: MemInquiry = {
    id: id("inq"),
    contactId: contact.id,
    accountId: account.id,
    serviceKey,
    serviceName,
    companyName: input.company.trim(),
    message: input.message?.trim() || undefined,
    sourcePage: input.sourcePage,
    sourceChannel: input.sourceChannel || "talk_to_expert",
    campaign: input.campaign,
    utm: input.utm ?? {},
    consentGiven: true,
    status: "NEW",
    createdAt: ts,
  };
  inquiries.unshift(inquiry);

  const { enrollment, created: enrollmentCreated } = upsertEnrollment({
    contactId: contact.id,
    accountId: account.id,
    serviceKey,
    serviceName,
    inquiryId: inquiry.id,
  });

  const runId = id("wfr");
  activities.unshift(
    {
      id: id("act"),
      accountId: account.id,
      contactId: contact.id,
      inquiryId: inquiry.id,
      type: "SYSTEM",
      subject: "Talk to Expert submitted",
      body: inquiry.message?.slice(0, 280),
      createdAt: ts,
      metadata: { event: "talk_to_expert_submitted" },
    },
    {
      id: id("act"),
      accountId: account.id,
      contactId: contact.id,
      inquiryId: inquiry.id,
      type: "SYSTEM",
      subject: `${serviceName} selected`,
      createdAt: ts,
      metadata: { event: "service_selected" },
    },
  );

  const firstName = firstNameFromDisplayName(input.name);
  const tpl = selectClientAckTemplate(serviceKey);
  const consultant =
    process.env.CLIENTFLOW_CONSULTANT_NAME?.trim() ||
    "a Consult America practice leader";
  const booking = process.env.CLIENTFLOW_BOOKING_URL?.trim() || "";
  const vars = {
    first_name: firstName,
    company_name: input.company.trim(),
    service_name: serviceName,
    consultant_name: consultant,
    booking_url: booking,
  };
  const clientSubject = renderTemplate(tpl.subject, vars);
  const clientBody = renderTemplate(tpl.bodyText, vars);

  emails.unshift({
    id: id("cem"),
    contactId: contact.id,
    inquiryId: inquiry.id,
    accountId: account.id,
    templateKey: tpl.key,
    templateId: tpl.id,
    templateVersion: tpl.version,
    purpose: "CLIENT_ACK",
    toAddress: input.email.trim(),
    subject: clientSubject,
    bodyText: clientBody,
    status: "queued",
    attemptCount: 0,
    maxAttempts: 5,
    idempotencyKey: `client_ack:${inquiry.id}`,
    createdAt: ts,
    updatedAt: ts,
  });

  const internalTo = process.env.CLIENTFLOW_INTERNAL_NOTIFY_TO?.trim();
  if (internalTo) {
    emails.unshift({
      id: id("cem"),
      contactId: contact.id,
      inquiryId: inquiry.id,
      accountId: account.id,
      templateKey: "talk_to_expert_internal_notify",
      purpose: "INTERNAL_NOTIFY",
      toAddress: internalTo,
      subject: `New Talk to Expert inquiry — ${inquiry.companyName} / ${serviceName}`,
      bodyText: `New inquiry from ${contact.name} (${contact.email})`,
      status: "queued",
      attemptCount: 0,
      maxAttempts: 5,
      idempotencyKey: `internal_notify:${inquiry.id}`,
      createdAt: ts,
      updatedAt: ts,
    });
  }

  return {
    ok: true,
    contactId: contact.id,
    accountId: account.id,
    inquiryId: inquiry.id,
    workflowRunId: runId,
    contactCreated,
    serviceId: `svc-${serviceKey}`,
    serviceName,
    enrollmentId: enrollment.id,
    enrollmentCreated,
    clientTemplateId: tpl.id,
    clientTemplateKey: tpl.key,
    clientTemplateVersion: tpl.version,
  };
}

export function memorySetEnrollmentStatus(
  enrollmentId: string,
  status: ServiceEnrollmentStatus,
  actorUserId?: string,
): { ok: true; status: ServiceEnrollmentStatus } | { ok: false; error: string } {
  const row = enrollments.find((e) => e.id === enrollmentId);
  if (!row) return { ok: false, error: "Enrollment not found." };
  if (row.status === status) return { ok: true, status };
  const from = row.status;
  row.status = status;
  row.updatedAt = nowIso();
  activities.unshift({
    id: id("act"),
    accountId: row.accountId,
    contactId: row.contactId,
    inquiryId: row.sourceInquiryId,
    type: "SYSTEM",
    subject: `${row.serviceName} enrollment → ${status}`,
    body: `Status changed from ${from} to ${status}`,
    createdAt: row.updatedAt,
    metadata: {
      event: "enrollment_status_changed",
      enrollment_id: row.id,
      service_id: row.serviceId,
      from_status: from,
      to_status: status,
      actor: actorUserId,
    },
  });
  return { ok: true, status };
}

export function memoryListEnrollmentsByContact(
  contactId: string,
): ClientFlowServiceEnrollment[] {
  return enrollments
    .filter((e) => e.contactId === contactId)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .map((e) => ({
      id: e.id,
      contactId: e.contactId,
      accountId: e.accountId,
      serviceId: e.serviceId,
      serviceName: e.serviceName,
      sourceInquiryId: e.sourceInquiryId,
      status: e.status,
      ownerUserId: e.ownerUserId,
      createdAt: e.createdAt,
      updatedAt: e.updatedAt,
      recentStatusChanges: activities
        .filter(
          (a) =>
            a.contactId === contactId &&
            a.metadata?.enrollment_id === e.id &&
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
    }));
}

export function memoryCountEnrollmentsByContact(contactId: string): number {
  return enrollments.filter((e) => e.contactId === contactId).length;
}

export function memoryGetEnrollmentMeta(enrollmentId: string) {
  const e = enrollments.find((row) => row.id === enrollmentId);
  if (!e) return undefined;
  return {
    contactId: e.contactId,
    accountId: e.accountId,
    sourceInquiryId: e.sourceInquiryId,
    serviceKey: e.serviceKey,
    serviceName: e.serviceName,
    status: e.status,
  };
}

export function memoryListEmailsByContact(contactId: string): ClientFlowEmailMessage[] {
  return emails.filter((e) => e.contactId === contactId);
}

export function memoryListFailedOrRetrying(): ClientFlowEmailMessage[] {
  return emails.filter(
    (e) => e.status === "failed" || e.status === "retrying" || e.status === "queued",
  );
}

export function memoryGetEmail(idValue: string): ClientFlowEmailMessage | undefined {
  return emails.find((e) => e.id === idValue);
}

export function memoryUpdateEmail(
  idValue: string,
  patch: Partial<ClientFlowEmailMessage>,
): ClientFlowEmailMessage | undefined {
  const row = emails.find((e) => e.id === idValue);
  if (!row) return undefined;
  Object.assign(row, patch, { updatedAt: nowIso() });
  return row;
}

export function memoryClaimEmail(idValue: string): ClientFlowEmailMessage | undefined {
  const row = emails.find((e) => e.id === idValue);
  if (!row) return undefined;
  if (row.providerMessageId) return undefined;
  if (row.attemptCount >= row.maxAttempts) return undefined;
  if (!["queued", "retrying", "failed"].includes(row.status)) return undefined;
  row.status = "retrying";
  row.lastAttemptAt = nowIso();
  row.updatedAt = nowIso();
  return { ...row };
}

export function memoryGetContactDetail(contactId: string): ContactClientFlowDetail | undefined {
  const contact = contacts.find((c) => c.id === contactId);
  if (!contact) return undefined;
  const account = accounts.find((a) => a.id === contact.accountId);
  return {
    contact: {
      id: contact.id,
      accountId: contact.accountId,
      accountName: account?.name ?? "—",
      name: contact.name,
      email: contact.email,
      emailNormalized: contact.emailNormalized,
      consentAt: contact.consentAt,
      lastInquiryAt: contact.lastInquiryAt,
      createdAt: contact.createdAt,
    },
    inquiries: inquiries
      .filter((i) => i.contactId === contactId)
      .map((i) => ({
        id: i.id,
        contactId: i.contactId,
        accountId: i.accountId,
        serviceId: `svc-${i.serviceKey}`,
        serviceName: i.serviceName,
        companyName: i.companyName,
        message: i.message,
        sourcePage: i.sourcePage,
        sourceChannel: i.sourceChannel,
        campaign: i.campaign,
        utm: i.utm,
        consentGiven: i.consentGiven,
        status: i.status,
        createdAt: i.createdAt,
      })),
    enrollments: memoryListEnrollmentsByContact(contactId),
    activities: activities
      .filter((a) => a.contactId === contactId)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    emails: memoryListEmailsByContact(contactId).sort((a, b) =>
      b.createdAt.localeCompare(a.createdAt),
    ),
  };
}

export function memoryCountContactsByEmail(email: string): number {
  const n = normalizeEmail(email);
  return contacts.filter((c) => c.emailNormalized === n).length;
}

export function memoryCountInquiriesByEmail(email: string): number {
  const n = normalizeEmail(email);
  const contact = contacts.find((c) => c.emailNormalized === n);
  if (!contact) return 0;
  return inquiries.filter((i) => i.contactId === contact.id).length;
}
