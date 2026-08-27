/**
 * Payroll foundation — built on top of stable Employee + Assignment +
 * Compensation + approved Time + approved Leave. Figures here are
 * illustrative (flat withholding, no real tax engine), matching the
 * "Illustrative example — not client production data" convention used
 * elsewhere in this demo.
 */

export type PayPeriodStatus = "OPEN" | "PROCESSING" | "CLOSED";

export type PayPeriod = {
  id: string;
  periodStart: string;
  periodEnd: string;
  payDate: string;
  status: PayPeriodStatus;
  createdAt: string;
  updatedAt: string;
};

export type PayrollRunStatus =
  | "OPEN"
  | "CALCULATED"
  | "UNDER_REVIEW"
  | "APPROVED"
  | "LOCKED";

export type PayrollRun = {
  id: string;
  payPeriodId: string;
  status: PayrollRunStatus;
  employeeCount: number;
  totalGrossPay: number;
  totalDeductions: number;
  totalNetPay: number;
  exceptionCount: number;
  calculatedAt?: string;
  approvedAt?: string;
  approvedByEmployeeId?: string;
  lockedAt?: string;
  createdAt: string;
  updatedAt: string;
};

export type PayrollException = {
  id: string;
  runId: string;
  employeeId: string;
  reason: string;
};

export type PayslipEarningLine = {
  code: string;
  label: string;
  hours?: number;
  amount: number;
};

export type PayslipDeductionLine = {
  code: string;
  label: string;
  amount: number;
};

export type Payslip = {
  id: string;
  runId: string;
  payPeriodId: string;
  employeeId: string;
  payDate: string;
  earnings: PayslipEarningLine[];
  deductions: PayslipDeductionLine[];
  grossPay: number;
  totalDeductions: number;
  netPay: number;
  createdAt: string;
};

export const payPeriodStatusLabels: Record<PayPeriodStatus, string> = {
  OPEN: "Open",
  PROCESSING: "Processing",
  CLOSED: "Closed",
};

export const payrollRunStatusLabels: Record<PayrollRunStatus, string> = {
  OPEN: "Ready for Processing",
  CALCULATED: "Calculated",
  UNDER_REVIEW: "Under Review",
  APPROVED: "Approved",
  LOCKED: "Locked",
};

/** Flat illustrative withholding — not a real tax calculation. */
export const ILLUSTRATIVE_WITHHOLDING_RATE = 0.22;
