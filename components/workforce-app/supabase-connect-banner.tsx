export default function SupabaseConnectBanner() {
  return (
    <div className="mt-6 border border-[var(--ca-blue)]/30 bg-[var(--ca-blue)]/5 p-5">
      <p className="text-sm font-medium text-[var(--ca-app-ink)]">
        Connect Supabase to see live recruiting and employee data
      </p>
      <p className="mt-1 text-sm text-black/55">
        Employees and Pending Approvals below already reflect real (in-memory)
        data. Candidates and the Hiring Pipeline need a connected database.
      </p>
      <ol className="mt-3 list-decimal space-y-1 pl-5 text-sm text-black/55">
        <li>
          Set <code>NEXT_PUBLIC_SUPABASE_URL</code>,{" "}
          <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code>, and{" "}
          <code>SUPABASE_SERVICE_ROLE_KEY</code> in <code>.env.local</code>.
        </li>
        <li>
          Apply <code>db/schema/001_organization.sql</code> through{" "}
          <code>006_audit.sql</code> in the Supabase SQL Editor, in order.
        </li>
        <li>
          Run <code>npm run seed:supabase</code>.
        </li>
      </ol>
    </div>
  );
}
