import type { Metadata } from "next";

import { ILLUSTRATIVE_WITHHOLDING_RATE } from "@/types/payroll";

export const metadata: Metadata = {
  title: "Deductions | ConsultAmerica",
};

export default function PayrollDeductionsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-[-0.04em]">
          Deductions
        </h1>
        <p className="mt-2 text-black/55">
          Deduction codes used by the payroll calculator.
        </p>
      </div>

      <div className="overflow-hidden rounded-lg border border-black/10 bg-white">
        <ul className="divide-y divide-black/5">
          <li className="px-5 py-4">
            <p className="font-medium">
              Federal &amp; State Withholding
              <span className="ml-2 text-xs text-black/40">FED_WH</span>
            </p>
            <p className="mt-1 text-sm text-black/55">
              A flat {Math.round(ILLUSTRATIVE_WITHHOLDING_RATE * 100)}% of gross
              pay — illustrative only, not a real tax calculation. A
              production system would integrate a payroll tax provider here.
            </p>
          </li>
        </ul>
      </div>
    </div>
  );
}
