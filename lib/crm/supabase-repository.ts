import { getSupabaseServiceClient } from "@/app/lib/supabase/server";
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

function mapAccount(row: Record<string, unknown>): Account {
  return {
    id: row.id as string,
    name: row.name as string,
    industry: row.industry as string,
    website: (row.website as string) ?? undefined,
    tier: row.tier as Account["tier"],
    status: row.status as Account["status"],
    ownerUserId: row.owner_user_id as string,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

function mapContact(row: Record<string, unknown>): Contact {
  return {
    id: row.id as string,
    accountId: row.account_id as string,
    name: row.name as string,
    title: (row.title as string) ?? undefined,
    email: row.email as string,
    phone: (row.phone as string) ?? undefined,
    isPrimary: Boolean(row.is_primary),
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

function mapOpportunity(row: Record<string, unknown>): Opportunity {
  return {
    id: row.id as string,
    accountId: row.account_id as string,
    name: row.name as string,
    stage: row.stage as Opportunity["stage"],
    amount: Number(row.amount),
    currency: row.currency as string,
    probability: Number(row.probability),
    expectedCloseDate: (row.expected_close_date as string) ?? undefined,
    ownerUserId: row.owner_user_id as string,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

function mapActivity(row: Record<string, unknown>): Activity {
  return {
    id: row.id as string,
    accountId: row.account_id as string,
    opportunityId: (row.opportunity_id as string) ?? undefined,
    contactId: (row.contact_id as string) ?? undefined,
    type: row.type as Activity["type"],
    subject: row.subject as string,
    body: (row.body as string) ?? undefined,
    dueDate: (row.due_date as string) ?? undefined,
    completedAt: (row.completed_at as string) ?? undefined,
    createdByUserId: row.created_by_user_id as string,
    createdAt: row.created_at as string,
  };
}

function isOpenStage(opportunity: { stage: Opportunity["stage"] }) {
  return !OPPORTUNITY_TERMINAL_STAGES.includes(opportunity.stage);
}

export function createSupabaseCrmRepository(): CrmRepository {
  return {
    async listAccounts(): Promise<AccountListItem[]> {
      const client = getSupabaseServiceClient();
      if (!client) return [];

      const [{ data: accountRows }, { data: contactRows }, { data: opportunityRows }] =
        await Promise.all([
          client.from("crm_accounts").select("*"),
          client.from("crm_contacts").select("id, account_id"),
          client
            .from("crm_opportunities")
            .select("id, account_id, stage, amount"),
        ]);

      return (accountRows ?? [])
        .map(mapAccount)
        .map((account) => {
          const accountContacts = (contactRows ?? []).filter(
            (c) => c.account_id === account.id,
          );
          const open = (opportunityRows ?? []).filter(
            (o) =>
              o.account_id === account.id &&
              !OPPORTUNITY_TERMINAL_STAGES.includes(
                o.stage as Opportunity["stage"],
              ),
          );

          return {
            id: account.id,
            name: account.name,
            industry: account.industry,
            tier: account.tier,
            status: account.status,
            contactCount: accountContacts.length,
            openOpportunityCount: open.length,
            openPipelineValue: open.reduce(
              (sum, o) => sum + Number(o.amount),
              0,
            ),
            updatedAt: account.updatedAt,
          };
        })
        .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
    },

    async getAccountDetail(accountId: string): Promise<AccountDetail | undefined> {
      const client = getSupabaseServiceClient();
      if (!client) return undefined;

      const { data: accountRow } = await client
        .from("crm_accounts")
        .select("*")
        .eq("id", accountId)
        .maybeSingle();
      if (!accountRow) return undefined;

      const [{ data: contactRows }, { data: opportunityRows }, { data: activityRows }] =
        await Promise.all([
          client.from("crm_contacts").select("*").eq("account_id", accountId),
          client
            .from("crm_opportunities")
            .select("*")
            .eq("account_id", accountId)
            .order("updated_at", { ascending: false }),
          client
            .from("crm_activities")
            .select("*")
            .eq("account_id", accountId)
            .order("created_at", { ascending: false }),
        ]);

      return {
        account: mapAccount(accountRow),
        contacts: (contactRows ?? []).map(mapContact),
        opportunities: (opportunityRows ?? []).map(mapOpportunity),
        activities: (activityRows ?? []).map(mapActivity),
      };
    },

    async listOpportunities(): Promise<OpportunityListItem[]> {
      const client = getSupabaseServiceClient();
      if (!client) return [];

      const [{ data: opportunityRows }, { data: accountRows }] = await Promise.all([
        client
          .from("crm_opportunities")
          .select("*")
          .order("updated_at", { ascending: false }),
        client.from("crm_accounts").select("id, name"),
      ]);

      const accountNameById = new Map(
        (accountRows ?? []).map((row) => [row.id as string, row.name as string]),
      );

      return (opportunityRows ?? []).map((row) => ({
        ...mapOpportunity(row),
        accountName: accountNameById.get(row.account_id as string) ?? "—",
      }));
    },

    async listContacts(): Promise<ContactListItem[]> {
      const client = getSupabaseServiceClient();
      if (!client) return [];

      const [{ data: contactRows }, { data: accountRows }] = await Promise.all([
        client.from("crm_contacts").select("*").order("name", { ascending: true }),
        client.from("crm_accounts").select("id, name"),
      ]);

      const accountNameById = new Map(
        (accountRows ?? []).map((row) => [row.id as string, row.name as string]),
      );

      return (contactRows ?? []).map((row) => ({
        ...mapContact(row),
        accountName: accountNameById.get(row.account_id as string) ?? "—",
      }));
    },

    async getPipelineSummary(): Promise<PipelineSummary> {
      const client = getSupabaseServiceClient();
      if (!client) {
        return {
          stages: [...OPPORTUNITY_PIPELINE, ...OPPORTUNITY_TERMINAL_STAGES].map(
            (stage) => ({ stage, count: 0, value: 0 }),
          ),
          openValue: 0,
          wonValue: 0,
          winRate: 0,
        };
      }

      const { data } = await client
        .from("crm_opportunities")
        .select("stage, amount");
      const opportunities = (data ?? []).map((row) => ({
        stage: row.stage as Opportunity["stage"],
        amount: Number(row.amount),
      }));

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
      const client = getSupabaseServiceClient();
      if (!client) throw new Error("Supabase is not configured");

      const now = new Date().toISOString();
      const { data, error } = await client
        .from("crm_accounts")
        .insert({
          id: `acct-${crypto.randomUUID()}`,
          name: input.name,
          industry: input.industry,
          website: input.website,
          tier: input.tier,
          status: input.status,
          owner_user_id: input.ownerUserId,
          created_at: now,
          updated_at: now,
        })
        .select("*")
        .single();
      if (error) throw new Error(`Failed to create account: ${error.message}`);

      return mapAccount(data);
    },

    async createContact(input: CreateContactInput): Promise<Contact> {
      const client = getSupabaseServiceClient();
      if (!client) throw new Error("Supabase is not configured");

      const now = new Date().toISOString();
      const { data, error } = await client
        .from("crm_contacts")
        .insert({
          id: `cont-${crypto.randomUUID()}`,
          account_id: input.accountId,
          name: input.name,
          title: input.title,
          email: input.email,
          phone: input.phone,
          is_primary: input.isPrimary ?? false,
          created_at: now,
          updated_at: now,
        })
        .select("*")
        .single();
      if (error) throw new Error(`Failed to create contact: ${error.message}`);

      return mapContact(data);
    },

    async createOpportunity(input: CreateOpportunityInput): Promise<Opportunity> {
      const client = getSupabaseServiceClient();
      if (!client) throw new Error("Supabase is not configured");

      const now = new Date().toISOString();
      const { data, error } = await client
        .from("crm_opportunities")
        .insert({
          id: `opp-${crypto.randomUUID()}`,
          account_id: input.accountId,
          name: input.name,
          stage: input.stage ?? "DISCOVER",
          amount: input.amount,
          currency: input.currency ?? "USD",
          probability: input.probability ?? 10,
          expected_close_date: input.expectedCloseDate,
          owner_user_id: input.ownerUserId,
          created_at: now,
          updated_at: now,
        })
        .select("*")
        .single();
      if (error) {
        throw new Error(`Failed to create opportunity: ${error.message}`);
      }

      await client
        .from("crm_accounts")
        .update({ updated_at: now })
        .eq("id", input.accountId);

      return mapOpportunity(data);
    },

    async moveOpportunityStage(opportunityId, stage) {
      const client = getSupabaseServiceClient();
      if (!client) return undefined;

      const now = new Date().toISOString();
      const patch: Record<string, unknown> = { stage, updated_at: now };
      if (stage === "CLOSED_WON") patch.probability = 100;
      if (stage === "CLOSED_LOST") patch.probability = 0;

      const { data, error } = await client
        .from("crm_opportunities")
        .update(patch)
        .eq("id", opportunityId)
        .select("*")
        .single();
      if (error || !data) return undefined;

      const opportunity = mapOpportunity(data);

      await client
        .from("crm_accounts")
        .update({ updated_at: now })
        .eq("id", opportunity.accountId);

      await client.from("crm_activities").insert({
        id: `act-${crypto.randomUUID()}`,
        account_id: opportunity.accountId,
        opportunity_id: opportunity.id,
        type: "NOTE",
        subject: `Stage changed to ${stage}`,
        created_by_user_id: opportunity.ownerUserId,
        created_at: now,
      });

      return opportunity;
    },

    async logActivity(input: LogActivityInput): Promise<Activity> {
      const client = getSupabaseServiceClient();
      if (!client) throw new Error("Supabase is not configured");

      const now = new Date().toISOString();
      const { data, error } = await client
        .from("crm_activities")
        .insert({
          id: `act-${crypto.randomUUID()}`,
          account_id: input.accountId,
          opportunity_id: input.opportunityId,
          contact_id: input.contactId,
          type: input.type,
          subject: input.subject,
          body: input.body,
          due_date: input.dueDate,
          created_by_user_id: input.createdByUserId,
          created_at: now,
        })
        .select("*")
        .single();
      if (error) throw new Error(`Failed to log activity: ${error.message}`);

      await client
        .from("crm_accounts")
        .update({ updated_at: now })
        .eq("id", input.accountId);

      return mapActivity(data);
    },
  };
}
