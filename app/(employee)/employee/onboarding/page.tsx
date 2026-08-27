import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, Circle } from "lucide-react";

import { getEmployeeOnboarding, getEmployeeProfile } from "@/lib/self-service";
import { getEmployeeSession } from "@/lib/self-service/session";
import type { OnboardingTask } from "@/types/hr";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Onboarding | ConsultAmerica",
};

type TaskGroup = "BEFORE_FIRST_DAY" | "FIRST_WEEK" | "GETTING_SET_UP";

const TASK_GROUP_BY_TYPE: Record<string, TaskGroup> = {
  PERSONAL_INFO: "BEFORE_FIRST_DAY",
  EMERGENCY_CONTACT: "BEFORE_FIRST_DAY",
  DOCUMENTS: "BEFORE_FIRST_DAY",
  ORG: "BEFORE_FIRST_DAY",
  POLICIES: "BEFORE_FIRST_DAY",
  MANAGER: "FIRST_WEEK",
  ORIENTATION: "FIRST_WEEK",
  WORK_EMAIL: "GETTING_SET_UP",
  EQUIPMENT: "GETTING_SET_UP",
  ACCESS: "GETTING_SET_UP",
};

const GROUP_LABELS: Record<TaskGroup, string> = {
  BEFORE_FIRST_DAY: "Before your first day",
  FIRST_WEEK: "Your first week",
  GETTING_SET_UP: "Getting set up",
};

const GROUP_ORDER: TaskGroup[] = [
  "BEFORE_FIRST_DAY",
  "FIRST_WEEK",
  "GETTING_SET_UP",
];

/** Date-only strings ("YYYY-MM-DD") must parse as local dates, not UTC
 * midnight, or they render one day early in negative-UTC timezones. */
function formatDate(value?: string) {
  if (!value) return undefined;
  const dateOnly = /^\d{4}-\d{2}-\d{2}$/.test(value);
  const date = dateOnly ? new Date(`${value}T00:00:00`) : new Date(value);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export default async function EmployeeOnboardingPage() {
  const session = getEmployeeSession();
  const [profile, onboarding] = await Promise.all([
    getEmployeeProfile(session.employeeId),
    getEmployeeOnboarding(session.employeeId),
  ]);

  const firstName =
    profile?.person.preferredName || profile?.person.firstName || "there";

  if (!onboarding.record) {
    return (
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-[-0.03em]">
          Onboarding
        </h1>
        <p className="text-sm text-black/55">
          No onboarding checklist is on file for your record.
        </p>
      </div>
    );
  }

  const isComplete = onboarding.percentComplete === 100;
  const pendingByGroup = new Map<TaskGroup, OnboardingTask[]>();
  const completed: OnboardingTask[] = [];

  for (const task of onboarding.tasks) {
    if (task.status === "COMPLETED") {
      completed.push(task);
      continue;
    }
    const group = TASK_GROUP_BY_TYPE[task.taskType] ?? "BEFORE_FIRST_DAY";
    const list = pendingByGroup.get(group) ?? [];
    list.push(task);
    pendingByGroup.set(group, list);
  }

  completed.sort((a, b) =>
    (b.completedAt ?? "").localeCompare(a.completedAt ?? ""),
  );

  return (
    <div className="space-y-8">
      <div className="rounded-lg border border-black/10 bg-white p-6">
        <h1 className="text-2xl font-semibold tracking-[-0.03em]">
          Welcome to ConsultAmerica, {firstName}
        </h1>
        <p className="mt-2 text-sm text-black/55">
          Your first day
          <span className="ml-2 font-medium text-black/80">
            {formatDate(onboarding.record.startDate)}
          </span>
        </p>

        {isComplete ? (
          <div className="mt-5 flex items-center gap-2 text-[var(--ca-green,#16865b)]">
            <CheckCircle2 className="h-5 w-5" />
            <p className="text-sm font-medium">
              Onboarding complete. Welcome aboard.
            </p>
          </div>
        ) : (
          <div className="mt-5">
            <div className="flex items-center justify-between text-xs text-black/50">
              <span>{onboarding.percentComplete}% complete</span>
              <span>
                {onboarding.completedCount} of {onboarding.totalCount} tasks
              </span>
            </div>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-black/10">
              <div
                className="h-full rounded-full bg-[var(--ca-blue)] transition-[width]"
                style={{ width: `${onboarding.percentComplete}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {GROUP_ORDER.map((group) => {
        const tasks = pendingByGroup.get(group);
        if (!tasks || tasks.length === 0) return null;

        return (
          <section key={group}>
            <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-black/40">
              {GROUP_LABELS[group]}
            </h2>
            <div className="mt-3 space-y-3">
              {tasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          </section>
        );
      })}

      {completed.length > 0 && (
        <details className="group rounded-lg border border-black/10 bg-white">
          <summary className="flex cursor-pointer list-none items-center justify-between px-6 py-4 text-xs font-semibold uppercase tracking-[0.12em] text-black/40">
            <span>Completed ({completed.length})</span>
            <span className="text-black/30 group-open:rotate-180">▾</span>
          </summary>
          <div className="space-y-3 px-6 pb-6">
            {completed.map((task) => (
              <div
                key={task.id}
                className="flex items-start gap-3 border-t border-black/5 pt-3 first:border-t-0 first:pt-0"
              >
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--ca-green,#16865b)]" />
                <div>
                  <p className="text-sm font-medium text-black/70">
                    {task.title}
                  </p>
                  {task.completedAt && (
                    <p className="mt-0.5 text-xs text-black/40">
                      Completed {formatDate(task.completedAt)}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </details>
      )}
    </div>
  );
}

function taskAction(task: OnboardingTask): { label: string; href: string } {
  switch (task.taskType) {
    case "POLICIES":
    case "DOCUMENTS":
      return { label: "Review Document", href: "/employee/documents" };
    case "PERSONAL_INFO":
    case "EMERGENCY_CONTACT":
      return { label: "Update Profile", href: "/employee/profile" };
    default:
      return { label: "Contact HR", href: "/employee/requests" };
  }
}

function TaskCard({ task }: { task: OnboardingTask }) {
  const action = taskAction(task);

  return (
    <div className="rounded-lg border border-black/10 bg-white p-5">
      <div className="flex items-start gap-3">
        <Circle
          className={cn(
            "mt-0.5 h-4 w-4 shrink-0",
            task.status === "IN_PROGRESS"
              ? "text-[var(--ca-blue)]"
              : "text-black/25",
          )}
        />
        <div className="flex-1">
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <p className="text-sm font-medium">{task.title}</p>
            {task.dueDate && (
              <p className="text-xs text-black/45">
                Due {formatDate(task.dueDate)}
              </p>
            )}
          </div>
          {task.description && (
            <p className="mt-1.5 text-sm text-black/55">
              {task.description}
            </p>
          )}
          <Link
            href={action.href}
            className="mt-3 inline-flex text-sm font-medium text-[var(--ca-blue)] hover:underline"
          >
            {action.label}
          </Link>
        </div>
      </div>
    </div>
  );
}
