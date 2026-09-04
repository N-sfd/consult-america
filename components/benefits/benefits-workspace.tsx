"use client";

import { useState, useTransition } from "react";

import { cancelElectionAction, submitElectionAction } from "@/app/actions/benefits-actions";
import {
  benefitsCoverageTierLabels,
  benefitsPlanCategoryLabels,
} from "@/types/self-service";
import type {
  BenefitsCoverageTier,
  BenefitsElection,
  BenefitsPlan,
} from "@/types/self-service";

const TIERS = Object.keys(benefitsCoverageTierLabels) as BenefitsCoverageTier[];

function formatCurrency(amount: number) {
  return amount.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

export default function BenefitsWorkspace({
  plans,
  elections,
}: {
  plans: BenefitsPlan[];
  elections: BenefitsElection[];
}) {
  const activeElections = elections.filter((e) => e.status === "ACTIVE");
  const electionsByPlanId = new Map(
    activeElections.map((election) => [election.planId, election]),
  );

  const plansByCategory = plans.reduce<Record<string, BenefitsPlan[]>>(
    (acc, plan) => {
      (acc[plan.category] ??= []).push(plan);
      return acc;
    },
    {},
  );

  return (
    <div className="space-y-8">
      <section className="rounded-lg border border-black/10 bg-white p-6">
        <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-black/40">
          My Elections
        </h2>
        {activeElections.length === 0 ? (
          <p className="mt-4 text-sm text-black/50">
            No active elections yet. Choose a plan below to enroll.
          </p>
        ) : (
          <ul className="mt-4 divide-y divide-black/5 text-sm">
            {activeElections.map((election) => {
              const plan = plans.find((p) => p.id === election.planId);
              return (
                <ElectionRow key={election.id} election={election} planName={plan?.name} />
              );
            })}
          </ul>
        )}
      </section>

      {Object.entries(plansByCategory).map(([category, categoryPlans]) => (
        <section key={category} className="space-y-4">
          <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-black/40">
            {benefitsPlanCategoryLabels[category as keyof typeof benefitsPlanCategoryLabels]}
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {categoryPlans.map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                currentElection={electionsByPlanId.get(plan.id)}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function ElectionRow({
  election,
  planName,
}: {
  election: BenefitsElection;
  planName?: string;
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleCancel() {
    setError(null);
    startTransition(async () => {
      const result = await cancelElectionAction({ electionId: election.id });
      if (!result.ok) setError(result.message);
    });
  }

  return (
    <li className="flex flex-wrap items-center justify-between gap-3 py-3">
      <div>
        <p className="font-medium">{planName ?? "Plan"}</p>
        <p className="mt-1 text-black/55">
          {benefitsCoverageTierLabels[election.coverageTier]} · Effective{" "}
          {election.effectiveDate}
        </p>
        {error && (
          <p className="mt-1 text-xs text-red-600" role="alert">
            {error}
          </p>
        )}
      </div>
      <button
        type="button"
        onClick={handleCancel}
        disabled={pending}
        className="rounded-md border border-black/15 px-3 py-1.5 text-xs font-medium hover:bg-black/[0.03] disabled:opacity-50"
      >
        Cancel
      </button>
    </li>
  );
}

function PlanCard({
  plan,
  currentElection,
}: {
  plan: BenefitsPlan;
  currentElection?: BenefitsElection;
}) {
  const [tier, setTier] = useState<BenefitsCoverageTier>(
    currentElection?.coverageTier ?? "EMPLOYEE_ONLY",
  );
  const [dependentCount, setDependentCount] = useState(
    currentElection?.dependentCount ?? 0,
  );
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleElect() {
    setMessage(null);
    setError(null);
    startTransition(async () => {
      const result = await submitElectionAction({
        planId: plan.id,
        coverageTier: tier,
        dependentCount,
        effectiveDate: new Date().toISOString().slice(0, 10),
      });
      if (result.ok) setMessage(result.message);
      else setError(result.message);
    });
  }

  return (
    <div className="rounded-lg border border-black/10 bg-white p-5">
      <p className="font-medium">{plan.name}</p>
      <p className="mt-1 text-sm text-black/55">{plan.carrier}</p>
      <p className="mt-2 text-sm text-black/60">{plan.description}</p>

      <p className="mt-3 text-2xl font-semibold tracking-[-0.04em]">
        {formatCurrency(plan.monthlyCostByTier[tier])}
        <span className="ml-1 text-sm font-normal text-black/45">/mo</span>
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <select
          value={tier}
          onChange={(event) => setTier(event.target.value as BenefitsCoverageTier)}
          className="rounded-md border border-black/15 px-2 py-1.5 text-sm"
        >
          {TIERS.map((value) => (
            <option key={value} value={value}>
              {benefitsCoverageTierLabels[value]}
            </option>
          ))}
        </select>
        {(tier === "EMPLOYEE_CHILDREN" || tier === "FAMILY") && (
          <input
            type="number"
            min={0}
            value={dependentCount}
            onChange={(event) => setDependentCount(Number(event.target.value))}
            className="w-20 rounded-md border border-black/15 px-2 py-1.5 text-sm"
            aria-label="Dependent count"
          />
        )}
        <button
          type="button"
          onClick={handleElect}
          disabled={pending}
          className="rounded-md bg-[var(--ca-blue)] px-3 py-1.5 text-xs font-medium text-white disabled:opacity-50"
        >
          {currentElection ? "Change Plan" : "Elect Plan"}
        </button>
      </div>

      {message && (
        <p className="mt-2 text-xs text-emerald-700" role="status">
          {message}
        </p>
      )}
      {error && (
        <p className="mt-2 text-xs text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
