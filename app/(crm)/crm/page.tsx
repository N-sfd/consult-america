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
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-[-0.04em]">
          CRM Workspace
        </h1>
        <p className="mt-2 text-black/55">
          Pipeline health and account activity at a glance.
        </p>
      </div>

      <section className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-black/10 bg-white p-5">
          <p className="text-xs uppercase tracking-[0.12em] text-black/40">
            Open Pipeline
          </p>
          <p className="mt-3 text-3xl font-semibold tracking-[-0.04em]">
            {formatCurrency(pipeline.openValue)}
          </p>
        </div>
        <div className="rounded-lg border border-black/10 bg-white p-5">
          <p className="text-xs uppercase tracking-[0.12em] text-black/40">
            Won This Period
          </p>
          <p className="mt-3 text-3xl font-semibold tracking-[-0.04em]">
            {formatCurrency(pipeline.wonValue)}
          </p>
        </div>
        <div className="rounded-lg border border-black/10 bg-white p-5">
          <p className="text-xs uppercase tracking-[0.12em] text-black/40">
            Win Rate
          </p>
          <p className="mt-3 text-3xl font-semibold tracking-[-0.04em]">
            {pipeline.winRate}%
          </p>
        </div>
      </section>

      <section className="rounded-lg border border-black/10 bg-white p-6">
        <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-black/40">
          Pipeline by Stage
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {pipeline.stages.map((stage) => (
            <div
              key={stage.stage}
              className="rounded-md bg-[#F8FAFC] px-3 py-3"
            >
              <p className="text-xs text-black/45">
                {opportunityStageLabels[stage.stage]}
              </p>
              <p className="mt-1 text-lg font-semibold">
                {formatCurrency(stage.value)}
              </p>
              <p className="text-xs text-black/40">
                {stage.count} {stage.count === 1 ? "deal" : "deals"}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-lg border border-black/10 bg-white p-6">
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-black/40">
            Top Accounts by Open Pipeline
          </h2>
          <Link
            href="/crm/accounts"
            className="text-sm font-medium text-[var(--ca-blue)] hover:underline"
          >
            View all
          </Link>
        </div>
        {topAccounts.length === 0 ? (
          <p className="mt-4 text-sm text-black/50">No accounts yet.</p>
        ) : (
          <ul className="mt-4 divide-y divide-black/5 text-sm">
            {topAccounts.map((account) => (
              <li key={account.id}>
                <Link
                  href={`/crm/accounts/${account.id}`}
                  className="flex flex-wrap items-center justify-between gap-3 py-3 hover:text-[var(--ca-blue)]"
                >
                  <div>
                    <p className="font-medium">{account.name}</p>
                    <p className="mt-1 text-black/55">
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
