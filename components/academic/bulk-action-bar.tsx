"use client";

import { cn } from "@/lib/utils";

type BulkAction = {
  label: string;
  onClick: () => void;
  variant?: "default" | "danger";
};

type BulkActionBarProps = {
  selectedCount: number;
  actions: BulkAction[];
  onClearSelection: () => void;
  className?: string;
};

export function BulkActionBar({
  selectedCount,
  actions,
  onClearSelection,
  className,
}: BulkActionBarProps) {
  if (selectedCount === 0) return null;

  return (
    <div
      className={cn(
        "mb-4 flex items-center gap-3 rounded-lg border border-foreground/20 bg-foreground px-4 py-3",
        className,
      )}
    >
      <span className="text-sm font-medium text-background">
        {selectedCount} selected
      </span>
      <div className="ml-2 flex gap-2">
        {actions.map((action) => (
          <button
            key={action.label}
            onClick={action.onClick}
            className={cn(
              "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
              action.variant === "danger"
                ? "bg-[#ef4444] text-white hover:bg-[#dc2626]"
                : "bg-background text-foreground hover:bg-secondary",
            )}
          >
            {action.label}
          </button>
        ))}
      </div>
      <button
        onClick={onClearSelection}
        className="ml-auto text-sm text-background/70 hover:text-background"
      >
        Clear
      </button>
    </div>
  );
}
