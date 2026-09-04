import type { Metadata } from "next";
import Link from "next/link";

import { crmRepository } from "@/lib/crm";
import { opportunityStageLabels } from "@/types/crm";

export const metadata: Metadata = {
  title: "CRM Workspace | ConsultAmerica",
};

export const dynamic = "force-dynamic";

function formatCurrency(amount: number) {
  return amount.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

export default async function CrmDashboardPage() {
  const [accounts, pipeline] = await Promise.all([
    crmRepository.listAccounts(),
    crmRepository.getPipelineSummary(),
  ]);

  const topAccounts = [...accounts]
    .sort((a, b) => b.openPipelineValue - a.openPipelineValue)
    .slice(0, 5);

  return (
    <div className="space-y-7">
      <section className="ca-platform-hero">
        <div className="relative z-[1]">
          <h1 className="text-[clamp(1.75rem,2.4vw,2.25rem)] font-semibold tracking-[-0.03em]">
            CRM Workspace
          </h1>
          <p className="mt-1.5 text-[0.95rem] text-[var(--ca-platform-muted)]">
            Pipeline health and account activity at a glance.
          </p>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <div className="ca-platform-card ca-platform-kpi">
          <p className="ca-platform-kpi-label">Open Pipeline</p>
          <p className="ca-platform-kpi-value">{formatCurrency(pipeline.openValue)}</p>
        </div>
        <div className="ca-platform-card ca-platform-kpi">
          <p className="ca-platform-kpi-label">Won This Period</p>
          <p className="ca-platform-kpi-value">{formatCurrency(pipeline.wonValue)}</p>
        </div>
        <div className="ca-platform-card ca-platform-kpi">
          <p className="ca-platform-kpi-label">Win Rate</p>
          <p className="ca-platform-kpi-value">{pipeline.winRate}%</p>
        </div>
      </section>

      <section className="ca-platform-card p-6">
        <h2 className="ca-platform-kpi-label">Pipeline by Stage</h2>
        <div className="ca-platform-pipeline mt-5">
          {pipeline.stages.map((stage) => (
            <div
              key={stage.stage}
              className={`ca-platform-pipeline-stage ${stage.count > 0 ? "is-active" : ""}`}
            >
              <p className="ca-platform-pipeline-count">{stage.count}</p>
              <p className="ca-platform-pipeline-label">
                {opportunityStageLabels[stage.stage]}
              </p>
              <p className="mt-1 text-[0.7rem] text-[var(--ca-platform-muted)]">
                {formatCurrency(stage.value)}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="ca-platform-card p-6">
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="ca-platform-kpi-label">Top Accounts by Open Pipeline</h2>
          <Link
            href="/crm/accounts"
            className="text-sm font-semibold text-[var(--ca-platform-mid)] hover:underline"
          >
            View all
          </Link>
        </div>
        {topAccounts.length === 0 ? (
          <p className="mt-4 text-sm text-[var(--ca-platform-muted)]">No accounts yet.</p>
        ) : (
          <ul className="mt-4 divide-y divide-[var(--ca-platform-border)] text-sm">
            {topAccounts.map((account) => (
              <li key={account.id}>
                <Link
                  href={`/crm/accounts/${account.id}`}
                  className="flex flex-wrap items-center justify-between gap-3 py-3 hover:text-[var(--ca-platform-mid)]"
                >
                  <div>
                    <p className="font-medium">{account.name}</p>
                    <p className="mt-1 text-[var(--ca-platform-muted)]">
                      {account.industry} · {account.openOpportunityCount} open{" "}
                      {account.openOpportunityCount === 1 ? "deal" : "deals"}
                    </p>
                  </div>
                  <span className="font-semibold">
                    {formatCurrency(account.openPipelineValue)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
