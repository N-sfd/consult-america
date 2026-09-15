/**
 * ClientFlow email templates — communication content only.
 * No delays, conditions, branching, or enrollment transitions here.
 */

export function sanitizeTemplateValue(value: unknown, maxLen = 500): string {
  if (value == null) return "";
  return String(value)
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "")
    .replace(/[<>]/g, "")
    .trim()
    .slice(0, maxLen);
}

/** Escape for HTML email bodies after sanitize. */
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export function renderTemplate(
  template: string,
  vars: Record<string, string | undefined | null>,
  options?: { html?: boolean },
): string {
  let out = template;
  for (const [key, raw] of Object.entries(vars)) {
    const safe = sanitizeTemplateValue(raw);
    const value = options?.html ? escapeHtml(safe) : safe;
    out = out.split(`{{${key}}}`).join(value);
  }
  // Never send raw {{variable}} placeholders to a client
  return out.replace(/\{\{[a-z_]+\}\}/gi, "");
}

export type ClientAckTemplateDef = {
  id: string;
  key: string;
  serviceKey: string;
  name: string;
  subject: string;
  bodyText: string;
  bodyHtml: string;
  version: number;
  isActive: boolean;
};

/** In-memory / test catalog mirroring seeded DB templates. */
export const CLIENT_ACK_TEMPLATE_CATALOG: ClientAckTemplateDef[] = [
  {
    id: "etpl-client-ack",
    key: "client_ack_general",
    serviceKey: "general",
    name: "General — Client acknowledgment",
    subject: "Thanks for contacting Consult America, {{first_name}}",
    bodyText:
      "Hi {{first_name}},\n\nThank you for reaching out to Consult America about {{service_name}} for {{company_name}}.\n\n{{consultant_name}} will follow up within one business day.\n\nBook time: {{booking_url}}\n\n— Consult America",
    bodyHtml:
      "<p>Hi {{first_name}},</p><p>Thank you for reaching out to Consult America about <strong>{{service_name}}</strong> for <strong>{{company_name}}</strong>.</p><p>{{consultant_name}} will follow up within one business day.</p><p><a href=\"{{booking_url}}\">Book time</a></p><p>— Consult America</p>",
    version: 1,
    isActive: true,
  },
  {
    id: "etpl-client-ack-oracle",
    key: "client_ack_oracle",
    serviceKey: "oracle",
    name: "Oracle Transformation — Client acknowledgment",
    subject: "Thanks for reaching out about Oracle Transformation, {{first_name}}",
    bodyText:
      "Hi {{first_name}},\n\nThank you for contacting Consult America about {{service_name}} for {{company_name}}.\n\n{{consultant_name}} from our Oracle practice will follow up shortly.\n\nBook time: {{booking_url}}\n\n— Consult America",
    bodyHtml:
      "<p>Hi {{first_name}},</p><p>Thank you for contacting Consult America about <strong>{{service_name}}</strong> for <strong>{{company_name}}</strong>.</p><p>{{consultant_name}} from our Oracle practice will follow up shortly.</p><p><a href=\"{{booking_url}}\">Book time</a></p><p>— Consult America</p>",
    version: 1,
    isActive: true,
  },
  {
    id: "etpl-client-ack-ai-data",
    key: "client_ack_ai_data",
    serviceKey: "ai_data",
    name: "AI & Data — Client acknowledgment",
    subject: "Thanks for reaching out about AI & Data, {{first_name}}",
    bodyText:
      "Hi {{first_name}},\n\nThank you for contacting Consult America about {{service_name}} for {{company_name}}.\n\n{{consultant_name}} from our AI & Data practice will follow up shortly.\n\nBook time: {{booking_url}}\n\n— Consult America",
    bodyHtml:
      "<p>Hi {{first_name}},</p><p>Thank you for contacting Consult America about <strong>{{service_name}}</strong> for <strong>{{company_name}}</strong>.</p><p>{{consultant_name}} from our AI & Data practice will follow up shortly.</p><p><a href=\"{{booking_url}}\">Book time</a></p><p>— Consult America</p>",
    version: 1,
    isActive: true,
  },
  {
    id: "etpl-client-ack-app-eng",
    key: "client_ack_application_engineering",
    serviceKey: "application_engineering",
    name: "Application Engineering — Client acknowledgment",
    subject: "Thanks for reaching out about Application Engineering, {{first_name}}",
    bodyText:
      "Hi {{first_name}},\n\nThank you for contacting Consult America about {{service_name}} for {{company_name}}.\n\n{{consultant_name}} from our engineering practice will follow up shortly.\n\nBook time: {{booking_url}}\n\n— Consult America",
    bodyHtml:
      "<p>Hi {{first_name}},</p><p>Thank you for contacting Consult America about <strong>{{service_name}}</strong> for <strong>{{company_name}}</strong>.</p><p>{{consultant_name}} from our engineering practice will follow up shortly.</p><p><a href=\"{{booking_url}}\">Book time</a></p><p>— Consult America</p>",
    version: 1,
    isActive: true,
  },
  {
    id: "etpl-client-ack-crm-cx",
    key: "client_ack_crm_cx",
    serviceKey: "crm_cx",
    name: "CRM & Customer Experience — Client acknowledgment",
    subject: "Thanks for reaching out about CRM & CX, {{first_name}}",
    bodyText:
      "Hi {{first_name}},\n\nThank you for contacting Consult America about {{service_name}} for {{company_name}}.\n\n{{consultant_name}} from our CRM practice will follow up shortly.\n\nBook time: {{booking_url}}\n\n— Consult America",
    bodyHtml:
      "<p>Hi {{first_name}},</p><p>Thank you for contacting Consult America about <strong>{{service_name}}</strong> for <strong>{{company_name}}</strong>.</p><p>{{consultant_name}} from our CRM practice will follow up shortly.</p><p><a href=\"{{booking_url}}\">Book time</a></p><p>— Consult America</p>",
    version: 1,
    isActive: true,
  },
  {
    id: "etpl-client-ack-managed",
    key: "client_ack_managed_services",
    serviceKey: "managed_services",
    name: "Managed Services — Client acknowledgment",
    subject: "Thanks for reaching out about Managed Services, {{first_name}}",
    bodyText:
      "Hi {{first_name}},\n\nThank you for contacting Consult America about {{service_name}} for {{company_name}}.\n\n{{consultant_name}} from our Managed Services team will follow up shortly.\n\nBook time: {{booking_url}}\n\n— Consult America",
    bodyHtml:
      "<p>Hi {{first_name}},</p><p>Thank you for contacting Consult America about <strong>{{service_name}}</strong> for <strong>{{company_name}}</strong>.</p><p>{{consultant_name}} from our Managed Services team will follow up shortly.</p><p><a href=\"{{booking_url}}\">Book time</a></p><p>— Consult America</p>",
    version: 1,
    isActive: true,
  },
];

let catalogOverride: ClientAckTemplateDef[] | null = null;

/** Test-only: replace catalog (e.g. mark a service template inactive). */
export function setClientAckTemplateCatalogForTests(rows: ClientAckTemplateDef[] | null) {
  catalogOverride = rows;
}

export function listClientAckTemplates(): ClientAckTemplateDef[] {
  return (catalogOverride ?? CLIENT_ACK_TEMPLATE_CATALOG).map((t) => ({ ...t }));
}

export function selectClientAckTemplate(serviceKey: string): ClientAckTemplateDef {
  const catalog = catalogOverride ?? CLIENT_ACK_TEMPLATE_CATALOG;
  const direct = catalog.find((t) => t.serviceKey === serviceKey && t.isActive);
  if (direct) return { ...direct };
  const general = catalog.find((t) => t.serviceKey === "general" && t.isActive);
  if (general) return { ...general };
  const any = catalog.find((t) => t.isActive) ?? catalog[0]!;
  return { ...any };
}
