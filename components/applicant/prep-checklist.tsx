"use client";

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { useState } from "react";
import type { PrepChecklistItem } from "@/types/applicant";

export function PrepChecklist({
  items: initialItems,
  className,
}: {
  items: PrepChecklistItem[];
  className?: string;
}) {
  const [items, setItems] = useState(initialItems);

  const toggle = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item,
      ),
    );
  };

  return (
    <div className={cn("space-y-2", className)}>
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => toggle(item.id)}
          className="flex w-full items-center gap-3 rounded-lg border border-border p-3 text-left transition-colors hover:bg-secondary/50"
        >
          <div
            className={cn(
              "flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors",
              item.checked
                ? "border-emerald-600 bg-emerald-100"
                : "border-border bg-background",
            )}
          >
            {item.checked && <Check className="h-3 w-3 text-emerald-600" />}
          </div>
          <span
            className={cn(
              "text-sm",
              item.checked && "text-secondary-foreground line-through",
            )}
          >
            {item.label}
          </span>
        </button>
      ))}
    </div>
  );
}
