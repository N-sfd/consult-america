"use client";

import { useMemo, useState } from "react";

import { EmptyState } from "@/components/shared";
import type { EmployeeProfileView } from "@/lib/self-service";

function initialsFor(view: EmployeeProfileView) {
  const name =
    view.person.preferredName ||
    `${view.person.firstName} ${view.person.lastName}`;
  const parts = name.trim().split(/\s+/);
  return (
    (parts[0]?.[0] ?? "") +
    (parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? "") : "")
  ).toUpperCase();
}

function displayNameFor(view: EmployeeProfileView) {
  return (
    view.person.preferredName ||
    `${view.person.firstName} ${view.person.lastName}`
  );
}

function contactFor(view: EmployeeProfileView) {
  const email = view.employee.workEmail || view.person.personalEmail;
  const phone = view.employee.workPhone || view.employee.phone || view.person.personalPhone;
  return { email, phone };
}

function EmployeeCard({
  view,
  onViewInOrgChart,
}: {
  view: EmployeeProfileView;
  onViewInOrgChart?: () => void;
}) {
  const { email, phone } = contactFor(view);

  return (
    <div className="flex items-center gap-3 rounded-lg border border-black/10 bg-white p-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--ca-blue)]/10 text-sm font-semibold text-[var(--ca-blue)]">
        {initialsFor(view)}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium">{displayNameFor(view)}</p>
        <p className="truncate text-sm text-black/55">
          {view.positionTitle ?? "—"}
        </p>
        <p className="truncate text-xs text-black/40">
          {[view.departmentName, view.locationName].filter(Boolean).join(" · ")}
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
          {email ? (
            <a
              href={`mailto:${email}`}
              className="truncate font-medium text-[var(--ca-blue)] hover:underline"
            >
              {email}
            </a>
          ) : onViewInOrgChart ? (
            <button
              type="button"
              onClick={onViewInOrgChart}
              className="font-medium text-black/45 underline-offset-2 hover:text-black/70 hover:underline"
            >
              View in org chart
            </button>
          ) : (
            <span className="text-black/40">View in org chart</span>
          )}
          {phone ? (
            <a
              href={`tel:${phone.replace(/[^\d+]/g, "")}`}
              className="font-medium text-black/55 hover:text-black/80 hover:underline"
            >
              {phone}
            </a>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function OrgChartNode({
  view,
  childrenByManager,
}: {
  view: EmployeeProfileView;
  childrenByManager: Map<string, EmployeeProfileView[]>;
}) {
  const reports = childrenByManager.get(view.employee.id) ?? [];

  return (
    <div className="space-y-3">
      <EmployeeCard view={view} />
      {reports.length > 0 && (
        <div className="ml-6 space-y-3 border-l border-black/10 pl-6">
          {reports.map((report) => (
            <OrgChartNode
              key={report.employee.id}
              view={report}
              childrenByManager={childrenByManager}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function EmployeeDirectory({
  entries,
}: {
  entries: EmployeeProfileView[];
}) {
  const [query, setQuery] = useState("");
  const [view, setView] = useState<"list" | "chart">("list");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return entries;
    return entries.filter((entry) => {
      const { email, phone } = contactFor(entry);
      const haystack = [
        displayNameFor(entry),
        entry.positionTitle,
        entry.departmentName,
        entry.locationName,
        email,
        phone,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [entries, query]);

  const { roots, childrenByManager } = useMemo(() => {
    const byId = new Set(entries.map((entry) => entry.employee.id));
    const children = new Map<string, EmployeeProfileView[]>();
    const topLevel: EmployeeProfileView[] = [];

    for (const entry of entries) {
      const managerId = entry.assignment?.managerEmployeeId;
      if (managerId && byId.has(managerId)) {
        const list = children.get(managerId) ?? [];
        list.push(entry);
        children.set(managerId, list);
      } else {
        topLevel.push(entry);
      }
    }

    return { roots: topLevel, childrenByManager: children };
  }, [entries]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by name, title, department, or location"
          className="h-10 w-full max-w-sm rounded-md border border-black/10 px-3 text-sm outline-none focus:border-[var(--ca-blue)]"
        />
        <div className="flex gap-1 rounded-md border border-black/10 p-1">
          <button
            type="button"
            onClick={() => setView("list")}
            className={`rounded px-3 py-1.5 text-sm font-medium transition-colors ${
              view === "list"
                ? "bg-[var(--ca-blue)] text-white"
                : "text-black/55 hover:text-black"
            }`}
          >
            List
          </button>
          <button
            type="button"
            onClick={() => setView("chart")}
            className={`rounded px-3 py-1.5 text-sm font-medium transition-colors ${
              view === "chart"
                ? "bg-[var(--ca-blue)] text-white"
                : "text-black/55 hover:text-black"
            }`}
          >
            Org Chart
          </button>
        </div>
      </div>

      {view === "list" ? (
        filtered.length === 0 ? (
          <EmptyState
            title="No matching coworkers"
            description="Try another name, title, department, or location."
          />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((entry) => (
              <EmployeeCard
                key={entry.employee.id}
                view={entry}
                onViewInOrgChart={() => setView("chart")}
              />
            ))}
          </div>
        )
      ) : (
        <div className="space-y-6 overflow-x-auto rounded-lg border border-black/10 bg-white/40 p-5">
          {roots.length === 0 ? (
            <EmptyState
              compact
              title="Org chart unavailable"
              description="No reporting relationships to display."
              className="border-0 bg-transparent px-0 py-2"
            />
          ) : (
            roots.map((root) => (
              <OrgChartNode
                key={root.employee.id}
                view={root}
                childrenByManager={childrenByManager}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}
