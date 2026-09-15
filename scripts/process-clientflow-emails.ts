/**
 * Drain ClientFlow email outbox (queued / retrying / failed).
 * Usage: npx tsx --env-file=.env.local scripts/process-clientflow-emails.ts
 */
import { processClientFlowEmailQueue } from "../lib/clientflow/process-emails";

async function main() {
  const result = await processClientFlowEmailQueue(50);
  console.log(
    `ClientFlow emails: processed=${result.processed} sent=${result.sent} failed=${result.failed} skipped=${result.skipped}`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
