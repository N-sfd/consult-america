"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { Bell, HelpCircle, Menu, Search, X } from "lucide-react";

import { logout } from "@/app/actions/auth";
import PortalBrand from "@/components/brand/portal-brand";
import DemoEnvironmentBanner from "@/components/platform/demo-environment-banner";
import DemoWorkspaceMenu from "@/components/platform/demo-workspace-menu";
import {
  NAV_BY_WORKSPACE,
  WORKSPACE_META,
  type PlatformNavGroup,
  type PlatformShellVariant,
  type PlatformWorkspaceId,
} from "@/components/platform/platform-nav";
import { cn } from "@/lib/utils";

export type PlatformSessionInfo = {
  displayName: string;
  email?: string;
  initials?: string;
  roleLabel?: string;
};

export type PlatformShellProps = {
  workspace: PlatformWorkspaceId;
  /** Override sidebar module name (e.g. Admin vs ATS on shared workforce routes). */
  workspaceLabel?: string;
  session: PlatformSessionInfo;
  children: React.ReactNode;
  variant?: PlatformShellVariant;
  navGroups?: PlatformNavGroup[];
  logoHref?: string;
  showSearch?: boolean;
  searchPlaceholder?: string;
  notificationsHref?: string | null;
  unreadCount?: number;
  pendingApprovalsCount?: number;
  approvalsHref?: string;
  headerAction?: React.ReactNode;
  bottomNav?: React.ReactNode;
  hideSidebarOnMobile?: boolean;
  contentClassName?: string;
};

