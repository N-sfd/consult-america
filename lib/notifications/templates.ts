/**
 * Email template registry, keyed by the same notification_type values written
 * to the `notifications` table. Templates receive structured data only — no
 * page component or action ever builds email HTML inline.
 */

export type EmailTemplateName =
  | "timesheet_submitted"
  | "timesheet_approved"
  | "timesheet_rejected"
  | "leave_submitted"
  | "leave_approved"
  | "leave_rejected"
  | "hr_request_created"
  | "hr_request_updated"
  | "payroll_run_ready";

const NOTIFICATION_TYPE_TO_TEMPLATE: Record<string, EmailTemplateName> = {
  TIMESHEET_SUBMITTED: "timesheet_submitted",
  TIMESHEET_APPROVED: "timesheet_approved",
  TIMESHEET_REJECTED: "timesheet_rejected",
  LEAVE_SUBMITTED: "leave_submitted",
  LEAVE_APPROVED: "leave_approved",
  LEAVE_REJECTED: "leave_rejected",
  HR_REQUEST_CREATED: "hr_request_created",
  HR_REQUEST_ASSIGNED: "hr_request_updated",
  HR_REQUEST_RESOLVED: "hr_request_updated",
  PAYROLL_RUN_READY: "payroll_run_ready",
};

export function templateForNotificationType(notificationType: string): EmailTemplateName | null {
  return NOTIFICATION_TYPE_TO_TEMPLATE[notificationType] ?? null;
}

export type EmailTemplateData = {
  title: string;
  message: string;
  actionUrl?: string;
};

export type RenderedEmail = {
  subject: string;
  html: string;
  text: string;
};

/** Every template renders the same way today (title/message/CTA) — the
 * registry exists so that changes stay in one place instead of being
 * hand-rolled per call site as new templates are added. */
function renderDefault(data: EmailTemplateData): RenderedEmail {
  const cta = data.actionUrl
    ? `<p><a href="${data.actionUrl}">Open in ConsultAmerica</a></p>`
    : "";
  return {
    subject: data.title,
    html: `<p>${data.message}</p>${cta}`,
    text: data.actionUrl ? `${data.message}\n\n${data.actionUrl}` : data.message,
  };
}

const RENDERERS: Record<EmailTemplateName, (data: EmailTemplateData) => RenderedEmail> = {
  timesheet_submitted: renderDefault,
  timesheet_approved: renderDefault,
  timesheet_rejected: renderDefault,
  leave_submitted: renderDefault,
  leave_approved: renderDefault,
  leave_rejected: renderDefault,
  hr_request_created: renderDefault,
  hr_request_updated: renderDefault,
  payroll_run_ready: renderDefault,
};

export function renderEmailTemplate(template: EmailTemplateName, data: EmailTemplateData): RenderedEmail {
  return RENDERERS[template](data);
}
