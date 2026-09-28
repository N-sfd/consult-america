import type { Metadata } from "next";
import { PageHeader } from "@/components/shared";

import { hrRepository } from "@/lib/hr";
import { getEmployeeProfile } from "@/lib/self-service";
import { getLatestPayslipForEmployee } from "@/lib/self-service/payroll-store";

export const metadata: Metadata = {
  title: "Employee Pay | ConsultAmerica",
};

function formatDate(value: string) {
  return new Date(`${value}T00:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function currency(value: number) {
  return value.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

export default async function PayrollEmployeePayPage() {
  const employees = await hrRepository.listEmployees();
  const rows = await Promise.all(
    employees
      .filter((e) => e.employmentStatus === "ACTIVE")
      .map(async (employee) => {
        const profile = await getEmployeeProfile(employee.id);
        const slip = getLatestPayslipForEmployee(employee.id);
        return { employee, profile, slip };
      }),
  );

  return (
    <div className="space-y-8">
      <PageHeader
        title="Employee Pay"
        description="Most recent processed payslip per active employee."
      />

      <div className="overflow-hidden rounded-lg border border-[var(--ca-platform-border)] bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-[var(--ca-platform-border)] bg-[#F8FAFC] text-xs uppercase tracking-[0.08em] text-[var(--ca-platform-muted)]">
            <tr>
              <th className="px-4 py-3 font-medium">Employee</th>
              <th className="px-4 py-3 font-medium">Last Pay Date</th>
              <th className="px-4 py-3 font-medium">Gross Pay</th>
              <th className="px-4 py-3 font-medium">Net Pay</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ employee, profile, slip }) => (
              <tr key={employee.id} className="border-b border-black/5 last:border-b-0">
                <td className="px-4 py-4 font-medium">
                  {profile ? `${profile.person.firstName} ${profile.person.lastName}` : employee.id}
                  <span className="ml-2 text-xs text-[var(--ca-platform-muted)]">
                    {employee.employeeNumber}
                  </span>
                </td>
                <td className="px-4 py-4 text-[var(--ca-platform-muted)]">
                  {slip ? formatDate(slip.payDate) : "—"}
                </td>
                <td className="px-4 py-4 text-[var(--ca-platform-muted)]">
                  {slip ? currency(slip.grossPay) : "—"}
                </td>
                <td className="px-4 py-4 font-medium">
                  {slip ? currency(slip.netPay) : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