function initialsFromName(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function isActiveNavHref(
  pathname: string,
  searchParams: URLSearchParams,
  href: string,
  exact?: boolean,
) {
  const [pathPart, queryPart] = href.split("?");
  const pathMatches = exact
    ? pathname === pathPart
    : pathname === pathPart || pathname.startsWith(`${pathPart}/`);
  if (!pathMatches) return false;
  if (!queryPart) return true;

  const required = new URLSearchParams(queryPart);
  for (const [key, value] of required.entries()) {
    if (searchParams.get(key) !== value) return false;
  }
  return true;
}

function SidebarNav({
  groups,
  pathname,
  searchParams,
  unreadCount,
  pendingApprovalsCount,
  onNavigate,
}: {
  groups: PlatformNavGroup[];
  pathname: string;
  searchParams: URLSearchParams;
  unreadCount: number;
  pendingApprovalsCount: number;
  onNavigate?: () => void;
}) {
  return (
    <nav className="ca-platform-nav" aria-label="Workspace">
      {groups.map((group) => (
        <div key={group.label ?? "main"} className="ca-platform-nav-group">
          {group.label ? <p className="ca-platform-nav-label">{group.label}</p> : null}
          <div className="space-y-0.5">
            {group.items.map((item) => {
              if (item.disabled || item.href === "#") {
                return (
                  <span key={item.label} className="ca-platform-nav-link is-disabled">
                    <span>{item.label}</span>
                    <span className="text-[0.6rem] uppercase tracking-[0.08em]">Soon</span>
                  </span>
                );
              }

              // Query-specific siblings (e.g. Onboarding) win over the plain path item.
              const siblings = group.items.filter(
                (other) =>
                  other.href !== item.href &&
                  other.href.split("?")[0] === item.href.split("?")[0],
              );
              const siblingQueryMatch = siblings.some((other) =>
                isActiveNavHref(pathname, searchParams, other.href, other.exact),
              );
              const active =
                isActiveNavHref(pathname, searchParams, item.href, item.exact) &&
                (item.href.includes("?") || !siblingQueryMatch);
              const badge =
                item.badgeKey === "notifications"
                  ? unreadCount
                  : item.badgeKey === "approvals"
                    ? pendingApprovalsCount
                    : 0;

              return (
                <Link
                  key={`${item.href}-${item.label}`}
                  href={item.href}
                  onClick={onNavigate}
                  className={cn("ca-platform-nav-link", active && "is-active")}
                >
                  <span>{item.label}</span>
                  {badge > 0 ? <span className="ca-platform-badge">{badge}</span> : null}
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
}

function PlatformSidebar({
  workspace,
  workspaceLabel,
  session,
  variant,
  groups,
  logoHref,
  pathname,
  searchParams,
  unreadCount,
  pendingApprovalsCount,
  className,
  onNavigate,
}: {
  workspace: PlatformWorkspaceId;
  workspaceLabel?: string;
  session: PlatformSessionInfo;
  variant: PlatformShellVariant;
  groups: PlatformNavGroup[];
  logoHref: string;
  pathname: string;
  searchParams: URLSearchParams;
  unreadCount: number;
  pendingApprovalsCount: number;
  className?: string;
  onNavigate?: () => void;
}) {
  const meta = WORKSPACE_META[workspace];

  return (
    <aside className={cn("ca-platform-sidebar", `ca-platform-sidebar--${variant}`, className)}>
      {/* All app sidebars are navy — brand sits on a white block */}
      <PortalBrand surface="dark" href={logoHref} />

      <div className="ca-platform-sidebar-identity">
        <p className="ca-platform-workspace-name">{workspaceLabel ?? meta.name}</p>
        <p className="ca-platform-user-name">{session.displayName}</p>
        {session.roleLabel ? <p className="ca-platform-user-role">{session.roleLabel}</p> : null}
      </div>

      <SidebarNav
        groups={groups}
        pathname={pathname}
        searchParams={searchParams}
        unreadCount={unreadCount}
        pendingApprovalsCount={pendingApprovalsCount}
        onNavigate={onNavigate}
      />

      <div className="ca-platform-sidebar-footer">
        <DemoWorkspaceMenu current={workspace} dark />
        <div className="mt-3 flex flex-col gap-1.5">
          <Link
            href="/"
            onClick={onNavigate}
            className="text-white/70 hover:text-white hover:underline"
          >
            Public site
          </Link>
          <form action={logout}>
            <button
              type="submit"
              className="text-left text-white/70 hover:text-white hover:underline"
            >
              Sign out
            </button>
          </form>
        </div>
      </div>
    </aside>
  );
}

export default function PlatformShell(props: PlatformShellProps) {
  return (
    <Suspense fallback={<PlatformShellFrame {...props} searchParams={new URLSearchParams()} />}>
      <PlatformShellWithSearchParams {...props} />
    </Suspense>
  );
}

function PlatformShellWithSearchParams(props: PlatformShellProps) {
  const searchParams = useSearchParams();
  return <PlatformShellFrame {...props} searchParams={searchParams} />;
}

function PlatformShellFrame({
  workspace,
  workspaceLabel,
  session,
  children,
  variant,
  navGroups,
  logoHref,
  showSearch = false,
  searchPlaceholder = "Search…",
  notificationsHref = null,
  unreadCount = 0,
  pendingApprovalsCount = 0,
  approvalsHref,
  headerAction,
  bottomNav,
  hideSidebarOnMobile = false,
  contentClassName,
  searchParams,
}: PlatformShellProps & { searchParams: URLSearchParams }) {
  const meta = WORKSPACE_META[workspace];
  const resolvedVariant = variant ?? meta.variant;
  const groups = navGroups ?? NAV_BY_WORKSPACE[workspace];
  const homeHref = logoHref ?? meta.homeHref;
  const pathname = usePathname() || "/";
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerPath, setDrawerPath] = useState(pathname);

  if (drawerPath !== pathname) {
    setDrawerPath(pathname);
    if (drawerOpen) setDrawerOpen(false);
  }

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  const initials = session.initials || initialsFromName(session.displayName);

  return (
    <div className={cn("experience-app ca-platform", hideSidebarOnMobile && "pb-16 lg:pb-0")}>
      <DemoEnvironmentBanner />

      <div className="ca-platform-frame">
        <PlatformSidebar
          workspace={workspace}
          workspaceLabel={workspaceLabel}
          session={session}
          variant={resolvedVariant}
          groups={groups}
          logoHref={homeHref}
          pathname={pathname}
          searchParams={searchParams}
          unreadCount={unreadCount}
          pendingApprovalsCount={pendingApprovalsCount}
          className="ca-platform-sidebar--desktop"
        />

        {drawerOpen ? (
          <>
            <button
              type="button"
              className="ca-platform-drawer-backdrop"
              aria-label="Close menu"
              onClick={() => setDrawerOpen(false)}
            />
            <div className={cn("ca-platform-drawer is-open")}>
              <PlatformSidebar
                workspace={workspace}
                workspaceLabel={workspaceLabel}
                session={session}
                variant={resolvedVariant}
                groups={groups}
                logoHref={homeHref}
                pathname={pathname}
                searchParams={searchParams}
                unreadCount={unreadCount}
                pendingApprovalsCount={pendingApprovalsCount}
                className="h-full"
                onNavigate={() => setDrawerOpen(false)}
              />
            </div>
          </>
        ) : null}

        <div className="ca-platform-main">
          <header className="ca-platform-header">
            <button
              type="button"
              className="ca-platform-menu-btn"
              aria-label="Open navigation"
              onClick={() => setDrawerOpen(true)}
            >
              <Menu className="h-4 w-4" />
            </button>

            <div className="ca-platform-header-brand min-[1180px]:hidden">
              <PortalBrand
                surface="light"
                mode="mobile"
                href={homeHref}
              />
            </div>

            <div className="ca-platform-header-context hidden sm:block">
              <p className="ca-platform-header-eyebrow">{meta.eyebrow}</p>
              <p className="ca-platform-header-title">{workspaceLabel ?? meta.name}</p>
            </div>

            {showSearch ? (
              <label className="ca-platform-search">
                <Search className="ca-platform-search-icon" aria-hidden />
                <input type="search" placeholder={searchPlaceholder} />
              </label>
            ) : null}

            <div className="ca-platform-header-actions">
              {pendingApprovalsCount > 0 && approvalsHref ? (
                <Link
                  href={approvalsHref}
                  className="hidden items-center gap-1.5 rounded-lg border border-[var(--ca-platform-border)] px-2.5 py-1.5 text-xs font-semibold text-[var(--ca-platform-muted)] hover:text-[var(--ca-platform-deep)] sm:inline-flex"
                >
                  {pendingApprovalsCount} pending
                </Link>
              ) : null}

              {headerAction}

              {notificationsHref ? (
                <Link
                  href={notificationsHref}
                  className="ca-platform-icon-btn relative"
                  aria-label="Notifications"
                >
                  <Bell className="h-4 w-4" />
                  {unreadCount > 0 ? (
                    <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-[var(--ca-platform-red)]" />
                  ) : null}
                </Link>
              ) : null}

              <Link href="/" className="ca-platform-icon-btn" aria-label="Help">
                <HelpCircle className="h-4 w-4" />
              </Link>

              <span className="ca-platform-avatar" aria-hidden>
                {initials}
              </span>
            </div>
          </header>

          <main className={cn("ca-platform-content", contentClassName)}>{children}</main>
        </div>
      </div>

      {bottomNav}
      {drawerOpen ? (
        <button
          type="button"
          className="fixed right-3 top-3 z-[70] inline-flex h-9 w-9 items-center justify-center rounded-lg bg-white text-[var(--ca-platform-ink)] shadow-md lg:hidden"
          aria-label="Close navigation"
          onClick={() => setDrawerOpen(false)}
        >
          <X className="h-4 w-4" />
        </button>
      ) : null}
    </div>
  );
}
