import {
  renderEmailTemplate,
  type EmailTemplateData,
  type EmailTemplateName,
} from "@/lib/notifications/templates";

export type SendEmailInput = {
  template: EmailTemplateName;
  recipient: string;
  data: EmailTemplateData;
};

export type SendEmailResult =
  | { ok: true; providerMessageId?: string }
  | { ok: false; error: string };

/**
 * Provider boundary. Nothing above this line (templates, the delivery
 * processor, or any action/page) may know which email vendor is behind it —
 * swap the implementation here when one is chosen. No provider API key is
 * ever read outside this module, and never on the client.
 */
export type EmailProvider = {
  send(input: { to: string; subject: string; html: string; text: string }): Promise<SendEmailResult>;
};

/**
 * Default provider: no outbound network call. Safe to run in every
 * environment (including CI and local dev) until a real provider is wired
 * in. Swap via `setEmailProvider` in an app bootstrap module once one is
 * chosen — workflows are not designed around any specific vendor.
 */
const consoleProvider: EmailProvider = {
  async send({ to, subject }) {
    console.log(`[email:not-sent] to=${to} subject=${JSON.stringify(subject)}`);
    return { ok: true };
  },
};

let activeProvider: EmailProvider = consoleProvider;

export function setEmailProvider(provider: EmailProvider) {
  activeProvider = provider;
}

export async function sendNotificationEmail(input: SendEmailInput): Promise<SendEmailResult> {
  const rendered = renderEmailTemplate(input.template, input.data);
  return activeProvider.send({
    to: input.recipient,
    subject: rendered.subject,
    html: rendered.html,
    text: rendered.text,
  });
}
