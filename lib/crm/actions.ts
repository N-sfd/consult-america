"use server";

import { revalidatePath } from "next/cache";

import { crmRepository } from "@/lib/crm";
import { getCrmSession } from "@/lib/crm/session";
import type { ActivityType, AccountStatus, AccountTier, OpportunityStage } from "@/types/crm";

export type CrmActionResult = {
  ok: boolean;
  message: string;
};

function revalidateCrmPaths(accountId?: string) {
  revalidatePath("/crm");
  revalidatePath("/crm/accounts");
  revalidatePath("/crm/opportunities");
  if (accountId) revalidatePath(`/crm/accounts/${accountId}`);
}

export async function createAccountAction(input: {
  name: string;
  industry: string;
  website?: string;
  tier: AccountTier;
  status: AccountStatus;
}): Promise<CrmActionResult> {
  try {
    if (!input.name.trim()) throw new Error("Account name is required");

    const session = await getCrmSession();
    const account = await crmRepository.createAccount({
      name: input.name.trim(),
      industry: input.industry.trim() || "—",
      website: input.website?.trim() || undefined,
      tier: input.tier,
      status: input.status,
      ownerUserId: session.userId,
    });

    revalidateCrmPaths(account.id);
    return { ok: true, message: "Account created." };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Unable to create account.",
    };
  }
}

export async function createContactAction(input: {
  accountId: string;
  name: string;
  title?: string;
  email: string;
  phone?: string;
  isPrimary?: boolean;
}): Promise<CrmActionResult> {
  try {
    if (!input.name.trim()) throw new Error("Contact name is required");
    if (!input.email.trim()) throw new Error("Contact email is required");

    await crmRepository.createContact({
      accountId: input.accountId,
      name: input.name.trim(),
      title: input.title?.trim() || undefined,
      email: input.email.trim(),
      phone: input.phone?.trim() || undefined,
      isPrimary: input.isPrimary,
    });

    revalidateCrmPaths(input.accountId);
    return { ok: true, message: "Contact added." };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Unable to add contact.",
    };
  }
}

export async function createOpportunityAction(input: {
  accountId: string;
  name: string;
  amount: number;
  probability?: number;
  expectedCloseDate?: string;
}): Promise<CrmActionResult> {
  try {
    if (!input.name.trim()) throw new Error("Opportunity name is required");
    if (!(input.amount > 0)) throw new Error("Amount must be greater than zero");

    const session = await getCrmSession();
    await crmRepository.createOpportunity({
      accountId: input.accountId,
      name: input.name.trim(),
      amount: input.amount,
      probability: input.probability,
      expectedCloseDate: input.expectedCloseDate || undefined,
      ownerUserId: session.userId,
    });

    revalidateCrmPaths(input.accountId);
    return { ok: true, message: "Opportunity created." };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Unable to create opportunity.",
    };
  }
}

export async function moveOpportunityStageAction(input: {
  opportunityId: string;
  accountId: string;
  stage: OpportunityStage;
}): Promise<CrmActionResult> {
  try {
    const opportunity = await crmRepository.moveOpportunityStage(
      input.opportunityId,
      input.stage,
    );
    if (!opportunity) throw new Error("Opportunity not found");

    revalidateCrmPaths(input.accountId);
    return { ok: true, message: "Opportunity stage updated." };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Unable to update stage.",
    };
  }
}

export async function logActivityAction(input: {
  accountId: string;
  opportunityId?: string;
  contactId?: string;
  type: ActivityType;
  subject: string;
  body?: string;
}): Promise<CrmActionResult> {
  try {
    if (!input.subject.trim()) throw new Error("Subject is required");

    const session = await getCrmSession();
    await crmRepository.logActivity({
      accountId: input.accountId,
      opportunityId: input.opportunityId,
      contactId: input.contactId,
      type: input.type,
      subject: input.subject.trim(),
      body: input.body?.trim() || undefined,
      createdByUserId: session.userId,
    });

    revalidateCrmPaths(input.accountId);
    return { ok: true, message: "Activity logged." };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Unable to log activity.",
    };
  }
}
