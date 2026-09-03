"use client";

import { cn } from "@/lib/utils";

export type CrmWorkspaceTab = "accounts" | "opportunities" | "pipeline" | "analytics";

const TABS: { id: CrmWorkspaceTab; label: string }[] = [
  { id: "accounts", label: "Accounts" },
  { id: "opportunities", label: "Opportunities" },
  { id: "pipeline", label: "Pipeline" },
  { id: "analytics", label: "Analytics" },
];

const accounts = [
  ["Northbridge Health System", "Healthcare", "Active", "Last week"],
  ["Aether Financial Group", "Financial services", "Active", "2 days ago"],
  ["Commonwealth Transit Authority", "Public sector", "Review", "Yesterday"],
];

const opportunities = [
  ["Enterprise Cloud Transformation", "Proposal", "Q3", "Multi-entity"],
  ["Public Sector AI Intake", "Qualify", "Q2", "Document intel"],
  ["Finance close modernization", "Engage", "Q4", "Oracle-connected"],
];

function WorkspaceBody({ tab }: { tab: CrmWorkspaceTab }) {
  if (tab === "pipeline") {
    return (
      <div className="crm-kanban">
        {[
          { label: "Qualify", cards: ["Public Sector AI Intake"] },
          { label: "Engage", cards: ["Finance close modernization"] },
          { label: "Propose", cards: ["Enterprise Cloud Transformation"] },
          { label: "Close", cards: ["Workforce systems review"] },
        ].map((col) => (
          <div key={col.label} className="crm-kanban-col">
            <p className="crm-kanban-label">{col.label}</p>
            {col.cards.map((card) => (
              <div key={card} className="crm-kanban-card">
                {card}
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  }

  if (tab === "analytics") {
    return (
      <div className="crm-analytics">
        <div className="crm-metric">
          <p className="crm-metric-label">Open opportunities</p>
          <p className="crm-metric-value">Workspace view</p>
        </div>
        <div className="crm-metric">
          <p className="crm-metric-label">Stage coverage</p>
          <p className="crm-metric-value">Qualify → Close</p>
        </div>
        <div className="crm-metric">
          <p className="crm-metric-label">Account focus</p>
          <p className="crm-metric-value">Enterprise</p>
        </div>
      </div>
    );
  }

  const rows = tab === "accounts" ? accounts : opportunities;
  const heads =
    tab === "accounts"
      ? ["Account", "Industry", "Status", "Activity"]
      : ["Opportunity", "Stage", "Period", "Focus"];

  return (
    <>
      <div className="crm-ui-head">
        {heads.map((head) => (
          <span key={head}>{head}</span>
        ))}
      </div>
      {rows.map((row) => (
        <div key={row[0]} className="crm-ui-row">
          <span className="font-medium">{row[0]}</span>
          <span>{row[1]}</span>
          <span>
            <span className="crm-ui-status">{row[2]}</span>
          </span>
          <span className="text-[#5B6D6B]">{row[3]}</span>
        </div>
      ))}
    </>
  );
}

export default function CrmWorkspaceUi({
  tab,
  onTabChange,
  interactive = true,
  className,
}: {
  tab: CrmWorkspaceTab;
  onTabChange?: (tab: CrmWorkspaceTab) => void;
  interactive?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("crm-product-frame", className)}>
      <div className="crm-product-chrome">
        <div className="flex items-center gap-2">
          <span className="flex gap-1.5" aria-hidden="true">
            <span className="h-2 w-2 rounded-full bg-[#C9DDD7]" />
            <span className="h-2 w-2 rounded-full bg-[#C9DDD7]" />
            <span className="h-2 w-2 rounded-full bg-[#9BC4B8]" />
          </span>
          <p className="crm-product-chrome-title">CRM Workspace</p>
        </div>
        <p className="crm-product-chrome-meta">Consult America</p>
      </div>

      <div className="crm-product-tabs" role={interactive ? "tablist" : undefined} aria-label="CRM workspace views">
        {TABS.map((item) =>
          interactive ? (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={tab === item.id}
              data-active={tab === item.id}
              className="crm-product-tab"
              onClick={() => onTabChange?.(item.id)}
            >
              {item.label}
            </button>
          ) : (
            <span
              key={item.id}
              data-active={tab === item.id}
              className="crm-product-tab"
            >
              {item.label}
            </span>
          ),
        )}
      </div>

      <div className="crm-product-body" role={interactive ? "tabpanel" : undefined}>
        <WorkspaceBody tab={tab} />
      </div>
    </div>
  );
}
