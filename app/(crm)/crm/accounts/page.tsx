import type { Metadata } from "next";
import Link from "next/link";

import AccountCreateForm from "@/components/crm/account-create-form";
import { crmRepository } from "@/lib/crm";
import { accountStatusLabels, accountTierLabels } from "@/types/crm";

export const metadata: Metadata = {
  title: "Accounts | CRM Workspace",
};

export const dynamic = "force-dynamic";

function formatCurrency(amount: number) {
  return amount.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

export default async function CrmAccountsPage() {
  const accounts = await crmRepository.listAccounts();

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-[-0.04em]">
            Accounts
          </h1>
          <p className="mt-2 text-black/55">
            Every account your team owns, with open pipeline at a glance.
          </p>
        </div>
        <AccountCreateForm />
      </div>

      {accounts.length === 0 ? (
        <div className="rounded-lg border border-black/10 bg-white px-5 py-8 text-sm text-black/50">
          No accounts yet.
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-black/10 bg-white">
          <ul className="divide-y divide-black/5">
            {accounts.map((account) => (
              <li key={account.id}>
                <Link
                  href={`/crm/accounts/${account.id}`}
                  className="block px-5 py-4 hover:bg-black/[0.02]"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-medium">{account.name}</p>
                      <p className="mt-1 text-sm text-black/55">
                        {account.industry} · {accountTierLabels[account.tier]}
                        {" · "}
                        {account.contactCount} contact
                        {account.contactCount === 1 ? "" : "s"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">
                        {formatCurrency(account.openPipelineValue)}
                      </p>
                      <p className="mt-1 text-xs uppercase tracking-[0.1em] text-black/45">
                        {accountStatusLabels[account.status]}
                      </p>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
