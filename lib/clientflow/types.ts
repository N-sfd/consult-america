export type ClientFlowEmailStatus =
  | "queued"
  | "retrying"
  | "sent"
  | "failed"
  | "simulated";

export type ClientFlowEmailPurpose = "CLIENT_ACK" | "INTERNAL_NOTIFY" | "FOLLOW_UP";

export type TalkToExpertInput = {
  name: string;
  email: string;
  company: string;
  message?: string;
  sourcePage?: string;
  sourceChannel?: string;
  serviceKey?: string;
  campaign?: string;
  utm?: Record<string, string>;
  consentGiven: boolean;
};

export type TalkToExpertResult =
  | {
      ok: true;
      contactId: string;
      accountId: string;
      inquiryId: string;
      workflowRunId: string;
      contactCreated: boolean;
      serviceId?: string;
      serviceName?: string;
      enrollmentId?: string;
      enrollmentCreated?: boolean;
      clientTemplateId?: string;
      clientTemplateKey?: string;
      clientTemplateVersion?: number;
    }
  | { ok: false; error: string; code?: string };

export type ServiceEnrollmentStatus =
  | "Interested"
  | "Qualified"
  | "Discovery"
  | "Proposal"
  | "Active"
  | "Completed";

export const SERVICE_ENROLLMENT_STATUSES: ServiceEnrollmentStatus[] = [
  "Interested",
  "Qualified",
  "Discovery",
  "Proposal",
  "Active",
  "Completed",
];

export type ClientFlowServiceEnrollment = {
  id: string;
  contactId: string;
  accountId: string;
  serviceId: string;
  serviceName: string;
  sourceInquiryId?: string;
  status: ServiceEnrollmentStatus;
  ownerUserId: string;
  createdAt: string;
  updatedAt: string;
  recentStatusChanges: Array<{
    id: string;
    subject: string;
    body?: string;
    createdAt: string;
    fromStatus?: string;
    toStatus?: string;
  }>;
};

export type ClientFlowEmailMessage = {
  id: string;
  contactId: string;
  inquiryId?: string;
  accountId: string;
  templateKey: string;
  templateId?: string;
  templateVersion?: number;
  purpose: ClientFlowEmailPurpose;
  toAddress: string;
  subject: string;
  bodyText: string;
  status: ClientFlowEmailStatus;
  attemptCount: number;
  maxAttempts: number;
  lastError?: string;
  lastAttemptAt?: string;
  sentAt?: string;
  failedAt?: string;
  providerMessageId?: string;
  provider?: "gmail" | "console";
  idempotencyKey: string;
  createdAt: string;
  updatedAt: string;
};

export type ClientFlowInquiry = {
  id: string;
  contactId: string;
  accountId: string;
  serviceId?: string;
  serviceName?: string;
  companyName: string;
  message?: string;
  sourcePage?: string;
  sourceChannel: string;
  campaign?: string;
  utm: Record<string, unknown>;
  consentGiven: boolean;
  status: string;
  createdAt: string;
};

export type ContactClientFlowDetail = {
  contact: {
    id: string;
    accountId: string;
    accountName: string;
    name: string;
    email: string;
    emailNormalized: string;
    title?: string;
    phone?: string;
    consentAt?: string;
    lastInquiryAt?: string;
    createdAt: string;
  };
  inquiries: ClientFlowInquiry[];
  enrollments: ClientFlowServiceEnrollment[];
  activities: Array<{
    id: string;
    type: string;
    subject: string;
    body?: string;
    createdAt: string;
    metadata?: Record<string, unknown>;
  }>;
  emails: ClientFlowEmailMessage[];
};
