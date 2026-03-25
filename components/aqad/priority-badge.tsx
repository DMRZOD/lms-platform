import { cn } from "@/lib/utils";
import type { Priority, CorrectiveActionPriority } from "@/types/aqad";

const styles: Record<string, string> = {
  Critical: "bg-[#fee2e2] text-[#dc2626]",
  High: "bg-[#fef3c7] text-[#d97706]",
  Medium: "bg-[#dbeafe] text-[#2563eb]",
  Low: "bg-[#f4f4f4] text-[#6b7280]",
};

type PriorityBadgeProps = {
  priority: Priority | CorrectiveActionPriority;
  className?: string;
};

export function PriorityBadge({ priority, className }: PriorityBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        styles[priority] ?? "bg-[#f4f4f4] text-[#6b7280]",
        className,
      )}
    >
      {priority}
    </span>
  );
}
