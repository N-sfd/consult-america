import type { Metadata } from "next";
import { notFound } from "next/navigation";

import ActivityLogForm from "@/components/crm/activity-log-form";
import ContactCreateForm from "@/components/crm/contact-create-form";
import OpportunityCreateForm from "@/components/crm/opportunity-create-form";
import OpportunityStageSelect from "@/components/crm/opportunity-stage-select";
import { crmRepository } from "@/lib/crm";
import {
  accountStatusLabels,
  accountTierLabels,
  activityTypeLabels,
} from "@/types/crm";

export const metadata: Metadata = {
  title: "Account | CRM Workspace",
};

export const dynamic = "force-dynamic";

function formatCurrency(amount: number) {
  return amount.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

function formatDate(iso?: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default async function CrmAccountDetailPage({
  params,
}: {
  params: Promise<{ accountId: string }>;
}) {
  const { accountId } = await params;
  const detail = await crmRepository.getAccountDetail(accountId);
  if (!detail) notFound();

  const { account, contacts, opportunities, activities } = detail;
  const openValue = opportunities
    .filter((o) => o.stage !== "CLOSED_WON" && o.stage !== "CLOSED_LOST")
    .reduce((sum, o) => sum + o.amount, 0);

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.12em] text-black/40">
          {account.industry} · {accountTierLabels[account.tier]}
        </p>
        <h1 className="mt-1 text-3xl font-semibold tracking-[-0.04em]">
          {account.name}
        </h1>
        <p className="mt-2 text-black/55">
          {accountStatusLabels[account.status]}
          {account.website ? ` · ${account.website}` : ""}
        </p>
      </div>

      <section className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-black/10 bg-white p-5">
          <p className="text-xs uppercase tracking-[0.12em] text-black/40">
            Open Pipeline
          </p>
          <p className="mt-3 text-2xl font-semibold tracking-[-0.04em]">
            {formatCurrency(openValue)}
          </p>
        </div>
        <div className="rounded-lg border border-black/10 bg-white p-5">
          <p className="text-xs uppercase tracking-[0.12em] text-black/40">
            Opportunities
          </p>
          <p className="mt-3 text-2xl font-semibold tracking-[-0.04em]">
            {opportunities.length}
          </p>
        </div>
        <div className="rounded-lg border border-black/10 bg-white p-5">
          <p className="text-xs uppercase tracking-[0.12em] text-black/40">
            Contacts
          </p>
          <p className="mt-3 text-2xl font-semibold tracking-[-0.04em]">
            {contacts.length}
          </p>
        </div>
      </section>

      <section className="rounded-lg border border-black/10 bg-white p-6">
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-black/40">
            Opportunities
          </h2>
          <OpportunityCreateForm accountId={account.id} />
        </div>
        {opportunities.length === 0 ? (
          <p className="mt-4 text-sm text-black/50">No opportunities yet.</p>
        ) : (
          <ul className="mt-4 divide-y divide-black/5 text-sm">
            {opportunities.map((opportunity) => (
              <li
                key={opportunity.id}
                className="flex flex-wrap items-center justify-between gap-3 py-3"
              >
                <div>
                  <p className="font-medium">{opportunity.name}</p>
                  <p className="mt-1 text-black/55">
                    {formatCurrency(opportunity.amount)} ·{" "}
                    {opportunity.probability}% · Close{" "}
                    {formatDate(opportunity.expectedCloseDate)}
                  </p>
                </div>
                <OpportunityStageSelect
                  opportunityId={opportunity.id}
                  accountId={account.id}
                  stage={opportunity.stage}
                />
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-lg border border-black/10 bg-white p-6">
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-black/40">
            Contacts
          </h2>
          <ContactCreateForm accountId={account.id} />
        </div>
        {contacts.length === 0 ? (
          <p className="mt-4 text-sm text-black/50">No contacts yet.</p>
        ) : (
          <ul className="mt-4 divide-y divide-black/5 text-sm">
            {contacts.map((contact) => (
              <li key={contact.id} className="py-3">
                <p className="font-medium">
                  {contact.name}
                  {contact.isPrimary && (
                    <span className="ml-2 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800">
                      Primary
                    </span>
                  )}
                </p>
                <p className="mt-1 text-black/55">
                  {[contact.title, contact.email, contact.phone]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-lg border border-black/10 bg-white p-6">
        <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-black/40">
          Activity Timeline
        </h2>
        <div className="mt-4">
          <ActivityLogForm accountId={account.id} />
        </div>
        {activities.length === 0 ? (
          <p className="mt-4 text-sm text-black/50">No activity logged yet.</p>
        ) : (
          <ul className="mt-6 space-y-3 border-t border-black/5 pt-4 text-sm">
            {activities.map((activity) => (
              <li key={activity.id}>
                <p className="font-medium">
                  {activityTypeLabels[activity.type]} · {activity.subject}
                </p>
                {activity.body && (
                  <p className="mt-1 text-black/55">{activity.body}</p>
                )}
                <p className="mt-1 text-xs text-black/40">
                  {formatDate(activity.createdAt)}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
