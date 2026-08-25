import { resetAuditStoreForTests } from "@/lib/self-service/audit-store";
import { resetHrRequestStoreForTests } from "@/lib/self-service/hr-request-store";
import { resetLeaveStoreForTests } from "@/lib/self-service/leave-store";
import { resetTimeStoreForTests } from "@/lib/self-service/time-store";
import { resetWorkflowStoreForTests } from "@/lib/self-service/workflow-store";

/** Reset all Phase 4 in-memory stores between tests. */
export function resetSelfServiceStoresForTests() {
  resetWorkflowStoreForTests();
  resetTimeStoreForTests();
  resetLeaveStoreForTests();
  resetHrRequestStoreForTests();
  resetAuditStoreForTests();
}
