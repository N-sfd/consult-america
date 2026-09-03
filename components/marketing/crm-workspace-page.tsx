"use client";

import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

import CrmWorkspaceUi, {
  type CrmWorkspaceTab,
} from "@/components/marketing/crm-workspace-ui";
import { useContactPanel } from "@/components/providers/contact-provider";
import { cn } from "@/lib/utils";

const capabilities = [
  {
    title: "Customer 360",
    detail: "Account context, relationships, and history in one workspace.",
  },
  {
    title: "Opportunity Pipeline",
    detail: "Stage-based opportunity management for multi-stakeholder deals.",
  },
  {
    title: "Executive Review & SOW Tracking",
    detail: "Keep proposal, review, and statement-of-work status visible.",
  },
  {
    title: "Oracle ERP interoperability",
    detail: "Designed for Oracle-connected workflows and account lifecycle handoff.",
  },
  {
    title: "Role-Based Access & Governance",
    detail: "Controlled visibility across revenue, delivery, and leadership roles.",
  },
];

const journey = ["Discover", "Qualify", "Engage", "Propose", "Close", "Expand"];
const revealEase = [0.2, 0.8, 0.2, 1] as const;

export default function CrmWorkspacePage() {
  const shouldReduceMotion = useReducedMotion();
  const { setOpen } = useContactPanel();
  const [tab, setTab] = useState<CrmWorkspaceTab>("accounts");

  return (
    <>
      <section className="crm-hero">
        <div
          aria-hidden="true"
          className={cn(
            "crm-hero-sage-disc",
            !shouldReduceMotion && "ca-decor-drift--slow",
          )}
        />
        <div className="mkt-shell crm-hero-grid">
          <motion.div
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: revealEase }}
          >
            <p className="crm-eyebrow">Enterprise Platforms</p>
            <h1 className="crm-hero-title">Consult America CRM Workspace</h1>
            <p className="crm-hero-subtitle">
              A unified customer intelligence and opportunity management workspace
              engineered for enterprise revenue teams, multi-stakeholder deals,
              and account lifecycle governance.
            </p>
            <div className="crm-hero-actions">
              <button type="button" className="crm-cta" onClick={() => setOpen(true)}>
                Request CRM Demo
              </button>
              <a href="#crm-capabilities" className="crm-cta-secondary">
                Explore CRM Capabilities
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
          </motion.div>

          <motion.div
            className="crm-hero-visual"
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 14, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.78, delay: 0.08, ease: revealEase }}
          >
            <div
              aria-hidden="true"
              className={cn("crm-hero-panel", !shouldReduceMotion && "ca-decor-drift--slow")}
            />
            <div
              aria-hidden="true"
              className={cn("crm-hero-ring", !shouldReduceMotion && "ca-decor-drift--slow")}
            />
            <CrmWorkspaceUi tab="accounts" interactive={false} />
          </motion.div>
        </div>
      </section>

      <section id="crm-capabilities" className="crm-capabilities">
        <div className="mkt-shell crm-capabilities-grid">
          <div>
            <h2 className="crm-cap-heading">Built for complex enterprise accounts.</h2>
            <p className="crm-cap-copy">
              Designed to replace fragmented spreadsheets and disconnected sales
              processes with a governed account and opportunity workspace.
            </p>
          </div>
          <div className="crm-cap-rows">
            {capabilities.map((item, index) => (
              <div key={item.title} className="crm-cap-row">
                <span className="crm-cap-num">{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <p className="crm-cap-title">{item.title}</p>
                  <p className="crm-cap-detail">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="crm-showcase">
        <div className="mkt-shell crm-showcase-grid">
          <div>
            <p className="crm-showcase-eyebrow">CRM Workspace UI</p>
            <h2 className="crm-showcase-heading">See how revenue work is organized.</h2>
            <p className="crm-showcase-copy">
              Move between accounts, opportunities, pipeline, and analytics without
              leaving the workspace. Each view stays rectangular, readable, and
              tied to the same account record.
            </p>
          </div>
          <CrmWorkspaceUi tab={tab} onTabChange={setTab} />
        </div>
      </section>

      <section className="crm-journey">
        <div className="mkt-shell">
          <p className="crm-journey-label">CRM workflow</p>
          <div className="crm-journey-steps">
            {journey.map((step, index) => (
              <div key={step} className="flex items-center gap-2.5">
                <span className="crm-journey-step">{step.toUpperCase()}</span>
                {index < journey.length - 1 ? (
                  <span className="crm-journey-arrow" aria-hidden="true">
                    →
                  </span>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
