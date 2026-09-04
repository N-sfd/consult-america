import type {
  Account,
  AccountStatus,
  AccountTier,
  Activity,
  ActivityType,
  Contact,
  Opportunity,
  OpportunityStage,
} from "@/types/crm";

export type AccountListItem = {
  id: string;
  name: string;
  industry: string;
  tier: AccountTier;
  status: AccountStatus;
  contactCount: number;
  openOpportunityCount: number;
  openPipelineValue: number;
  updatedAt: string;
};

export type AccountDetail = {
  account: Account;
  contacts: Contact[];
  opportunities: Opportunity[];
  activities: Activity[];
};

export type OpportunityListItem = Opportunity & { accountName: string };
export type ContactListItem = Contact & { accountName: string };

export type PipelineStageSummary = {
  stage: OpportunityStage;
  count: number;
  value: number;
};

export type PipelineSummary = {
  stages: PipelineStageSummary[];
  openValue: number;
  wonValue: number;
  winRate: number;
};

export type CreateAccountInput = {
  name: string;
  industry: string;
  website?: string;
  tier: AccountTier;
  status: AccountStatus;
  ownerUserId: string;
};

export type CreateContactInput = {
  accountId: string;
  name: string;
  title?: string;
  email: string;
  phone?: string;
  isPrimary?: boolean;
};

export type CreateOpportunityInput = {
  accountId: string;
  name: string;
  stage?: OpportunityStage;
  amount: number;
  currency?: string;
  probability?: number;
  expectedCloseDate?: string;
  ownerUserId: string;
};

export type LogActivityInput = {
  accountId: string;
  opportunityId?: string;
  contactId?: string;
  type: ActivityType;
  subject: string;
  body?: string;
  dueDate?: string;
  createdByUserId: string;
};

export type CrmRepository = {
  listAccounts(): Promise<AccountListItem[]>;
  getAccountDetail(accountId: string): Promise<AccountDetail | undefined>;
  listOpportunities(): Promise<OpportunityListItem[]>;
  listContacts(): Promise<ContactListItem[]>;
  getPipelineSummary(): Promise<PipelineSummary>;
  createAccount(input: CreateAccountInput): Promise<Account>;
  createContact(input: CreateContactInput): Promise<Contact>;
  createOpportunity(input: CreateOpportunityInput): Promise<Opportunity>;
  moveOpportunityStage(
    opportunityId: string,
    stage: OpportunityStage,
  ): Promise<Opportunity | undefined>;
  logActivity(input: LogActivityInput): Promise<Activity>;
};
