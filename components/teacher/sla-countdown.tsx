"use client";

import { cn } from "@/lib/utils";
import { Clock } from "lucide-react";

type SLACountdownProps = {
  deadline: string;
  breached: boolean;
  className?: string;
};

function getTimeRemaining(deadline: string): { label: string; isUrgent: boolean } {
  const now = new Date();
  const end = new Date(deadline);
  const diffMs = end.getTime() - now.getTime();

  if (diffMs <= 0) {
    return { label: "SLA breached", isUrgent: true };
  }

  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  if (diffHours < 2) {
    return { label: `${diffHours}h ${diffMins}m left`, isUrgent: true };
  }

  return { label: `${diffHours}h left`, isUrgent: false };
}

export function SLACountdown({ deadline, breached, className }: SLACountdownProps) {
  const { label, isUrgent } = getTimeRemaining(deadline);
  const isWarning = breached || isUrgent;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
        isWarning
          ? "bg-[#fee2e2] text-[#991b1b]"
          : "bg-[#fef9c3] text-[#854d0e]",
        className,
      )}
    >
      <Clock className="h-3 w-3" />
      {label}
    </span>
  );
}
