"use client";

import { useTransition } from "react";

import { moveOpportunityStageAction } from "@/lib/crm/actions";
import { opportunityStageLabels } from "@/types/crm";
import type { OpportunityStage } from "@/types/crm";

const STAGES = Object.keys(opportunityStageLabels) as OpportunityStage[];

export default function OpportunityStageSelect({
  opportunityId,
  accountId,
  stage,
}: {
  opportunityId: string;
  accountId: string;
  stage: OpportunityStage;
}) {
  const [pending, startTransition] = useTransition();

  function handleChange(next: OpportunityStage) {
    startTransition(async () => {
      await moveOpportunityStageAction({ opportunityId, accountId, stage: next });
    });
  }

  return (
    <select
      value={stage}
      disabled={pending}
      onChange={(event) => handleChange(event.target.value as OpportunityStage)}
      className="rounded-md border border-black/15 px-2 py-1 text-xs font-medium disabled:opacity-50"
    >
      {STAGES.map((value) => (
        <option key={value} value={value}>
          {opportunityStageLabels[value]}
        </option>
      ))}
    </select>
  );
}
