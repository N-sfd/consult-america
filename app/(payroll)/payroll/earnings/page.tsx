import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Earnings | ConsultAmerica",
};

const earningCodes = [
  {
    code: "REG",
    label: "Regular Salary",
    description: "Salaried employees: annual salary ÷ 26 pay periods.",
  },
  {
    code: "REG",
    label: "Regular Hours",
    description: "Hourly employees: approved timesheet hours × hourly rate.",
  },
  {
    code: "LEAVE",
    label: "Paid Leave",
    description: "Hourly employees: approved paid leave hours × hourly rate.",
  },
];

export default function PayrollEarningsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-[-0.04em]">Earnings</h1>
        <p className="mt-2 text-black/55">
          Earning codes used by the payroll calculator.
        </p>
      </div>

      <div className="overflow-hidden rounded-lg border border-black/10 bg-white">
        <ul className="divide-y divide-black/5">
          {earningCodes.map((item) => (
            <li key={item.label} className="px-5 py-4">
              <p className="font-medium">
                {item.label}
                <span className="ml-2 text-xs text-black/40">{item.code}</span>
              </p>
              <p className="mt-1 text-sm text-black/55">{item.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
