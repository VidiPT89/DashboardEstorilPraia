"use client";

import { useState } from "react";
import type { ClubHistoryCategory } from "@/data/club-history";

export interface ResolvedHistoryEntry {
  id: string;
  year: string;
  category: ClubHistoryCategory;
  title: string;
  description: string;
}

type ClubHistoryTimelineProps = {
  entries: ResolvedHistoryEntry[];
  categoryLabels: Record<ClubHistoryCategory, string>;
  allLabel: string;
  filterLabel: string;
};

type FilterValue = ClubHistoryCategory | "all";

const CATEGORY_ORDER: ClubHistoryCategory[] = ["title", "promotion", "relegation", "milestone"];

const CATEGORY_DOT_CLASS: Record<ClubHistoryCategory, string> = {
  title: "bg-[var(--club-yellow)]",
  promotion: "bg-[var(--chart-won)]",
  relegation: "bg-[var(--chart-lost)]",
  milestone: "bg-[var(--club-blue)]",
};

export function ClubHistoryTimeline({ entries, categoryLabels, allLabel, filterLabel }: ClubHistoryTimelineProps) {
  const [filter, setFilter] = useState<FilterValue>("all");
  const filteredEntries = filter === "all" ? entries : entries.filter((entry) => entry.category === filter);

  return (
    <>
      <div role="group" aria-label={filterLabel} className="mt-6 flex flex-wrap gap-2">
        <FilterButton isActive={filter === "all"} onClick={() => setFilter("all")}>
          {allLabel}
        </FilterButton>
        {CATEGORY_ORDER.map((category) => (
          <FilterButton key={category} isActive={filter === category} onClick={() => setFilter(category)}>
            <span className={`h-2 w-2 rounded-full ${CATEGORY_DOT_CLASS[category]}`} aria-hidden="true" />
            {categoryLabels[category]}
          </FilterButton>
        ))}
      </div>

      <ol className="mt-8 space-y-8 border-l-2 border-[var(--border)] pl-8">
        {filteredEntries.map((entry) => (
          <li key={entry.id} className="relative">
            <span
              className={`absolute -left-[2.35rem] top-1 h-4 w-4 rounded-full ring-4 ring-[var(--background)] ${CATEGORY_DOT_CLASS[entry.category]}`}
              aria-hidden="true"
            />
            <div className="card p-5">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <span className="text-sm font-semibold tabular-nums text-[var(--muted)]">{entry.year}</span>
                <span className="rounded-full bg-[var(--surface-raised)] px-2.5 py-0.5 text-xs font-medium text-[var(--muted)]">
                  {categoryLabels[entry.category]}
                </span>
              </div>
              <h2 className="mt-1 text-base font-semibold">{entry.title}</h2>
              <p className="mt-1 text-sm text-[var(--muted)]">{entry.description}</p>
            </div>
          </li>
        ))}
      </ol>
    </>
  );
}

type FilterButtonProps = {
  isActive: boolean;
  onClick: () => void;
  children: React.ReactNode;
};

function FilterButton({ isActive, onClick, children }: FilterButtonProps) {
  return (
    <button
      type="button"
      aria-pressed={isActive}
      onClick={onClick}
      className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
        isActive
          ? "border-[var(--club-blue)] bg-[var(--club-blue)] text-white"
          : "border-[var(--border)] bg-[var(--surface)] text-[var(--muted)] hover:text-[var(--foreground)]"
      }`}
    >
      {children}
    </button>
  );
}
