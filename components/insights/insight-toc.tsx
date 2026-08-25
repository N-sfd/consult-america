"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

type TocItem = {
  id: string;
  label: string;
};

type InsightTocProps = {
  items: TocItem[];
  variant?: "mobile" | "desktop";
};

export default function InsightToc({
  items,
  variant = "desktop",
}: InsightTocProps) {
  const [activeId, setActiveId] = useState(items[0]?.id ?? "");

  useEffect(() => {
    if (items.length === 0) return;

    const elements = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) => a.boundingClientRect.top - b.boundingClientRect.top,
          );

        if (visible[0]?.target.id) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        rootMargin: "-20% 0px -60% 0px",
        threshold: [0, 0.25, 0.5],
      },
    );

    for (const el of elements) observer.observe(el);
    return () => observer.disconnect();
  }, [items]);

  if (variant === "mobile") {
    return (
      <nav
        aria-label="On this page"
        className="mb-12 border-b border-white/10 pb-8 lg:hidden"
      >
        <p className="ca-eyebrow text-white/40">On this page</p>
        <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
          {items.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className="text-sm text-white/55 transition-colors hover:text-white"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    );
  }

  return (
    <nav aria-label="On this page" className="ca-insight-toc">
      <div className="ca-insight-toc-sticky">
        <p className="ca-eyebrow text-white/40">On this page</p>
        <ul className="mt-6 space-y-1">
          {items.map((item) => {
            const active = activeId === item.id;
            return (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className={cn(
                    "block border-l py-1.5 pl-4 text-[0.95rem] transition-colors duration-200",
                    active
                      ? "border-[var(--ca-blue)] text-white"
                      : "border-white/15 text-white/50 hover:border-white/40 hover:text-white",
                  )}
                >
                  {item.label}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
