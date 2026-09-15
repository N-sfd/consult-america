import { processClientFlowWorkflowQueue } from "../lib/clientflow/workflow-engine";

async function main() {
  const result = await processClientFlowWorkflowQueue(50);
  console.log(
    `[clientflow-workflows] processed=${result.processed} completed=${result.completed} failed=${result.failed}`,
  );
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
