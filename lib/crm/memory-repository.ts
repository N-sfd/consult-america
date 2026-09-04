import {
  seedAccounts,
  seedActivities,
  seedContacts,
  seedOpportunities,
} from "@/data/crm/seed";
import type {
  AccountDetail,
  AccountListItem,
  ContactListItem,
  CreateAccountInput,
  CreateContactInput,
  CreateOpportunityInput,
  CrmRepository,
  LogActivityInput,
  OpportunityListItem,
  PipelineSummary,
} from "@/lib/crm/repository";
import {
  OPPORTUNITY_PIPELINE,
  OPPORTUNITY_TERMINAL_STAGES,
  type Account,
  type Activity,
  type Contact,
  type Opportunity,
} from "@/types/crm";

function createId(prefix: string) {
  return `${prefix}-${crypto.randomUUID()}`;
}

function nowIso() {
  return new Date().toISOString();
}

function isOpenStage(opportunity: Opportunity) {
  return !OPPORTUNITY_TERMINAL_STAGES.includes(opportunity.stage);
}

/**
 * In-memory CRM repository. Real writes (account/contact/opportunity
 * creation, stage moves, activity logging) so the CRM Workspace can be
 * exercised end to end locally without a Supabase project.
 */
export function createMemoryCrmRepository(): CrmRepository {
  const accounts: Account[] = [...seedAccounts];
  const contacts: Contact[] = [...seedContacts];
  const opportunities: Opportunity[] = [...seedOpportunities];
  const activities: Activity[] = [...seedActivities];

  return {
    async listAccounts(): Promise<AccountListItem[]> {
      return accounts
        .map((account) => {
          const accountContacts = contacts.filter(
            (c) => c.accountId === account.id,
          );
          const accountOpportunities = opportunities.filter(
            (o) => o.accountId === account.id,
          );
          const open = accountOpportunities.filter(isOpenStage);

          return {
            id: account.id,
            name: account.name,
            industry: account.industry,
            tier: account.tier,
            status: account.status,
            contactCount: accountContacts.length,
            openOpportunityCount: open.length,
            openPipelineValue: open.reduce((sum, o) => sum + o.amount, 0),
            updatedAt: account.updatedAt,
          };
        })
        .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
    },

    async getAccountDetail(accountId: string): Promise<AccountDetail | undefined> {
      const account = accounts.find((a) => a.id === accountId);
      if (!account) return undefined;

      return {
        account,
        contacts: contacts.filter((c) => c.accountId === accountId),
        opportunities: opportunities
          .filter((o) => o.accountId === accountId)
          .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)),
        activities: activities
          .filter((a) => a.accountId === accountId)
          .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
      };
    },

    async listOpportunities(): Promise<OpportunityListItem[]> {
      return opportunities
        .map((opportunity) => ({
          ...opportunity,
          accountName:
            accounts.find((a) => a.id === opportunity.accountId)?.name ?? "—",
        }))
        .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
    },

    async listContacts(): Promise<ContactListItem[]> {
      return contacts
        .map((contact) => ({
          ...contact,
          accountName:
            accounts.find((a) => a.id === contact.accountId)?.name ?? "—",
        }))
        .sort((a, b) => a.name.localeCompare(b.name));
    },

    async getPipelineSummary(): Promise<PipelineSummary> {
      const stages = [...OPPORTUNITY_PIPELINE, ...OPPORTUNITY_TERMINAL_STAGES].map(
        (stage) => {
          const inStage = opportunities.filter((o) => o.stage === stage);
          return {
            stage,
            count: inStage.length,
            value: inStage.reduce((sum, o) => sum + o.amount, 0),
          };
        },
      );

      const open = opportunities.filter(isOpenStage);
      const won = opportunities.filter((o) => o.stage === "CLOSED_WON");
      const lost = opportunities.filter((o) => o.stage === "CLOSED_LOST");
      const decided = won.length + lost.length;

      return {
        stages,
        openValue: open.reduce((sum, o) => sum + o.amount, 0),
        wonValue: won.reduce((sum, o) => sum + o.amount, 0),
        winRate: decided === 0 ? 0 : Math.round((won.length / decided) * 100),
      };
    },

    async createAccount(input: CreateAccountInput): Promise<Account> {
      const now = nowIso();
      const account: Account = {
        id: createId("acct"),
        name: input.name,
        industry: input.industry,
        website: input.website,
        tier: input.tier,
        status: input.status,
        ownerUserId: input.ownerUserId,
        createdAt: now,
        updatedAt: now,
      };
      accounts.push(account);
      return account;
    },

    async createContact(input: CreateContactInput): Promise<Contact> {
      const now = nowIso();
      const contact: Contact = {
        id: createId("cont"),
        accountId: input.accountId,
        name: input.name,
        title: input.title,
        email: input.email,
        phone: input.phone,
        isPrimary: input.isPrimary ?? false,
        createdAt: now,
        updatedAt: now,
      };
      contacts.push(contact);
      return contact;
    },

    async createOpportunity(input: CreateOpportunityInput): Promise<Opportunity> {
      const now = nowIso();
      const opportunity: Opportunity = {
        id: createId("opp"),
        accountId: input.accountId,
        name: input.name,
        stage: input.stage ?? "DISCOVER",
        amount: input.amount,
        currency: input.currency ?? "USD",
        probability: input.probability ?? 10,
        expectedCloseDate: input.expectedCloseDate,
        ownerUserId: input.ownerUserId,
        createdAt: now,
        updatedAt: now,
      };
      opportunities.push(opportunity);

      const account = accounts.find((a) => a.id === input.accountId);
      if (account) account.updatedAt = now;

      return opportunity;
    },

    async moveOpportunityStage(opportunityId, stage) {
      const opportunity = opportunities.find((o) => o.id === opportunityId);
      if (!opportunity) return undefined;

      const now = nowIso();
      opportunity.stage = stage;
      opportunity.updatedAt = now;
      if (stage === "CLOSED_WON") opportunity.probability = 100;
      if (stage === "CLOSED_LOST") opportunity.probability = 0;

      const account = accounts.find((a) => a.id === opportunity.accountId);
      if (account) account.updatedAt = now;

      activities.push({
        id: createId("act"),
        accountId: opportunity.accountId,
        opportunityId: opportunity.id,
        type: "NOTE",
        subject: `Stage changed to ${stage}`,
        createdByUserId: opportunity.ownerUserId,
        createdAt: now,
      });

      return opportunity;
    },

    async logActivity(input: LogActivityInput): Promise<Activity> {
      const activity: Activity = {
        id: createId("act"),
        accountId: input.accountId,
        opportunityId: input.opportunityId,
        contactId: input.contactId,
        type: input.type,
        subject: input.subject,
        body: input.body,
        dueDate: input.dueDate,
        createdByUserId: input.createdByUserId,
        createdAt: nowIso(),
      };
      activities.push(activity);

      const account = accounts.find((a) => a.id === input.accountId);
      if (account) account.updatedAt = activity.createdAt;

      return activity;
    },
  };
}
