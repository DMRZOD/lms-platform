"use client";

import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";

type CountdownBadgeProps = {
  expiresAt: string;
  className?: string;
};

function getCountdown(expiresAt: string): {
  label: string;
  urgent: boolean;
  expired: boolean;
} {
  const now = new Date();
  const expiry = new Date(expiresAt);
  const diffMs = expiry.getTime() - now.getTime();

  if (diffMs <= 0) return { label: "Expired", urgent: false, expired: true };

  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

  if (diffDays === 0) {
    return { label: `${diffHours}h remaining`, urgent: true, expired: false };
  }
  if (diffDays <= 3) {
    return {
      label: `${diffDays}d remaining`,
      urgent: true,
      expired: false,
    };
  }
  return { label: `${diffDays}d remaining`, urgent: false, expired: false };
}

export function CountdownBadge({ expiresAt, className }: CountdownBadgeProps) {
  const { label, urgent, expired } = getCountdown(expiresAt);

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium",
        expired
          ? "bg-[#f4f4f4] text-[#6b7280]"
          : urgent
            ? "bg-[#fee2e2] text-[#dc2626]"
            : "bg-[#fef3c7] text-[#d97706]",
        className,
      )}
    >
      <Clock className="h-3 w-3" />
      {label}
    </span>
  );
}
