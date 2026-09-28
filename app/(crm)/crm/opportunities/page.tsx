import type { Metadata } from "next";
import Link from "next/link";

import OpportunityStageSelect from "@/components/crm/opportunity-stage-select";
import { EmptyState, PageHeader } from "@/components/shared";
import { crmRepository } from "@/lib/crm";
import { OPPORTUNITY_PIPELINE, OPPORTUNITY_TERMINAL_STAGES, opportunityStageLabels } from "@/types/crm";

export const metadata: Metadata = {
  title: "Opportunities | CRM Workspace",
};

export const dynamic = "force-dynamic";

function formatCurrency(amount: number) {
  return amount.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

export default async function CrmOpportunitiesPage() {
  const opportunities = await crmRepository.listOpportunities();
  const stages = [...OPPORTUNITY_PIPELINE, ...OPPORTUNITY_TERMINAL_STAGES];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Opportunities"
        description="Every deal across all accounts, organized by pipeline stage."
      />

      {opportunities.length === 0 ? (
        <EmptyState
          title="No opportunities yet"
          description="Add a deal from an account to populate the pipeline board."
        />
      ) : (
        <div className="-mx-4 overflow-x-auto px-4 pb-2 lg:mx-0 lg:px-0">
          <div className="flex gap-4">
            {stages.map((stage) => {
              const inStage = opportunities.filter((o) => o.stage === stage);
              const stageValue = inStage.reduce((sum, o) => sum + o.amount, 0);

              return (
                <div
                  key={stage}
                  className="w-[270px] shrink-0 rounded-lg border border-[var(--ca-platform-border)] bg-white p-4"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[var(--ca-platform-muted)]">
                    {opportunityStageLabels[stage]}
                  </p>
                  <p className="mt-1 text-sm text-[var(--ca-platform-muted)]">
                    {inStage.length} · {formatCurrency(stageValue)}
                  </p>

                  <div className="mt-4 space-y-3">
                    {inStage.length === 0 ? (
                      <p className="text-sm text-[var(--ca-platform-muted)]">No deals in this stage.</p>
                    ) : (
                      inStage.map((opportunity) => (
                        <div
                          key={opportunity.id}
                          className="rounded-md border border-[var(--ca-platform-border)] p-3 text-sm"
                        >
                          <Link
                            href={`/crm/accounts/${opportunity.accountId}`}
                            className="font-medium hover:text-[var(--ca-platform-mid)]"
                          >
                            {opportunity.name}
                          </Link>
                          <p className="mt-1 truncate text-[var(--ca-platform-muted)]">
                            {opportunity.accountName}
                          </p>
                          <p className="mt-1 font-semibold">
                            {formatCurrency(opportunity.amount)}
                          </p>
                          <div className="mt-2">
                            <OpportunityStageSelect
                              opportunityId={opportunity.id}
                              accountId={opportunity.accountId}
                              stage={opportunity.stage}
                            />
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
