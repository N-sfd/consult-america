/**
 * Server-side employee number generation.
 * Format: CA-000001 — never expose database UUIDs as employee IDs.
 */

const EMPLOYEE_NUMBER_PREFIX = "CA-";
const EMPLOYEE_NUMBER_PAD = 6;

export function formatEmployeeNumber(sequence: number): string {
  if (!Number.isInteger(sequence) || sequence < 1) {
    throw new Error("Employee number sequence must be a positive integer");
  }

  return `${EMPLOYEE_NUMBER_PREFIX}${String(sequence).padStart(EMPLOYEE_NUMBER_PAD, "0")}`;
}

export function parseEmployeeNumber(employeeNumber: string): number {
  const match = /^CA-(\d{6})$/.exec(employeeNumber);
  if (!match) {
    throw new Error(`Invalid employee number: ${employeeNumber}`);
  }
  return Number(match[1]);
}

export function nextEmployeeNumber(existingNumbers: string[]): string {
  let max = 0;

  for (const value of existingNumbers) {
    try {
      max = Math.max(max, parseEmployeeNumber(value));
    } catch {
      // Ignore malformed historical values during generation.
    }
  }

  return formatEmployeeNumber(max + 1);
}
