"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import {
  insightCategoryLabels,
  type Insight,
  type InsightCategory,
} from "@/data/insights";
import { formatInsightDate } from "@/lib/insights";

interface InsightsIndexProps {
  insights: Insight[];
  categories: { value: InsightCategory; label: string; count: number }[];
}

export default function InsightsIndex({
  insights,
  categories,
}: InsightsIndexProps) {
  const [category, setCategory] = useState<"all" | InsightCategory>("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return insights.filter((item) => {
      if (category !== "all" && item.category !== category) return false;
      if (!normalized) return true;

      const haystack = [
        item.title,
        item.summary,
        insightCategoryLabels[item.category],
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(normalized);
    });
  }, [insights, category, query]);

  return (
    <div>
      <div className="grid gap-6 border-b border-white/10 pb-8 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <label htmlFor="insight-search" className="ca-eyebrow text-white/45">
            Search
          </label>
          <input
            id="insight-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search insights..."
            className="ca-underline-input mt-3 w-full"
          />
        </div>

        <div className="lg:col-span-7">
          <p className="ca-eyebrow text-white/45">Topics</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setCategory("all")}
              className={`border px-3 py-1.5 text-xs transition-colors ${
                category === "all"
                  ? "border-[var(--ca-blue)] bg-[var(--ca-blue)]/15 text-white"
                  : "border-white/15 text-white/60 hover:border-white/35 hover:text-white"
              }`}
            >
              All
            </button>
            {categories.map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => setCategory(item.value)}
                className={`border px-3 py-1.5 text-xs transition-colors ${
                  category === item.value
                    ? "border-[var(--ca-blue)] bg-[var(--ca-blue)]/15 text-white"
                    : "border-white/15 text-white/60 hover:border-white/35 hover:text-white"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <p className="mt-6 text-sm text-white/45">
        {filtered.length}{" "}
        {filtered.length === 1 ? "insight" : "insights"}
      </p>

      <div className="mt-4 border-t border-white/10">
        {filtered.length > 0 ? (
          filtered.map((item) => (
            <Link
              key={item.slug}
              href={`/insights/${item.slug}`}
              className="group grid gap-4 border-b border-white/10 py-8 md:grid-cols-12 md:items-start"
            >
              <div className="md:col-span-3">
                <p className="text-sm text-white/45">
                  {formatInsightDate(item.publishedAt)}
                </p>
                <p className="mt-2 text-xs uppercase tracking-[0.12em] text-[var(--ca-blue)]">
                  {insightCategoryLabels[item.category]}
                </p>
              </div>

              <div className="md:col-span-8">
                <h2 className="text-2xl font-medium tracking-[-0.035em] transition-colors group-hover:text-[#93c5fd]">
                  {item.title}
                </h2>
                <p className="mt-3 max-w-2xl text-base leading-7 text-white/60">
                  {item.summary}
                </p>
                <p className="mt-3 text-xs text-white/35">{item.readingTime} read</p>
              </div>

              <div className="hidden md:col-span-1 md:flex md:justify-end">
                <span className="text-white/50 transition-colors group-hover:text-white">
                  →
                </span>
              </div>
            </Link>
          ))
        ) : (
          <p className="py-12 text-white/55">
            No insights match your search. Try another topic or keyword.
          </p>
        )}
      </div>
    </div>
  );
}
