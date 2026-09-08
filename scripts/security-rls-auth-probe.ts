/**
 * Authenticated isolation probe using JWT claims, no row payloads.
 * Usage: npx tsx --env-file=.env.local scripts/security-rls-auth-probe.ts
 */
import pg from "pg";

async function main() {
  const databaseUrl = process.env.DATABASE_URL ?? process.env.SUPABASE_DB_URL;
  if (!databaseUrl) throw new Error("Missing DATABASE_URL");

  const client = new pg.Client({
    connectionString: databaseUrl,
    ssl: { rejectUnauthorized: false },
  });
  await client.connect();

  const candidates = await client.query(`
    SELECT p.auth_user_id, cp.id AS candidate_id
      FROM profiles p
      JOIN candidate_profiles cp ON cp.profile_id = p.id
     WHERE p.auth_user_id IS NOT NULL
     LIMIT 2
  `);

  async function asUser(authUserId: string | null, sql: string) {
    await client.query("BEGIN");
    try {
      await client.query("SET LOCAL ROLE authenticated");
      await client.query(
        "SELECT set_config('request.jwt.claim.sub', $1, true)",
        [authUserId ?? "00000000-0000-0000-0000-000000000000"],
      );
      await client.query(
        "SELECT set_config('request.jwt.claim.role', 'authenticated', true)",
      );
      const result = await client.query(sql);
      await client.query("ROLLBACK");
      return result;
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    }
  }

  const stranger = await asUser(null, "SELECT count(*)::int AS n FROM offers");
  console.log(
    Number(stranger.rows[0].n) === 0
      ? "PASS  authenticated stranger cannot read offers"
      : `FAIL  stranger saw ${stranger.rows[0].n} offers`,
  );

  const audit = await asUser(null, "SELECT count(*)::int AS n FROM audit_logs");
  console.log(
    Number(audit.rows[0].n) === 0
      ? "PASS  authenticated stranger cannot read audit_logs"
      : `FAIL  stranger saw ${audit.rows[0].n} audit rows`,
  );

  const payroll = await asUser(
    null,
    "SELECT count(*)::int AS n FROM compensation_records",
  );
  console.log(
    Number(payroll.rows[0].n) === 0
      ? "PASS  authenticated stranger cannot read compensation"
      : `FAIL  stranger saw ${payroll.rows[0].n} compensation rows`,
  );

  if (candidates.rows.length >= 1) {
    const self = candidates.rows[0];
    const own = await asUser(
      self.auth_user_id,
      "SELECT count(*)::int AS n FROM candidate_profiles",
    );
    console.log(
      Number(own.rows[0].n) === 1
        ? "PASS  candidate can read own profile only"
        : `FAIL  candidate profile rows=${own.rows[0].n}`,
    );

    if (candidates.rows.length >= 2) {
      const other = candidates.rows[1];
      const cross = await asUser(
        self.auth_user_id,
        `SELECT count(*)::int AS n FROM candidate_profiles WHERE id = '${other.candidate_id}'`,
      );
      console.log(
        Number(cross.rows[0].n) === 0
          ? "PASS  candidate cannot read another candidate profile"
          : "FAIL  candidate read another candidate profile",
      );
    } else {
      console.log("SKIP  only one linked candidate; cross-candidate check skipped");
    }
  } else {
    console.log("SKIP  no auth-linked candidate profiles for self-access probe");
  }

  await client.end();
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
