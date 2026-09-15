import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ClientFlowEmailRows } from "@/components/crm/clientflow-email-rows";
import { ClientFlowEnrollmentRows } from "@/components/crm/clientflow-enrollment-rows";
import { EmptyState, PageHeader, StatusBadge } from "@/components/shared";
import { getContactClientFlowDetail } from "@/lib/clientflow/contact-detail";

export const metadata: Metadata = {
  title: "Contact | CRM Workspace",
};

export const dynamic = "force-dynamic";

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "services", label: "Services" },
  { id: "activity", label: "Activity" },
  { id: "emails", label: "Emails" },
  { id: "workflows", label: "Workflows", placeholder: true },
  { id: "notes", label: "Notes", placeholder: true },
] as const;

function formatWhen(value?: string) {
  if (!value) return "—";
  return new Date(value).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default async function CrmContactDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ contactId: string }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  const { contactId } = await params;
  const { tab: tabParam } = await searchParams;
  const tab = TABS.some((t) => t.id === tabParam) ? tabParam! : "overview";

  const detail = await getContactClientFlowDetail(contactId);
  if (!detail) notFound();

  const { contact, inquiries, activities, emails, enrollments } = detail;
  const latestInquiry = inquiries[0];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="ClientFlow"
        title={contact.name}
        description={`${contact.email} · ${contact.accountName}`}
        meta={
          <div className="flex flex-wrap gap-2">
            <Link
              href={`/crm/accounts/${contact.accountId}`}
              className="text-sm font-medium text-[var(--ca-burgundy)] hover:underline"
            >
              Open account →
            </Link>
          </div>
        }
      />

      <nav className="flex flex-wrap gap-1 border-b border-black/10 pb-px" aria-label="Contact sections">
        {TABS.map((item) => {
          const active = tab === item.id;
          return (
            <Link
              key={item.id}
              href={`/crm/contacts/${contact.id}?tab=${item.id}`}
              className={`rounded-t-md px-3 py-2 text-sm font-medium ${
                active
                  ? "border border-b-white border-black/10 bg-white text-[var(--ca-app-ink)]"
                  : "text-black/50 hover:text-black/80"
              }`}
            >
              {item.label}
              {"placeholder" in item && item.placeholder ? (
                <span className="ml-1 text-[0.6rem] uppercase tracking-wide text-black/35">
                  Soon
                </span>
              ) : null}
            </Link>
          );
        })}
      </nav>

      {tab === "overview" ? (
        <div className="grid gap-4 lg:grid-cols-2">
          <section className="rounded-lg border border-black/10 bg-white p-5">
            <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-black/40">
              Contact
            </h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div>
                <dt className="text-black/40">Email</dt>
                <dd className="font-medium">{contact.email}</dd>
              </div>
              <div>
                <dt className="text-black/40">Account</dt>
                <dd className="font-medium">{contact.accountName}</dd>
              </div>
              <div>
                <dt className="text-black/40">Last inquiry</dt>
                <dd>{formatWhen(contact.lastInquiryAt)}</dd>
              </div>
              <div>
                <dt className="text-black/40">Consent</dt>
                <dd>{contact.consentAt ? formatWhen(contact.consentAt) : "—"}</dd>
              </div>
            </dl>
          </section>

          <section className="rounded-lg border border-black/10 bg-white p-5">
            <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-black/40">
              Latest inquiry
            </h2>
            {latestInquiry ? (
              <div className="mt-4 space-y-3 text-sm">
                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge tone="info">{latestInquiry.status}</StatusBadge>
                  {latestInquiry.serviceName ? (
                    <StatusBadge tone="accent">{latestInquiry.serviceName}</StatusBadge>
                  ) : null}
                </div>
                <p className="text-black/55">
                  {latestInquiry.sourcePage || latestInquiry.sourceChannel}
                </p>
                <p className="whitespace-pre-wrap text-black/70">
                  {latestInquiry.message || "No message provided."}
                </p>
                <p className="text-xs text-black/40">{formatWhen(latestInquiry.createdAt)}</p>
              </div>
            ) : (
              <p className="mt-4 text-sm text-black/50">No Talk to Expert inquiries yet.</p>
            )}
          </section>

          <section className="rounded-lg border border-black/10 bg-white p-5 lg:col-span-2">
            <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-black/40">
              Recent activity
            </h2>
            <ul className="mt-4 space-y-3">
              {activities.slice(0, 8).map((activity) => (
                <li key={activity.id} className="border-l-2 border-[var(--ca-burgundy)]/30 pl-3">
                  <p className="text-sm font-medium">{activity.subject}</p>
                  <p className="text-xs text-black/40">{formatWhen(activity.createdAt)}</p>
                </li>
              ))}
              {activities.length === 0 ? (
                <li className="text-sm text-black/50">No activity yet.</li>
              ) : null}
            </ul>
          </section>
        </div>
      ) : null}

      {tab === "activity" ? (
        activities.length === 0 ? (
          <EmptyState title="No activity" description="Timeline events will appear here." />
        ) : (
          <ol className="space-y-3">
            {activities.map((activity) => (
              <li
                key={activity.id}
                className="rounded-lg border border-black/10 bg-white px-4 py-3"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge tone="neutral">{activity.type}</StatusBadge>
                  <p className="text-sm font-medium">{activity.subject}</p>
                </div>
                {activity.body ? (
                  <p className="mt-2 text-sm text-black/55">{activity.body}</p>
                ) : null}
                <p className="mt-2 text-xs text-black/40">{formatWhen(activity.createdAt)}</p>
              </li>
            ))}
          </ol>
        )
      ) : null}

      {tab === "emails" ? (
        <ClientFlowEmailRows emails={emails} showRetry />
      ) : null}

      {tab === "services" ? <ClientFlowEnrollmentRows enrollments={enrollments} /> : null}

      {tab === "workflows" || tab === "notes" ? (
        <EmptyState
          title={`${TABS.find((t) => t.id === tab)?.label} coming in a later phase`}
          description="Phase 2A focuses on service enrollments. Workflows and notes follow later."
        />
      ) : null}

      {tab === "overview" && inquiries.length > 1 ? (
        <section className="rounded-lg border border-black/10 bg-white p-5">
          <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-black/40">
            All inquiries ({inquiries.length})
          </h2>
          <ul className="mt-4 divide-y divide-black/5">
            {inquiries.map((inquiry) => (
              <li key={inquiry.id} className="py-3 text-sm">
                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge tone="info">{inquiry.status}</StatusBadge>
                  <span className="font-medium">
                    {inquiry.serviceName ?? "General"}
                  </span>
                  <span className="text-black/40">{formatWhen(inquiry.createdAt)}</span>
                </div>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
