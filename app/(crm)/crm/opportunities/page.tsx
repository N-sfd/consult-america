import type { Metadata } from "next";
import Link from "next/link";

import OpportunityStageSelect from "@/components/crm/opportunity-stage-select";
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
      <div>
        <h1 className="text-3xl font-semibold tracking-[-0.04em]">
          Opportunities
        </h1>
        <p className="mt-2 text-black/55">
          Every deal across all accounts, organized by pipeline stage.
        </p>
      </div>

      <div className="-mx-4 overflow-x-auto px-4 pb-2 lg:mx-0 lg:px-0">
        <div className="flex gap-4">
          {stages.map((stage) => {
            const inStage = opportunities.filter((o) => o.stage === stage);
            const stageValue = inStage.reduce((sum, o) => sum + o.amount, 0);

            return (
              <div
                key={stage}
                className="w-[270px] shrink-0 rounded-lg border border-black/10 bg-white p-4"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.1em] text-black/45">
                  {opportunityStageLabels[stage]}
                </p>
                <p className="mt-1 text-sm text-black/40">
                  {inStage.length} · {formatCurrency(stageValue)}
                </p>

                <div className="mt-4 space-y-3">
                  {inStage.length === 0 ? (
                    <p className="text-sm text-black/40">No deals in this stage.</p>
                  ) : (
                    inStage.map((opportunity) => (
                      <div
                        key={opportunity.id}
                        className="rounded-md border border-black/10 p-3 text-sm"
                      >
                        <Link
                          href={`/crm/accounts/${opportunity.accountId}`}
                          className="font-medium hover:text-[var(--ca-blue)]"
                        >
                          {opportunity.name}
                        </Link>
                        <p className="mt-1 truncate text-black/55">
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
    </div>
  );
}
