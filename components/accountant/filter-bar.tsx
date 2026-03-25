"use client";

import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

type FilterOption = {
  label: string;
  value: string;
};

type FilterBarProps = {
  filters: FilterOption[];
  activeFilter: string;
  onFilterChange: (value: string) => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
  placeholder?: string;
  className?: string;
};

export function FilterBar({
  filters,
  activeFilter,
  onFilterChange,
  searchValue,
  onSearchChange,
  placeholder = "Search...",
  className,
}: FilterBarProps) {
  return (
    <div
      className={cn(
        "mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
        className,
      )}
    >
      <div className="flex flex-wrap gap-1.5">
        {filters.map((filter) => (
          <button
            key={filter.value}
            onClick={() => onFilterChange(filter.value)}
            className={cn(
              "rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
              activeFilter === filter.value
                ? "bg-foreground text-background"
                : "border border-border bg-background text-foreground hover:bg-secondary",
            )}
          >
            {filter.label}
          </button>
        ))}
      </div>
      <div className="relative w-full sm:w-64">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary-foreground" />
        <input
          type="text"
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-md border border-border bg-background py-1.5 pl-9 pr-3 text-sm placeholder:text-secondary-foreground focus:outline-none focus:ring-1 focus:ring-foreground/20"
        />
      </div>
    </div>
  );
}
