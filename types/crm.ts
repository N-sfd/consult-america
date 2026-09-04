/** CRM Workspace domain — accounts, contacts, opportunities, activities. */

export type AccountTier = "STRATEGIC" | "ENTERPRISE" | "MID_MARKET";
export type AccountStatus = "PROSPECT" | "ACTIVE" | "CHURNED";

export type Account = {
  id: string;
  name: string;
  industry: string;
  website?: string;
  tier: AccountTier;
  status: AccountStatus;
  ownerUserId: string;
  createdAt: string;
  updatedAt: string;
};

export type Contact = {
  id: string;
  accountId: string;
  name: string;
  title?: string;
  email: string;
  phone?: string;
  isPrimary: boolean;
  createdAt: string;
  updatedAt: string;
};

/** Mirrors the pipeline journey named on the CRM marketing page. */
export type OpportunityStage =
  | "DISCOVER"
  | "QUALIFY"
  | "ENGAGE"
  | "PROPOSE"
  | "CLOSED_WON"
  | "CLOSED_LOST";

export type Opportunity = {
  id: string;
  accountId: string;
  name: string;
  stage: OpportunityStage;
  amount: number;
  currency: string;
  probability: number;
  expectedCloseDate?: string;
  ownerUserId: string;
  createdAt: string;
  updatedAt: string;
};

export type ActivityType = "NOTE" | "CALL" | "MEETING" | "EMAIL" | "TASK";

export type Activity = {
  id: string;
  accountId: string;
  opportunityId?: string;
  contactId?: string;
  type: ActivityType;
  subject: string;
  body?: string;
  dueDate?: string;
  completedAt?: string;
  createdByUserId: string;
  createdAt: string;
};

export const accountTierLabels: Record<AccountTier, string> = {
  STRATEGIC: "Strategic",
  ENTERPRISE: "Enterprise",
  MID_MARKET: "Mid-Market",
};

export const accountStatusLabels: Record<AccountStatus, string> = {
  PROSPECT: "Prospect",
  ACTIVE: "Active",
  CHURNED: "Churned",
};

/** Active pipeline order (excludes terminal stages) — mirrors the marketing page's journey. */
export const OPPORTUNITY_PIPELINE: OpportunityStage[] = [
  "DISCOVER",
  "QUALIFY",
  "ENGAGE",
  "PROPOSE",
];

export const OPPORTUNITY_TERMINAL_STAGES: OpportunityStage[] = [
  "CLOSED_WON",
  "CLOSED_LOST",
];

export const opportunityStageLabels: Record<OpportunityStage, string> = {
  DISCOVER: "Discover",
  QUALIFY: "Qualify",
  ENGAGE: "Engage",
  PROPOSE: "Propose",
  CLOSED_WON: "Closed Won",
  CLOSED_LOST: "Closed Lost",
};

export const activityTypeLabels: Record<ActivityType, string> = {
  NOTE: "Note",
  CALL: "Call",
  MEETING: "Meeting",
  EMAIL: "Email",
  TASK: "Task",
};
