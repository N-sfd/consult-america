import { resetAuditStoreForTests } from "@/lib/self-service/audit-store";
import { resetBenefitsStoreForTests } from "@/lib/self-service/benefits-store";
import { resetCompensationStoreForTests } from "@/lib/self-service/compensation-store";
import { resetDocumentStoreForTests } from "@/lib/self-service/document-store";
import { resetExpenseStoreForTests } from "@/lib/self-service/expense-store";
import { resetHrRequestStoreForTests } from "@/lib/self-service/hr-request-store";
import { resetLeaveStoreForTests } from "@/lib/self-service/leave-store";
import { resetPayrollStoreForTests } from "@/lib/self-service/payroll-store";
import { resetPerformanceStoreForTests } from "@/lib/self-service/performance-store";
import { resetTimeStoreForTests } from "@/lib/self-service/time-store";
import { resetWorkflowStoreForTests } from "@/lib/self-service/workflow-store";

/** Reset all Phase 4 in-memory stores between tests. */
export function resetSelfServiceStoresForTests() {
  resetWorkflowStoreForTests();
  resetTimeStoreForTests();
  resetLeaveStoreForTests();
  resetHrRequestStoreForTests();
  resetAuditStoreForTests();
  resetDocumentStoreForTests();
  resetCompensationStoreForTests();
  resetPayrollStoreForTests();
  resetExpenseStoreForTests();
  resetBenefitsStoreForTests();
  resetPerformanceStoreForTests();
}
