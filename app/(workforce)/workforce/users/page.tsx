import type { Metadata } from "next";

import { listPlatformUsers } from "@/lib/workforce/operations";
import { requireHrActor, requirePermission } from "@/lib/self-service/security";

export const metadata: Metadata = { title: "Users" };

export default async function WorkforceUsersPage() {
  const actor = await requireHrActor();
  requirePermission(actor, "admin.manage");

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
        <table className="w-full min-w-[700px] text-left text-sm">
          <thead className="border-b border-black/10 bg-[#F8FAFC] text-xs uppercase tracking-[0.08em] text-black/45">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Roles</th>
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
                    {user.roles.length === 0 && <span className="text-black/30">No roles</span>}
                  </div>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-black/50">
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
