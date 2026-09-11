import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { listPlatformUsers } from "@/lib/workforce/operations";
import { getWorkforceSession } from "@/lib/workforce/session";

export const metadata: Metadata = { title: "Users" };
export const dynamic = "force-dynamic";

type SearchParams = Promise<{
  role?: string;
  profileType?: string;
  status?: string;
}>;

export default async function WorkforceUsersPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const session = await getWorkforceSession();
  if (!session.roles.includes("ADMIN") && !session.roles.includes("HR")) {
    redirect("/workforce");
  }

  const params = await searchParams;
  const users = await listPlatformUsers();

  const roles = [...new Set(users.flatMap((u) => u.roles))].sort();
  const statuses = [...new Set(users.map((u) => u.status))].sort();

  const filtered = users.filter((user) => {
    if (params.role && !user.roles.includes(params.role as never)) return false;
    if (params.status && user.status !== params.status) return false;
    if (params.profileType === "employee" && !user.employeeId) return false;
    if (params.profileType === "candidate" && !user.candidateId) return false;
    if (params.profileType === "none" && (user.employeeId || user.candidateId)) return false;
    return true;
  });

  function href(next: Record<string, string | undefined>) {
    const qs = new URLSearchParams();
    const merged = {
      role: params.role,
      profileType: params.profileType,
      status: params.status,
      ...next,
    };
    for (const [key, value] of Object.entries(merged)) {
      if (value) qs.set(key, value);
    }
    const query = qs.toString();
    return query ? `/workforce/users?${query}` : "/workforce/users";
  }

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-6 lg:px-8 lg:py-8">
      <div>
        <p className="text-[0.7rem] uppercase tracking-[0.14em] text-black/40">
          Workforce
        </p>
        <h1 className="mt-2 font-serif text-2xl font-semibold tracking-[-0.03em]">
          Users
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-6 text-black/55">
          Platform accounts and their assigned roles. View only — granting or
          revoking a role is not available from this screen yet.
        </p>
      </div>

      <form
        method="get"
        className="mt-6 grid gap-3 rounded-lg border border-black/10 bg-white p-4 sm:grid-cols-4"
      >
        <label className="block text-xs">
          <span className="font-semibold uppercase tracking-[0.1em] text-black/40">Role</span>
          <select
            name="role"
            defaultValue={params.role ?? ""}
            className="mt-1 w-full rounded-md border border-black/15 px-2.5 py-2 text-sm"
          >
            <option value="">All roles</option>
            {roles.map((role) => (
              <option key={role} value={role}>
                {role.replaceAll("_", " ")}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-xs">
          <span className="font-semibold uppercase tracking-[0.1em] text-black/40">
            Profile type
          </span>
          <select
            name="profileType"
            defaultValue={params.profileType ?? ""}
            className="mt-1 w-full rounded-md border border-black/15 px-2.5 py-2 text-sm"
          >
            <option value="">All types</option>
            <option value="employee">Employee</option>
            <option value="candidate">Candidate</option>
            <option value="none">Unlinked</option>
          </select>
        </label>
        <label className="block text-xs">
          <span className="font-semibold uppercase tracking-[0.1em] text-black/40">Status</span>
          <select
            name="status"
            defaultValue={params.status ?? ""}
            className="mt-1 w-full rounded-md border border-black/15 px-2.5 py-2 text-sm"
          >
            <option value="">All statuses</option>
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </label>
        <div className="flex items-end gap-2">
          <button
            type="submit"
            className="rounded-md bg-[var(--ca-platform-deep)] px-3.5 py-2 text-sm font-semibold text-white"
          >
            Apply
          </button>
          <Link
            href="/workforce/users"
            className="rounded-md border border-black/15 px-3.5 py-2 text-sm font-medium text-black/65"
          >
            Clear
          </Link>
        </div>
      </form>

      <p className="mt-4 text-sm text-black/45">
        {filtered.length} of {users.length} platform users
      </p>

      <div className="mt-3 overflow-x-auto rounded-lg border border-black/10 bg-white">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="border-b border-black/10 bg-[#F8FAFC] text-xs uppercase tracking-[0.08em] text-black/45">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Roles</th>
              <th className="px-4 py-3 font-medium">Profile</th>
              <th className="px-4 py-3 font-medium">Last activity</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((user) => (
              <tr key={user.id} className="border-b border-black/5 last:border-b-0">
                <td className="px-4 py-3 font-medium">{user.displayName}</td>
                <td className="px-4 py-3 text-black/70">{user.email}</td>
                <td className="px-4 py-3 text-black/70">{user.status}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1.5">
                    {user.roles.map((role) => (
                      <span
                        key={role}
                        className="rounded-md bg-black/5 px-2 py-1 text-xs font-medium text-black/60"
                      >
                        {role.replaceAll("_", " ")}
                      </span>
                    ))}
                    {user.roles.length === 0 && (
                      <span className="text-black/30">No roles</span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 text-xs text-black/60">
                  {user.employeeId ? (
                    <Link
                      href={`/workforce/people/${user.employeeId}`}
                      className="font-medium text-[var(--ca-platform-mid)] hover:underline"
                    >
                      Employee
                    </Link>
                  ) : null}
                  {user.employeeId && user.candidateId ? " · " : null}
                  {user.candidateId ? (
                    <Link
                      href={`/app/recruiting/candidates/${user.candidateId}`}
                      className="font-medium text-[var(--ca-platform-mid)] hover:underline"
                    >
                      Candidate
                    </Link>
                  ) : null}
                  {!user.employeeId && !user.candidateId ? "—" : null}
                </td>
                <td className="px-4 py-3 text-xs text-black/45">
                  {user.lastActivityAt
                    ? user.lastActivityAt.slice(0, 19).replace("T", " ")
                    : "—"}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-black/50">
                  No platform users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
