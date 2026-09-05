"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
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

function isActivePath(pathname: string, href: string, exact?: boolean) {
  if (exact) return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

function SidebarNav({
  groups,
  pathname,
  unreadCount,
  pendingApprovalsCount,
  onNavigate,
}: {
  groups: PlatformNavGroup[];
  pathname: string;
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

              const active = isActivePath(pathname, item.href, item.exact);
              const badge =
                item.badgeKey === "notifications"
                  ? unreadCount
                  : item.badgeKey === "approvals"
                    ? pendingApprovalsCount
                    : 0;

              return (
                <Link
                  key={item.href}
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
  session,
  variant,
  groups,
  logoHref,
  pathname,
  unreadCount,
  pendingApprovalsCount,
  className,
  onNavigate,
}: {
  workspace: PlatformWorkspaceId;
  session: PlatformSessionInfo;
  variant: PlatformShellVariant;
  groups: PlatformNavGroup[];
  logoHref: string;
  pathname: string;
  unreadCount: number;
  pendingApprovalsCount: number;
  className?: string;
  onNavigate?: () => void;
}) {
  const meta = WORKSPACE_META[workspace];
  const dark = variant === "admin" || variant === "crm";

  return (
    <aside className={cn("ca-platform-sidebar", `ca-platform-sidebar--${variant}`, className)}>
      <PortalBrand surface={dark ? "dark" : "light"} href={logoHref} />

      <div className="ca-platform-sidebar-identity">
        <p className="ca-platform-workspace-name">{meta.name}</p>
        <p className="ca-platform-user-name">{session.displayName}</p>
        {session.roleLabel ? <p className="ca-platform-user-role">{session.roleLabel}</p> : null}
      </div>

      <SidebarNav
        groups={groups}
        pathname={pathname}
        unreadCount={unreadCount}
        pendingApprovalsCount={pendingApprovalsCount}
        onNavigate={onNavigate}
      />

      <div className="ca-platform-sidebar-footer">
        <DemoWorkspaceMenu current={workspace} dark={dark} />
        <div className="mt-3 flex flex-col gap-1.5">
          <Link
            href="/"
            onClick={onNavigate}
            className={cn(
              "hover:underline",
              dark ? "text-white/70 hover:text-white" : "text-[var(--ca-platform-muted)] hover:text-[var(--ca-platform-deep)]",
            )}
          >
            Public site
          </Link>
          <form action={logout}>
            <button
              type="submit"
              className={cn(
                "text-left hover:underline",
                dark ? "text-white/70 hover:text-white" : "text-[var(--ca-platform-muted)] hover:text-[var(--ca-platform-deep)]",
              )}
            >
              Sign out
            </button>
          </form>
        </div>
      </div>
    </aside>
  );
}

export default function PlatformShell({
  workspace,
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
}: PlatformShellProps) {
  const meta = WORKSPACE_META[workspace];
  const resolvedVariant = variant ?? meta.variant;
  const groups = navGroups ?? NAV_BY_WORKSPACE[workspace];
  const homeHref = logoHref ?? meta.homeHref;
  const pathname = usePathname() || "/";
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  const initials = session.initials || initialsFromName(session.displayName);

  return (
    <div className={cn("experience-app ca-platform", hideSidebarOnMobile && "pb-16 lg:pb-0")}>
      <DemoEnvironmentBanner />

      <div className="ca-platform-frame">
        <PlatformSidebar
          workspace={workspace}
          session={session}
          variant={resolvedVariant}
          groups={groups}
          logoHref={homeHref}
          pathname={pathname}
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
                session={session}
                variant={resolvedVariant}
                groups={groups}
                logoHref={homeHref}
                pathname={pathname}
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
              <p className="ca-platform-header-title">
                {session.email || session.displayName}
              </p>
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
