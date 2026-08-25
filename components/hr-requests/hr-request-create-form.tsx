"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { createHrRequestAction } from "@/app/actions/hr-request-actions";
import type { HrRequestCategory } from "@/types/self-service";
import {
  hrRequestCategoryLabels,
  hrRequestPriorityLabels,
} from "@/types/self-service";

const categories = Object.keys(hrRequestCategoryLabels) as HrRequestCategory[];
const priorities = Object.keys(hrRequestPriorityLabels) as Array<
  "LOW" | "NORMAL" | "HIGH"
>;

export default function HrRequestCreateForm() {
  const router = useRouter();
  const [category, setCategory] = useState<HrRequestCategory>(
    "GENERAL_HR_QUESTION",
  );
  const [priority, setPriority] = useState<"LOW" | "NORMAL" | "HIGH">("NORMAL");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await createHrRequestAction({
        category,
        subject,
        description,
        priority,
      });
      if (!result.ok) {
        setError(result.message);
        return;
      }
      if (result.requestId) {
        router.push(`/employee/requests/${result.requestId}`);
      } else {
        router.push("/employee/requests");
      }
      router.refresh();
    });
  }

  return (
    <section className="rounded-lg border border-black/10 bg-white p-6">
      <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-black/40">
        New HR Request
      </h2>

      <form onSubmit={handleSubmit} className="mt-5 grid gap-4 md:grid-cols-2">
        <label className="block text-xs uppercase tracking-[0.1em] text-black/40">
          Category
          <select
            value={category}
            onChange={(event) =>
              setCategory(event.target.value as HrRequestCategory)
            }
            className="mt-2 w-full rounded-md border border-black/15 px-3 py-2 text-sm font-normal normal-case tracking-normal text-[#0B1220]"
            required
          >
            {categories.map((item) => (
              <option key={item} value={item}>
                {hrRequestCategoryLabels[item]}
              </option>
            ))}
          </select>
        </label>

        <label className="block text-xs uppercase tracking-[0.1em] text-black/40">
          Priority
          <select
            value={priority}
            onChange={(event) =>
              setPriority(event.target.value as "LOW" | "NORMAL" | "HIGH")
            }
            className="mt-2 w-full rounded-md border border-black/15 px-3 py-2 text-sm font-normal normal-case tracking-normal text-[#0B1220]"
          >
            {priorities.map((item) => (
              <option key={item} value={item}>
                {hrRequestPriorityLabels[item]}
              </option>
            ))}
          </select>
        </label>

        <label className="block text-xs uppercase tracking-[0.1em] text-black/40 md:col-span-2">
          Subject
          <input
            type="text"
            value={subject}
            onChange={(event) => setSubject(event.target.value)}
            maxLength={120}
            className="mt-2 w-full rounded-md border border-black/15 px-3 py-2 text-sm font-normal normal-case tracking-normal text-[#0B1220]"
            required
          />
        </label>

        <label className="block text-xs uppercase tracking-[0.1em] text-black/40 md:col-span-2">
          Description
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={5}
            className="mt-2 w-full rounded-md border border-black/15 px-3 py-2 text-sm font-normal normal-case tracking-normal text-[#0B1220]"
            required
          />
        </label>

        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={pending}
            className="rounded-md bg-[var(--ca-blue)] px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            Submit Request
          </button>
        </div>
      </form>

      {error && (
        <p className="mt-4 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </section>
  );
}
