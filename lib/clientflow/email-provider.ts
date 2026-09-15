import type { SendEmailResult } from "@/lib/notifications/email";

export type ClientFlowSendInput = {
  to: string;
  subject: string;
  text: string;
  html?: string;
};

export type ClientFlowProviderName = "gmail" | "console";

export type ClientFlowSendResult = SendEmailResult & {
  provider: ClientFlowProviderName;
  /** True when no real outbound mail was delivered (dev console only). */
  simulated?: boolean;
};

/**
 * Outbound provider boundary for ClientFlow.
 * Credentials are read only on the server; never imported from client components.
 */
export type ClientFlowEmailProvider = {
  name: ClientFlowProviderName;
  send(input: ClientFlowSendInput): Promise<ClientFlowSendResult>;
};

function forceFailRequested(): boolean {
  const v = (process.env.CLIENTFLOW_EMAIL_FORCE_FAIL ?? "").toLowerCase();
  return v === "1" || v === "true" || v === "yes";
}

function isProductionRuntime(): boolean {
  return (
    process.env.NODE_ENV === "production" ||
    process.env.VERCEL_ENV === "production" ||
    process.env.CLIENTFLOW_REQUIRE_GMAIL === "1" ||
    process.env.CLIENTFLOW_REQUIRE_GMAIL === "true"
  );
}

function gmailConfigured(): boolean {
  return Boolean(
    process.env.GMAIL_CLIENT_ID &&
      process.env.GMAIL_CLIENT_SECRET &&
      process.env.GMAIL_REFRESH_TOKEN &&
      process.env.GMAIL_FROM,
  );
}

const consoleProvider: ClientFlowEmailProvider = {
  name: "console",
  async send({ to, subject }) {
    if (forceFailRequested()) {
      return {
        ok: false,
        error: "Forced ClientFlow email failure (CLIENTFLOW_EMAIL_FORCE_FAIL)",
        provider: "console",
      };
    }
    if (isProductionRuntime()) {
      return {
        ok: false,
        error:
          "Gmail is required in production. Console fallback cannot record a real delivery.",
        provider: "console",
      };
    }
    // Subject only — never log message body / secrets.
    console.log(`[clientflow-email:simulated] to=${to} subject=${JSON.stringify(subject)}`);
    return {
      ok: true,
      provider: "console",
      simulated: true,
      providerMessageId: `console-sim-${crypto.randomUUID()}`,
    };
  },
};

/**
 * Gmail API send via OAuth refresh token.
 * Env (server only): GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET, GMAIL_REFRESH_TOKEN, GMAIL_FROM
 */
const gmailProvider: ClientFlowEmailProvider = {
  name: "gmail",
  async send({ to, subject, text, html }) {
    if (forceFailRequested()) {
      return {
        ok: false,
        error: "Forced ClientFlow email failure (CLIENTFLOW_EMAIL_FORCE_FAIL)",
        provider: "gmail",
      };
    }

    const clientId = process.env.GMAIL_CLIENT_ID;
    const clientSecret = process.env.GMAIL_CLIENT_SECRET;
    const refreshToken = process.env.GMAIL_REFRESH_TOKEN;
    const from = process.env.GMAIL_FROM;
    if (!clientId || !clientSecret || !refreshToken || !from) {
      return {
        ok: false,
        error: "Gmail credentials are not configured on the server",
        provider: "gmail",
      };
    }

    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: refreshToken,
        grant_type: "refresh_token",
      }),
    });
    if (!tokenRes.ok) {
      return {
        ok: false,
        error: `Gmail token refresh failed (${tokenRes.status})`,
        provider: "gmail",
      };
    }
    const tokenJson = (await tokenRes.json()) as { access_token?: string };
    if (!tokenJson.access_token) {
      return {
        ok: false,
        error: "Gmail token refresh returned no access_token",
        provider: "gmail",
      };
    }

    const boundary = `ca_${crypto.randomUUID().replace(/-/g, "")}`;
    const mime = [
      `From: ${from}`,
      `To: ${to}`,
      `Subject: ${subject}`,
      "MIME-Version: 1.0",
      `Content-Type: multipart/alternative; boundary="${boundary}"`,
      "",
      `--${boundary}`,
      'Content-Type: text/plain; charset="UTF-8"',
      "",
      text,
      `--${boundary}`,
      'Content-Type: text/html; charset="UTF-8"',
      "",
      html ?? `<pre>${text}</pre>`,
      `--${boundary}--`,
    ].join("\r\n");

    const raw = Buffer.from(mime)
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

    const sendRes = await fetch(
      "https://gmail.googleapis.com/gmail/v1/users/me/messages/send",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${tokenJson.access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ raw }),
      },
    );

    if (!sendRes.ok) {
      return {
        ok: false,
        error: `Gmail send failed (${sendRes.status})`,
        provider: "gmail",
      };
    }
    const sent = (await sendRes.json()) as { id?: string };
    return {
      ok: true,
      provider: "gmail",
      simulated: false,
      providerMessageId: sent.id ?? `gmail-${crypto.randomUUID()}`,
    };
  },
};

function resolveProvider(): ClientFlowEmailProvider {
  if (gmailConfigured()) return gmailProvider;
  return consoleProvider;
}

/** Test override; when null, provider is resolved from env on each send. */
let providerOverride: ClientFlowEmailProvider | null = null;

export function setClientFlowEmailProvider(provider: ClientFlowEmailProvider) {
  providerOverride = provider;
}

export function getClientFlowEmailProvider(): ClientFlowEmailProvider {
  return providerOverride ?? resolveProvider();
}

export function getClientFlowProviderName(): ClientFlowProviderName {
  return getClientFlowEmailProvider().name;
}

export function assertClientFlowEmailConfig(): { ok: true } | { ok: false; error: string } {
  if (isProductionRuntime() && !gmailConfigured()) {
    return {
      ok: false,
      error:
        "Production requires GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET, GMAIL_REFRESH_TOKEN, and GMAIL_FROM.",
    };
  }
  return { ok: true };
}

export async function sendClientFlowEmail(
  input: ClientFlowSendInput,
): Promise<ClientFlowSendResult> {
  return getClientFlowEmailProvider().send(input);
}
