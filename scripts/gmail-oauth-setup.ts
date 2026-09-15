/**
 * Obtain a Gmail API refresh token for ClientFlow outbound mail.
 *
 * Prerequisites (Google Cloud Console):
 * 1. Enable Gmail API
 * 2. Create OAuth 2.0 Client (Desktop or Web) with redirect
 *    http://127.0.0.1:8765/oauth2callback
 * 3. Add the sending mailbox as a test user if the app is in Testing
 *
 * Usage:
 *   set GMAIL_CLIENT_ID / GMAIL_CLIENT_SECRET in .env.local, then:
 *   npm run clientflow:gmail-oauth
 *
 * Paste the printed values into .env.local and Vercel Production.
 */
import http from "node:http";
import { URL } from "node:url";

const REDIRECT_URI = "http://127.0.0.1:8765/oauth2callback";
const SCOPE = "https://www.googleapis.com/auth/gmail.send";

async function main() {
  const clientId = process.env.GMAIL_CLIENT_ID?.trim();
  const clientSecret = process.env.GMAIL_CLIENT_SECRET?.trim();
  if (!clientId || !clientSecret) {
    console.error(
      "Set GMAIL_CLIENT_ID and GMAIL_CLIENT_SECRET in .env.local before running this script.",
    );
    process.exit(1);
  }

  const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  authUrl.searchParams.set("client_id", clientId);
  authUrl.searchParams.set("redirect_uri", REDIRECT_URI);
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("scope", SCOPE);
  authUrl.searchParams.set("access_type", "offline");
  authUrl.searchParams.set("prompt", "consent");

  console.log("\n1. Ensure Gmail API is enabled and this OAuth client allows:");
  console.log(`   ${REDIRECT_URI}`);
  console.log("\n2. Open this URL in a browser and authorize the sending mailbox:\n");
  console.log(authUrl.toString());
  console.log("\n3. Waiting for OAuth callback on", REDIRECT_URI, "...\n");

  const code = await waitForCode();
  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: REDIRECT_URI,
      grant_type: "authorization_code",
    }),
  });
  const tokenJson = (await tokenRes.json()) as {
    refresh_token?: string;
    access_token?: string;
    error?: string;
    error_description?: string;
  };

  if (!tokenRes.ok || !tokenJson.refresh_token) {
    console.error(
      "Token exchange failed:",
      tokenJson.error ?? tokenRes.status,
      tokenJson.error_description ?? "",
    );
    if (!tokenJson.refresh_token && tokenJson.access_token) {
      console.error(
        "No refresh_token returned. Revoke prior grants for this client and re-run with prompt=consent.",
      );
    }
    process.exit(1);
  }

  console.log("\nAdd these to .env.local and Vercel Production:\n");
  console.log(`GMAIL_CLIENT_ID=${clientId}`);
  console.log("GMAIL_CLIENT_SECRET=<already set>");
  console.log(`GMAIL_REFRESH_TOKEN=${tokenJson.refresh_token}`);
  console.log("GMAIL_FROM=<the authorized mailbox email>");
  console.log("CLIENTFLOW_INTERNAL_NOTIFY_TO=<sales/intake role mailbox>");
  console.log("# CLIENTFLOW_OWNER_USER_ID=<optional profiles.id>");
  console.log("CLIENTFLOW_REQUIRE_GMAIL=true");
  console.log("\nThen: npm run test:clientflow-gate\n");
}

function waitForCode(): Promise<string> {
  return new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      try {
        const url = new URL(req.url ?? "/", "http://127.0.0.1:8765");
        if (url.pathname !== "/oauth2callback") {
          res.writeHead(404);
          res.end("Not found");
          return;
        }
        const err = url.searchParams.get("error");
        const code = url.searchParams.get("code");
        if (err) {
          res.writeHead(400, { "Content-Type": "text/plain" });
          res.end(`OAuth error: ${err}`);
          server.close();
          reject(new Error(err));
          return;
        }
        if (!code) {
          res.writeHead(400, { "Content-Type": "text/plain" });
          res.end("Missing code");
          return;
        }
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(
          "<html><body><h1>Gmail authorized</h1><p>You can close this tab and return to the terminal.</p></body></html>",
        );
        server.close();
        resolve(code);
      } catch (e) {
        reject(e);
      }
    });
    server.listen(8765, "127.0.0.1");
  });
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
