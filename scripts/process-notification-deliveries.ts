/**
 * Drains pending email deliveries. Run on a schedule (cron/task runner) once
 * one exists; safe to run manually or repeatedly in the meantime — idempotent.
 * Usage: npx tsx --env-file=.env.local scripts/process-notification-deliveries.ts
 */
import { processPendingEmailDeliveries } from "@/lib/notifications/process-deliveries";

async function main() {
  const result = await processPendingEmailDeliveries();
  console.log(
    `processed=${result.processed} sent=${result.sent} failed=${result.failed} skipped=${result.skipped}`,
  );
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
