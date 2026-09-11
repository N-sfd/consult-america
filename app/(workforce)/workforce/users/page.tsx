import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { listPlatformUsers } from "@/lib/workforce/operations";
import { getWorkforceSession } from "@/lib/workforce/session";

export const metadata: Metadata = { title: "Users" };
export const dynamic = "force-dynamic";

export default async function WorkforceUsersPage() {
  const session = await getWorkforceSession();
  if (!session.roles.includes("ADMIN") && !session.roles.includes("HR")) {
    redirect("/workforce");
  }

  const users = await listPlatformUsers();

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

      <p className="mt-6 text-sm text-black/45">{users.length} platform users</p>

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
            {users.map((user) => (
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
            {users.length === 0 && (
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
