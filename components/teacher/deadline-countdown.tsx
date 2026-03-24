"use client";

import { cn } from "@/lib/utils";
import { AlertTriangle, Clock } from "lucide-react";

type DeadlineCountdownProps = {
  deadline: string;
  className?: string;
};

function getCountdown(deadline: string): { label: string; urgency: "ok" | "warning" | "danger" } {
  const now = new Date();
  const end = new Date(deadline);
  const diffMs = end.getTime() - now.getTime();

  if (diffMs <= 0) return { label: "Overdue", urgency: "danger" };

  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

  if (diffDays === 0) return { label: `${diffHours}h left`, urgency: "danger" };
  if (diffDays <= 3) return { label: `${diffDays}d left`, urgency: "warning" };
  return { label: `${diffDays}d left`, urgency: "ok" };
}

export function DeadlineCountdown({ deadline, className }: DeadlineCountdownProps) {
  const { label, urgency } = getCountdown(deadline);

  const styles = {
    ok: "bg-[#dcfce7] text-[#166534]",
    warning: "bg-[#fef9c3] text-[#854d0e]",
    danger: "bg-[#fee2e2] text-[#991b1b]",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
        styles[urgency],
        className,
      )}
    >
      {urgency === "danger" ? (
        <AlertTriangle className="h-3 w-3" />
      ) : (
        <Clock className="h-3 w-3" />
      )}
      {label}
    </span>
  );
}
