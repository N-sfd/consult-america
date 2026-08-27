"use client";

import { useState } from "react";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { Payslip } from "@/types/payroll";

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

export default function PayslipList({ payslips }: { payslips: Payslip[] }) {
  const [selected, setSelected] = useState<Payslip | null>(null);

  return (
    <>
      <ul className="divide-y divide-black/5">
        {payslips.map((slip) => (
          <li key={slip.id} className="flex items-center justify-between py-3">
            <span className="text-sm font-medium">{formatDate(slip.payDate)}</span>
            <button
              type="button"
              onClick={() => setSelected(slip)}
              className="text-sm font-medium text-[var(--ca-blue)] hover:underline"
            >
              View →
            </button>
          </li>
        ))}
        {payslips.length === 0 && (
          <li className="py-3 text-sm text-black/50">No payslips yet.</li>
        )}
      </ul>

      <Sheet
        open={Boolean(selected)}
        onOpenChange={(open) => {
          if (!open) setSelected(null);
        }}
      >
        <SheetContent>
          {selected && (
            <>
              <SheetHeader>
                <SheetTitle>Payslip · {formatDate(selected.payDate)}</SheetTitle>
              </SheetHeader>
              <div className="flex-1 space-y-5 overflow-y-auto px-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-black/40">
                    Earnings
                  </p>
                  <ul className="mt-2 divide-y divide-black/5 text-sm">
                    {selected.earnings.map((line) => (
                      <li
                        key={line.code + line.label}
                        className="flex justify-between py-2"
                      >
                        <span>
                          {line.label}
                          {line.hours ? ` · ${line.hours}h` : ""}
                        </span>
                        <span className="font-medium">
                          {currency(line.amount)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-black/40">
                    Deductions
                  </p>
                  <ul className="mt-2 divide-y divide-black/5 text-sm">
                    {selected.deductions.map((line) => (
                      <li key={line.code} className="flex justify-between py-2">
                        <span>{line.label}</span>
                        <span className="font-medium">
                          −{currency(line.amount)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-md bg-[#F8FAFC] p-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-black/55">Gross Pay</span>
                    <span className="font-medium">
                      {currency(selected.grossPay)}
                    </span>
                  </div>
                  <div className="mt-2 flex justify-between text-sm">
                    <span className="text-black/55">Total Deductions</span>
                    <span className="font-medium">
                      −{currency(selected.totalDeductions)}
                    </span>
                  </div>
                  <div className="mt-3 flex justify-between border-t border-black/10 pt-3 text-base">
                    <span className="font-semibold">Net Pay</span>
                    <span className="font-semibold">
                      {currency(selected.netPay)}
                    </span>
                  </div>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
