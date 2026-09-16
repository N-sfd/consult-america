import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { PageHeader } from "@/components/shared";
import NotificationPreferencesForm from "@/components/workforce/notification-preferences-form";
import { listNotificationPreferencesForProfile } from "@/lib/workforce/operations";
import { getWorkforceSession } from "@/lib/workforce/session";

export const metadata: Metadata = { title: "Settings" };
export const dynamic = "force-dynamic";

export default async function WorkforceSettingsPage() {
  const session = await getWorkforceSession();
  if (!session.roles.includes("ADMIN") && !session.roles.includes("HR")) {
    redirect("/workforce");
  }

  const preferences = session.profileId
    ? await listNotificationPreferencesForProfile(session.profileId)
    : [];

  return (
    <div className="mx-auto max-w-[1400px] space-y-7">
      <PageHeader
        eyebrow="Administration"
        title="Settings"
        description="Workspace preferences, notification delivery, and access controls for the Consult America platform."
      />

      <section className="rounded-lg border border-[var(--ca-platform-border)] bg-white p-5">
        <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-black/40">
          Notification preferences
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-black/55">
          Choose which platform events notify you, {session.displayName}, in-app and by email.
          Critical account and security notices are always delivered regardless of these settings.
        </p>
        <div className="mt-4">
          {session.profileId ? (
            <NotificationPreferencesForm preferences={preferences} />
          ) : (
            <p className="text-sm text-black/45">
              No platform profile is linked to this session, so preferences cannot be edited here.
            </p>
          )}
        </div>
      </section>

      <section className="rounded-lg border border-[var(--ca-platform-border)] bg-white p-5">
        <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-black/40">
          Access controls
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-black/55">
          Role assignment, user status, and platform accounts are managed from{" "}
          <a href="/workforce/users" className="font-medium text-[var(--ca-platform-mid)] hover:underline">
            Users
          </a>
          . Granting or revoking a role from this screen is not available yet.
        </p>
      </section>

      <section className="rounded-lg border border-[var(--ca-platform-border)] bg-white p-5">
        <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-black/40">
          Workspace
        </h2>
        <dl className="mt-4 grid gap-6 sm:grid-cols-2">
          <div>
            <dt className="text-xs uppercase tracking-[0.12em] text-black/40">Signed in as</dt>
            <dd className="mt-2 text-sm font-medium">
              {session.displayName} · {session.workEmail}
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-[0.12em] text-black/40">Roles</dt>
            <dd className="mt-2 text-sm font-medium">{session.roles.join(", ")}</dd>
          </div>
        </dl>
      </section>
    </div>
  );
}
